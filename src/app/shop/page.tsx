import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/site/PageHero";
import { ShopGrid } from "@/components/site/ShopGrid";
import { getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Wear the mission. Hands of Hope branded merchandise — every purchase supports our community programs across Kenya.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/shop", label: "Shop" }]}
        eyebrow="Merchandise"
        title="Wear the Mission"
        description="Quality merchandise that carries our story — and funds it. Proceeds support Hands of Hope programs, in line with our financial policies."
      />

      <section className="section-pad">
        <div className="container-x">
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
        </div>
      </section>
    </>
  );
}
