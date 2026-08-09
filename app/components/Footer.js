import { services } from "../data/services";

const menuLinks = [
  { href: "#home", label: "หน้าแรก" },
  { href: "#about", label: "เกี่ยวกับเรา" },
  { href: "#services", label: "บริการของเรา" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export default function Footer() {
  const year = new Date().getFullYear() + 543; // แสดงเป็น พ.ศ.

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                TO
              </span>
              <span className="text-lg font-semibold text-white">
                ไทยโอเชียนเซอร์วิส
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              ผู้ให้บริการดูแลธุรกิจครบวงจร
              ด้วยทีมงานมืออาชีพที่พร้อมเติบโตไปพร้อมกับคุณ
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">เมนู</h3>
            <ul className="mt-4 space-y-2.5">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">บริการ</h3>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">ติดต่อ</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>123 อาคารโอเชียนทาวเวอร์ ชั้น 8</li>
              <li>ถนนสุขุมวิท คลองเตย กรุงเทพฯ 10110</li>
              <li>โทร. 02-123-4567</li>
              <li>contact@thaioceanservice.co.th</li>
              <li>จันทร์ - ศุกร์ 09:00 - 18:00 น.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-7 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {year} บริษัท ไทยโอเชียน เซอร์วิส จำกัด สงวนลิขสิทธิ์
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="transition-colors hover:text-slate-300">
              นโยบายความเป็นส่วนตัว
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              ข้อกำหนดการใช้งาน
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
