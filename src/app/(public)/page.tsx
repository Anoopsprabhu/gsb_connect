import HeroCarousel from "@/components/HeroCarousel";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import TeamSection from "@/components/TeamSection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroCarousel />
      <AboutSection />
      <FeaturedEventsSection />
      <ExperienceSection />
      <TeamSection />
    </div>
  );
}
