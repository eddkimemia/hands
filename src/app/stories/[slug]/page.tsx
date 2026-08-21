import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { getSettings, getStoryBySlug, getStories } from "@/lib/content";
import { SITE_URL, formatDate, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: story.title,
    description: truncate(story.excerpt, 155),
    alternates: { canonical: `${SITE_URL}/stories/${story.slug}` },
    openGraph: {
      title: story.title,
      description: truncate(story.excerpt, 155),
      images: [{ url: story.image }],
      type: "article",
      publishedTime: story.publishedAt,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story || !story.published) notFound();

  const settings = await getSettings();
  const related = (await getStories()).filter((s) => s.slug !== story.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    image: story.image,
    datePublished: story.publishedAt,
    author: { "@type": "Organization", name: settings.orgName },
    publisher: { "@type": "Organization", name: settings.orgName },
    mainEntityOfPage: `${SITE_URL}/stories/${story.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        <div className="absolute inset-0 -z-10 opacity-40">
          <SmartImage src={story.image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
        </div>
        <div className="container-x pb-16 pt-20 sm:pb-20 sm:pt-28">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-navy-300">
              <ol className="flex items-center gap-1.5">
                <li><Link href="/" className="hover:text-gold-300">Home</Link></li>
                <li aria-hidden="true"><Icon name="arrow-right" size={11} className="text-navy-600" /></li>
                <li><Link href="/stories" className="hover:text-gold-300">Stories</Link></li>
              </ol>
            </nav>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="chip bg-gold-400 font-bold text-navy-950">{story.category}</span>
              {story.sample && (
                <span className="chip border border-white/25 bg-white/10 text-navy-100">Illustrative example</span>
              )}
            </div>
            <h1 className="h-display mt-5 max-w-3xl !text-white">{story.title}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm !text-navy-200">
              <span className="flex items-center gap-2">
                <Icon name="map-pin" size={15} className="text-gold-400" />
                {story.location}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="calendar" size={15} className="text-gold-400" />
                {formatDate(story.publishedAt)}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="section-pad bg-sand">
        <div className="container-x grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <article>
            <Reveal>
              <p className="font-display text-xl italic leading-relaxed text-navy-800 sm:text-2xl">
                {story.excerpt}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <figure className="zoom-img relative mt-8 aspect-video overflow-hidden rounded-3xl shadow-lift">
                <SmartImage
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
            <div className="mt-8 space-y-5 leading-relaxed text-navy-800/90">
              {story.body.map((para, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={150}>
              <aside className="mt-10 rounded-2xl border-l-4 border-gold-400 bg-gold-50 p-6">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-800">
                  <Icon name="trending-up" size={14} />
                  Impact achieved
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-navy-900">
                  {story.impactAchieved}
                </p>
              </aside>
            </Reveal>

            {story.sample && (
              <Reveal>
                <p className="mt-8 rounded-xl border border-dashed border-navy-300 bg-white p-4 text-xs leading-relaxed text-navy-500">
                  This is illustrative demonstration content prepared for the website launch.
                  Verified stories — written and published only with informed consent of those
                  featured — will replace it.
                </p>
              </Reveal>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <div className="card p-7 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <Icon name="heart" size={22} />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-navy-900">
                  Move a Story Forward
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  Behind every story is a program you can strengthen today.
                </p>
                <Link href="/donate" className="btn-primary mt-5 w-full">
                  Support Our Work
                </Link>
              </div>
            </Reveal>

            {related.length > 0 && (
              <Reveal delay={120}>
                <div className="card p-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-navy-500">
                    More Stories
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link href={`/stories/${r.slug}`} className="group flex items-start gap-3.5">
                          <span className="relative block h-14 w-16 shrink-0 overflow-hidden rounded-lg">
                            <SmartImage src={r.image} alt="" fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                          </span>
                          <span>
                            <span className="block font-display text-sm font-semibold leading-snug text-navy-900 group-hover:text-royal-700">
                              {r.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-navy-500">{r.location}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
