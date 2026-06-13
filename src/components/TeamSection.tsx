"use client";

import Button from "./Button";

const TeamSection = () => {
  const targets = [
    { value: "100", label: "Startups Funded" },
    { value: "1000s", label: "Jobs Created" },
    { value: "∞", label: "Capital Recycled" },
  ];

  return (
    <section className="py-16 sm:py-24 md:py-28 bg-white text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-indigo-50/80 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-1">
          <p className="text-indigo-600 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">
            The Vision
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-snug">
            Ten years from now, we will remember that our community came together
            and created an entrepreneurial movement.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            The goal is not a headline. It is a self-sustaining ecosystem — where
            successful founders recycle their capital and experience into the
            generation that follows them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-14 sm:mb-20" data-stagger>
          {targets.map((target, i) => (
            <div
              key={i}
              className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 shadow-sm"
            >
              <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-2">
                {target.value}
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 font-semibold">
                {target.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto px-1">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
            Ready to walk with us?
          </h3>
          <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            If you are a founder, come forward. If you are an investor, join us.
            If you believe in the future of our community — walk with us.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              href="/register/startup"
              size="large"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Apply as Founder
            </Button>
            <Button
              href="/contact"
              size="large"
              variant="outline"
              className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-50"
            >
              Join as Investor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
