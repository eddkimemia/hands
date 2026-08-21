import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/site/Section";
import { StoryCard } from "@/components/site/cards";
import type { Story } from "@/types";

export function StoriesSection({ stories }: { stories: Story[] }) {
  if (!stories.length) return null;

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Stories of Hope"
            title="Stories That Inspire Us"
            description="Real change, told with dignity. We share stories only with informed consent, and we never exaggerate."
            align="left"
            className="!mx-0"
          />
          <Reveal delay={150}>
            <Link href="/stories" className="btn-outline shrink-0">
              Read More Stories
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.slice(0, 3).map((story, i) => (
            <Reveal key={story.id} delay={i * 100}>
              <StoryCard story={story} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
