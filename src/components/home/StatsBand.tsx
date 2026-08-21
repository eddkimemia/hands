import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import type { Stat } from "@/types";

export function StatsBand({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;

  return (
    <section aria-label="Our impact in numbers" className="relative z-10 -mt-16 sm:-mt-20">
      <div className="container-x">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy-100 shadow-lift lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id} className="flex flex-col items-center bg-white px-6 py-8 text-center sm:py-10">
                <dd className="font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-700 sm:text-sm sm:normal-case sm:tracking-normal sm:text-navy-600">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
