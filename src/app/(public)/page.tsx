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

async function getLatestWebinar() {
  try {
    return await prisma.webinar.findFirst({
      where: {
        status: "published",
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        startTime: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch latest webinar:", error);
    return null;
  }
}

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents();
  const latestWebinar = await getLatestWebinar();

  const sliderEvents = upcomingEvents.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  const webinarProp = latestWebinar ? {
    ...latestWebinar,
    date: latestWebinar.date.toISOString(),
  } : null;

  return (
    <div className="flex flex-col w-full">
      <HeroCarousel latestWebinar={webinarProp} />
      <UpcomingEventsSlider events={sliderEvents} />
      <AboutSection />
      <FeaturedEventsSection />
      <ExperienceSection />
      <TeamSection />
    </div>
  );
}
