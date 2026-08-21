import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ProgramCard } from "@/components/site/cards";
import { SectionHeader } from "@/components/site/Section";
import type { Program } from "@/types";

export function ProgramsGrid({ programs }: { programs: Program[] }) {
  return (
    <section id="programs" className="section-pad bg-sand">
      <div className="container-x">
        <SectionHeader
          eyebrow="What We Do"
          title="Programs Built Around Real Needs"
          description="Six focused program areas, designed with communities — not just for them."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Reveal key={program.id} delay={(i % 3) * 90}>
              <ProgramCard program={program} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/programs" className="btn-outline">
            Explore All Programs
            <Icon name="arrow-right" size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
