"use client";

const ExperienceSection = () => {
  const pillars = [
    {
      label: "Capital",
      desc: "Seed and angel investments from a network of committed community investors. Fast evaluation, structured process.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Mentorship",
      desc: "Access to seasoned entrepreneurs, CXOs and domain experts who've navigated what founders are about to face.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Network",
      desc: "Warm introductions to customers, partners, advisors and industry leaders — the connections that accelerate growth.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Community",
      desc: "A trusted, vetted platform built on shared values — integrity, coachability and a genuine desire to see each other succeed.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  const participants = [
    {
      label: "Founders",
      desc: "Bring your ideas, your execution energy and your vision. We will bring the capital, mentorship and network to support you.",
    },
    {
      label: "Investors",
      desc: "Provide capital through the structured angel investment committee. Small or large — every cheque builds the ecosystem.",
    },
    {
      label: "Professionals",
      desc: "Offer your functional expertise — legal, finance, tech, marketing — to founders who need guidance at critical junctures.",
    },
    {
      label: "CXOs",
      desc: "Open doors. A warm introduction from a trusted CXO can mean a first enterprise customer or a key partnership.",
    },
    {
      label: "Academicians",
      desc: "Mentor students, validate research-led ventures and help the next generation learn what classrooms cannot teach.",
    },
    {
      label: "Community Organisations",
      desc: "Create awareness, host events, and ensure every corner of the GSB community knows this platform exists for them.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-100 rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-100 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 space-y-16 sm:space-y-24 md:space-y-28">
        <div>
          <div className="max-w-2xl mb-16">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">
              Our Model
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-slate-900 leading-tight mb-4">
              Money alone does not build startups.
            </h2>
            <p className="text-slate-500 text-lg">
              The right guidance at the right time often matters more. Our
              four-pillar model delivers both.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" data-stagger>
            {pillars.map((item, i) => (
              <div
                key={i}
                className="group relative bg-slate-50 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-indigo-600 font-bold text-sm">
                      {i + 1}.
                    </span>
                    <h3 className="text-2xl font-medium text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="max-w-2xl mb-16">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">
              How to Participate
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-slate-900 leading-tight mb-4">
              Every member can contribute.
            </h2>
            <p className="text-slate-500 text-lg">
              Not just with money. Knowledge, relationships and goodwill are as
              valuable as capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-stagger>
            {participants.map((item, i) => (
              <div
                key={i}
                className="group bg-slate-50 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 h-full"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {item.label}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
