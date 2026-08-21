import type {
  DatabaseShape,
  EventItem,
  Homepage,
  Partner,
  Program,
  Project,
  ReportDoc,
  SiteSettings,
  Stat,
  Story,
  TeamMember,
} from "@/types";
import { findItemByField, getSingleton, listItems } from "./db";

/* ----------------------------- site settings ---------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  return getSingleton<SiteSettings>("settings");
}

export async function getHomepage(): Promise<Homepage> {
  return getSingleton<Homepage>("homepage");
}

/* -------------------------------- stats --------------------------------- */

export async function getStats(): Promise<Stat[]> {
  const items = await listItems<Stat>("stats");
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/* ------------------------------- programs ------------------------------- */

export async function getPrograms(opts?: { includeDrafts?: boolean }): Promise<Program[]> {
  const items = await listItems<Program>("programs");
  const sorted = items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return opts?.includeDrafts ? sorted : sorted.filter((p) => p.published);
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const programs = await getPrograms({ includeDrafts: true });
  return programs.find((p) => p.slug === slug);
}

/* ------------------------------- projects ------------------------------- */

export async function getProjects(opts?: { includeDrafts?: boolean }): Promise<Project[]> {
  const items = await listItems<Project>("projects");
  const filtered = opts?.includeDrafts ? items : items.filter((p) => p.published);
  return filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects({ includeDrafts: true });
  return projects.find((p) => p.slug === slug);
}

export async function getFeaturedProject(): Promise<Project | undefined> {
  const hp = await getHomepage();
  const projects = await getProjects();
  return (
    (hp.featuredProjectSlug ? await getProjectBySlug(hp.featuredProjectSlug) : undefined) ||
    projects.find((p) => p.featured) ||
    projects[0]
  );
}

/* -------------------------------- stories ------------------------------- */

export async function getStories(opts?: { includeDrafts?: boolean }): Promise<Story[]> {
  const items = await listItems<Story>("stories");
  const filtered = opts?.includeDrafts ? items : items.filter((s) => s.published);
  return filtered.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  const stories = await getStories({ includeDrafts: true });
  return stories.find((s) => s.slug === slug);
}

/* --------------------------- people & partners -------------------------- */

export async function getTeam(): Promise<TeamMember[]> {
  const items = await listItems<TeamMember>("team");
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getPartners(): Promise<Partner[]> {
  return listItems<Partner>("partners");
}

export async function getEvents(opts?: { upcomingOnly?: boolean }): Promise<EventItem[]> {
  const nowIso = new Date().toISOString().slice(0, 10);
  let events = await listItems<EventItem>("events");
  if (opts?.upcomingOnly) events = events.filter((e) => e.date >= nowIso);
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

/* ------------------------------ shop helpers ---------------------------- */

export async function getReports(): Promise<ReportDoc[]> {
  return listItems<ReportDoc>("reports");
}

export async function getProducts(opts?: { includeOutOfStock?: boolean }) {
  const items = await listItems<DatabaseShape["products"][number]>("products");
  return opts?.includeOutOfStock ? items : items.filter((p) => p.inStock);
}

export async function getProductById(productId: string) {
  return findItemByField<DatabaseShape["products"][number]>("products", "id", productId);
}
