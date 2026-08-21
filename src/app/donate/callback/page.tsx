import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { VerifyDonation } from "@/components/site/VerifyDonation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Confirmation",
  robots: { index: false, follow: false },
};

export default function DonateCallbackPage() {
  return (
    <section className="flex min-h-[70svh] items-center bg-sand">
      <div className="container-x py-20">
        <Suspense
          fallback={
            <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-lift">
              <span className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-navy-100 text-navy-400">
                <Icon name="credit-card" size={26} />
              </span>
              <p className="mt-5 font-display text-xl font-semibold text-navy-900">
                Checking your payment…
              </p>
            </div>
          }
        >
          <VerifyDonation />
        </Suspense>
        <p className="mt-8 text-center">
          <Link href="/" className="link-underline text-sm font-semibold text-navy-700">
            Back to homepage
          </Link>
        </p>
      </div>
    </section>
  );
}
