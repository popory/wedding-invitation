import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이세린 ♥ 이혜린 결혼합니다",
  description: "2026년 11월 1일 오후 1시, 더채플앳청담",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
