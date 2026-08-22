import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { getReports, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Ishara Charity's commitment to transparency — annual reports, financial summaries, governance, registration information and policies.",
};

const CATEGORY_ICONS: Record<string, "file-text" | "wallet" | "target" | "shield" | "award" | "globe"> = {
  "Annual Report": "file-text",
  "Financial Report": "wallet",
  "Project Report": "target",
  Policy: "shield",
  Governance: "award",
  Registration: "globe",
};

const PRINCIPLES = [
  {
    icon: "eye" as const,
    title: "Open by default",
    body: "We publish what we do, how we spend and what we learn — in plain language.",
  },
  {
    icon: "shield-check" as const,
    title: "Verified before shared",
    body: "Numbers and stories appear here only after verification with communities and partners.",
  },
  {
    icon: "users" as const,
    title: "Answerable to many",
    body: "We are accountable to the communities we serve, our supporters, partners and regulators.",
  },
];

export default async function TransparencyPage() {
  const [reports, settings] = await Promise.all([getReports(), getSettings()]);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/transparency", label: "Transparency" }]}
        eyebrow="Trust Centre"
        title="Transparency & Accountability"
        description="Trust is earned in the open. Here you'll find our reporting, governance and policies — and an open invitation to ask us anything."
      />

      {/* Principles */}
      <section className="section-pad">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <article className="card h-full p-7 text-center sm:text-left">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-800 sm:mx-0">
                  <Icon name={p.icon} size={22} />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-navy-900">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-800/75">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Accountability practices */}
        <Reveal delay={200}>
          <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-navy-100 bg-white p-8 shadow-card sm:p-10">
            <h2 className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">
              Accountability in Practice
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600">
              Policies only matter when they shape daily decisions. These are the working
              practices behind our commitments:
            </p>
            <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {[
                "Dual sign-off on every expenditure, regardless of size",
                "Beneficiary lists verified jointly with local leaders and institutions",
                "Conflict-of-interest declarations by board and staff",
                "Procurement through documented comparison, not relationships",
                "Safeguarding focal points in every active program area",
                "Whistleblower channel with guaranteed follow-up",
                "Quarterly internal program reviews against written objectives",
                "Data protection aligned to the Kenya Data Protection Act",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-navy-800">
                  <Icon name="check-circle" size={16} className="mt-0.5 shrink-0 text-leaf-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Documents */}
      <section className="section-pad bg-sand pt-0 sm:pt-0">
        <div className="container-x pt-16 sm:pt-20">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Document Library</p>
                <h2 className="h-display text-3xl">Reports & Policies</h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-navy-500">
                Published documents are available for direct download. Documents marked
                &ldquo;on request&rdquo; are shared promptly via email while our public library is prepared.
              </p>
            </div>
          </Reveal>

          <ul className="mt-10 space-y-3.5">
            {reports.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i * 60, 300)}>
                <li className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                    <Icon name={CATEGORY_ICONS[r.category] ?? "file-text"} size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-semibold text-navy-900">{r.title}</span>
                      {r.year && (
                        <span className="chip bg-navy-50 px-2 py-0.5 text-[11px] text-navy-600">{r.year}</span>
                      )}
                      <span className="chip bg-gold-100 px-2 py-0.5 text-[11px] text-gold-800">{r.category}</span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-navy-700">{r.description}</span>
                  </span>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-navy btn-sm shrink-0">
                      Download
                      <Icon name="download" size={14} />
                    </a>
                  ) : (
                    <a
                      href={`mailto:${settings.emailGeneral}?subject=${encodeURIComponent(`Document request: ${r.title}`)}`}
                      className="btn-outline btn-sm shrink-0"
                    >
                      Request a Copy
                      <Icon name="mail" size={14} />
                    </a>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200}>
            <div className="mt-12 rounded-3xl bg-navy-950 p-8 sm:p-10">
              <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h2 className="font-display text-2xl font-semibold !text-white">
                    Our Registration & Governance
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed !text-navy-200/85">
                    {settings.registrationNote} We publish registration details, board composition
                    and governing documents here as they are finalized for public release — we would
                    rather show you nothing than something untrue.
                  </p>
                </div>
                <a href={`mailto:${settings.emailGeneral}?subject=Governance%20Information%20Request`} className="btn-primary w-fit">
                  Ask About Governance
                  <Icon name="arrow-right" size={15} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
