import { Geist, Geist_Mono } from "next/font/google";

import { CookieNotice } from "@/_components/CookieNotice";
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
  title: "_nsigned - The DIY music magazine",
  description:
    "A community music review site. Post a link to your Bandcamp and other people will review it, or give some stuff a listen and tell everyone what you think!",
  openGraph: {
    images: [
      {
        height: 1200,
        width: 1200,
        url: "/images/nsigned-meta.jpg",
      },
    ],
  },
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
          <head>
            <link rel="icon" href="/images/nsigned-favicon.jpg" />
          </head>
          <body>
            <div className="flex flex-col flex-1 items-center justify-center font-sans bg-background">
              <main className="flex flex-1 w-full max-w-[900px] flex-col items-center justify-between px-[10px] sm:px-16 bg-background text-foreground mb-[100px]">
                <Header />
                <div className="flex flex-col gap-6 w-full">
                  <div className="w-full">{children}</div>
                </div>
              </main>
              <CookieNotice />
              <Footer />
            </div>
          </body>
        </CookiesProvider>
      </AuthProvider>
    </html>
  );
}
