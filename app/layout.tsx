import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";
import "leaflet/dist/leaflet.css";

// ============================================================================
// Global Font Configurations (Google Fonts - Plus Jakarta Sans & Geist Mono)
// ============================================================================
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50/70 text-slate-900 selection:bg-brand-red-soft selection:text-brand-red">
        <Toaster richColors position="top-center" closeButton />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
