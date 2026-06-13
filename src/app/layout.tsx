import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GSB Startup Angels - Funding Dreams. Building Founders.",
  description:
    "An angel investment platform built by and for the GSB community — connecting founders, investors, mentors and industry leaders to fuel India's entrepreneurial decade.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} font-sans antialiased`}>
        <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden max-w-[100vw]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
