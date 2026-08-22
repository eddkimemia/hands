import type { Metadata } from "next";
import Link from "next/link";
import { Counter } from "@/components/Counter";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/Section";
import { ProjectCard } from "@/components/site/cards";
import { SmartImage } from "@/components/SmartImage";
import { getProjects, getReports, getStats, getStories } from "@/lib/content";
import { IMG } from "@/data/seed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Impact",
  description:
    "See the difference Hands of Hope Foundation is making — verified statistics, live project progress, reports and stories of change across Kenya.",
};

export default async function ImpactPage() {
  const [stats, projects, allStories, reports] = await Promise.all([
    getStats(),
    getProjects(),
    getStories(),
    getReports(),
  ]);
  const stories = allStories.slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/impact", label: "Our Impact" }]}
        eyebrow="Accountability"
        title="Impact You Can Verify"
        description="Numbers matter only when you can trust them. Here's what we're doing, where it's happening, and how we report it."
      />

      {/* Stats */}
      <section className="section-pad">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.id} delay={i * 90}>
              <article className="card h-full bg-gradient-to-b from-white to-sand p-8 text-center">
                <dd className="font-display text-5xl font-semibold tracking-tight text-navy-900">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-gold-700">
                  {s.label}
                </dt>
                {s.note && <p className="mt-2 text-xs text-navy-500">{s.note}</p>}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Photo band */}
      <section aria-hidden="true" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage src={IMG.stackedHands} alt="" fill sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-navy-950/60" />
        </div>
        <div className="container-x py-20 text-center sm:py-24">
          <Reveal>
            <p className="font-display text-2xl italic leading-relaxed !text-white sm:text-3xl">
              &ldquo;We don&apos;t count people for applause.
              <br />
              We count because every number is a neighbour.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* Methodology */}
      <section className="section-pad">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Our Method"
              title="How We Count — and Why You Can Trust It"
              description="Numbers without method are just marketing. Here is exactly how impact figures on this site are produced."
              align="left"
              className="!max-w-none"
            />
            <Reveal delay={140}>
              <p className="mt-6 text-sm leading-relaxed text-navy-700">
                Every statistic published here traces back to primary records: attendance sheets
                signed at outreach camps, school retention confirmations from head teachers,
                distribution registers co-signed by local leaders, and committee reports from
                community projects. Program teams consolidate these monthly; our coordination desk
                reviews them before anything is published.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 text-sm leading-relaxed text-navy-700">
                When a figure cannot yet be verified to this standard, we simply don&apos;t publish it.
                That is why some sections of this site grow slowly — and why partners, auditors and
                supporters can rely on the numbers that do appear.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <ul className="space-y-3.5">
              {[
                {
                  title: "Verification before publication",
                  body: "Two-source confirmation — field records plus partner or leader sign-off.",
                },
                {
                  title: "Consent-based storytelling",
                  body: "Stories and photos are shared only with informed, documented consent.",
                },
                {
                  title: "Honest revisions",
                  body: "If a number proves wrong on verification, we correct it publicly.",
                },
                {
                  title: "Independent oversight",
                  body: "Board review of all reported figures each reporting cycle.",
                },
              ].map((item) => (
                <li key={item.title} className="card flex gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                    <Icon name="check-circle" size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-navy-600">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Projects */}
      <section className="section-pad bg-sand">
        <div className="container-x">
          <SectionHeader
            eyebrow="Live Progress"
            title="Where Projects Stand Today"
            description="Progress percentages are updated by our program teams as work is completed and verified."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link href="/projects" className="btn-outline">
              Explore All Projects
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Stories */}
      {stories.length > 0 && (
        <section className="section-pad">
          <div className="container-x">
            <SectionHeader
              eyebrow="Human Evidence"
              title="Stories Behind the Numbers"
              description="Shared with consent, told with dignity."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <Reveal key={story.id}>
                  <article className="card card-hover group flex h-full flex-col overflow-hidden">
                    <Link href={`/stories/${story.slug}`} className="zoom-img relative block h-48 overflow-hidden">
                      <SmartImage
                        src={story.image}
                        alt={story.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-semibold leading-snug text-navy-900">
                        <Link href={`/stories/${story.slug}`} className="link-underline">
                          {story.title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-800/75">{story.excerpt}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reports */}
      <section className="section-pad bg-navy-950">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow !text-gold-300 before:!bg-gold-400">Reports</p>
            <h2 className="h-display text-3xl !text-white">Read the Details for Yourself</h2>
            <p className="lede mt-4 !text-navy-200/85">
              Annual reporting, financial summaries and policies are shared openly with supporters,
              partners and regulators.
            </p>
            <Link href="/transparency" className="btn-primary mt-8">
              View Transparency Centre
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
          <Reveal delay={140}>
            <ul className="space-y-3">
              {reports.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
                    <Icon name="file-text" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{r.title}</p>
                    <p className="truncate text-xs text-navy-300">{r.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
