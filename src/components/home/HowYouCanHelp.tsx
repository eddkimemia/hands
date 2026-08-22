import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/site/Section";

const WAYS: {
  icon: IconName;
  title: string;
  body: string;
  cta: string;
  href: string;
  accent: string;
}[] = [
  {
    icon: "gift",
    title: "Give",
    body: "Support a specific project or community initiative — one-time or monthly.",
    cta: "Give Now",
    href: "/donate",
    accent: "bg-gold-100 text-gold-800",
  },
  {
    icon: "users",
    title: "Volunteer",
    body: "Give your time, skills and expertise where they matter most.",
    cta: "Volunteer",
    href: "/get-involved#volunteer",
    accent: "bg-leaf-100 text-leaf-800",
  },
  {
    icon: "handshake",
    title: "Partner",
    body: "Businesses and organizations can collaborate with Hands of Hope on shared goals.",
    cta: "Partner With Us",
    href: "/get-involved#partner",
    accent: "bg-royal-50 text-royal-700",
  },
  {
    icon: "shopping-cart",
    title: "Shop",
    body: "Purchase branded merchandise and support the organization's sustainability.",
    cta: "Visit Our Shop",
    href: "/shop",
    accent: "bg-navy-100 text-navy-700",
  },
];

export function HowYouCanHelp() {
  return (
    <section id="how-you-can-help" className="section-pad">
      <div className="container-x">
        <SectionHeader
          eyebrow="How You Can Help"
          title="There Is More Than One Way to Show Up"
          description="Donations matter — but so do skills, partnerships and everyday choices. Choose the way that fits you."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((way, i) => (
            <Reveal key={way.title} delay={i * 90}>
              <article className="card card-hover group flex h-full flex-col p-7">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${way.accent}`}>
                  <Icon name={way.icon} size={26} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">{way.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-800/75">{way.body}</p>
                <Link
                  href={way.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 transition-colors hover:text-gold-700"
                >
                  {way.cta}
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
