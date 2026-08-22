import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeader } from "@/components/site/Section";
import type { Product } from "@/types";

export function ShopSection({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section id="shop" className="section-pad bg-sand">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Hope Shop"
            title="Wear the Mission"
            description="Branded merchandise that carries our story — and funds it. Proceeds support community programs."
            align="left"
            className="!mx-0"
          />
          <Reveal delay={150}>
            <Link href="/shop" className="btn-navy shrink-0">
              Visit Our Shop
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 80}>
              <ProductCard product={product} ctaHref="/shop" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
