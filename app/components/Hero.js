const stats = [
  { value: "500+", label: "ลูกค้าที่ไว้วางใจ" },
  { value: "12 ปี", label: "ประสบการณ์ในวงการ" },
  { value: "98%", label: "ความพึงพอใจ" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white"
    >
      {/* วงกลมตกแต่งพื้นหลัง */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            บริการมืออาชีพ ครบวงจรในที่เดียว
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            ยกระดับธุรกิจของคุณ
            <br />
            ด้วย<span className="text-brand-600">ทีมงานที่เชื่อถือได้</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            เราคือผู้ให้บริการดูแลธุรกิจแบบครบวงจร ตั้งแต่วางกลยุทธ์ ดูแลระบบไอที
            การตลาดออนไลน์ ไปจนถึงงานออกแบบ ด้วยทีมผู้เชี่ยวชาญที่พร้อมดูแลคุณ
            ทุกขั้นตอน ในราคาที่จับต้องได้
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-700"
            >
              ปรึกษาฟรี ไม่มีค่าใช้จ่าย
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              ดูบริการทั้งหมด
            </a>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm"
            >
              <dt className="text-3xl font-bold text-brand-600">{stat.value}</dt>
              <dd className="mt-1 text-sm text-slate-600">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
