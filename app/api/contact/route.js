import { NextResponse } from "next/server";
import { sendLeadToLineOA, isLineConfigured } from "../../lib/line";
import { checkRateLimit, getClientIp } from "../../lib/rateLimit";

// ตรวจสอบข้อมูลซ้ำอีกครั้งฝั่งเซิร์ฟเวอร์ ไม่พึ่งการตรวจสอบฝั่งเบราว์เซอร์เพียงอย่างเดียว
function validate(data) {
  const errors = {};
  const name = String(data.name ?? "").trim();
  const phone = String(data.phone ?? "").replace(/[\s-]/g, "");
  const email = String(data.email ?? "").trim();
  const serviceType = String(data.serviceType ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name) errors.name = "กรุณากรอกชื่อ";
  if (!/^0\d{8,9}$/.test(phone)) errors.phone = "เบอร์โทรไม่ถูกต้อง";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "อีเมลไม่ถูกต้อง";
  if (!serviceType) errors.serviceType = "กรุณาเลือกประเภทบริการ";
  if (message.length < 10) errors.message = "รายละเอียดสั้นเกินไป";

  return { errors, clean: { name, phone, email, serviceType, message } };
}

export async function POST(request) {
  // กันบอทก่อนเป็นอย่างแรก ก่อนจะเสียเวลาประมวลผลหรือยิงไปที่ LINE
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    console.warn(`[contact] ปฏิเสธคำขอจาก ${ip} — ส่งถี่เกินกำหนด`);

    return NextResponse.json(
      {
        ok: false,
        error: `คุณส่งข้อมูลบ่อยเกินไป กรุณารออีก ${minutes} นาทีแล้วลองใหม่ หรือโทร 02-123-4567`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const { errors, clean } = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  console.log("[contact] ได้รับข้อมูลติดต่อใหม่:", clean);

  // ส่งเข้า LINE OA
  try {
    const result = await sendLeadToLineOA(clean);

    if (result.sent) {
      console.log("[contact] ส่งเข้า LINE OA สำเร็จ");
    } else {
      console.warn(`[contact] ข้ามการส่งเข้า LINE OA — ${result.skipped}`);
    }
  } catch (err) {
    console.error("[contact] ส่งเข้า LINE OA ไม่สำเร็จ:", err.message);

    // แจ้ง error กลับไปให้ลูกค้าเห็น เพื่อให้ติดต่อทางโทรศัพท์แทน
    // ดีกว่าบอกว่าสำเร็จทั้งที่ข้อมูลไม่ถึงมือทีมงาน
    return NextResponse.json(
      {
        ok: false,
        error: "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้งหรือติดต่อทางโทรศัพท์",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    // ระบุให้ชัดว่าข้อความถึง LINE จริงหรือยัง สะดวกตอนทดสอบ
    lineDelivered: isLineConfigured(),
    message: "ได้รับข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
  });
}
