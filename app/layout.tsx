import type { Metadata } from "next";
import { Inter, Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700']
});

const sora = Sora({
  subsets: ["latin"],
  variable: '--font-sora',
  weight: ['400', '600']
});

export const metadata: Metadata = {
  title: "ADmyBRAND AI Suite",
  description: "Marketing on Autopilot. Results on Demand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable}`}>{children}</body>
    </html>
  );
}