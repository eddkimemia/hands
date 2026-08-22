import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { faqJsonLd } from "@/lib/faq-schema";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/Section";
import { SmartImage } from "@/components/SmartImage";
import { getSettings, getTeam } from "@/lib/content";
import { IMG } from "@/data/seed";

export const dynamic = "force-dynamic";

const ABOUT_FAQ: FaqItem[] = [
  {
    question: "Is Ishara Charity only for certain tribes, religions or political groups?",
    answer:
      "No. We serve Kenyans based on need alone. Our programs are open to every community regardless of ethnicity, faith, gender or background, and we keep our operations strictly non-political.",
  },
  {
    question: "How is the foundation funded?",
    answer:
      "Through a deliberate mix of individual donations, corporate partnerships and our own sustainability initiatives — including merchandise sales and training programs. This blend protects our independence and reduces reliance on any single funder.",
  },
  {
    question: "Who oversees the foundation's leadership?",
    answer:
      "A non-executive board provides independent oversight of strategy, risk and finances, supported by documented governance, finance and safeguarding policies. Governance information is published on our Transparency page.",
  },
  {
    question: "How do you protect the children and families you work with?",
    answer:
      "Safeguarding is central to everything we do: screened staff and volunteers, mandatory safeguarding training, strict media-consent rules and confidential reporting channels. Our full Safeguarding Policy is published on this site.",
  },
  {
    question: "Can I visit a project before deciding to support it?",
    answer:
      "Yes — serious supporters are welcome to see the work firsthand. Visits are arranged by appointment so communities host guests well rather than being interrupted by drop-ins.",
  },
];

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ishara Charity — our story, mission, vision, values, leadership and governance as a Kenyan community foundation.",
};

