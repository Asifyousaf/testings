// app/metadata.ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Achyut Katiyar | Portfolio",
  description: "Full Stack Developer & Machine Learning Enthusiast",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", type: "image/png" },
  },
};