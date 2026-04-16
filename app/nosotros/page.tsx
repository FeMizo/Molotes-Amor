import type { Metadata } from "next";

import { AboutPage } from "@/components/pages/AboutPage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nosotros | Molotitos Amor — Ciudad del Carmen",
  description:
    "Conoce la historia detrás de Molotitos Amor. Recetas tradicionales, ingredientes locales y el sabor de siempre en Ciudad del Carmen.",
  alternates: { canonical: "https://molotes.aionsite.com.mx/nosotros" },
  openGraph: {
    title: "Nosotros | Molotitos Amor",
    description: "La historia detrás de los mejores molotes de Ciudad del Carmen.",
    url: "https://molotes.aionsite.com.mx/nosotros",
  },
};

export default async function Page() {
  const content = await getSiteContent();
  return <AboutPage content={content} />;
}
