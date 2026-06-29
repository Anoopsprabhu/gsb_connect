"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Button from "./Button";

const staticSlides = [
  {
    id: 1,
    eyebrow: "Community · Capital · Growth",
    title: "GSB Startup Angels",
    subtitle: "Funding Dreams. Building the Next Generation of Founders.",
    description:
      "An angel investment platform built by and for the GSB community — connecting founders, investors, mentors and industry leaders to fuel India's entrepreneurial decade.",
    primaryCta: "Apply as Founder",
    primaryHref: "/register/startup",
    secondaryCta: "Join as Investor",
    secondaryHref: "/contact",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop",
    color: "from-amber-500/30 to-yellow-600/20",
  },
  {
    id: 2,
    eyebrow: "Our Purpose",
    title: "Not creating unicorns. Creating a culture.",
    subtitle: "",
    description:
      "Our community possesses enormous intellectual and financial capital. GSB Startup Angels is the organized platform that finally connects it all. India is entering a golden decade — and the GSB community is positioned at the centre of it.",
    primaryCta: "Apply as Founder",
    primaryHref: "/register/startup",
    secondaryCta: "Learn More",
    secondaryHref: "/about",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop",
    color: "from-yellow-500/25 to-amber-600/20",
  },
  {
    id: 3,
    eyebrow: "The Vision",
    title: "Ready to walk with us?",
    subtitle: "",
    description:
      "Ten years from now, we will remember that our community came together and created an entrepreneurial movement — a self-sustaining ecosystem where successful founders recycle their capital and experience into the generation that follows them.",
    primaryCta: "Apply as Founder",
    primaryHref: "/register/startup",
    secondaryCta: "Join as Investor",
    secondaryHref: "/contact",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1470&auto=format&fit=crop",
    color: "from-amber-400/25 to-yellow-700/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

type WebinarData = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string | null;
  imageUrl: string | null;
};

export default function HeroCarousel({ latestWebinar }: { latestWebinar?: WebinarData | null }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const dynamicSlide = latestWebinar ? {
    id: `webinar-${latestWebinar.id}`,
    eyebrow: "Upcoming Webinar",
    title: `${latestWebinar.title} • ${new Date(latestWebinar.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${latestWebinar.startTime ? `, ${latestWebinar.startTime}` : ""}`,
    subtitle: "Learn, Network, and Grow",
    description: latestWebinar.description || "Don't miss out on our latest insights and strategies from industry leaders.",
    primaryCta: "Register Now",
    primaryHref: `/webinars/${latestWebinar.id}`,
    secondaryCta: "All Webinars",
    secondaryHref: "/webinars",
    image: latestWebinar.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
    color: "from-indigo-600/30 to-blue-500/20",
  } : {
    id: 'fallback-webinar',
    eyebrow: "Webinars",
    title: "Join Our Latest Webinars",
    subtitle: "Learn from industry experts",
    description: "Check out our webinars page to find upcoming sessions and masterclasses.",
    primaryCta: "View Webinars",
    primaryHref: "/webinars",
    secondaryCta: "Learn More",
    secondaryHref: "/about",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
    color: "from-indigo-600/30 to-blue-500/20",
  };

  const slides = [dynamicSlide, ...staticSlides];

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[current];

  return (
    <section
      data-reveal-off
      className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-black isolate"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`bg-${current}`}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 } }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 8, ease: "linear" }}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-45"
              priority={current === 0}
            />
          </motion.div>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-overlay`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" /> */}
        </motion.div>
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-start pt-20 sm:pt-24 pb-28 sm:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={textVariants} className="mb-5">
              <span className="inline-flex items-center gap-3 text-amber-400 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400 animate-shimmer" />
                {slide.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={textVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-[1.1] tracking-tight"
            >
              {slide.title}
            </motion.h1>

            {slide.subtitle && (
              <motion.p
                variants={textVariants}
                className="mt-5 text-xl md:text-2xl lg:text-3xl text-amber-200/90 font-medium leading-snug"
              >
                {slide.subtitle}
              </motion.p>
            )}

            <motion.p
              variants={textVariants}
              className="mt-6 text-base md:text-lg text-slate-300/90 max-w-2xl leading-relaxed"
            >
              {slide.description}
            </motion.p>

            <motion.div
              variants={textVariants}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Button
                href={slide.primaryHref}
                size="large"
                variant="primary"
                icon={
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                }
                className="group w-full sm:w-auto justify-center shadow-lg shadow-amber-900/30"
              >
                {slide.primaryCta}
              </Button>
              <Button
                href={slide.secondaryHref}
                size="large"
                variant="outline"
                className="w-full sm:w-auto justify-center bg-white/5 text-white backdrop-blur-md border-amber-400/40 hover:bg-amber-400/15"
              >
                {slide.secondaryCta}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6 z-20 max-w-full px-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          className="p-2.5 sm:p-3 rounded-full border border-amber-400/30 text-white hover:bg-amber-400/15 transition-colors backdrop-blur-sm shrink-0"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </motion.button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
              style={{ width: current === idx ? 36 : 10 }}
            >
              <span className="absolute inset-0 bg-white/25 rounded-full" />
              {current === idx && (
                <motion.span
                  layoutId="hero-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="p-2.5 sm:p-3 rounded-full border border-amber-400/30 text-white hover:bg-amber-400/15 transition-colors backdrop-blur-sm shrink-0"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-amber-400/70 hover:text-amber-400 transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  );
}
