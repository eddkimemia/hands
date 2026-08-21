import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { getSettings } from "@/lib/content";

const SOCIAL_ICONS: Record<string, IconName> = {
  facebook: "facebook",
  instagram: "instagram",
  x: "x",
  twitter: "x",
  linkedin: "linkedin",
  youtube: "youtube",
};

const ORG_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Our Programs" },
  { href: "/impact", label: "Our Impact" },
  { href: "/about#leadership", label: "Our Team" },
  { href: "/stories", label: "Stories" },
];

const INVOLVED_LINKS = [
  { href: "/donate", label: "Donate" },
  { href: "/get-involved#volunteer", label: "Volunteer" },
  { href: "/get-involved#partner", label: "Partner With Us" },
  { href: "/get-involved#fundraise", label: "Fundraise" },
  { href: "/shop", label: "Shop" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/safeguarding", label: "Safeguarding" },
  { href: "/transparency", label: "Transparency" },
];

export async function Footer() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-5 font-display text-lg font-medium text-gold-300">
            {settings.tagline}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-200/80">
            {settings.missionShort}
          </p>
          <ul className="mt-6 flex gap-2.5" aria-label="Social media">
            {settings.socials.map((s) => {
              const icon = SOCIAL_ICONS[s.label.toLowerCase()];
              if (!icon) return null;
              return (
                <li key={s.label}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-navy-100 transition-colors hover:bg-gold-400 hover:text-navy-950"
                    >
                      <Icon name={icon} size={18} />
                    </a>
                  ) : (
                    <span
                      title={`${s.label} — link coming soon`}
                      aria-label={`${s.label} (link coming soon)`}
                      className="flex h-10 w-10 cursor-default items-center justify-center rounded-full bg-white/5 text-navy-300"
                    >
                      <Icon name={icon} size={18} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Organization */}
        <nav aria-label="Organization" className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
            Organization
          </h3>
          <ul className="mt-5 space-y-3">
            {ORG_LINKS.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="text-sm text-navy-200 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Get involved */}
        <nav aria-label="Get involved" className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
            Get Involved
          </h3>
          <ul className="mt-5 space-y-3">
            {INVOLVED_LINKS.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="text-sm text-navy-200 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="lg:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="mail" size={16} className="shrink-0 text-gold-400" />
              <a href={`mailto:${settings.emailGeneral}`} className="transition-colors hover:text-white">
                {settings.emailGeneral}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="handshake" size={16} className="shrink-0 text-gold-400" />
              <a href={`mailto:${settings.emailPartnerships}`} className="transition-colors hover:text-white">
                {settings.emailPartnerships}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="leaf" size={16} className="shrink-0 text-gold-400" />
              <a href={`mailto:${settings.emailPrograms}`} className="transition-colors hover:text-white">
                {settings.emailPrograms}
              </a>
            </li>
            {settings.phone && (
              <li className="flex items-center gap-3">
                <Icon name="phone" size={16} className="shrink-0 text-gold-400" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            <li className="flex items-center gap-3">
              <Icon name="map-pin" size={16} className="shrink-0 text-gold-400" />
              <span>{settings.location}</span>
            </li>
          </ul>
          <Link href="/donate" className="btn-primary btn-sm mt-7">
            <Icon name="heart" size={15} />
            Support Our Work
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-navy-300">
            © {year} {settings.orgName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs">
            {LEGAL_LINKS.map((l, i) => (
              <span key={l.href} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="mx-2 text-navy-600">|</span>}
                <Link href={l.href} className="text-navy-200 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
