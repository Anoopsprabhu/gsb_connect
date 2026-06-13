import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Events | GSB Startup Angels",
  description:
    "Browse pitch nights, founder meetups, investor sessions, and startup workshops hosted by GSB Startup Angels.",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let events: any[] = [];
  let dbError = false;

  const resolvedSearchParams = await searchParams;
  const typeParam = resolvedSearchParams.type as string | undefined;
  const timelineParam = (resolvedSearchParams.timeline as string) || "all";

  try {
    const where: any = {};
    
    // Type Filter
    if (typeParam) {
      const types = typeParam.split(",");
      where.type = { in: types };
    }

    // Timeline Filter
    const now = new Date();
    if (timelineParam === "upcoming") {
      where.date = { gte: now };
    } else if (timelineParam === "past") {
      where.date = { lt: now };
    }

    events = await prisma.event.findMany({
      where,
      orderBy: { date: timelineParam === "past" ? "desc" : "asc" },
    });
  } catch (error) {
    console.error(
      "Database connection failed. Showing mock data for now.",
      error,
    );
    dbError = true;
    
    // Filter Mock Data for local testing/dev when DB is down
    const mockEvents = [
      {
        id: "1",
        title: "Innovators & Heritage Workshop",
        description:
          "Explore the intersection of traditional practices and modern technology in this interactive workshop.",
        date: new Date(Date.now() + 86400000 * 5),
        location: "GSB Connect Center, Main Hall",
        type: "workshop",
        imageUrl: null,
        speakers: "Dr. Anoop Prabhu",
        featured: "Mr. Ratan Tata",
        startTime: "10:00 AM",
      },
      {
        id: "2",
        title: "Tech Meets Tradition Hackathon",
        description:
          "A 48-hour hackathon aimed at building technological solutions that preserve and promote cultural heritage.",
        date: new Date(Date.now() + 86400000 * 12),
        location: "Innovation Hub",
        type: "hackathon",
        imageUrl: null,
        featured: "Grace Hopper",
        startTime: "09:00 AM",
      },
      {
        id: "3",
        title: "Community Networking Mixer",
        description:
          "Connect with mentors, students, and professionals in a relaxed, culturally rich environment.",
        date: new Date(Date.now() + 86400000 * 20),
        location: "The Rooftop Lounge",
        type: "networking",
        imageUrl: null,
        speakers: "Sarah Connor",
        startTime: "06:00 PM",
      },
      {
        id: "4",
        title: "Annual Cultural Fest",
        description:
          "A grand celebration of our heritage featuring art, music, food, and traditions from diverse communities.",
        date: new Date(Date.now() + 86400000 * 45),
        location: "City Convention Center",
        type: "cultural",
        imageUrl: null,
        startTime: "11:00 AM",
      },
    ];

    events = mockEvents.filter(e => {
      // Filter mock by type
      if (typeParam && !typeParam.split(",").includes(e.type)) return false;
      
      // Filter mock by timeline
      const eDate = new Date(e.date);
      const now = new Date();
      if (timelineParam === "upcoming" && eDate < now) return false;
      if (timelineParam === "past" && eDate >= now) return false;
      
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return timelineParam === "past" ? dateB - dateA : dateA - dateB;
    });
  }

  const categories = ["Workshops", "Networking", "Hackathons", "Cultural"];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header Section */}
      <section className="relative bg-brand-navy h-[220px] sm:h-[260px] md:h-[320px] overflow-hidden" data-reveal-off>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-70"
            alt="Startup founders and investors at a tech event"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1628]/50 via-[#0b1628]/75 to-[#0b1628]" />
        </div>

        <div className="relative z-10 container flex items-center justify-center flex-col mx-auto h-full px-4 md:px-6 text-center pt-14 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-3 sm:mb-4 tracking-tight">
            {timelineParam === "past" ? "Past Events" : timelineParam === "upcoming" ? "Upcoming Events" : "All Events"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {timelineParam === "past"
              ? "Relive pitch nights, founder sessions, and investor meetups from our community."
              : "Pitch nights, founder workshops, investor sessions, and startup gatherings for the GSB ecosystem."}
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-16 md:py-24 bg-slate-50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          {dbError && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-sm">
                  Database Not Connected
                </h4>
                <p className="text-sm mt-1">
                  Currently displaying filtered placeholder data. Please configure your
                  Neon DB connection string in the `.env` file and push the
                  Prisma schema.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <EventFilters categories={categories} />
            </div>

            {/* Events Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-stagger>
                {events.length > 0 ? (
                  events.map((event) => <EventCard key={event.id} {...event} />)
                ) : (
                  <div className="col-span-full py-24 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-slate-700">
                      No events matched your filters.
                    </p>
                    <p className="text-sm">
                      Try adjusting your selection or browse all events!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
