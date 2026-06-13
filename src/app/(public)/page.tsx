import HeroCarousel from "@/components/HeroCarousel";
import UpcomingEventsSlider from "@/components/UpcomingEventsSlider";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import TeamSection from "@/components/TeamSection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import prisma from "@/lib/prisma";

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: {
        status: "published",
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 12,
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        type: true,
        imageUrl: true,
        startTime: true,
        registrationOpen: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
}

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents();

  const sliderEvents = upcomingEvents.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  return (
    <div className="flex flex-col w-full">
      <HeroCarousel />
      <UpcomingEventsSlider events={sliderEvents} />
      <AboutSection />
      <FeaturedEventsSection />
      <ExperienceSection />
      <TeamSection />
    </div>
  );
}
