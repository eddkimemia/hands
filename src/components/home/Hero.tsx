import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";

export function Hero({
  kicker,
  titleTop,
  titleAccent,
  subtitle,
  image,
  taglineItems,
}: {
  kicker: string;
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  image: string;
  taglineItems: string[];
}) {
  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
      </div>

      <div className="container-x relative pb-28 pt-20 sm:pb-32">
        <Reveal>
          <p className="chip border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200 backdrop-blur">
            <Icon name="sun" size={13} />
            {kicker}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-6 max-w-3xl font-display text-[2.75rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {titleTop}
            <br />
            <span className="italic text-gold-400">{titleAccent}</span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="lede mt-6 max-w-xl !text-base !text-navy-100/90 sm:!text-lg">{subtitle}</p>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link href="/donate" className="btn-primary btn-lg">
              <Icon name="heart" size={18} />
              Support Our Work
            </Link>
            <Link href="/get-involved#volunteer" className="btn-ghost-light btn-lg">
              Become a Volunteer
            </Link>
          </div>
        </Reveal>

        <Reveal delay={480}>
          <ul className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm font-medium text-navy-100/85" aria-label="Our commitment">
            {taglineItems.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="mr-4 hidden h-1 w-1 rounded-full bg-gold-400/70 sm:inline-block" />
                )}
                <Icon name="check" size={15} className="text-gold-400" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
