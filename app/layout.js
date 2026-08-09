import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "ไทยโอเชียน เซอร์วิส | บริการมืออาชีพครบวงจร",
  description:
    "ผู้ให้บริการดูแลธุรกิจครบวงจร ทั้งที่ปรึกษา ดูแลระบบ การตลาดออนไลน์ และงานออกแบบ ด้วยทีมงานมืออาชีพ",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.className} antialiased`}>{children}</body>
    </html>
  );
}
