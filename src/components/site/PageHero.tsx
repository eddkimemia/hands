import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { href: string; label: string }[];
}

/** Inner-page banner used across all secondary pages. */
export function PageHero({ eyebrow, title, description, crumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* decorative arcs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border-[56px] border-navy-800/60" />
        <div className="absolute -bottom-52 left-[-120px] h-[420px] w-[420px] rounded-full border-[44px] border-navy-800/40" />
        <div className="absolute right-1/4 top-10 h-24 w-24 rounded-full bg-gold-400/15 blur-2xl" />
      </div>

      <div className="container-x relative py-16 sm:py-20 lg:py-24">
        {crumbs && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-navy-300">
                <li>
                  <Link href="/" className="transition-colors hover:text-gold-300">
                    Home
                  </Link>
                </li>
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-1.5">
                    <Icon name="arrow-right" size={11} className="text-navy-600" />
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-gold-300">
                        {c.label}
                      </span>
                    ) : (
                      <Link href={c.href} className="transition-colors hover:text-gold-300">
                        {c.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}
        <Reveal delay={80}>
          {eyebrow && (
            <p className="eyebrow !text-gold-300 before:!bg-gold-400">{eyebrow}</p>
          )}
          <h1 className="h-display max-w-3xl text-4xl !text-white sm:text-5xl">{title}</h1>
          {description && (
            <p className="lede mt-5 max-w-2xl !text-navy-200/90">{description}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
