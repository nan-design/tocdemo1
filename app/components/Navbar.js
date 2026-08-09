"use client";

import { useState } from "react";

const links = [
  { href: "#home", label: "หน้าแรก" },
  { href: "#about", label: "เกี่ยวกับเรา" },
  { href: "#services", label: "บริการของเรา" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            TO
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            ไทยโอเชียน<span className="text-brand-600">เซอร์วิส</span>
          </span>
        </a>

        {/* เมนูสำหรับจอใหญ่ */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 md:inline-block"
        >
          ขอใบเสนอราคา
        </a>

        {/* ปุ่มเมนูมือถือ */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="เปิดเมนู"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* เมนูแบบเลื่อนลงบนมือถือ */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-1">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                ขอใบเสนอราคา
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
