import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/cards";
import { SectionHeader } from "@/components/site/Section";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Follow Hands of Hope Foundation projects across Kenya — with live progress, people reached and ways to support each initiative.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const active = projects.filter((p) => p.status === "active");
  const others = projects.filter((p) => p.status !== "active");

  return (
    <>
      <PageHero
        crumbs={[{ href: "/projects", label: "Projects" }]}
        eyebrow="Where Hope Is Working"
        title="Current & Completed Projects"
        description="Every project reports its location, reach and honest progress — so you always know what your support is doing."
      />

      <section className="section-pad bg-sand">
        <div className="container-x">
          {active.length > 0 && (
            <>
              <SectionHeader eyebrow="Happening Now" title="Active Projects" align="left" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((project, i) => (
                  <Reveal key={project.id} delay={i * 90}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {others.length > 0 && (
            <div className={active.length ? "mt-16" : ""}>
              <SectionHeader eyebrow="Track Record" title="Planning & Completed" align="left" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((project) => (
                  <Reveal key={project.id}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-12 text-center">
                <p className="font-display text-xl font-semibold text-navy-900">
                  Project pages are being prepared.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
                  We publish projects only once details are verified. Check back soon.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={150}>
            <div className="mt-16 text-center">
              <Link href="/impact" className="btn-outline">
                See Our Collective Impact
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
