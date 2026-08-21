import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/cards";
import { SmartImage } from "@/components/SmartImage";
import { getProgramBySlug, getPrograms, getProjects, getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: program.name,
    description: program.summary,
    alternates: { canonical: `${SITE_URL}/programs/${program.slug}` },
    openGraph: {
      title: `${program.name} | Hands of Hope Foundation`,
      description: program.summary,
      images: [{ url: program.image }],
      type: "article",
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program || !program.published) notFound();

  const settings = await getSettings();
  const relatedProjects = (await getProjects()).filter((p) => p.programId === program.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: program.name,
    description: program.summary,
    provider: { "@type": "NGO", name: settings.orgName },
    areaServed: { "@type": "Country", name: "Kenya" },
    url: `${SITE_URL}/programs/${program.slug}`,
  };

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/programs", label: "Our Programs" },
          { href: `/programs/${program.slug}`, label: program.name },
        ]}
        eyebrow="Our Programs"
        title={program.name}
        description={program.summary}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Objectives + activities */}
      <section className="section-pad">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="h-display text-2xl sm:text-3xl">Objectives</h2>
            <ul className="mt-6 space-y-3.5">
              {program.objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                    <Icon name="check" size={13} />
                  </span>
                  <span className="text-sm leading-relaxed text-navy-800">{obj}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="h-display text-2xl sm:text-3xl">What We Do</h2>
            <ul className="mt-6 space-y-3.5">
              {program.activities.map((act) => (
                <li key={act} className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                    <Icon name="arrow-right" size={12} />
                  </span>
                  <span className="text-sm leading-relaxed text-navy-800">{act}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Impact summary band */}
      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="eyebrow !text-gold-300 before:!bg-gold-400">Impact</p>
            <p className="font-display text-2xl italic leading-relaxed !text-white sm:text-3xl">
              &ldquo;{program.impactSummary}&rdquo;
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold-300">
                <Icon name="target" size={15} />
                Current Projects
              </h3>
              <ul className="mt-4 space-y-2.5">
                {program.currentProjects.map((cp) => (
                  <li key={cp} className="flex items-start gap-2.5 text-sm text-navy-100/90">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                    {cp}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      {program.gallery.length > 0 && (
        <section className="section-pad bg-sand">
          <div className="container-x">
            <Reveal>
              <h2 className="h-display text-2xl sm:text-3xl">From the Field</h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {program.gallery.slice(0, 6).map((src, i) => (
                <Reveal key={src} delay={(i % 3) * 80}>
                  <div className={`zoom-img relative overflow-hidden rounded-2xl shadow-card ${i === 0 ? "aspect-[4/3] lg:col-span-2" : "aspect-[4/3]"}`}>
                    <SmartImage
                      src={src}
                      alt={`${program.name} — field photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="section-pad">
          <div className="container-x">
            <Reveal>
              <h2 className="h-display text-2xl sm:text-3xl">Projects in This Program</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <Reveal key={project.id}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get involved CTA */}
      <section className="pb-20">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-royal-800 to-navy-900 p-8 text-center sm:p-10 lg:flex-row lg:text-left">
              <div>
                <h2 className="font-display text-2xl font-semibold !text-white">
                  Want to support {program.name.toLowerCase()}?
                </h2>
                <p className="mt-2 max-w-lg text-sm !text-navy-100/85">
                  Your gift, skills or partnership helps this program reach more communities.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href={`/donate?project=${slug}`} className="btn-primary">
                  <Icon name="heart" size={16} />
                  Give Now
                </Link>
                <Link href="/get-involved#volunteer" className="btn-ghost-light">
                  Volunteer
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
