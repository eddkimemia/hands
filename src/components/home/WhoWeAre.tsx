import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/site/Section";
import { SmartImage } from "@/components/SmartImage";

const FLOW = ["Compassion", "Empowerment", "Opportunity", "Impact"];

export function WhoWeAre({
  heading,
  body,
  image,
}: {
  heading: string;
  body: string;
  image: string;
}) {
  const paragraphs = body.split("\n").filter(Boolean);

  return (
    <section className="section-pad overflow-hidden">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image side */}
        <Reveal className="relative order-2 lg:order-1">
          <div
            aria-hidden="true"
            className="absolute -left-5 -top-5 h-full w-full rounded-3xl border-2 border-gold-300"
          />
          <div className="zoom-img relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
            <SmartImage
              src={image}
              alt="A Ishara Charity volunteer working with a child in the community"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <figure className="absolute -bottom-7 right-4 flex items-center gap-3 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-lift sm:right-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 text-navy-950">
              <Icon name="handshake" size={22} />
            </span>
            <figcaption className="text-sm font-semibold leading-tight">
              Walking together,
              <br />
              <span className="text-gold-300">since day one</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Text side */}
        <div className="order-1 lg:order-2">
          <SectionHeader
            eyebrow="Who We Are"
            title={heading}
            align="left"
            className="!max-w-none"
          />
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={100 + i * 80}>
              <p className="mt-4 leading-relaxed text-navy-800/80">{p}</p>
            </Reveal>
          ))}

          {/* Flow diagram */}
          <Reveal delay={260}>
            <ol className="mt-8 flex flex-wrap items-center gap-y-2" aria-label="Our approach">
              {FLOW.map((step, i) => (
                <li key={step} className="flex items-center">
                  {i > 0 && (
                    <Icon name="arrow-right" size={16} className="mx-2.5 text-gold-500" aria-hidden="true" />
                  )}
                  <span className="chip border border-navy-200 bg-white px-3.5 py-1.5 text-xs font-bold text-navy-800">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={340}>
            <Link href="/about" className="btn-navy mt-9">
              Learn About Us
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
