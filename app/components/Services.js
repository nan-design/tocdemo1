import { services } from "../data/services";

export default function Services() {
  return (
    <section id="services" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            บริการของเรา
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            เลือกบริการที่ใช่สำหรับธุรกิจคุณ
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            ทุกบริการปรับขอบเขตงานได้ตามขนาดธุรกิจ
            หากยังไม่แน่ใจว่าควรเริ่มจากตรงไหน ทีมงานยินดีให้คำปรึกษาฟรี
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={service.icon}
                  />
                </svg>
              </span>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {service.name}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-7 text-slate-600">
                {service.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-brand-600">
                  {service.price}
                </span>
                <a
                  href="#contact"
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
                >
                  สอบถาม →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
