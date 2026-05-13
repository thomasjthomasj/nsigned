import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/_components/Footer";
import { Header } from "@/_components/Header";
import { CookiesProvider } from "@/_components/_providers/CookiesProvider";
import { AuthProvider } from "@/_contexts/AuthContext";

import "./globals.css";

import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "_nsigned",
  description: "The DIY music magazine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider>
        <CookiesProvider>
          <body>
            <div className="flex flex-col flex-1 items-center justify-center font-sans bg-background">
              <main className="flex flex-1 w-full max-w-[900px] flex-col items-center justify-between px-[10px] sm:px-16 bg-background text-foreground mb-[100px]">
                <Header />
                <div className="flex flex-col gap-6 w-full">
                  <div className="w-full">{children}</div>
                </div>
              </main>
              <Footer />
            </div>
          </body>
        </CookiesProvider>
      </AuthProvider>
    </html>
  );
}
