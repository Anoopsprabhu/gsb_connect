import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
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

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="pt-24 pb-20">
        <RegistrationForm eventId={event.id} eventTitle={event.title} />
      </section>
    </div>
  );
}
