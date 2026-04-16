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

const BASE_URL = "https://molotes.aionsite.com.mx";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Molotitos Amor",
  description: "Molotes artesanales en Ciudad del Carmen. Recetas tradicionales, ingredientes frescos y sabor casero en cada mordida.",
  url: BASE_URL,
  servesCuisine: "Mexican",
  priceRange: "$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ciudad del Carmen",
    addressRegion: "Campeche",
    addressCountry: "MX",
  },
  openingHoursSpecification: [],
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteContent = await getSiteContent();
    const title = siteContent.brand.metaTitle || "Molotitos Amor | Molotes en Ciudad del Carmen";
    const description =
      siteContent.brand.metaDescription ||
      "Molotes artesanales en Ciudad del Carmen. Crujientes por fuera, suaves por dentro. Ordena en línea y recibe en casa.";

    return {
      title,
      description,
      metadataBase: new URL(BASE_URL),
      alternates: { canonical: BASE_URL },
      openGraph: {
        type: "website",
        locale: "es_MX",
        url: BASE_URL,
        siteName: "Molotitos Amor",
        title,
        description,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      },
    };
  } catch {
    return {
      title: "Molotitos Amor | Molotes en Ciudad del Carmen",
      description:
        "Molotes artesanales en Ciudad del Carmen. Crujientes por fuera, suaves por dentro. Ordena en línea y recibe en casa.",
      metadataBase: new URL(BASE_URL),
      alternates: { canonical: BASE_URL },
      openGraph: {
        type: "website",
        locale: "es_MX",
        url: BASE_URL,
        siteName: "Molotitos Amor",
      },
      robots: { index: true, follow: true },
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let siteContent = null;

  try {
    siteContent = await getSiteContent();
  } catch {
    siteContent = null;
  }

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${serif.variable} ${sans.variable} min-h-screen flex flex-col`}>
        <AppShell siteContent={siteContent}>{children}</AppShell>
      </body>
    </html>
  );
}
