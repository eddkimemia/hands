import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Safeguarding",
  description:
    "Hands of Hope Foundation's safeguarding commitment — protecting children and vulnerable adults in everything we do.",
};

const COMMITMENTS = [
  {
    title: "Do no harm",
    body: "Every activity is planned to protect the safety, dignity and wellbeing of participants before any other objective.",
  },
  {
    title: "Screen & train everyone",
    body: "Staff and volunteers who work with children or vulnerable adults undergo background checks and complete safeguarding orientation.",
  },
  {
    title: "Clear reporting channels",
    body: "Concerns can be raised safely to designated safeguarding focal points, with guaranteed follow-up and protection from retaliation.",
  },
  {
    title: "Consent & dignity in storytelling",
    body: "We photograph and share stories only with informed consent, never identifying children in ways that could expose them to risk.",
  },
];

export default async function SafeguardingPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/safeguarding", label: "Safeguarding" }]}
        eyebrow="Our Promise"
        title="Safeguarding Policy"
        description="Protecting the children, families and vulnerable adults we serve is a condition of our work — not an afterthought."
      />

      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border-l-4 border-gold-400 bg-gold-50 p-7 text-center sm:p-9">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white p-3 text-gold-700 w-fit">
                <Icon name="shield-check" size={26} />
              </span>
              <p className="mt-4 font-display text-xl font-semibold leading-relaxed text-navy-900">
                Every person we serve has the right to safety, dignity and respect.
                <br />
                <span className="text-gold-800">Zero tolerance means zero tolerance.</span>
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 100}>
                <article className="card h-full p-7">
                  <h2 className="font-display text-lg font-semibold text-navy-900">{c.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/75">{c.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mx-auto mt-14 max-w-2xl rounded-3xl bg-navy-950 p-8 text-center sm:p-10">
              <h2 className="font-display text-2xl font-semibold !text-white">
                Raise a Concern
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed !text-navy-200/85">
                If you ever have a safeguarding concern about our work, our people or our partners,
                please tell us immediately. Reports are treated confidentially and taken seriously.
              </p>
              <a
                href={`mailto:${settings.emailGeneral}?subject=Safeguarding%20Concern%20(confidential)`}
                className="btn-primary mt-7"
              >
                <Icon name="mail" size={16} />
                Report a Concern Confidentially
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
