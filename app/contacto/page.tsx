import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/ContactPage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto | Molotitos Amor — Ciudad del Carmen",
  description:
    "Contáctanos para pedidos, información o cualquier duda. Molotitos Amor, molotes artesanales en Ciudad del Carmen, Campeche.",
  alternates: { canonical: "https://molotes.aionsite.com.mx/contacto" },
  openGraph: {
    title: "Contacto | Molotitos Amor",
    description: "Contáctanos para pedidos y más información.",
    url: "https://molotes.aionsite.com.mx/contacto",
  },
};

export default async function Page() {
  const content = await getSiteContent();
  return <ContactPage content={content} />;
}
