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
  Tag,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Button from "@/components/Button";

async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let event = await getEvent(id);

  if (!event) {
    const mockEvents = [
      {
        id: "1",
        title: "Innovators & Heritage Workshop",
        description:
          "Explore the intersection of traditional practices and modern technology in this interactive workshop.",
        about:
          "This comprehensive workshop aims to bring together traditional artisans and modern technology innovators. Over the course of the day, participants will engage in hands-on sessions, panel discussions, and networking opportunities.",
        date: new Date(Date.now() + 86400000 * 5),
        location: "GSB Connect Center, Main Hall",
        type: "workshop",
        imageUrl: null,
        speakers: "Dr. Anoop Prabhu",
        featured: "Mr. Ratan Tata, Dr. Sudha Murty",
        roadmap: [
          { time: "09:00 AM", activity: "Registration & Welcome Tea" },
          { time: "10:00 AM", activity: "Keynote: The Future of Heritage" },
        ],
      },
      {
        id: "2",
        title: "Tech Meets Tradition Hackathon",
        description:
          "A 48-hour hackathon aimed at building technological solutions that preserve and promote cultural heritage.",
        about:
          "Join us for an intensive 48-hour session where technology meets culture. Developers, designers, and cultural enthusiasts will collaborate to build innovative solutions.",
        date: new Date(Date.now() + 86400000 * 12),
        location: "Innovation Hub",
        type: "hackathon",
        imageUrl: null,
        speakers: "Alan Turing",
        featured: "Grace Hopper",
      },
      {
        id: "3",
        title: "Community Networking Mixer",
        description:
          "Connect with mentors, students, and professionals in a relaxed, culturally rich environment.",
        about:
          "An informal evening of connection and conversation. Perfect for professionals looking to mentor the next generation or students seeking career advice.",
        date: new Date(Date.now() + 86400000 * 20),
        location: "The Rooftop Lounge",
        type: "networking",
        imageUrl: null,
      },
      {
        id: "4",
        title: "Annual Cultural Fest",
        description:
          "A grand celebration of our heritage featuring art, music, food, and traditions from diverse communities.",
        about:
          "Our biggest event of the year! Experience the sights, sounds, and tastes of our diverse heritage in this day-long celebration.",
        date: new Date(Date.now() + 86400000 * 45),
        location: "City Convention Center",
        type: "cultural",
        imageUrl: null,
      },
    ];

    const mockEvent = mockEvents.find((e) => e.id === id);
    if (!mockEvent) return notFound();

    event = mockEvent as any;
  }

  // Final safeguard for TypeScript narrowing
  if (!event) return notFound();

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "workshop":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "networking":
        return "bg-green-50 text-green-700 border-green-100";
      case "hackathon":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "cultural":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[45vh] lg:h-[60vh] min-h-[400px] lg:min-h-[500px] w-full overflow-hidden bg-slate-900" data-reveal-off>
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <Link
            href="/events"
            className="absolute top-28 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-6xl font-medium text-white max-w-4xl leading-tight tracking-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base mt-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" />
                <span>
                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-indigo-400" />
                <span>{event.type}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
              <AlignLeft className="w-6 h-6 text-indigo-600" />
              About This Event
            </h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-600 text-md leading-relaxed whitespace-pre-line">
                {event.about || event.description}
              </p>
            </div>
          </section>

          {/* Roadmap Section */}
          {event.roadmap &&
            Array.isArray(event.roadmap) &&
            event.roadmap.length > 0 && (
              <section>
                <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  Event Roadmap
                </h2>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                    {event.roadmap.map((item: any, idx: number) => (
                      <div key={idx} className="relative pl-12">
                        <div className="absolute left-0 top-1 w-9 h-9 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center z-10">
                          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                        </div>
                        <div>
                          <span className="text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2 inline-block">
                            {item.time}
                          </span>
                          <h4 className="text-lg font-normal text-slate-900">
                            {item.activity}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          {/* Speakers Section */}
          {(event.speakers || event.featured) && (
            <div className="space-y-12">
              {/* Featured Speakers (event.featured) */}
              {event.featured && (
                <section>
                  <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    Featured Speakers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-stagger>
                    {event.featured
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
                              Featured Guest
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Main Speakers (event.speakers) */}
              {event.speakers && (
                <section>
                  <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-slate-600" />
                    </div>
                    Event Speakers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-stagger>
                    {event.speakers
                      .split(",")
                      .map((speaker: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all group"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center font-bold text-2xl transition-colors">
                            {speaker.trim().charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {speaker.trim()}
                            </h4>
                            <p className="text-sm text-slate-500">
                              Main Speaker
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Location / Map Section */}
          {event.mapUrl && (
            <section>
              <h2 className="text-2xl font-medium text-slate-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-indigo-600" />
                Event Location
              </h2>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 h-[400px] overflow-hidden">
                <iframe
                  src={
                    event.mapUrl.includes("<iframe")
                      ? event.mapUrl.match(/src="([^"]+)"/)?.[1] || ""
                      : event.mapUrl
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100" data-reveal-block>
            <h3 className="text-xl font-medium text-slate-900 mb-6 pb-6 border-b border-slate-100">
              Event Details
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
                    {format(new Date(event.date), "MMMM d, yyyy")}
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
                    {event.startTime || "Check Details"} -{" "}
                    {event.endTime || "TBD"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-normal text-slate-400 uppercase tracking-widest">
                    Venue
                  </p>
                  <p className="font-normal text-slate-900">{event.location}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-xs font-normal text-slate-400 uppercase tracking-widest">
                    Category
                  </p>
                  <p className="font-normal text-slate-900 capitalize">
                    {event.type}
                  </p>
                </div>
              </div>
            </div>

            {event.registrationOpen !== false ? (
              <Button
                href={`/events/${event.id}/register`}
                size="large"
                variant="primary"
                className="w-full mt-8"
                label="Register for Event"
              />
            ) : (
              <div className="w-full mt-8 px-4 py-3.5 rounded-xl bg-slate-100 text-slate-500 text-center text-sm font-semibold border border-slate-200">
                Registrations Closed
              </div>
            )}

            <Button
              variant="outline"
              size="large"
              className="w-full mt-3"
              icon={<Share2 size={18} />}
              label="Share Event"
            />
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg text-white" data-reveal-block>
            <h4 className="font-medium text-xl mb-2">Need Help?</h4>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              If you have any questions regarding the event or registration
              process, please feel free to contact us.
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
    </div>
  );
}

function AlignLeft(props: any) {
  return (
    <svg
      {...props}
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
  );
}
