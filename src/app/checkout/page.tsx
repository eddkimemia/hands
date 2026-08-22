import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CheckoutForm } from "@/components/site/CheckoutForm";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Hands of Hope merchandise order — delivery across Kenya and worldwide.",
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/cart", label: "Cart" },
          { href: "/checkout", label: "Checkout" },
        ]}
        eyebrow="Final Step"
        title="Checkout"
        description="Confirm your delivery details — our team will arrange payment and delivery with you personally."
      />
      <section className="section-pad bg-sand">
        <div className="container-x">
          <CheckoutForm
            fees={{
              deliveryFeeKes: settings.deliveryFeeKes ?? 0,
              deliveryFeeUsd: settings.deliveryFeeUsd ?? 0,
            }}
          />
        </div>
      </section>
    </>
  );
}
