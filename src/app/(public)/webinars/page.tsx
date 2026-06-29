import WebinarCard from "@/components/WebinarCard";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Webinars | GSB Startup Angels",
  description:
    "Join live webinars with industry leaders, investors, and founders. Learn from experts in the GSB Startup Angels ecosystem.",
};

export default async function WebinarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let webinars: any[] = [];
  let dbError = false;

  const resolvedSearchParams = await searchParams;
  const timelineParam =
    (resolvedSearchParams.timeline as string) || "all";

  try {
    const where: any = { status: "published" };
    const now = new Date();

    if (timelineParam === "upcoming") {
      where.date = { gte: now };
    } else if (timelineParam === "past") {
      where.date = { lt: now };
    }

    webinars = await prisma.webinar.findMany({
      where,
      orderBy: { date: timelineParam === "past" ? "desc" : "asc" },
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    dbError = true;

    const mockWebinars = [
      {
        id: "w1",
        title: "Fundraising Masterclass: Seed to Series A",
        description:
          "Learn the strategies behind successful fundraising from seed stage to Series A with top investors sharing their insights.",
        date: new Date(Date.now() + 86400000 * 7),
        startTime: "3:00 PM",
        endTime: "4:30 PM",
        speakers: "Rajesh Sharma, Priya Mehta, Vikram Singh",
        platform: "Zoom",
        imageUrl: null,
        webinarLink: "https://zoom.us/j/example",
        status: "published",
        registrationOpen: true,
      },
      {
        id: "w2",
        title: "Building Products that Scale",
        description:
          "A deep-dive into product-market fit, user research, and scaling strategies for early-stage startups.",
        date: new Date(Date.now() + 86400000 * 14),
        startTime: "11:00 AM",
        endTime: "12:30 PM",
        speakers: "Ananya Desai, Karthik Rao",
        platform: "Google Meet",
        imageUrl: null,
        webinarLink: null,
        status: "published",
        registrationOpen: true,
      },
      {
        id: "w3",
        title: "Legal Essentials for Indian Startups",
        description:
          "Understanding company registration, equity structures, ESOP pools, and regulatory compliance for startups in India.",
        date: new Date(Date.now() + 86400000 * 21),
        startTime: "5:00 PM",
        endTime: "6:00 PM",
        speakers: "Adv. Sunil Bhat",
        platform: "Microsoft Teams",
        imageUrl: null,
        webinarLink: null,
        status: "published",
        registrationOpen: true,
      },
    ];

    webinars = mockWebinars.filter((w) => {
      const wDate = new Date(w.date);
      const now = new Date();
      if (timelineParam === "upcoming" && wDate < now) return false;
      if (timelineParam === "past" && wDate >= now) return false;
      return true;
    });
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-brand-navy h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden flex items-center justify-center"
        data-reveal-off
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-50"
            alt="Webinar with speakers on a digital screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1628]/60 via-[#0b1628]/80 to-[#0b1628]" />
        </div>

        <div className="relative z-10 container flex items-center justify-center flex-col mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <svg
              className="w-4 h-4 text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              Live & On-Demand
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-3 sm:mb-4 tracking-tight">
            {timelineParam === "past"
              ? "Past Webinars"
              : timelineParam === "upcoming"
                ? "Upcoming Webinars"
                : "Webinars"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {timelineParam === "past"
              ? "Catch up on past sessions with top investors, founders, and industry experts."
              : "Join live sessions with investors, founders, and industry experts from the GSB ecosystem."}
          </p>
        </div>
      </section>

      {/* Webinars Grid Section */}
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
                  Currently displaying placeholder data. Please configure your
                  database connection.
                </p>
              </div>
            </div>
          )}

          {/* Timeline Filter */}
          <div className="flex items-center gap-3 mb-10">
            <a
              href="/webinars"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                timelineParam === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </a>
            <a
              href="/webinars?timeline=upcoming"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                timelineParam === "upcoming"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Upcoming
            </a>
            <a
              href="/webinars?timeline=past"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                timelineParam === "past"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Past
            </a>
          </div>

          {/* Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            data-stagger
          >
            {webinars.length > 0 ? (
              webinars.map((webinar) => (
                <WebinarCard key={webinar.id} {...webinar} />
              ))
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg font-medium text-slate-700">
                  No webinars found.
                </p>
                <p className="text-sm">
                  Check back soon for upcoming sessions!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
