// เชื่อมต่อ LINE Messaging API เพื่อส่งข้อมูลจากฟอร์มติดต่อเข้า LINE OA
//
// ต้องตั้งค่า 2 ค่านี้ในไฟล์ .env.local (ดูวิธีหาค่าได้ที่ .env.example)
//   LINE_CHANNEL_ACCESS_TOKEN = Channel access token (long-lived) ของ Messaging API channel
//   LINE_TO                   = userId / groupId / roomId ที่ต้องการให้ข้อความเด้งเข้า

const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";
const REQUEST_TIMEOUT_MS = 10_000;

export function isLineConfigured() {
  return Boolean(
    process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim() && process.env.LINE_TO?.trim()
  );
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function formatThaiTime() {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

// แถวข้อมูล 1 รายการในการ์ด: ไอคอนวงกลมซ้าย + หัวข้อ/ค่าเรียงซ้อนขวา
// ใช้ layout นี้แทนแบบ 2 คอลัมน์เดิม เพราะอ่านง่ายกว่าบนจอมือถือที่แคบ
function infoRow(icon, label, value) {
  return {
    type: "box",
    layout: "horizontal",
    spacing: "md",
    contents: [
      {
        type: "box",
        layout: "vertical",
        width: "32px",
        height: "32px",
        cornerRadius: "16px",
        backgroundColor: "#EEF6FF",
        justifyContent: "center",
        alignItems: "center",
        contents: [
          {
            type: "text",
            text: icon,
            size: "sm",
            align: "center",
            gravity: "center",
          },
        ],
      },
      {
        type: "box",
        layout: "vertical",
        flex: 1,
        contents: [
          {
            type: "text",
            text: label,
            color: "#94a3b8",
            size: "xs",
          },
          {
            type: "text",
            text: truncate(value, 300),
            color: "#0f172a",
            size: "sm",
            weight: "bold",
            wrap: true,
            margin: "xs",
          },
        ],
      },
    ],
  };
}

function buildFlexMessage(lead) {
  const telDigits = lead.phone.replace(/\D/g, "");
  const title = "มีลูกค้าติดต่อเข้ามาใหม่";

  return {
    type: "flex",
    // altText แสดงในหน้ารายการแชทและ push notification (จำกัด 400 ตัวอักษร)
    altText: truncate(`🔔 ${title}: ${lead.name} (${lead.serviceType})`, 400),
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#1B5CF5",
        paddingAll: "20px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            alignItems: "center",
            contents: [
              { type: "text", text: "🔔", size: "xl", flex: 0 },
              {
                type: "text",
                text: title,
                color: "#FFFFFF",
                weight: "bold",
                size: "lg",
                wrap: true,
                flex: 1,
              },
            ],
          },
          {
            type: "text",
            text: `จากฟอร์มติดต่อบนเว็บไซต์ • ${formatThaiTime()}`,
            color: "#C7D9FF",
            size: "xs",
            margin: "md",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "lg",
        paddingAll: "20px",
        contents: [
          infoRow("👤", "ชื่อ", lead.name),
          infoRow("📞", "เบอร์โทร", lead.phone),
          infoRow("✉️", "อีเมล", lead.email),
          infoRow("🗂️", "ประเภทบริการ", lead.serviceType),
          { type: "separator", margin: "sm" },
          {
            type: "text",
            text: "รายละเอียด",
            color: "#94a3b8",
            size: "xs",
            margin: "sm",
          },
          {
            // กล่องพื้นเทาอ่อนสำหรับรายละเอียด ให้แยกจากข้อมูลติดต่อด้านบนชัดเจน
            type: "box",
            layout: "vertical",
            backgroundColor: "#F8FAFC",
            cornerRadius: "8px",
            paddingAll: "12px",
            margin: "xs",
            contents: [
              {
                type: "text",
                // ข้อความใน flex จำกัดไม่เกิน 2000 ตัวอักษร เผื่อไว้ที่ 1000
                text: truncate(lead.message, 1000),
                color: "#334155",
                size: "sm",
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        paddingAll: "16px",
        contents: [
          {
            type: "button",
            style: "primary",
            height: "sm",
            color: "#1B5CF5",
            action: {
              type: "uri",
              label: "📞 โทรหาลูกค้า",
              uri: `tel:${telDigits}`,
            },
          },
          {
            type: "button",
            style: "secondary",
            height: "sm",
            action: {
              type: "uri",
              label: "✉️ ตอบกลับทางอีเมล",
              uri: `mailto:${lead.email}`,
            },
          },
        ],
      },
    },
  };
}

/**
 * ส่งข้อมูลลูกค้าเข้า LINE OA
 * @returns {Promise<{sent: boolean, skipped?: string}>}
 * @throws {Error} เมื่อตั้งค่าครบแล้วแต่ส่งไม่สำเร็จ
 */
export async function sendLeadToLineOA(lead) {
  if (!isLineConfigured()) {
    // ยังไม่ได้ใส่ API Key — ข้ามการส่งไปก่อน เพื่อให้ฟอร์มยังทดสอบได้ตามปกติ
    return { sent: false, skipped: "ยังไม่ได้ตั้งค่า LINE_CHANNEL_ACCESS_TOKEN / LINE_TO" };
  }

  let response;
  try {
    response = await fetch(LINE_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN.trim()}`,
      },
      body: JSON.stringify({
        to: process.env.LINE_TO.trim(),
        messages: [buildFlexMessage(lead)],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    // เครือข่ายมีปัญหา หรือ LINE ไม่ตอบกลับภายในเวลาที่กำหนด
    throw new Error(`ติดต่อ LINE API ไม่ได้: ${err.message}`);
  }

  if (!response.ok) {
    // อ่านรายละเอียดข้อผิดพลาดจาก LINE เพื่อให้ debug ได้ง่าย (ไม่มี token อยู่ใน response)
    const detail = await response.text().catch(() => "");
    throw new Error(
      `LINE API ตอบกลับ ${response.status} ${response.statusText}: ${detail.slice(0, 500)}`
    );
  }

  return { sent: true };
}
