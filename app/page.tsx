import { HomePage } from "@/components/home/HomePage";
import { getSiteContent } from "@/services/content/site-content.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getSiteContent();
  return <HomePage content={content.home} />;
}
