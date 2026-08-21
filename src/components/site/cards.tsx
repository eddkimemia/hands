import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SmartImage } from "@/components/SmartImage";
import { cn, formatDate, formatKes } from "@/lib/utils";
import type { Program, Product, Project, Story } from "@/types";

/* ------------------------------- ProgramCard ------------------------------ */

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={`/programs/${program.slug}`} className="zoom-img relative block h-48 overflow-hidden">
        <SmartImage
          src={program.image}
          alt={program.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950/70 to-transparent" />
        <span className="absolute -bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400 text-navy-950 shadow-lift">
          <Icon name={program.icon as never} size={22} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6 pt-8">
        <h3 className="font-display text-xl font-semibold text-navy-900">
          <Link href={`/programs/${program.slug}`} className="link-underline">
            {program.name}
          </Link>
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-800/75">{program.summary}</p>
        <Link
          href={`/programs/${program.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-royal-700 transition-colors hover:text-royal-600"
        >
          Learn More
          <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------- StoryCard ------------------------------- */

export function StoryCard({ story, priority = false }: { story: Story; priority?: boolean }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={`/stories/${story.slug}`} className="zoom-img relative block h-52 overflow-hidden">
        <SmartImage
          src={story.image}
          alt={story.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="chip absolute left-4 top-4 bg-white/95 text-navy-900 shadow-card">
          {story.category}
        </span>
        {story.sample && (
          <span className="chip absolute right-4 top-4 bg-gold-400/95 text-navy-950">Illustrative</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-500">
          <Icon name="map-pin" size={13} className="text-gold-600" />
          {story.location} · {formatDate(story.publishedAt)}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-navy-900">
          <Link href={`/stories/${story.slug}`} className="link-underline">
            {story.title}
          </Link>
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-800/75">{story.excerpt}</p>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-leaf-50 px-3.5 py-2.5 text-xs font-medium text-leaf-800">
          <Icon name="trending-up" size={14} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-bold">Impact:</span> {story.impactAchieved}
          </span>
        </p>
      </div>
    </article>
  );
}

/* ------------------------------- ProjectCard ------------------------------ */

const STATUS_STYLES: Record<Project["status"], string> = {
  active: "bg-leaf-100 text-leaf-800",
  planning: "bg-gold-100 text-gold-800",
  completed: "bg-navy-100 text-navy-800",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={`/projects/${project.slug}`} className="zoom-img relative block h-52 overflow-hidden">
        <SmartImage
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className={cn("chip absolute left-4 top-4 capitalize", STATUS_STYLES[project.status])}>
          {project.status === "active" && (
            <span className="mr-0.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-leaf-600" />
          )}
          {project.status}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-500">
          <Icon name="map-pin" size={13} className="text-gold-600" />
          {project.location}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-navy-900">
          <Link href={`/projects/${project.slug}`} className="link-underline">
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-800/75">{project.summary}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-navy-700">
            <span>Progress</span>
            <span>{project.progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-navy-100" role="progressbar" aria-valuenow={project.progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.name} progress`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-royal-600 to-gold-400 transition-all duration-700"
              style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
            />
          </div>
          <p className="pt-1 text-xs text-navy-600">
            <Icon name="users" size={13} className="mr-1 inline text-leaf-600" />
            {project.peopleReached.toLocaleString()} people reached
          </p>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------- ProductCard ------------------------------ */

export function ProductCard({
  product,
  ctaHref,
  orderHref,
}: {
  product: Product;
  ctaHref?: string;
  orderHref?: string;
}) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="zoom-img relative h-60 overflow-hidden bg-sand">
        <SmartImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        {!product.inStock && (
          <span className="chip absolute right-4 top-4 bg-navy-900/90 text-white">Out of stock</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-navy-900">{product.name}</h3>
          <p className="whitespace-nowrap rounded-full bg-gold-100 px-3 py-1 text-sm font-bold text-gold-800">
            {formatKes(product.priceKes)}
          </p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-800/75">{product.description}</p>
        {orderHref ? (
          <Link
            href={product.inStock ? orderHref : "#"}
            aria-disabled={!product.inStock}
            className={cn(
              "btn-navy btn-sm mt-4 w-full",
              !product.inStock && "pointer-events-none opacity-50",
            )}
          >
            <Icon name="shopping-bag" size={15} />
            {product.inStock ? "Order" : "Out of stock"}
          </Link>
        ) : (
          ctaHref && (
            <Link href={ctaHref} className="btn-outline btn-sm mt-4 w-full">
              <Icon name="shopping-bag" size={15} />
              View in Shop
            </Link>
          )
        )}
      </div>
    </article>
  );
}
