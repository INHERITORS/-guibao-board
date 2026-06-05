import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "瑰宝榜 Tracker",
  description: "2027 丁未年槟城庙会策展评分系统"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
