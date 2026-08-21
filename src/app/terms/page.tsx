import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Hands of Hope Foundation website.",
};

const TERMS = [
  {
    title: "1. Using this site",
    body: "This website is provided by Hands of Hope Foundation for information about our mission, programs and ways to get involved. You agree to use it lawfully and respectfully, and not to misuse forms, attempt unauthorized access, or copy content for commercial purposes without written permission.",
  },
  {
    title: "2. Content & accuracy",
    body: "We work hard to keep information accurate and current, but content is provided 'as is' without warranty. Statistics reflect verified figures at their time of publication and are updated periodically. Stories marked as illustrative are demonstration content, clearly labelled as such.",
  },
  {
    title: "3. Donations & purchases",
    body: "Donations are voluntary contributions to our mission. Where a project designation is chosen, we honour it wherever practical; if a designated project becomes unviable, funds are applied to the closest comparable purpose. Merchandise orders are confirmed personally before payment or delivery. A gift is receipted only after payment verification.",
  },
  {
    title: "4. Intellectual property",
    body: "The Hands of Hope name, logo, photographs and written content belong to the Foundation or are used with permission. You're welcome to share our public pages and materials non-commercially with attribution.",
  },
  {
    title: "5. External links",
    body: "Links to third-party sites are provided for convenience. We don't control and aren't responsible for their content or policies.",
  },
  {
    title: "6. Changes",
    body: "We may update these terms as our work evolves. The current version is always published on this page with its revision date.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/terms", label: "Terms" }]}
        eyebrow="Legal"
        title="Terms of Use"
        description="The short version: be kind, be honest, and we'll do the same."
      />
      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-400">
            Last updated: January 2026
          </p>
          {TERMS.map((t) => (
            <div key={t.title} className="mt-8">
              <h2 className="font-display text-xl font-semibold text-navy-900">{t.title}</h2>
              <p className="mt-2 leading-relaxed text-navy-800/80">{t.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
