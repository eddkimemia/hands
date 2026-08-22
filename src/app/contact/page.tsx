import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Ishara Charity — general enquiries, partnerships, programs and volunteering contacts in Nairobi, Kenya.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const channels: {
    icon: IconName;
    label: string;
    value: string;
    href?: string;
    note?: string;
  }[] = [
    {
      icon: "mail",
      label: "General enquiries",
      value: settings.emailGeneral,
      href: `mailto:${settings.emailGeneral}`,
    },
    {
      icon: "handshake",
      label: "Partnerships",
      value: settings.emailPartnerships,
      href: `mailto:${settings.emailPartnerships}`,
      note: "Companies, foundations & institutions",
    },
    {
      icon: "leaf",
      label: "Programs",
      value: settings.emailPrograms,
      href: `mailto:${settings.emailPrograms}`,
      note: "Schools, health facilities & community groups",
    },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ href: "/contact", label: "Contact" }]}
        eyebrow="Say Hello"
        title="We'd Love to Hear From You"
        description="Questions about our work? Ideas for partnership? Ready to volunteer? Reach out — real people read every message."
      />

      <section className="section-pad bg-sand">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          {/* Info column */}
          <div className="space-y-6">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a
                  href={c.href}
                  className="card card-hover flex items-start gap-4 p-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                    <Icon name={c.icon} size={21} />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-widest text-navy-500">
                      {c.label}
                    </span>
                    <span className="mt-1 block font-semibold text-navy-900">{c.value}</span>
                    {c.note && <span className="mt-0.5 block text-xs text-navy-500">{c.note}</span>}
                  </span>
                </a>
              </Reveal>
            ))}

            {settings.phone && (
              <Reveal delay={270}>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="card card-hover flex items-center gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                    <Icon name="phone" size={20} />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-widest text-navy-500">Phone</span>
                    <span className="mt-1 block font-semibold text-navy-900">{settings.phone}</span>
                  </span>
                </a>
              </Reveal>
            )}

            <Reveal delay={330}>
              <div className="card p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-navy-500">
                  <Icon name="map-pin" size={15} className="text-gold-600" />
                  Where we are
                </h2>
                <p className="mt-2 font-semibold text-navy-900">{settings.location}</p>
                <p className="mt-1 text-xs leading-relaxed text-navy-500">
                  We work across multiple counties — visits to our office are by appointment so we
                  can host you well.
                </p>
                <ul aria-label="Social media" className="mt-4 flex gap-2">
                  {settings.socials.map((s) => {
                    const icons: Record<string, IconName> = {
                      facebook: "facebook",
                      instagram: "instagram",
                      x: "x",
                      linkedin: "linkedin",
                      youtube: "youtube",
                    };
                    const icon = icons[s.label.toLowerCase()];
                    if (!icon) return null;
                    return (
                      <li key={s.label}>
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-100 text-navy-700 transition-colors hover:bg-navy-900 hover:text-white"
                          >
                            <Icon name={icon} size={16} />
                          </a>
                        ) : (
                          <span
                            title={`${s.label} coming soon`}
                            className="flex h-9 w-9 cursor-default items-center justify-center rounded-full border border-navy-100 text-navy-300"
                          >
                            <Icon name={icon} size={16} />
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={390}>
              <div className="overflow-hidden rounded-2xl border border-navy-100 shadow-card">
                <iframe
                  title="Map showing Ishara Charity location in Westlands, Nairobi"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=36.7860%2C-1.2830%2C36.8180%2C-1.2440&layer=mapnik&marker=-1.2627%2C36.8018"
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={140}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
