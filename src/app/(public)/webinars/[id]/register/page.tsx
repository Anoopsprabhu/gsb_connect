import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import WebinarRegistrationForm from "@/components/WebinarRegistrationForm";

async function getWebinar(id: string) {
  try {
    const webinar = await prisma.webinar.findUnique({
      where: { id },
      select: { id: true, title: true, registrationOpen: true },
    });
    return webinar;
  } catch (error) {
    console.error("Failed to fetch webinar:", error);
    return null;
  }
}

export default async function WebinarRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let webinar = await getWebinar(id);

  if (!webinar) {
    // Fallback mock data for development
    const mockWebinars = [
      { id: "w1", title: "Fundraising Masterclass: Seed to Series A", registrationOpen: true },
      { id: "w2", title: "Building Products that Scale", registrationOpen: true },
      { id: "w3", title: "Legal Essentials for Indian Startups", registrationOpen: true },
    ];

    const mockWebinar = mockWebinars.find((w) => w.id === id);
    if (!mockWebinar) return notFound();
    webinar = mockWebinar;
  }

  if (!webinar) return notFound();

  if (!webinar.registrationOpen) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
          Registrations Closed
        </h2>
        <p className="text-lg text-slate-600 mb-10">
          Registration for this webinar is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-slate-50 min-h-screen">
      <WebinarRegistrationForm
        webinarId={webinar.id}
        webinarTitle={webinar.title}
      />
    </div>
  );
}
