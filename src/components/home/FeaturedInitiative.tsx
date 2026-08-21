import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import type { Project } from "@/types";

export function FeaturedInitiative({ project }: { project?: Project }) {
  if (!project) return null;

  return (
    <section className="section-pad relative overflow-hidden bg-navy-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-royal-700/20 blur-3xl"
      />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Visual collage */}
        <Reveal className="relative">
          <div className="zoom-img relative aspect-[4/5] max-h-[520px] w-full overflow-hidden rounded-3xl shadow-lift sm:aspect-[4/4.4]">
            <SmartImage
              src={project.image}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950/80 to-transparent" />
          </div>

          {project.gallery[0] && (
            <div className="zoom-img absolute -bottom-8 -right-3 hidden aspect-square w-44 overflow-hidden rounded-2xl border-4 border-navy-950 shadow-lift sm:block lg:-right-6 lg:w-52">
              <SmartImage
                src={project.gallery[0]}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          )}

          <div className="absolute -top-5 left-5 rounded-2xl bg-gold-400 px-5 py-3.5 shadow-lift">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-800">People reached</p>
            <p className="font-display text-2xl font-semibold text-navy-950">
              {project.peopleReached.toLocaleString()}+
            </p>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <p className="eyebrow !text-gold-300 before:!bg-gold-400">Featured Initiative</p>
            <h2 className="h-display text-3xl !text-white sm:text-4xl lg:text-[2.75rem]">{project.name}</h2>
            <p className="mt-3 font-display text-xl italic text-gold-300">{project.summary}</p>
            <p className="mt-5 leading-relaxed text-navy-100/85 line-clamp-5">{project.description}</p>
          </Reveal>

          <Reveal delay={140}>
            <dl className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300">
                  <Icon name="map-pin" size={14} /> Location
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-white">{project.location}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300">
                  <Icon name="trending-up" size={14} /> Progress
                </dt>
                <dd className="mt-1.5 flex items-center gap-3 text-sm font-semibold text-white">
                  {project.progressPercent}%
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-200"
                      style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
                    />
                  </span>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href={`/projects/${project.slug}`} className="btn-primary btn-lg">
                Explore This Project
                <Icon name="arrow-right" size={17} />
              </Link>
              <Link href={`/donate?project=${project.slug}`} className="btn-ghost-light btn-lg">
                Support {project.name}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
