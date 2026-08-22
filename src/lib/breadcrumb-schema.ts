import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

interface Crumb {
  href: string;
  label: string;
}

/** Builds BreadcrumbList structured data from visual breadcrumbs. */
export function breadcrumbJsonLd(crumbs: Crumb[]): object | null {
  if (!crumbs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        item: `${SITE_URL}${c.href}`,
      })),
    ],
  };
}
