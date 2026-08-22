import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CartView } from "@/components/site/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Ishara Charity merchandise order — checkout here or order directly on WhatsApp.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/cart", label: "Cart" }]}
        eyebrow="Almost There"
        title="Your Cart"
        description="Review your selection, then check out here or send the order straight to our team on WhatsApp."
      />
      <section className="section-pad bg-sand">
        <div className="container-x">
          <CartView />
        </div>
      </section>
    </>
  );
}
