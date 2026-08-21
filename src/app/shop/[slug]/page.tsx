import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { OrderForm } from "@/components/site/OrderForm";
import { SmartImage } from "@/components/SmartImage";
import { getProductById, getProducts } from "@/lib/content";
import { formatKes, SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts({ includeOutOfStock: true });
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `${SITE_URL}/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | Hands of Hope Shop`,
      description: product.description,
      images: [{ url: product.image }],
      type: "website",
    },
  };
}

export default async function ProductOrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts({ includeOutOfStock: true });
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <section className="section-pad bg-sand">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-navy-500">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-gold-700">Home</Link></li>
            <li aria-hidden="true"><Icon name="arrow-right" size={11} className="text-navy-300" /></li>
            <li><Link href="/shop" className="hover:text-gold-700">Shop</Link></li>
            <li aria-hidden="true"><Icon name="arrow-right" size={11} className="text-navy-300" /></li>
            <li aria-current="page" className="font-semibold text-navy-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Product visual */}
          <div>
            <div className="zoom-img relative aspect-square overflow-hidden rounded-3xl shadow-lift">
              <SmartImage
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {!product.inStock && (
                <span className="chip absolute left-4 top-4 bg-navy-900/90 !text-white">Out of stock</span>
              )}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-navy-100 bg-white px-5 py-4 shadow-card">
              <span className="text-sm font-bold text-navy-900">{product.name}</span>
              <span className="rounded-full bg-gold-100 px-4 py-1.5 text-sm font-bold text-gold-800">
                {formatKes(product.priceKes)}
              </span>
            </div>
          </div>

          {/* Details + order form */}
          <div>
            <h1 className="h-display text-3xl sm:text-4xl">{product.name}</h1>
            <p className="lede mt-3">{product.description}</p>
            {(product.colors?.length ?? 0) > 0 && (
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-700">
                <Icon name="spark" size={15} className="text-gold-600" />
                Colours: {product.colors!.join(", ")}
              </p>
            )}

            <div className="mt-7">
              {product.inStock ? (
                <OrderForm
                  product={{
                    id: product.id,
                    name: product.name,
                    priceKes: product.priceKes,
                    sizes: product.sizes ?? [],
                  }}
                />
              ) : (
                <div className="card p-8 text-center">
                  <p className="font-display text-lg font-semibold text-navy-900">
                    Currently out of stock
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-navy-600">
                    Email{" "}
                    <a href="mailto:info@handsofhope.org" className="font-semibold underline underline-offset-2">
                      info@handsofhope.org
                    </a>{" "}
                    and we&apos;ll let you know as soon as it&apos;s back.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-6 rounded-2xl bg-leaf-50 px-5 py-4 text-xs leading-relaxed text-leaf-900">
              <Icon name="heart" size={13} className="mr-1.5 inline align-[-2px]" />
              Every purchase supports the organization&apos;s sustainability and community programs,
              subject to our published financial policies.
            </p>
          </div>
        </div>

        {/* Other products */}
        {others.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold text-navy-900">More from the shop</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="card card-hover group flex items-center gap-4 p-4">
                  <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <SmartImage src={p.image} alt="" fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm font-semibold text-navy-900">{p.name}</span>
                    <span className="text-sm font-bold text-gold-700">{formatKes(p.priceKes)}</span>
                  </span>
                  <Icon name="arrow-right" size={15} className="ml-auto shrink-0 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-gold-600" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
