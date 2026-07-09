import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { BootScreen } from "@/components/boot-screen";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://bhavikkhorava.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bhavik Khorava — Node.js Backend Developer",
    template: "%s — Bhavik Khorava",
  },
  description:
    "Bhavik Khorava is a Node.js backend developer with 4+ years of experience building scalable REST APIs, real-time infrastructure, secure payment systems, and AI-powered backends with OpenAI and vector databases.",
  keywords: [
    "Bhavik Khorava",
    "Node.js Developer",
    "Backend Developer",
    "Backend Engineer",
    "TypeScript Developer",
    "REST API",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "OpenAI API",
    "Vector Database",
  ],
  authors: [{ name: "Bhavik Khorava" }],
  creator: "Bhavik Khorava",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Bhavik Khorava — Node.js Backend Developer",
    description:
      "4+ years building scalable backend systems: REST APIs, real-time infrastructure, payments, and AI-powered systems.",
    siteName: "Bhavik Khorava",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavik Khorava — Node.js Backend Developer",
    description:
      "4+ years building scalable backend systems: REST APIs, real-time infrastructure, payments, and AI-powered systems.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg selection:bg-accent/30">
        <BootScreen />
        <ScrollProgress />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
