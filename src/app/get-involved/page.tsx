import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { faqJsonLd } from "@/lib/faq-schema";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/Section";
import { VolunteerForm } from "@/components/site/VolunteerForm";
import { getEvents, getSettings } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Volunteer, donate, partner, fundraise or join our team — find your place at Ishara Charity and use your skills for communities across Kenya.",
};

const GET_INVOLVED_FAQ: FaqItem[] = [
  {
    question: "Do I need special qualifications to volunteer?",
    answer:
      "Only for clinical roles, where professional licensing is required. For everything else — tutoring, events, logistics, creative work, mentoring — reliability and respect matter more than résumés.",
  },
  {
    question: "How much time must I commit?",
    answer:
      "It varies by role: outreach days can be one-off, mentorship suits a few hours monthly, and project roles may need weekly involvement. You choose what fits; we'll match expectations honestly.",
  },
  {
    question: "Can volunteers from outside Kenya help?",
    answer:
      "Yes — remote support in design, communications, grant research and mentorship is genuinely valuable. On-site international volunteering is arranged case by case with proper lead time.",
  },
  {
    question: "Is there an age requirement?",
    answer:
      "Volunteers are typically 18+. Younger helpers are welcome through school-organised drives accompanied by their institutions.",
  },
  {
    question: "Why do roles involving children require background checks?",
    answer:
      "Because safeguarding is non-negotiable. Checks plus mandatory training protect the children we serve — and protect you as a volunteer working under clear, professional standards.",
  },
  {
    question: "Can my company send a team?",
    answer:
      "Absolutely — employee volunteering days are among our favourite partnerships. Email partnerships@isharacharity.org and we will design a day that is useful to communities and meaningful for your team.",
  },
];

const FUNDRAISE_IDEAS = [
  {
    title: "Birthday & Celebration Giving",
    body: "Ask friends to give toward a community project instead of gifts. We'll share exactly where the support goes.",
  },
  {
    title: "Community Drives",
    body: "Organize a book, uniform or food drive with your school, church, estate or workplace — we'll help you plan it.",
  },
  {
    title: "Challenge Events",
    body: "Run, cycle, hike or game for hope! Set up a challenge and rally sponsors for a cause you choose.",
  },
];

