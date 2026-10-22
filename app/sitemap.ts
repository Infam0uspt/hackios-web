import type { MetadataRoute } from "next";
import { LOCALES, HTML_LANG } from "@/lib/locales";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `${SITE_URL}/${l}`]));
  return LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: l === "en" ? 1 : 0.8,
    alternates: { languages },
  }));
}
