import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { DonateWidget } from "@/components/site/DonateWidget";
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
      <section className="relative overflow-hidden bg-navy-950">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border-[56px] border-navy-800/60" />
          <div className="absolute right-1/4 top-10 h-24 w-24 rounded-full bg-gold-400/15 blur-2xl" />
        </div>
        <div className="container-x relative py-16 sm:py-20 lg:py-24">
          <p className="eyebrow !text-gold-300 before:!bg-gold-400">Support Our Work</p>
          <h1 className="h-display max-w-3xl text-4xl !text-white sm:text-5xl">
            Your Generosity Becomes Someone&apos;s Turning Point
          </h1>
          <p className="lede mt-5 max-w-2xl !text-navy-200/90">
            Every contribution — large or small, once or monthly — moves real programs forward.
            Choose where your gift goes and we&apos;ll report back on what it achieved.
          </p>
        </div>
      </section>

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
    </>
  );
}
