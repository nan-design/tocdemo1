const highlights = [
  {
    title: "ทีมผู้เชี่ยวชาญเฉพาะทาง",
    detail:
      "ทุกโปรเจกต์ดูแลโดยผู้เชี่ยวชาญที่มีประสบการณ์ตรงในสายงานนั้น ๆ ไม่ใช่งานฝากทำ",
  },
  {
    title: "ราคาโปร่งใส ไม่มีบวกเพิ่ม",
    detail:
      "แจ้งขอบเขตงานและค่าใช้จ่ายชัดเจนตั้งแต่ต้น ไม่มีค่าใช้จ่ายแอบแฝงระหว่างทาง",
  },
  {
    title: "ดูแลต่อเนื่องหลังส่งมอบ",
    detail:
      "มีทีมซัพพอร์ตพร้อมตอบทุกวันทำการ พร้อมรับประกันผลงานตามเงื่อนไขที่ตกลงกัน",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              เกี่ยวกับเรา
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              พาร์ทเนอร์ที่อยู่เคียงข้างธุรกิจคุณ
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              ไทยโอเชียน เซอร์วิส ก่อตั้งขึ้นในปี 2557
              ด้วยความตั้งใจที่จะทำให้ธุรกิจขนาดเล็กและขนาดกลาง
              เข้าถึงบริการระดับมืออาชีพได้ในราคาที่เป็นธรรม
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              ตลอด 12 ปีที่ผ่านมา เราดูแลลูกค้ามาแล้วกว่า 500 ราย
              ครอบคลุมทั้งธุรกิจค้าปลีก ร้านอาหาร โรงแรม และงานบริการ
              โดยยึดหลักการทำงานที่ตรงไปตรงมาและวัดผลได้จริง
            </p>

            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              คุยกับทีมงานของเรา
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <ul className="space-y-4">
            {highlights.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-7 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
