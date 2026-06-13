import type { ReactNode } from "react";
import {
  Target,
  Users,
  ArrowRight,
  ShieldCheck,
  Heart,
  Cpu,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 -skew-x-12 translate-x-1/4 -z-10" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">
              Community · Capital · Growth
            </p>
            <h1 className="text-6xl md:text-6xl font-medium text-slate-900 leading-[1.1] tracking-tight mb-8">
              GSB Startup{" "}
              <span className="text-indigo-600">Angels</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              An angel investment platform built by and for the GSB community —
              connecting founders, investors, mentors and industry leaders to
              fuel India&apos;s entrepreneurial decade.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-20">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl" />
              <h2 className="text-4xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                <Target className="text-indigo-600 w-10 h-10" />
                Our Purpose
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  <span className="font-bold text-slate-900">
                    Not creating unicorns. Creating a culture.
                  </span>
                </p>
                <p>
                  Our community possesses enormous intellectual and financial
                  capital. GSB Startup Angels is the organized platform that
                  finally connects it all.
                </p>
                <p className="pl-6 border-l-4 border-indigo-600 italic font-medium text-slate-800">
                  &ldquo;If our community misses this decade, we may miss a
                  generational opportunity.&rdquo;
                </p>
                <p>
                  India is entering a golden decade — and the GSB community is
                  positioned at the centre of it.
                </p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="GSB Startup Angels"
                width={480}
                height={480}
                className="object-contain w-full max-w-sm sm:max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                <Cpu className="text-indigo-400 w-8 h-8" />
                Our Model
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-10">
                Money alone does not build startups. The right guidance at the
                right time often matters more.
              </p>
              <div className="grid grid-cols-2 gap-4" data-stagger>
                {["Capital", "Mentorship", "Network", "Community"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <span className="font-semibold text-sm">{item}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                <Users className="text-indigo-400 w-8 h-8" />
                Who We Serve
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-10">
                Founders, investors, professionals, CXOs, academicians and
                community organisations — every member can contribute.
              </p>
              <div className="space-y-4" data-stagger>
                {[
                  "Founders seeking capital & mentorship",
                  "Investors building the ecosystem",
                  "Professionals offering expertise",
                  "Community leaders creating awareness",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-400/50 transition-all group"
                  >
                    <span className="font-semibold">{item}</span>
                    <ArrowRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
            What We Look For In Founders
          </h2>
          <div className="w-24 h-1.5 bg-indigo-600 mx-auto mt-6 rounded-full" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8" data-stagger>
            <ValueItem
              icon={<ShieldCheck />}
              title="Integrity"
              desc="Trust is the foundation of every investment relationship."
            />
            <ValueItem
              icon={<Heart />}
              title="Passion"
              desc="Founders who care deeply about the problem they are solving."
            />
            <ValueItem
              icon={<Cpu />}
              title="Domain Knowledge"
              desc="Deep understanding of the market and technology."
            />
            <ValueItem
              icon={<Users />}
              title="Coachability"
              desc="Open to mentorship and willing to learn from experience."
            />
            <ValueItem
              icon={<Globe />}
              title="Execution Capability"
              desc="The drive to turn vision into reality, fast."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueItem({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group text-center">
      <div className="w-20 h-20 bg-slate-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-indigo-200">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
