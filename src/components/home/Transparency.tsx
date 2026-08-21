import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import type { ReportDoc } from "@/types";

export function Transparency({ reports }: { reports: ReportDoc[] }) {
  return (
    <section id="transparency" className="section-pad relative overflow-hidden bg-navy-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-white/5"
      />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 text-navy-950 shadow-lift">
              <Icon name="shield-check" size={28} />
            </span>
            <p className="eyebrow mt-6 !text-gold-300 before:!bg-gold-400">Transparency &amp; Accountability</p>
            <h2 className="h-display text-3xl !text-white sm:text-4xl">Your Trust Matters</h2>
            <p className="lede mt-4 !text-navy-200/85">
              Every shilling and every promise carries someone&apos;s hope. We hold ourselves to
              open books, honest reporting and strong governance — and we invite you to check our work.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <ul className="mt-7 space-y-3 text-sm text-navy-100/90">
              {[
                "Independent governance and clear oversight",
                "Programs verified with communities and partners",
                "Safeguarding at the centre of everything we do",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-gold-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={220}>
            <Link href="/transparency" className="btn-primary mt-9">
              View Our Reports
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
        </div>

        {/* Report categories */}
        <Reveal delay={120}>
          <ul className="grid gap-3.5 sm:grid-cols-2">
            {reports.slice(0, 6).map((r) => (
              <li key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors hover:border-gold-400/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
                  <Icon name="file-text" size={19} />
                </span>
                <h3 className="mt-3.5 text-sm font-bold text-white">{r.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy-300">{r.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-navy-400">
            Documents are shared on request while our public document library is being prepared.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
