import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이세린 ♥ 이혜린 결혼합니다",
  description: "2026년 11월 1일 일요일 오후 1시, 더채플앳 청담 6층 채플홀",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
