import type { MetadataRoute } from "next";
import { getPrograms, getProducts, getProjects, getStories } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/programs`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/impact`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/stories`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/get-involved`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/donate`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/transparency`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/safeguarding`, changeFrequency: "yearly", priority: 0.4, lastModified: now },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
  ];

  const [programRoutes, projectRoutes, storyRoutes, productRoutes] = await Promise.all([
    getPrograms().then((list) =>
      list.map((p) => ({
        url: `${SITE_URL}/programs/${p.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: now,
      })),
    ),
    getProjects().then((list) =>
      list.map((p) => ({
        url: `${SITE_URL}/projects/${p.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        lastModified: now,
      })),
    ),
    getStories().then((list) =>
      list.map((s) => ({
        url: `${SITE_URL}/stories/${s.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        lastModified: new Date(s.publishedAt),
      })),
    ),
    getProducts().then((list) =>
      list.map((p) => ({
        url: `${SITE_URL}/shop/${p.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        lastModified: now,
      })),
    ),
  ]);

  return [...staticRoutes, ...programRoutes, ...projectRoutes, ...storyRoutes, ...productRoutes];
}