export default async function GetInvolvedPage() {
  const [settings, events] = await Promise.all([getSettings(), getEvents({ upcomingOnly: true })]);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/get-involved", label: "Get Involved" }]}
        eyebrow="Join the Movement"
        title="There's a Place for You Here"
        description="Hope is a team effort. Whether you give money, time, skills, voice or partnership — you belong in this story."
      />

      {/* Quick ways */}
      <section className="section-pad">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "gift" as const, title: "Donate", href: "/donate", body: "Fuel programs with one-time or monthly giving." },
            { icon: "users" as const, title: "Volunteer", href: "#volunteer", body: "Offer time and skills on the ground or online." },
            { icon: "handshake" as const, title: "Partner", href: "#partner", body: "Collaborate as a business or organization." },
            { icon: "megaphone" as const, title: "Advocate", href: "#fundraise", body: "Fundraise and spread the word in your circles." },
          ].map((w, i) => (
            <Reveal key={w.title} delay={i * 80}>
              <Link href={w.href} className="card card-hover group flex h-full flex-col items-start p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                  <Icon name={w.icon} size={22} />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-navy-900">{w.title}</h2>
                <p className="mt-1.5 flex-1 text-sm text-navy-800/75">{w.body}</p>
                <Icon name="arrow-right" size={16} className="mt-4 text-gold-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Volunteer journey */}
      <section className="pb-4">
        <div className="container-x">
          <SectionHeader
            eyebrow="What to Expect"
            title="Your Volunteer Journey"
            description="From first hello to first project day — a clear, respectful process designed to set you up for meaningful service."
          />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Apply", body: "Share your skills, availability and motivation through the short form below." },
              { title: "Chat & Screen", body: "A friendly conversation helps us find your best fit; roles involving children include background checks." },
              { title: "Orientation", body: "Safeguarding training and community context prepare you to serve with confidence and respect." },
              { title: "Serve & Grow", body: "Join projects matching your skills — with team support, clear tasks and honest feedback." },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="card relative h-full p-6 pt-8">
                  <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 font-display text-sm font-bold text-navy-950 shadow-card">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-navy-700">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="section-pad bg-sand scroll-mt-20">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <SectionHeader
              eyebrow="Volunteer"
              title="Your Skills Can Change a Life"
              description="Teachers, nurses, accountants, designers, drivers, students, retirees — every skill has a place. Volunteers receive orientation, safeguarding training and ongoing support."
              align="left"
              className="!max-w-none"
            />
            <Reveal delay={140}>
              <ul className="mt-7 space-y-3.5">
                {[
                  "Community outreach & event days",
                  "Mentorship and tutoring",
                  "Medical missions (licensed professionals)",
                  "Logistics, photography, communications",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-navy-800">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                      <Icon name="check" size={13} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {events.length > 0 && (
              <Reveal delay={200}>
                <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-700">
                    <Icon name="calendar" size={16} className="text-gold-600" />
                    Upcoming Volunteer Events
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {events.slice(0, 3).map((ev) => (
                      <li key={ev.id} className="flex items-start justify-between gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-navy-900">{ev.title}</p>
                          <p className="text-xs text-navy-500">{ev.location}</p>
                        </div>
                        <time className="shrink-0 rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700">
                          {formatDate(ev.date)}
                        </time>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
          <Reveal delay={120}>
            <VolunteerForm />
          </Reveal>
        </div>
      </section>

      {/* Partner */}
      <section id="partner" className="section-pad scroll-mt-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeader
              eyebrow="For Organizations"
              title="Partner With Purpose"
              description="We design corporate and institutional partnerships around shared goals, measurable outcomes and transparent reporting — never logo-slapping."
              align="left"
              className="!max-w-none"
            />
            <Reveal delay={130}>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Sponsor a program or project",
                  "Employee volunteering days",
                  "In-kind product & service support",
                  "Cause marketing campaigns",
                  "Technical expertise & mentoring",
                  "Matched giving programs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-card">
                    <Icon name="check-circle" size={16} className="shrink-0 text-leaf-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={200}>
              <a
                href={`mailto:${settings.emailPartnerships}?subject=Partnership%20Enquiry`}
                className="btn-navy btn-lg mt-8"
              >
                Start a Partnership Conversation
                <Icon name="arrow-right" size={16} />
              </a>
            </Reveal>
          </Reveal>

          <Reveal delay={160}>
            <div id="fundraise" className="scroll-mt-24 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-300 p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 text-gold-800">
                <Icon name="megaphone" size={24} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
                Fundraise With Us
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/80">
                Turn your birthday, wedding, run or campus week into hope. Tell us your idea and
                we&apos;ll provide materials, guidance and reporting.
              </p>
              <ul className="mt-6 space-y-4">
                {FUNDRAISE_IDEAS.map((idea) => (
                  <li key={idea.title} className="rounded-2xl bg-white/85 p-4 backdrop-blur">
                    <p className="text-sm font-bold text-navy-900">{idea.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-navy-700">{idea.body}</p>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${settings.emailGeneral}?subject=Fundraising%20Idea`} className="btn-navy btn-sm mt-6">
                Share Your Fundraising Idea
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <SectionHeader
            eyebrow="Common Questions"
            title="Before You Get Involved"
          />
          <Reveal delay={120}>
            <Faq items={GET_INVOLVED_FAQ} className="mt-10" />
          </Reveal>
        </div>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GET_INVOLVED_FAQ)) }}
        />
      </section>

      {/* Careers */}
      <section id="careers" className="section-pad bg-sand scroll-mt-20">
        <div className="container-x">
          <SectionHeader
            eyebrow="Careers"
            title="Work Where Your Work Matters"
            description="Open roles are listed here as they become available. Even when nothing is open, we keep strong CVs on file — send yours anytime."
          />
          <Reveal delay={150}>
            <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-dashed border-navy-300 bg-white p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-500">
                <Icon name="briefcase" size={26} />
              </span>
              <p className="mt-5 font-display text-xl font-semibold text-navy-900">
                No open roles right now
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy-600">
                New positions will be posted here and on our LinkedIn page. Speculative applications
                are always welcome.
              </p>
              <a href={`mailto:${settings.emailGeneral}?subject=Career%20Enquiry`} className="btn-outline btn-sm mt-6">
                Send a General Enquiry
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
