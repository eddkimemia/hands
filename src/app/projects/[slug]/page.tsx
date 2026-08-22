import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/SmartImage";
import { getPrograms, getProjectBySlug, getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | Ishara Charity`,
      description: project.summary,
      images: [{ url: project.image }],
      type: "article",
    },
  };
}

const STATUS_STYLES = {
  active: "bg-leaf-100 text-leaf-800",
  planning: "bg-gold-100 text-gold-800",
  completed: "bg-navy-100 text-navy-800",
} as const;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) notFound();

  const program = project.programId
    ? (await getPrograms()).find((p) => p.id === project.programId)
    : undefined;

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/projects", label: "Projects" },
          { href: `/projects/${project.slug}`, label: project.name },
        ]}
        eyebrow={program ? program.name : "Project"}
        title={project.name}
        description={project.summary}
      />

      <section className="section-pad">
        <div className="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* Main column */}
          <div>
            <Reveal>
              <div className="zoom-img relative aspect-video overflow-hidden rounded-3xl shadow-lift">
                <SmartImage
                  src={project.image}
                  alt={project.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 space-y-4 leading-relaxed text-navy-800/85">
                {project.description.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Reveal delay={100}>
              <div className="card p-7">
                <span className={`chip capitalize ${STATUS_STYLES[project.status]}`}>
                  {project.status}
                </span>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Icon name="map-pin" size={17} className="mt-0.5 shrink-0 text-gold-600" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wider text-navy-500">Location</dt>
                      <dd className="mt-0.5 font-semibold text-navy-900">{project.location}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="users" size={17} className="mt-0.5 shrink-0 text-gold-600" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wider text-navy-500">People Reached</dt>
                      <dd className="mt-0.5 font-semibold text-navy-900">{project.peopleReached.toLocaleString()}+</dd>
                    </div>
                  </div>
                  {project.startDate && (
                    <div className="flex items-start gap-3">
                      <Icon name="calendar" size={17} className="mt-0.5 shrink-0 text-gold-600" />
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-navy-500">Started</dt>
                        <dd className="mt-0.5 font-semibold text-navy-900">{project.startDate}</dd>
                      </div>
                    </div>
                  )}
                </dl>

                <div className="mt-6 border-t border-navy-100 pt-5">
                  <div className="flex items-center justify-between text-sm font-bold text-navy-900">
                    <span>Progress</span>
                    <span>{project.progressPercent}%</span>
                  </div>
                  <div
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy-100"
                    role="progressbar"
                    aria-valuenow={project.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${project.name} progress`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-royal-600 to-gold-400"
                      style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <Link href={`/donate?project=${project.slug}`} className="btn-primary mt-6 w-full">
                  <Icon name="heart" size={16} />
                  Support This Project
                </Link>
                <Link href="/get-involved#volunteer" className="btn-outline mt-3 w-full">
                  Volunteer With Us
                </Link>
              </div>
            </Reveal>

            {program && (
              <Reveal delay={180}>
                <Link href={`/programs/${program.slug}`} className="card card-hover flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                    <Icon name={program.icon as never} size={20} />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-navy-500">Part of</span>
                    <span className="block font-display font-semibold text-navy-900">{program.name}</span>
                  </span>
                </Link>
              </Reveal>
            )}
          </aside>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="section-pad bg-sand pt-0 sm:pt-0">
          <div className="container-x pt-16 sm:pt-20">
            <Reveal>
              <h2 className="h-display text-2xl sm:text-3xl">Project Gallery</h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.gallery.slice(0, 8).map((src, i) => (
                <Reveal key={src + i} delay={(i % 4) * 70}>
                  <div className="zoom-img relative aspect-square overflow-hidden rounded-2xl shadow-card">
                    <SmartImage
                      src={src}
                      alt={`${project.name} gallery photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
