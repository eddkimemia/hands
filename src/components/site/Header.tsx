"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Our Programs" },
  { href: "/impact", label: "Our Impact" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/shop", label: "Shop" },
  { href: "/stories", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[70] w-full bg-white transition-shadow duration-300",
          scrolled ? "shadow-[0_4px_24px_-8px_rgba(11,33,69,0.18)]" : "border-b border-navy-100/70",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-3 lg:h-24">
          <Link href="/" aria-label="Hands of Hope Foundation — Home" className="shrink-0">
            <Image
              src="/logo/hopelogo.png"
              alt="Hands of Hope Foundation"
              width={222}
              height={125}
              priority
              className="h-16 w-auto sm:h-[4.5rem] lg:h-20"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  isActive(item.href)
                    ? "bg-navy-50 text-navy-900"
                    : "text-navy-800/70 hover:bg-navy-50 hover:text-navy-900",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy-900 transition-colors hover:bg-navy-50"
            >
              <Icon name="shopping-cart" size={19} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-navy-950">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            <Link href="/donate" className="btn-primary btn-sm inline-flex !px-3.5 sm:!px-5">
              <Icon name="heart" size={15} />
              <span className="hidden sm:inline">Support Our Work</span>
              <span className="sm:hidden">Support</span>
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy-900 transition-colors hover:bg-navy-50 xl:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — rendered OUTSIDE <header> so sticky/blur can't clip it */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-20 z-[60] flex animate-fadeUp flex-col overflow-y-auto bg-white shadow-lift lg:top-24 xl:hidden"
        >
          <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-semibold transition-colors",
                  isActive(item.href)
                    ? "bg-gold-100/70 text-navy-900"
                    : "text-navy-800 hover:bg-navy-50",
                )}
              >
                {item.label}
                <Icon name="arrow-right" size={18} className="text-gold-600" />
              </Link>
            ))}
            <Link
              href="/cart"
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-semibold transition-colors",
                isActive("/cart") ? "bg-gold-100/70 text-navy-900" : "text-navy-800 hover:bg-navy-50",
              )}
            >
              <span className="flex items-center gap-2.5">
                Cart
                {count > 0 && (
                  <span className="rounded-full bg-gold-400 px-2 py-0.5 text-xs font-bold text-navy-950">
                    {count}
                  </span>
                )}
              </span>
              <Icon name="shopping-cart" size={18} className="text-gold-600" />
            </Link>
          </nav>
          <div className="container-x mt-auto space-y-3 pb-10 pt-4">
            <Link href="/donate" className="btn-primary btn-lg w-full">
              <Icon name="heart" size={18} />
              Support Our Work
            </Link>
            <Link href="/get-involved#volunteer" className="btn-outline w-full">
              Become a Volunteer
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
