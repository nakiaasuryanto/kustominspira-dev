import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Kustominspira - #DariKainJadiKarya",
  description: "Belajar dan praktek langsung di Kustominspira. Platform edukasi fashion dan menjahit terpercaya dengan artikel, video tutorial, workshop, dan seminar.",
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/assets/icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png', 
      sizes: '16x16',
      url: '/assets/icon.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/assets/icon.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
