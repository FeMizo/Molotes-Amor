import { AboutPage } from "@/components/pages/AboutPage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getSiteContent();
  return <AboutPage content={content.about} />;
}
