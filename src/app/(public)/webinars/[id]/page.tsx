import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import prisma from "@/lib/prisma";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  ArrowLeft,
  Share2,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/Button";
import ShareButton from "@/components/ShareButton";
import FloatingRegisterButton from "@/components/FloatingRegisterButton";


async function getWebinar(id: string) {
  try {
    const webinar = await prisma.webinar.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
      },
    });
    return webinar;
  } catch (error) {
    console.error("Failed to fetch webinar:", error);
    return null;
  }
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let webinar = await getWebinar(id);

  if (!webinar) {
    // Fallback mock data for development
    const mockWebinars = [
      {
        id: "w1",
        title: "Fundraising Masterclass: Seed to Series A",
        description:
          "Learn the strategies behind successful fundraising from seed stage to Series A with top investors sharing their insights.",
        about:
          "This comprehensive masterclass brings together seasoned investors and successful founders who have navigated the fundraising journey. From crafting your pitch deck to negotiating term sheets, this webinar covers everything an early-stage founder needs to know about raising capital in the Indian startup ecosystem.\n\nTopics covered:\n• Building a compelling pitch narrative\n• Understanding valuation at different stages\n• Investor psychology and what VCs look for\n• Term sheet negotiation strategies\n• Building relationships with investors before you need funding",
        date: new Date(Date.now() + 86400000 * 7),
        startTime: "3:00 PM",
        endTime: "4:30 PM",
        speakers: "Rajesh Sharma, Priya Mehta, Vikram Singh",
        platform: "Zoom",
        imageUrl: null,
        webinarLink: "https://zoom.us/j/example",
        status: "published",
        registrationOpen: true,
        _count: { registrations: 42 },
      },
      {
        id: "w2",
        title: "Building Products that Scale",
        description:
          "A deep-dive into product-market fit, user research, and scaling strategies for early-stage startups.",
        about:
          "Join us for an interactive session on product building. We'll explore how to validate your ideas, find product-market fit, and build a product that scales. Perfect for first-time founders and product managers.",
        date: new Date(Date.now() + 86400000 * 14),
        startTime: "11:00 AM",
        endTime: "12:30 PM",
        speakers: "Ananya Desai, Karthik Rao",
        platform: "Google Meet",
        imageUrl: null,
        webinarLink: null,
        status: "published",
        registrationOpen: true,
        _count: { registrations: 28 },
      },
      {
        id: "w3",
        title: "Legal Essentials for Indian Startups",
        description:
          "Understanding company registration, equity structures, ESOP pools, and regulatory compliance for startups in India.",
        about:
          "Navigate the legal landscape of building a startup in India with expert guidance from leading startup lawyers.",
        date: new Date(Date.now() + 86400000 * 21),
        startTime: "5:00 PM",
        endTime: "6:00 PM",
        speakers: "Adv. Sunil Bhat",
        platform: "Microsoft Teams",
        imageUrl: null,
        webinarLink: null,
        status: "published",
        registrationOpen: true,
        _count: { registrations: 15 },
      },
    ];

    const mockWebinar = mockWebinars.find((w) => w.id === id);
    if (!mockWebinar) return notFound();
    webinar = mockWebinar as any;
  }

  if (!webinar) return notFound();

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "zoom":
        return "🔵";
      case "google meet":
        return "🟢";
      case "microsoft teams":
        return "🟣";
      default:
        return "💻";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 w-full overflow-hidden bg-[#0f1423]"
        data-reveal-off
      >
        {/* Modern Vector Backgrounds */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Abstract Vector Graphic */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" className="text-indigo-400" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#dot-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col justify-end">
          <Link
            href="/webinars"
            className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-xs sm:text-sm font-medium mb-6 sm:mb-10 w-fit"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> Back to Webinars
          </Link>

          <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider shadow-lg">
                <Video size={12} className="sm:w-3.5 sm:h-3.5" />
                Webinar
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-[10px] sm:text-xs font-semibold text-amber-300 uppercase tracking-wider shadow-lg">
                {getPlatformIcon(webinar.platform)} {webinar.platform}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 leading-tight tracking-tight drop-shadow-sm pb-1 sm:pb-2">
              {webinar.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-300 text-sm sm:text-base mt-1 sm:mt-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" />
                <span>
                  {format(new Date(webinar.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                <span>
                  {webinar.startTime || "TBA"}
                  {webinar.endTime ? ` – ${webinar.endTime}` : ""}
                </span>
              </div>
            </div>

            {webinar.registrationOpen !== false ? (
              <div className="mt-6 lg:hidden w-full sm:w-auto">
                <Button
                  href={`/webinars/${webinar.id}/register`}
                  size="large"
                  variant="primary"
                  className="w-full sm:w-auto text-center"
                  label="Register Now"
                />
              </div>
            ) : (
              <div className="mt-6 lg:hidden w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 text-slate-300 text-center text-sm font-semibold border border-white/10">
                Registrations Closed
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Poster Section */}
          {webinar.imageUrl && (
            <section className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white p-4">
              <div className="relative w-full aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden bg-slate-50">
                <Image
                  src={webinar.imageUrl}
                  alt={`${webinar.title} Poster`}
                  fill
                  className="object-contain"
                />
              </div>
            </section>
          )}

          {/* About Section */}
          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="21" x2="3" y1="6" y2="6" />
                <line x1="15" x2="3" y1="12" y2="12" />
                <line x1="17" x2="3" y1="18" y2="18" />
              </svg>
              About This Webinar
            </h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-600 text-md leading-relaxed whitespace-pre-line">
                {webinar.about || webinar.description}
              </p>
            </div>
          </section>

          {/* Speakers Section */}
          {webinar.speakers && (
            <section>
              <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                Speakers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-stagger>
                {webinar.speakers
                  .split(",")
                  .map((speaker: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl shadow-lg border border-indigo-500/20 flex items-center gap-4 group hover:scale-[1.02] transition-all"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center font-bold text-2xl border border-white/20">
                        {speaker.trim().charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">
                          {speaker.trim()}
                        </h4>
                        <p className="text-xs font-medium text-indigo-100 uppercase tracking-widest mt-1">
                          Speaker
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* What You'll Learn */}
          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              How to Join
            </h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Register for the webinar
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Fill out the registration form with your details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Check your email
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      You&apos;ll receive a registration confirmation email immediately. The Webinar Join URL will be sent 48 hours before the Webinar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Join on the day
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Click the join link in your inbox at the scheduled time to join
                      via {webinar.platform}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div
            className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
            data-reveal-block
          >
            <h3 className="text-xl font-medium text-slate-900 mb-6 pb-6 border-b border-slate-100">
              Webinar Details
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-normal text-slate-400 uppercase tracking-widest">
                    Date
                  </p>
                  <p className="font-normal text-slate-900">
                    {format(new Date(webinar.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-normal text-slate-400 uppercase tracking-widest">
                    Time
                  </p>
                  <p className="font-normal text-slate-900">
                    {webinar.startTime || "Check Details"} –{" "}
                    {webinar.endTime || "TBD"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Video size={20} />
                </div>
                <div>
                  <p className="text-xs font-normal text-slate-400 uppercase tracking-widest">
                    Platform
                  </p>
                  <p className="font-normal text-slate-900">
                    {getPlatformIcon(webinar.platform)} {webinar.platform}
                  </p>
                </div>
              </div>

            </div>

            {webinar.registrationOpen !== false ? (
              <Button
                href={`/webinars/${webinar.id}/register`}
                size="large"
                variant="primary"
                className="w-full mt-8"
                label="Register Now"
              />
            ) : (
              <div className="w-full mt-8 px-4 py-3.5 rounded-xl bg-slate-100 text-slate-500 text-center text-sm font-semibold border border-slate-200">
                Registrations Closed
              </div>
            )}

            <ShareButton title={webinar.title} />
          </div>

          <div
            className="bg-indigo-600 p-8 rounded-3xl shadow-lg text-white"
            data-reveal-block
          >
            <h4 className="font-medium text-xl mb-2">Need Help?</h4>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Have questions about the webinar or facing issues with
              registration? We&apos;re here to help.
            </p>
            <Link
              href="/contact"
              className="text-white font-medium underline decoration-white/30 hover:decoration-white transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      {webinar.registrationOpen !== false && (
        <FloatingRegisterButton
          registerUrl={`/webinars/${webinar.id}/register`}
          title={webinar.title}
          dateText={`${format(new Date(webinar.date), "MMMM d, yyyy")}${
            webinar.startTime ? ` • ${webinar.startTime}` : ""
          }`}
          subText="Upcoming Webinar"
        />
      )}
    </div>
  );
}
