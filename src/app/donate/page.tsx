import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { faqJsonLd } from "@/lib/faq-schema";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { DonateWidget } from "@/components/site/DonateWidget";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/Section";
import { getProjects, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donate — Support Our Work",
  description:
    "Support Hands of Hope Foundation's community programs across Kenya. Give once or monthly, to a project of your choice.",
};

const WHAT_YOUR_GIFT_DOES = [
  { amount: "KES 500", body: "provides learning materials for a child for a school term." },
  { amount: "KES 1,000", body: "stocks a family food basket with staples for two weeks." },
  { amount: "KES 2,500", body: "sponsors a health screening slot at a community outreach camp." },
  { amount: "KES 5,000", body: "seeds a youth micro-enterprise starter toolkit." },
];

export default async function DonatePage() {
  const [projects, settings] = await Promise.all([
    getProjects().then((p) => p.map((x) => ({ slug: x.slug, name: x.name }))),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/donate", label: "Support Our Work" }]}
        eyebrow="Support Our Work"
        title="Your Generosity Becomes Someone's Turning Point"
        description="Every contribution — large or small, once or monthly — moves real programs forward. Choose where your gift goes and we'll report back on what it achieved."
      />

      <section className="section-pad bg-sand">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* Form */}
          <div className="order-2 lg:order-1">
            <DonateWidget projects={projects} />
          </div>

          {/* Side info */}
          <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-24">
            <Reveal>
              <div className="card p-7">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
                  <Icon name="spark" size={18} className="text-gold-600" />
                  What your gift can do
                </h2>
                <ul className="mt-4 space-y-3.5">
                  {WHAT_YOUR_GIFT_DOES.map((item) => (
                    <li key={item.amount} className="flex items-start gap-3 text-sm">
                      <span className="chip shrink-0 bg-gold-100 px-2.5 py-0.5 font-bold text-gold-900">
                        {item.amount}
                      </span>
                      <span className="text-navy-800/85">{item.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card p-7">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
                  <Icon name="shield-check" size={18} className="text-leaf-600" />
                  Giving you can trust
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-navy-800/85">
                  {[
                    "Gifts are receipted only after payment is verified",
                    "Project designations are honoured and reported on",
                    "Monthly giving can be paused anytime by email",
                    "Financial summaries are published in our reports",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Icon name="check" size={14} className="mt-1 shrink-0 text-leaf-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-2xl border border-dashed border-navy-300 bg-white p-6 text-sm leading-relaxed text-navy-700">
                <strong className="font-bold text-navy-900">Prefer bank transfer, M-Pesa or cheque?</strong>
                <br />
                Email{" "}
                <a href={`mailto:${settings.emailGeneral}`} className="font-semibold underline underline-offset-2">
                  {settings.emailGeneral}
                </a>{" "}
                and our team will share secure payment details and an official acknowledgement.
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
      {/* Stewardship + FAQ */}
      <section className="section-pad">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Responsible Stewardship"
              title="Where Every Shilling Goes"
              description="Trust is earned in the open — here is exactly how your generosity is handled."
              align="left"
              className="!max-w-none"
            />
            <Reveal delay={120}>
              <ul className="mt-7 space-y-4">
                {[
                  {
                    title: "Straight to programs",
                    body: "Gifts designated to a project are ring-fenced for it. Undesignated gifts flow where the verified need is greatest that month.",
                  },
                  {
                    title: "Verified before spent",
                    body: "Beneficiary lists are confirmed jointly with schools, health facilities and local leaders before any funds move.",
                  },
                  {
                    title: "Recorded & reported",
                    body: "Every gift gets a reference and appears in our financial reporting cycle, shared openly on the Transparency page.",
                  },
                  {
                    title: "Independence protected",
                    body: "Our sustainability initiatives — training, merchandise, partnerships — fund operations so donations stay focused on communities.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3.5 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                      <Icon name="shield-check" size={17} />
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

          <div>
            <SectionHeader
              eyebrow="Giving FAQ"
              title="Questions Donors Ask"
              align="left"
              className="!max-w-none"
            />
            <Reveal delay={140}>
              <Faq items={DONATE_FAQ} className="mt-7" />
            </Reveal>
          </div>
        </div>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(DONATE_FAQ)) }}
        />
      </section>
    </>
  );
}

const DONATE_FAQ: FaqItem[] = [
  {
    question: "Is my payment secure?",
    answer:
      "Yes. When online giving is active you are redirected to a PCI-DSS compliant checkout (Paystack) and we never see or store your card details. A donation is only marked received after our server verifies the payment directly with the provider.",
  },
  {
    question: "Can I give monthly?",
    answer:
      "Absolutely — choose 'Give Monthly'. Recurring support lets programs plan ahead with confidence. You can pause or change it anytime by emailing us; no questions asked.",
  },
  {
    question: "Can I direct my gift to a specific project?",
    answer:
      "Yes, use the designation selector in the form. We honour designations wherever practical; if a project becomes unviable we apply your gift to the closest comparable purpose and tell you.",
  },
  {
    question: "Will I get a receipt?",
    answer:
      "Every confirmed gift receives an acknowledgement with its reference number. Confirmed contributions are also reflected in our published financial summaries.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "We provide official receipts for all confirmed donations. Because tax treatment depends on your jurisdiction and personal situation, please consult your tax advisor on deductibility.",
  },
  {
    question: "Can I give via M-Pesa or bank transfer?",
    answer:
      "Yes — email info@handsofhope.org and we will share secure payment details plus an official acknowledgement. Our online checkout architecture also supports M-Pesa as payments are connected.",
  },
];
