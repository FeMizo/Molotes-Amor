import { MenuPage } from "@/components/products/MenuPage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getSiteContent();
  return <MenuPage content={content.menu} />;
}
