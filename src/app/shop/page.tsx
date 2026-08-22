import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { faqJsonLd } from "@/lib/faq-schema";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/Section";
import { ShopGrid } from "@/components/site/ShopGrid";
import { getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Wear the mission. Ishara Charity branded merchandise — every purchase supports our community programs across Kenya.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/shop", label: "Shop" }]}
        eyebrow="Merchandise"
        title="Wear the Mission"
        description="Quality merchandise that carries our story — and funds it. Proceeds support Ishara Charity programs, in line with our financial policies."
      />

      <section className="section-pad">
        <div className="container-x">
          {/* How ordering works */}
          <div className="mb-16 grid gap-5 sm:grid-cols-3">
            {[
              { icon: "shopping-cart" as const, title: "1 · Add to Cart", body: "Pick your items, sizes and colors — or order a single product straight from its page." },
              { icon: "send" as const, title: "2 · Order Your Way", body: "Check out on site with delivery details, or send the pre-filled order to our team on WhatsApp." },
              { icon: "package" as const, title: "3 · Confirmed & Delivered", body: "We verify stock personally, arrange secure payment and deliver countrywide — no surprises." },
            ].map((s) => (
              <div key={s.title} className="card flex items-start gap-4 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                  <Icon name={s.icon} size={22} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-navy-900">{s.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-navy-600">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <ShopGrid products={products} />

          <div className="mt-16 grid gap-5 sm:grid-cols-3">
            <div className="card flex items-start gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                <Icon name="heart" size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-navy-900">Mission-funded</h2>
                <p className="mt-1 text-xs leading-relaxed text-navy-600">
                  Purchases support the organization&apos;s sustainability and programs, subject to
                  our published financial structure and policies.
                </p>
              </div>
            </div>
            <div className="card flex items-start gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                <Icon name="package" size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-navy-900">Delivery countrywide</h2>
                <p className="mt-1 text-xs leading-relaxed text-navy-600">
                  We coordinate delivery within Kenya. Our team confirms costs and timing with you
                  personally.
                </p>
              </div>
            </div>
            <div className="card flex items-start gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-700">
                <Icon name="shield-check" size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-navy-900">Honest &amp; simple</h2>
                <p className="mt-1 text-xs leading-relaxed text-navy-600">
                  No hidden fees — you confirm everything before any payment is made.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-navy-950 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-semibold !text-white sm:text-3xl">
              Prefer to give directly?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm !text-navy-200/85">
              Merchandise helps — but direct giving puts 100% of your support into community programs.
            </p>
            <Link href="/donate" className="btn-primary mt-7">
              <Icon name="heart" size={16} />
              Support Our Work
            </Link>
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-16 max-w-3xl">
            <SectionHeader
              eyebrow="Good to Know"
              title="Shopping Questions, Answered"
            />
            <Reveal delay={120}>
              <Faq items={SHOP_FAQ} className="mt-10" />
            </Reveal>
          </div>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(SHOP_FAQ)) }}
          />
        </div>
      </section>
    </>
  );
}

const SHOP_FAQ: FaqItem[] = [
  {
    question: "How does buying merchandise support the mission?",
    answer:
      "Proceeds from merchandise strengthen the organization's sustainability — funding operations and programs so our impact doesn't depend on donations alone. Our financial structure and policies are published on the Transparency page.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Nairobi orders are typically arranged within days; countrywide deliveries depend on your location. Our team confirms timing with you personally before anything ships.",
  },
  {
    question: "How do I pay?",
    answer:
      "After placing an order we confirm availability and share secure payment options (including M-Pesa) directly with you. Nothing is charged before you've confirmed every detail.",
  },
  {
    question: "Do you deliver outside Kenya?",
    answer:
      "Yes, case by case. International orders are quoted separately with shipping costs confirmed up front — email us your location and items for an exact arrangement.",
  },
  {
    question: "What if my item is damaged or the size is wrong?",
    answer:
      "Tell us within seven days of delivery and we'll make it right — exchange or replacement, handled personally by the shop team.",
  },
  {
    question: "Can I order in bulk for an event or team?",
    answer:
      "Yes! Bulk orders for churches, companies and events come with better pricing. Message us on WhatsApp or email the shop team with quantities and dates.",
  },
];
