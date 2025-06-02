import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asif Yousaf | Full Stack Developer",
  description: "Full Stack Developer, UI/UX Designer & Machine Learning Enthusiast with expertise in web development and innovative solutions.",
  metadataBase: new URL("https://asifyousaf.com"),
  
  // Basic metadata
  applicationName: "Asif Yousaf Portfolio",
  authors: [{ name: "Asif Yousaf" }],
  keywords: ["Full Stack Developer", "UI/UX Designer", "Machine Learning", "Web Development", "Frontend", "Backend"],
  
  openGraph: {
    type: "website",
    url: "https://asifyousaf.com",
    title: "Asif Yousaf | Full Stack Developer",
    description: "Full Stack Developer, UI/UX Designer & Machine Learning Enthusiast with expertise in web development and innovative solutions.",
    siteName: "Asif Yousaf",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Asif Yousaf - Portfolio",
      },
    ],
  },
  
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
  
  alternates: {
    canonical: "https://asifyousaf.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}