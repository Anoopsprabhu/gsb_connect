"use client";

const industries = [
  "Artificial Intelligence",
  "SaaS",
  "Deep Tech",
  "Cybersecurity",
  "HealthTech",
  "FinTech",
  "AgriTech",
  "ClimateTech",
  "Manufacturing Innovation",
];

const founderTraits = [
  "Integrity",
  "Passion",
  "Domain Knowledge",
  "Coachability",
  "Execution Capability",
];

const FeaturedEventsSection = () => {
  return (
    <section className="py-14 sm:py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 space-y-24">
        <div>
          <div className="max-w-2xl mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              Sectors We Back
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              We invest in founders first. Ideas second.
            </h2>
            <p className="text-slate-600 text-lg">
              Our focus spans the industries reshaping India&apos;s economy over
              the next decade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-stagger>
            {industries.map((industry) => (
              <div
                key={industry}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group h-full"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 mb-3 sm:mb-4 group-hover:bg-indigo-400 transition-colors" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {industry}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="max-w-2xl mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              What We Look For In Founders
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              The qualities that matter most
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" data-stagger>
            {founderTraits.map((trait) => (
              <div
                key={trait}
                className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-100 to-amber-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-base sm:text-lg group-hover:from-indigo-600 group-hover:to-amber-500 group-hover:text-white transition-all duration-300">
                  {trait.charAt(0)}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{trait}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;
