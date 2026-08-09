"use client";

import { useState } from "react";
import { services, otherServiceOption } from "../data/services";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "กรุณากรอกชื่อ-นามสกุล";
  }

  const phoneDigits = form.phone.replace(/[\s-]/g, "");
  if (!phoneDigits) {
    errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
  } else if (!/^0\d{8,9}$/.test(phoneDigits)) {
    errors.phone = "เบอร์โทรไม่ถูกต้อง (ตัวอย่าง 0812345678)";
  }

  if (!form.email.trim()) {
    errors.email = "กรุณากรอกอีเมล";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  if (!form.serviceType) {
    errors.serviceType = "กรุณาเลือกประเภทบริการ";
  }

  if (!form.message.trim()) {
    errors.message = "กรุณากรอกรายละเอียด";
  } else if (form.message.trim().length < 10) {
    errors.message = "กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร";
  }

  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // ล้าง error ของช่องนั้นทันทีที่ผู้ใช้เริ่มแก้ไข
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // ใช้ข้อความจากเซิร์ฟเวอร์ เช่น กรณีส่งถี่เกินกำหนด จะได้บอกได้ว่าต้องรอนานแค่ไหน
        throw new Error(
          data.error || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือโทร 02-123-4567"
        );
      }

      setStatus("success");
      setForm(emptyForm);
    } catch (err) {
      setErrorMessage(
        err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง"
      );
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* ข้อมูลติดต่อ */}
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              ติดต่อเรา
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              บอกเราว่าคุณต้องการอะไร
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              กรอกแบบฟอร์มเพื่อให้ทีมงานติดต่อกลับภายใน 1 วันทำการ
              หรือจะโทรหาเราโดยตรงก็ได้เช่นกัน
            </p>

            <dl className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <dt className="mt-0.5 text-brand-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.24 1L7.8 9.6a12 12 0 006.6 6.6l1.62-1.31a1 1 0 011-.24l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z"
                    />
                  </svg>
                </dt>
                <dd>
                  <p className="text-sm font-medium text-slate-900">โทรศัพท์</p>
                  <p className="text-sm text-slate-600">02-123-4567</p>
                </dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="mt-0.5 text-brand-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </dt>
                <dd>
                  <p className="text-sm font-medium text-slate-900">อีเมล</p>
                  <p className="text-sm text-slate-600">
                    contact@thaioceanservice.co.th
                  </p>
                </dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="mt-0.5 text-brand-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </dt>
                <dd>
                  <p className="text-sm font-medium text-slate-900">ที่อยู่</p>
                  <p className="text-sm leading-6 text-slate-600">
                    123 อาคารโอเชียนทาวเวอร์ ชั้น 8
                    <br />
                    ถนนสุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110
                  </p>
                </dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="mt-0.5 text-brand-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 7v5l3 2" />
                  </svg>
                </dt>
                <dd>
                  <p className="text-sm font-medium text-slate-900">เวลาทำการ</p>
                  <p className="text-sm text-slate-600">
                    จันทร์ - ศุกร์ 09:00 - 18:00 น.
                  </p>
                </dd>
              </div>
            </dl>
          </div>

          {/* แบบฟอร์ม */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    ชื่อ <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="ชื่อ - นามสกุล"
                    aria-invalid={Boolean(errors.name)}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    เบอร์โทร <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08X-XXX-XXXX"
                    aria-invalid={Boolean(errors.phone)}
                    className={inputClass}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="serviceType"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    ประเภทบริการ <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.serviceType)}
                    className={`${inputClass} appearance-none bg-[length:1.25rem] bg-[right:0.9rem_center] bg-no-repeat pr-11 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M6 9l6 6 6-6%22/></svg>')]`}
                  >
                    <option value="">-- กรุณาเลือกประเภทบริการ --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                    <option value={otherServiceOption.name}>
                      {otherServiceOption.name}
                    </option>
                  </select>
                  {errors.serviceType && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.serviceType}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    รายละเอียด <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="เล่าให้เราฟังคร่าว ๆ ว่าธุรกิจของคุณทำอะไร และต้องการให้เราช่วยเรื่องใด"
                    aria-invalid={Boolean(errors.message)}
                    className={`${inputClass} resize-y`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-7 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                {status === "sending" ? "กำลังส่งข้อมูล..." : "ส่งข้อมูล"}
              </button>

              {status === "success" && (
                <p
                  role="status"
                  className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                  ✅ ส่งข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
                  ขอบคุณครับ/ค่ะ
                </p>
              )}

              {status === "error" && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  ❌ {errorMessage}
                </p>
              )}

              <p className="mt-4 text-center text-xs text-slate-500">
                ข้อมูลของคุณจะถูกเก็บเป็นความลับ และใช้เพื่อการติดต่อกลับเท่านั้น
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
