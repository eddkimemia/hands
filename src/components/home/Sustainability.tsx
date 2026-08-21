import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/site/Section";

const CYCLE = ["Community Support", "Sustainable Enterprise", "Revenue", "Programs", "Community Impact"];

export function Sustainability({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  const paragraphs = body.split("\n").filter(Boolean);

  return (
    <section className="section-pad bg-sand">
      <div className="container-x">
        <SectionHeader
          eyebrow="Our Sustainability Model"
          title={heading}
          description={undefined}
        />
        <div className="mx-auto mt-10 max-w-3xl">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="mt-4 text-center leading-relaxed text-navy-800/80">{p}</p>
            </Reveal>
          ))}
        </div>

        {/* Cycle visualization */}
        <Reveal delay={200}>
          <ol
            aria-label="Our sustainability cycle"
            className="mx-auto mt-12 flex max-w-5xl flex-col items-stretch gap-3 lg:flex-row lg:items-center"
          >
            {CYCLE.map((step, i) => (
              <li key={step} className="flex flex-1 items-center gap-3 last:flex-none">
                <span
                  className={`flex h-full min-h-[64px] w-full flex-col justify-center rounded-2xl border px-4 py-3 text-center ${
                    i === CYCLE.length - 1
                      ? "border-gold-400 bg-gold-400 font-bold text-navy-950 shadow-lift"
                      : i % 2 === 0
                        ? "border-navy-200 bg-white font-semibold text-navy-900 shadow-card"
                        : "border-leaf-200 bg-white font-semibold text-leaf-800 shadow-card"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Step {i + 1}
                  </span>
                  <span className="text-sm leading-tight sm:text-[15px]">{step}</span>
                </span>
                {i < CYCLE.length - 1 && (
                  <>
                    <Icon name="arrow-right" size={18} className="hidden shrink-0 text-gold-600 lg:block" />
                    <Icon name="chevron-down" size={18} className="shrink-0 text-gold-600 lg:hidden" />
                  </>
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-navy-500">
            We share our model openly. Detailed financial information is published in our annual
            reporting — see <a href="/transparency" className="font-semibold text-navy-700 underline underline-offset-2">Transparency</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
