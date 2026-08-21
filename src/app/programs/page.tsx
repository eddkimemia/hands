import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ProgramCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/PageHero";
import { getPrograms } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Programs",
  description:
    "Explore Hands of Hope Foundation's programs: health & wellbeing, education, food security, youth empowerment, community development and emergency support across Kenya.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/programs", label: "Our Programs" }]}
        eyebrow="What We Do"
        title="Programs Designed With Communities"
        description="Each program area combines immediate support with long-term capacity building — so today's help becomes tomorrow's independence."
      />

      <section className="section-pad bg-sand">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Reveal key={program.id} delay={(i % 3) * 90}>
              <ProgramCard program={program} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-16 rounded-3xl bg-navy-950 p-8 text-center sm:p-12">
            <h2 className="h-display text-2xl !text-white sm:text-3xl">
              Have an idea for a community initiative?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-navy-200/85">
              We co-design programs with communities, schools, health facilities and partners.
              If you see a need we should be addressing, we would love to hear from you.
            </p>
            <Link href="/contact" className="btn-primary mt-7">
              Start a Conversation
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
