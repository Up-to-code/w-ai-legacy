import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/toast-container";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
   weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "W-AI - منصة واتساب الذكية",
  description: "أتمتة التواصل مع العملاء بذكاء",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} antialiased font-sans`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
