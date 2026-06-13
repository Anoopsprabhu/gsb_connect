import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RegisterPage({ params }: Props) {
  const id = (await params).id;
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  if (!event.registrationOpen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Registrations Closed</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Registration for <span className="font-semibold">{event.title}</span> is
            currently closed. Please check back later or contact us for assistance.
          </p>
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="pt-24 pb-20">
        <RegistrationForm eventId={event.id} eventTitle={event.title} />
      </section>
    </div>
  );
}
