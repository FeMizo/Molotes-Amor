import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/mi-cuenta/", "/checkout/", "/api/"],
      },
    ],
    sitemap: "https://molotes.aionsite.com.mx/sitemap.xml",
  };
}
