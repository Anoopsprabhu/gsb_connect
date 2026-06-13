"use client";

const objectives = [
  "Encourage entrepreneurship within the community and create successful founders and job creators.",
  "Support innovation and technology as drivers of ethical wealth creation.",
  "Build a self-sustaining ecosystem where today's founders become tomorrow's mentors.",
  "Connect the community's intellectual capital with its financial capital — systematically.",
  "Demonstrate that when intent is strong, execution can move fast.",
];

const highlights = [
  { value: "2 weeks", label: "First investments shortlisted" },
  { value: "100+", label: "Target startups to fund" },
  { value: "∞", label: "Community potential" },
];

const sectors = [
  "Capital",
  "Mentorship",
  "Network",
  "Community",
  "AI & Deep Tech",
  "FinTech",
  "HealthTech",
  "SaaS",
  "Nation Building",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-14 sm:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <div>
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              Our Purpose
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
              Not creating unicorns. Creating a culture.
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our community possesses enormous intellectual and financial capital.
              GSB Startup Angels is the organized platform that finally connects
              it all.
            </p>
            <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-slate-700 mb-8 font-medium">
              &ldquo;If our community misses this decade, we may miss a generational
              opportunity.&rdquo;
            </blockquote>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              AI is disrupting industries. Traditional jobs are evolving. Capital is
              more accessible than ever, and building a startup has never been
              cheaper. India is entering a golden decade — and the GSB community is
              positioned at the centre of it.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-4">Objectives</h3>
            <ul className="space-y-4" data-stagger>
              {objectives.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-6">
                Highlights
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-stagger>
                {highlights.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 sm:p-5 rounded-xl shadow-sm text-center border border-transparent hover:border-indigo-100 transition-colors duration-300"
                  >
                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold leading-snug">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2" data-stagger>
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-semibold border border-indigo-100"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
