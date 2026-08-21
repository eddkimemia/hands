import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-sand">
      <div className="container-x py-24 text-center">
        <p className="font-display text-7xl font-semibold tracking-tight text-gold-500 sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
          This page wandered off the path
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-700">
          The link may be old or mistyped — but there are plenty of hopeful places to head next.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Link href="/" className="btn-primary btn-lg">
            Back Home
            <Icon name="arrow-right" size={16} />
          </Link>
          <Link href="/programs" className="btn-outline btn-lg">
            Explore Our Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
