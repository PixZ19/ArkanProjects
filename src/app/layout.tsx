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
  title: "ArkanProjects — Ekosistem Deployment DevOps",
  description:
    "Tools deployment produksi dan ekosistem otomasi server. Installer modular, arsitektur yang dapat diperluas, dibangun untuk skala besar.",
  keywords: [
    "DevOps",
    "deployment",
    "installer",
    "Pterodactyl",
    "game server",
    "automation",
    "server management",
    "infrastructure",
  ],
  authors: [{ name: "ArkanProjects" }],
  openGraph: {
    title: "ArkanProjects — Ekosistem Deployment DevOps",
    description: "Tools deployment produksi dan ekosistem otomasi server.",
    url: "https://arkanprojects.vercel.app",
    siteName: "ArkanProjects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
