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
  title: "ArkanProjects — Pterodactyl All-in-One Installer",
  description:
    "Solusi lengkap untuk instalasi Pterodactyl Panel dan Wings dalam satu script. Multi-OS, SSL otomatis, firewall terkonfigurasi, dan CLI modern.",
  keywords: [
    "ArkanProjects",
    "Pterodactyl",
    "Game Server",
    "Panel Installer",
    "Wings",
    "Docker",
    "Linux",
    "DevOps",
    "Game Hosting",
  ],
  authors: [
    { name: "Muhammad Rafif Rianto C.Ps" },
    { name: "Faturrahman Al Rizky" },
    { name: "Akhbar Alfiansyah" },
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ArkanProjects — Pterodactyl All-in-One Installer",
    description:
      "Solusi lengkap untuk instalasi Pterodactyl Panel dan Wings dalam satu script.",
    url: "https://arkanprojects.vercel.app",
    siteName: "ArkanProjects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArkanProjects — Pterodactyl All-in-One Installer",
    description:
      "Solusi lengkap untuk instalasi Pterodactyl Panel dan Wings dalam satu script.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: "#0a0a0f",
          color: "#e0e0e8",
        }}
      >
        {children}
      </body>
    </html>
  );
}
