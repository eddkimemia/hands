"use client";

import { useEffect } from "react";
import { Icon } from "@/components/Icon";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-sand">
      <div className="container-x py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
          <Icon name="alert-circle" size={30} />
        </span>
        <h1 className="mt-7 font-display text-3xl font-semibold text-navy-900">
          Something went wrong on our side
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-700">
          An unexpected error occurred. Please try again — if it keeps happening, we&apos;d be
          grateful if you let us know.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <button onClick={reset} className="btn-primary btn-lg">
            Try Again
          </button>
          <a href="/" className="btn-outline btn-lg">
            Go Home
          </a>
        </div>
      </div>
    </section>
  );
}
