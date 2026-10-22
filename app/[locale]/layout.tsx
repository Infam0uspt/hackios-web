import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Unbounded, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { LOCALES, HTML_LANG, OG_LOCALE, isLocale, type Locale } from "@/lib/locales";
import { getDict } from "@/lib/dict";
import { SITE_URL, TELEGRAM, GITHUB_URL } from "@/lib/site";

const display = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["500", "800", "900"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "700"], variable: "--font-mono", display: "swap" });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0909",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  const languages = Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `/${l}`]));
  return {
    metadataBase: new URL(SITE_URL),
    title: d.meta_title,
    description: d.meta_desc,
    applicationName: "HackiOS",
    keywords: ["HackiOS", "iOS on Android", "OOSEX GANG", "Android", "experimental", "Oosy"],
    alternates: { canonical: `/${locale}`, languages: { ...languages, "x-default": "/en" } },
    openGraph: {
      type: "website", siteName: "HackiOS", url: `/${locale}`, title: d.meta_title, description: d.meta_desc,
      locale: OG_LOCALE[locale], alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image", title: d.meta_title, description: d.meta_desc },
    manifest: "/manifest.webmanifest",
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale as Locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "OOSEX GANG", url: SITE_URL, logo: `${SITE_URL}/icon-512.png`, sameAs: [TELEGRAM.url, GITHUB_URL] },
      { "@type": "WebSite", name: "HackiOS", url: `${SITE_URL}/${locale}`, inLanguage: HTML_LANG[locale as Locale], description: d.meta_desc },
    ],
  };
  return (
    <html lang={HTML_LANG[locale as Locale]} className={`${display.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
