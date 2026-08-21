import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { getSettings } from "@/lib/content";

const AREAS = [
  "Community projects",
  "Youth programs",
  "Health initiatives",
  "Education",
  "Food security",
  "Employee volunteering",
  "CSR initiatives",
];

export async function Partnerships({ image }: { image?: string }) {
  const settings = await getSettings();

  return (
    <section id="partner" className="section-pad">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="eyebrow">Corporate Partnerships</p>
            <h2 className="h-display text-3xl sm:text-4xl lg:text-[2.6rem]">
              Partner With Us to Create Meaningful Impact
            </h2>
            <p className="lede mt-4">
              We work with Kenyan businesses and international organizations to design
              partnerships that are strategic, transparent and genuinely useful to communities.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3" aria-label="Partnership focus areas">
              {AREAS.map((area) => (
                <li key={area} className="flex items-center gap-2 text-sm font-medium text-navy-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                    <Icon name="check" size={12} />
                  </span>
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <a href={`mailto:${settings.emailPartnerships}?subject=Partnership%20Enquiry`} className="btn-navy btn-lg">
                Become a Partner
                <Icon name="arrow-right" size={16} />
              </a>
              <a
                href={`mailto:${settings.emailPartnerships}?subject=Request%3A%20Partnership%20Information`}
                className="btn-outline btn-lg"
              >
                Download Partnership Information
                <Icon name="download" size={16} />
              </a>
            </div>
            <p className="mt-4 text-xs text-navy-500">
              Our partnership prospectus is shared directly by our team — request a copy and we&apos;ll send it promptly.
            </p>
          </Reveal>
        </div>

        <Reveal className="order-1 lg:order-2" delay={100}>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -right-5 -top-5 h-full w-full rounded-3xl bg-gold-200/70"
            />
            <div className="zoom-img relative aspect-[5/4] overflow-hidden rounded-3xl shadow-lift">
              <SmartImage
                src={image || "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop"}
                alt="Two partners shaking hands"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figure className="absolute -bottom-6 left-5 flex max-w-[260px] items-center gap-3 rounded-2xl bg-white p-4 shadow-lift sm:left-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                <Icon name="handshake" size={22} />
              </span>
              <figcaption className="text-xs font-semibold leading-snug text-navy-900">
                Partnerships built on shared values and measurable outcomes.
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
