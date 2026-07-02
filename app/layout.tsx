import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script";
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Auctor RC - CAT Reading Comprehension Practice Platform",
  description:
    "Practice CAT Reading Comprehension daily with Auctor RC. Improve speed, inference and accuracy using AI training.",

    verification: {
  google: "O8712-gSjpOeakH0",
},
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
     <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f2a] text-white`}
>
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=AW-18259887177"
    strategy="afterInteractive"
  />

  <Script id="google-ads" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-18259887177');
    `}
  </Script>

  {children}
</body>
    </html>
  )
}