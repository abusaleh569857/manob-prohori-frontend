import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";
import "leaflet/dist/leaflet.css";

// ============================================================================
// Global Font Configurations (Google Fonts)
// ============================================================================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================================
// Application Metadata (SEO & OpenGraph)
// ============================================================================
export const metadata: Metadata = {
  title: "Manob Prohori - Smart Emergency Response Platform",
  description:
    "Connecting volunteers, hospitals, blood donors, and emergency services in real time.",
};

// ============================================================================
// Root Application HTML Layout
// ============================================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster richColors position="top-center" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
