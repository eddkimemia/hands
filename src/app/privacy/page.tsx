import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ishara Charity collects, uses and protects your personal information.",
};

const SECTIONS = [
  {
    title: "1. Who we are",
    body: "Ishara Charity ('we', 'us') is a community foundation working in Kenya. This policy explains how we handle personal information across our website, programs, events and communications. For any privacy question or request, contact us using the details on our Contact page.",
  },
  {
    title: "2. What we collect",
    body: "We collect only what we need: contact details you give us (name, email, phone), donation and order information you provide, volunteer application details, and basic technical data (such as anonymized analytics) to keep the site working well.",
  },
  {
    title: "3. Why we use it",
    body: "To respond to enquiries; process donations, orders and volunteer applications; send updates you have subscribed to; meet legal and accounting obligations; and improve our programs and website. We do not sell personal data — ever.",
  },
  {
    title: "4. Consent & choices",
    body: "Newsletter and update emails are sent only with your consent, and every message includes an unsubscribe option. You may withdraw consent at any time without affecting past interactions.",
  },
  {
    title: "5. Sharing & storage",
    body: "Information is shared only with service providers who help us operate (for example email delivery) under confidentiality obligations, or where required by law. We retain records only as long as needed for the purposes above, then securely delete them.",
  },
  {
    title: "6. Security",
    body: "We apply appropriate technical and organizational measures to protect personal information, including access controls and encrypted connections. No system is perfectly secure, but we treat your trust as our most important asset.",
  },
  {
    title: "7. Your rights",
    body: "You may ask us to access, correct, export or delete your personal information, subject to legal record-keeping duties. We respond to all such requests promptly and in good faith.",
  },
  {
    title: "8. Children",
    body: "Our programs serve children, and we handle their information with heightened care: minimal collection, guardian consent where applicable, and strict safeguarding procedures described in our Safeguarding Policy.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/privacy", label: "Privacy Policy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        description="We collect as little as possible, use it only for what you'd expect, and protect it carefully."
      />
      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-400">
            Last updated: January 2026
          </p>
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="mt-8 first-of-type:mt-6">
              <h2 className="font-display text-xl font-semibold text-navy-900">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-navy-800/80">{s.body}</p>
              {i === SECTIONS.length - 1 && null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
