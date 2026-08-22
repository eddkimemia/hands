import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { StoryCard } from "@/components/site/cards";
import { getStories } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Stories of hope and change from Kenyan communities — shared with consent, told with dignity by Ishara Charity.",
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/stories", label: "Stories" }]}
        eyebrow="Stories of Hope"
        title="Every Story Is Someone's Truth"
        description="We publish stories only with informed consent, share impact honestly, and put dignity before drama — always."
      />

      <section className="section-pad bg-sand">
        <div className="container-x">
          {stories.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story, i) => (
                  <Reveal key={story.id} delay={(i % 3) * 90}>
                    <StoryCard story={story} priority={i === 0} />
                  </Reveal>
                ))}
              </div>
              <Reveal delay={200}>
                <p className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gold-200 bg-gold-50 p-5 text-center text-xs leading-relaxed text-gold-900">
                  <Icon name="shield-check" size={14} className="mr-1.5 inline align-[-2px]" />
                  Stories marked &ldquo;Illustrative&rdquo; are demonstration content showing how
                  verified, consented community stories will appear. They are replaced as our teams
                  complete documentation with the people involved.
                </p>
              </Reveal>
            </>
          ) : (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-14 text-center">
                <p className="font-display text-xl font-semibold text-navy-900">
                  Stories are being gathered with care.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
                  We never rush consent or publish without permission. Verified stories will
                  appear here soon.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
