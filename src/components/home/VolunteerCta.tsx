import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";

export function VolunteerCta({
  heading,
  body,
  image,
}: {
  heading: string;
  body: string;
  image: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/70" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy-950/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/60 to-transparent" />
      </div>

      <div className="container-x py-24 text-center sm:py-32">
        <Reveal>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-400 text-navy-950 shadow-lift">
            <Icon name="users" size={30} />
          </span>
          <h2 className="h-display mx-auto mt-7 max-w-2xl text-3xl !text-white sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="lede mx-auto mt-5 max-w-xl !text-navy-100/90">{body}</p>
          <Link href="/get-involved#volunteer" className="btn-primary btn-lg mt-9">
            Join Our Volunteer Community
            <Icon name="arrow-right" size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
