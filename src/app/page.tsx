import type { Metadata } from "next";
import { FeaturedInitiative } from "@/components/home/FeaturedInitiative";
import { Hero } from "@/components/home/Hero";
import { HowYouCanHelp } from "@/components/home/HowYouCanHelp";
import { NewsletterSection } from "@/components/home/Newsletter";
import { Partnerships } from "@/components/home/Partnerships";
import { ProgramsGrid } from "@/components/home/ProgramsGrid";
import { ShopSection } from "@/components/home/ShopSection";
import { StatsBand } from "@/components/home/StatsBand";
import { StoriesSection } from "@/components/home/StoriesSection";
import { Sustainability } from "@/components/home/Sustainability";
import { Transparency } from "@/components/home/Transparency";
import { VolunteerCta } from "@/components/home/VolunteerCta";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import {
  getFeaturedProject,
  getHomepage,
  getPrograms,
  getProducts,
  getReports,
  getStats,
  getStories,
} from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  return {
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: "Ishara Charity — Extending Hands. Inspiring Hope.",
      description: homepage.heroSubtitle,
      url: SITE_URL,
      images: [{ url: homepage.heroImage, width: 1600, height: 900, alt: "Ishara Charity community" }],
    },
  };
}

export default async function HomePage() {
  const [homepage, stats, programs, featured, stories, reports, products] =
    await Promise.all([
      getHomepage(),
      getStats(),
      getPrograms(),
      getFeaturedProject(),
      getStories(),
      getReports(),
      getProducts(),
    ]);

  return (
    <>
      <Hero
        kicker={homepage.heroKicker}
        titleTop={homepage.heroTitleTop}
        titleAccent={homepage.heroTitleAccent}
        subtitle={homepage.heroSubtitle}
        image={homepage.heroImage}
        taglineItems={homepage.heroTaglineItems}
      />
      <StatsBand stats={stats} />
      <WhoWeAre
        heading={homepage.whoWeAreHeading}
        body={homepage.whoWeAreBody}
        image={homepage.whoWeAreImage}
      />
      <ProgramsGrid programs={programs} />
      <FeaturedInitiative project={featured} />
      <HowYouCanHelp />
      <ShopSection products={products.filter((p) => p.featured).slice(0, 4)} />
      <Sustainability heading={homepage.sustainabilityHeading} body={homepage.sustainabilityBody} />
      <StoriesSection stories={stories} />
      <Transparency reports={reports} />
      <Partnerships />
      <VolunteerCta
        heading={homepage.volunteerCtaHeading}
        body={homepage.volunteerCtaBody}
        image={homepage.volunteerCtaImage}
      />
      <NewsletterSection heading={homepage.newsletterHeading} body={homepage.newsletterBody} />
    </>
  );
}
