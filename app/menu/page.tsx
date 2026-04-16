import type { Metadata } from "next";

import { MenuPage } from "@/components/products/MenuPage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menú | Molotitos Amor — Ciudad del Carmen",
  description:
    "Conoce todos nuestros molotes artesanales: tinga, papa con chorizo, huitlacoche y más. Ordena en línea con entrega en Ciudad del Carmen.",
  alternates: { canonical: "https://molotes.aionsite.com.mx/menu" },
  openGraph: {
    title: "Menú | Molotitos Amor",
    description: "Molotes artesanales para ordenar en línea. Ciudad del Carmen.",
    url: "https://molotes.aionsite.com.mx/menu",
  },
};

export default async function Page() {
  const content = await getSiteContent();
  return <MenuPage content={content} />;
}
