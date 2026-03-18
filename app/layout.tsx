import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { getSiteContent } from "@/services/content/site-content.service";

import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif-base",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans-base",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Molotes El Tradicional",
  description: "Sabor artesanal con un toque moderno.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let siteContent = null;

  try {
    siteContent = await getSiteContent();
  } catch {
    siteContent = null;
  }

  return (
    <html lang="es">
      <body className={`${serif.variable} ${sans.variable} min-h-screen flex flex-col`}>
        <AppShell siteContent={siteContent}>{children}</AppShell>
      </body>
    </html>
  );
}
