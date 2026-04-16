import type { Metadata } from "next";

import { CheckoutPage } from "@/components/pages/CheckoutPage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function Page() {
  const content = await getSiteContent();
  return <CheckoutPage operations={content.operations} />;
}
