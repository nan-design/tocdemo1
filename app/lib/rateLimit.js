// จำกัดจำนวนครั้งที่ส่งฟอร์มได้ต่อ IP เพื่อกันบอทยิงซ้ำจน quota ของ LINE OA หมด
//
// ข้อจำกัด: เก็บสถิติไว้ในหน่วยความจำของเซิร์ฟเวอร์ จึงใช้ได้กับการรันแบบ
// Node server เครื่องเดียว (npm start / VPS / Docker) หากไปรันบนแพลตฟอร์ม
// serverless ที่มีหลาย instance เช่น Vercel ตัวนับจะแยกกันคนละ instance
// กรณีนั้นควรเปลี่ยนไปใช้ Redis / Upstash แทน

const WINDOW_MS = 10 * 60 * 1000; // ช่วงเวลาที่นับ = 10 นาที
const MAX_REQUESTS = 3; // ส่งได้ไม่เกิน 3 ครั้งในช่วงเวลานั้น
const SWEEP_INTERVAL_MS = 5 * 60 * 1000; // กวาดข้อมูลเก่าทิ้งทุก 5 นาที

// ใช้ globalThis เพื่อให้ตัวนับอยู่รอดตอน hot reload ระหว่างพัฒนา
// ไม่งั้นแก้โค้ดทีนึงตัวนับจะรีเซ็ตใหม่ทุกครั้ง
const store = (globalThis.__contactRateLimitStore ??= {
  hits: new Map(), // ip -> number[] (เวลาที่ส่งแต่ละครั้ง)
  lastSweep: Date.now(),
});

// ลบ IP ที่ไม่ได้ส่งอะไรมานานแล้วออก กัน Map โตไม่จำกัด
function sweepIfNeeded(now) {
  if (now - store.lastSweep < SWEEP_INTERVAL_MS) return;

  for (const [ip, timestamps] of store.hits) {
    const fresh = timestamps.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) {
      store.hits.delete(ip);
    } else {
      store.hits.set(ip, fresh);
    }
  }
  store.lastSweep = now;
}

/**
 * อ่าน IP ของผู้ใช้จาก header ที่ reverse proxy / CDN แนบมาให้
 * ถ้าหาไม่เจอจะคืน "unknown" ซึ่งจะถูกนับรวมเป็นก้อนเดียว
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for อาจมีหลาย IP คั่นด้วย comma ตัวแรกคือ client จริง
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * ตรวจว่า IP นี้ยังส่งฟอร์มได้อีกหรือไม่ และบันทึกครั้งนี้ลงตัวนับ
 * @returns {{allowed: boolean, remaining: number, retryAfterSeconds: number}}
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  sweepIfNeeded(now);

  const timestamps = (store.hits.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS) {
    // เก็บรายการที่กรองแล้วกลับไป เพื่อให้หน้าต่างเวลาเลื่อนตามจริง
    store.hits.set(ip, timestamps);

    const oldest = timestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + WINDOW_MS - now) / 1000)
    );

    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  timestamps.push(now);
  store.hits.set(ip, timestamps);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - timestamps.length,
    retryAfterSeconds: 0,
  };
}

export const rateLimitConfig = { WINDOW_MS, MAX_REQUESTS };
