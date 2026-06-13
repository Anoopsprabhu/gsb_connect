import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Users, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Team | GSB Connect",
  description:
    "Meet the dedicated team behind GSB Connect, working to empower and connect our community.",
};

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  publicId: string | null;
  bio: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

async function getTeam(): Promise<TeamMember[]> {
  try {
    return await (prisma.teamMember.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
    }) as any);
  } catch (error) {
    console.error("Failed to fetch team:", error);
    return [];
  }
}

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden" data-reveal-off>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#fff7ed_0%,transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6">
              <Users size={16} />
              <span>Our Visionaries</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-medium text-slate-900 leading-tight mb-6">
              The People Behind{" "}
              <span className="text-indigo-600">GSB Connect</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our team is a diverse group of passionate individuals dedicated to
              fostering community, innovation, and cultural heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-stagger>
              {team.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <Users className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Social links (placeholders for now) */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      {/* <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all">
                        <Linkedin size={18} />
                      </button> */}
                      <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all">
                        <Mail size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center px-2 pb-2">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-indigo-600 mb-4 uppercase tracking-wider">
                      {member.designation}
                    </p>
                    {member.bio && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">
                No team members found
              </h3>
              <p className="text-slate-500">
                The team list is currently being updated. Please check back
                later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
            Want to Join Our Mission?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to
            contribute to the growth and development of our community.
          </p>
          {/* <a
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all group"
          >
            Get In Touch
            <Linkedin className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a> */}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-50 -z-10" />
      </section>
    </div>
  );
}