const VALUES = [
  {
    icon: "heart" as const,
    title: "Compassion Without Pity",
    body: "We lead with care and respect — never with pity. The people we serve are partners, not subjects.",
  },
  {
    icon: "shield-check" as const,
    title: "Integrity & Transparency",
    body: "Honest reporting, open books and accountable governance guide every decision.",
  },
  {
    icon: "users" as const,
    title: "Community-Led",
    body: "Communities identify their needs and lead their solutions. We listen first, then walk alongside.",
  },
  {
    icon: "leaf" as const,
    title: "Sustainability First",
    body: "We build capacity that outlasts any single project, donor or season.",
  },
  {
    icon: "award" as const,
    title: "Dignity in Every Detail",
    body: "From how we photograph to how we distribute support — dignity is non-negotiable.",
  },
  {
    icon: "sun" as const,
    title: "Hope & Optimism",
    body: "We tell true stories of progress because hope, grounded in evidence, fuels change.",
  },
];

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSettings(), getTeam()]);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/about", label: "About Us" }]}
        eyebrow="Who We Are"
        title="Extending Hands. Inspiring Hope."
        description={settings.missionShort}
      />

      {/* Our story */}
      <section className="section-pad">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div
              aria-hidden="true"
              className="absolute -left-5 -top-5 h-full w-full rounded-3xl border-2 border-gold-300"
            />
            <div className="zoom-img relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
              <SmartImage
                src={IMG.studentsTable}
                alt="Community members working together at a table"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeader eyebrow="Our Story" title="Born From a Simple Belief" align="left" className="!max-w-none" />
            <Reveal delay={100}>
              <p className="mt-4 leading-relaxed text-navy-800/80">
                Ishara Charity began with a simple belief: that ordinary people, organized
                and supported, can transform their own communities. What started as neighbors helping
                neighbors has grown into a foundation working across education, health, food security,
                youth empowerment and community development.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-4 leading-relaxed text-navy-800/80">
                We remain rooted in the places we serve. Our approach is patient and practical —
                listen deeply, co-design programs with communities, deliver with excellence, and build
                local capacity so progress continues long after a project formally ends.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-4 leading-relaxed text-navy-800/80">
                This website will grow richer as our teams publish verified stories, reports and
                results. What you see here reflects our commitment to honesty over hype.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-pad bg-sand">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <article className="card h-full p-8 sm:p-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 p-3 text-gold-300">
                <Icon name="target" size={26} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">Our Mission</h2>
              <p className="mt-3 leading-relaxed text-navy-800/80">
                To extend practical support and create sustainable opportunities that empower
                communities across Kenya to become agents of their own positive change.
              </p>
            </article>
          </Reveal>
          <Reveal delay={120}>
            <article className="card h-full border-gold-200 bg-gold-50/60 p-8 sm:p-10">
              <span className="flex w-fit items-center justify-center rounded-2xl bg-gold-400 p-3 text-navy-950">
                <Icon name="eye" size={26} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">Our Vision</h2>
              <p className="mt-3 leading-relaxed text-navy-800/85">
                A Kenya where every community has the skills, resources and confidence to shape its
                own future — and where hope is extended hand to hand, generation to generation.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      {/* How we work */}
      <section className="section-pad bg-sand">
        <div className="container-x">
          <SectionHeader
            eyebrow="Our Method"
            title="How We Work"
            description="Five deliberate stages turn good intentions into change that lasts — and every stage belongs to the community as much as to us."
          />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: "heart-pulse" as const,
                title: "Listen",
                body: "Every engagement begins with patient community conversations — mapping needs, assets and dreams in residents' own words.",
              },
              {
                icon: "handshake" as const,
                title: "Co-Design",
                body: "Programs are planned jointly with residents, local leaders and technical partners, so ownership exists from day one.",
              },
              {
                icon: "target" as const,
                title: "Deliver",
                body: "We execute with professional discipline: verified beneficiaries, transparent procurement, documented processes.",
              },
              {
                icon: "trending-up" as const,
                title: "Measure",
                body: "Progress is tracked against objectives set at design time — attendance records, verification visits, honest reporting.",
              },
              {
                icon: "leaf" as const,
                title: "Hand Over",
                body: "Committees are trained, maintenance plans agreed, and follow-up visits scheduled. Success = independence.",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="card flex h-full flex-col p-6">
                  <span className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                      <Icon name={step.icon} size={20} />
                    </span>
                    <span className="font-display text-3xl font-semibold text-gold-200">{i + 1}</span>
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-navy-700">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHeader
            eyebrow="What Guides Us"
            title="Values We Live By"
            description="These aren't posters on a wall — they are tests we apply to every program, partnership and shilling."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 90}>
                <article className="card card-hover h-full p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                    <Icon name={v.icon} size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/75">{v.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section-pad bg-sand scroll-mt-20">
        <div className="container-x">
          <SectionHeader
            eyebrow="Leadership & Governance"
            title="The People Behind the Promise"
            description="Accountable leadership is the backbone of every trustworthy organization."
          />
          {team.length ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <Reveal key={member.id}>
                  <article className="card card-hover overflow-hidden text-center">
                    <div className="relative aspect-square bg-sand">
                      {member.photo && (
                        <SmartImage
                          src={member.photo}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-navy-900">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-gold-700">{member.role}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={150}>
              <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-dashed border-navy-300 bg-white p-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-500">
                  <Icon name="users" size={26} />
                </span>
                <p className="mt-5 font-display text-xl font-semibold text-navy-900">
                  Leadership profiles are being published
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy-600">
                  We only publish real, verified profiles — never placeholders dressed up as people.
                  Our board and team bios will appear here shortly.
                </p>
                <a href="/contact" className="btn-outline btn-sm mt-6">
                  Request Governance Information
                </a>
              </div>
            </Reveal>
          )}

          {/* Governance summary */}
          <Reveal delay={200}>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: "shield" as const,
                  title: "Board Oversight",
                  body: "A non-executive board provides independent oversight of strategy, risk and finances.",
                },
                {
                  icon: "file-text" as const,
                  title: "Documented Policies",
                  body: "Safeguarding, privacy, finance and procurement policies govern daily operations.",
                },
                {
                  icon: "trending-up" as const,
                  title: "Reported Results",
                  body: "Programs report against objectives, and findings are shared with partners and supporters.",
                },
              ].map((g) => (
                <div key={g.title} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                    <Icon name={g.icon} size={21} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{g.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-navy-600">{g.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-navy-500">{settings.registrationNote}</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <SectionHeader
            eyebrow="Common Questions"
            title="About Ishara Charity"
            description="Straight answers about who we are and how we operate."
          />
          <Reveal delay={120}>
            <Faq items={ABOUT_FAQ} className="mt-10" />
          </Reveal>
        </div>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ABOUT_FAQ)) }}
        />
      </section>

      {/* Where we work */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHeader
            eyebrow="Where We Work"
            title="Rooted in Kenya, Reaching Outward"
            description="Our current programs and partnerships reach communities across several counties."
          />
          <Reveal delay={140}>
            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
              {["Nairobi", "Kisumu", "Nakuru", "Kakamega", "Kitui", "Machakos"].map((county) => (
                <li key={county} className="chip border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-card">
                  <Icon name="map-pin" size={14} className="text-gold-600" />
                  {county}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={220}>
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-navy-100 shadow-card">
              <iframe
                title="Map of Kenya showing our working area around Nairobi"
                src="https://www.openstreetmap.org/export/embed.html?bbox=35.0%2C-1.5%2C39.5%2C0.9&layer=mapnik&marker=-0.3031%2C37.5880"
                className="h-[380px] w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
