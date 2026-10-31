import { Hero } from "@/components/home/hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { Features } from "@/components/home/features";
import { RecentEvents } from "@/components/home/recent-events";
import { HowItWorks } from "@/components/home/how-it-works";
import { Gallery } from "@/components/home/gallery";
import { Testimonials } from "@/components/home/testimonials";
import { PartnersMarquee } from "@/components/home/partners-marquee";
import { Faq } from "@/components/home/faq";
import { Newsletter } from "@/components/home/newsletter";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <Features />
      <RecentEvents />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <PartnersMarquee />
      <Faq />
      <Newsletter />
      <FinalCta />
    </>
  );
}
