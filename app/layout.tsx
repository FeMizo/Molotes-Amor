import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${serif.variable} ${sans.variable} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
