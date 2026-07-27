import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "استیم استور | مرجع خرید و دانلود بازی",
  description: "بهترین و جدیدترین بازی‌های دیجیتال با تحویل آنی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-600 selection:text-white bg-white text-gray-900 dark:bg-[#0f1217] dark:text-white transition-colors duration-500">
        <ThemeProvider>
          {/* هدر سایت */}
          <Navbar />

          {/* محتوای اصلی تمام صفحات */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* فوتر سایت */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}