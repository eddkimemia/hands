"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/types";

function Delay({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("is-visible"), delay);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}

export function ShopGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <Delay key={p.id} delay={(i % 3) * 80}>
          <ProductCard product={p} orderHref={`/shop/${p.slug}`} quickAdd />
        </Delay>
      ))}
    </div>
  );
}
