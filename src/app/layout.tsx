import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";

const bodyFont = DM_Sans({ variable: "--font-body", subsets: ["latin", "latin-ext"] });
const displayFont = Space_Grotesk({ variable: "--font-display", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Việt Interview Pro | Luyện phỏng vấn thông minh với AI",
  description: "Luyện phỏng vấn, nhận feedback có cấu trúc và chuẩn bị đàm phán lương với AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}