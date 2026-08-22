"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice, useCurrency } from "@/components/cart/CurrencyContext";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  orderHref?: string;
  ctaHref?: string;
  /** Adds the default variant straight to the cart. */
  quickAdd?: boolean;
}

export function ProductCard({ product, orderHref, ctaHref, quickAdd = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [added, setAdded] = useState(false);

  function handleQuickAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceKes: product.priceKes,
      priceUsd: product.priceUsd,
      image: product.image,
      qty: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={`/shop/${product.slug}`} className="zoom-img relative block h-60 overflow-hidden bg-sand">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        {!product.inStock && (
          <span className="chip absolute right-4 top-4 bg-navy-900/90 text-white">Out of stock</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-navy-900">
            <Link href={`/shop/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p className="whitespace-nowrap rounded-full bg-gold-100 px-3 py-1 text-sm font-bold text-gold-800">
            {formatPrice(product.priceKes, product.priceUsd, currency)}
          </p>
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-navy-800/75">
          {product.description}
        </p>

        {quickAdd ? (
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleQuickAdd}
            className={cn(
              "btn mt-4 w-full",
              added ? "bg-leaf-600 !text-white" : "btn-navy",
              !product.inStock && "pointer-events-none opacity-50",
            )}
          >
            {added ? (
              <>
                <Icon name="check" size={15} /> Added to cart
              </>
            ) : (
              <>
                <Icon name="shopping-bag" size={15} />
                {product.inStock ? "Add to Cart" : "Out of stock"}
              </>
            )}
          </button>
        ) : (
          <>
            {orderHref ? (
              <Link
                href={orderHref}
                aria-disabled={!product.inStock}
                className={cn(
                  "btn-navy btn mt-4 w-full",
                  !product.inStock && "pointer-events-none opacity-50",
                )}
              >
                <Icon name="shopping-bag" size={15} />
                Choose options
              </Link>
            ) : (
              ctaHref && (
                <Link href={ctaHref} className="btn-outline btn mt-4 w-full">
                  <Icon name="shopping-bag" size={15} />
                  View in Shop
                </Link>
              )
            )}
          </>
        )}
      </div>
    </article>
  );
}
