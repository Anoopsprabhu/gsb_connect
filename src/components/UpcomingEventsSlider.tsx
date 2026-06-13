"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import Button from "./Button";

export type UpcomingEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  imageUrl?: string | null;
  startTime?: string | null;
  registrationOpen?: boolean;
};

type UpcomingEventsSliderProps = {
  events: UpcomingEvent[];
};

export default function UpcomingEventsSlider({ events }: UpcomingEventsSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const count = events.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setDirection(index > current ? 1 : -1);
      setCurrent((index + count) % count);
    },
    [count, current],
  );

  const next = useCallback(() => {
    if (count === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [count, next]);

  if (count === 0) return null;

  const event = events[current];
  const eventDate = new Date(event.date);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-2">
              Upcoming Events
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Don&apos;t miss what&apos;s next
            </h2>
          </div>
          <Link
            href="/events?timeline=upcoming"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
          >
            View all events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-lg border border-slate-100">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={event.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] sm:min-h-[380px]"
              >
                <div className="relative h-52 sm:h-64 lg:h-auto min-h-[220px] bg-slate-200">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-amber-50 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-indigo-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-sm">
                    {event.type}
                  </span>
                </div>

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {format(eventDate, "EEEE, MMM d, yyyy")}
                      {event.startTime ? ` · ${event.startTime}` : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      {event.location}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    <Button href={`/events/${event.id}`} variant="primary" size="large">
                      Event Details
                    </Button>
                    {event.registrationOpen !== false && (
                      <Button
                        href={`/events/${event.id}/register`}
                        variant="outline"
                        size="large"
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous event"
                className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next event"
                className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {events.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Go to event ${index + 1}`}
                    onClick={() => goTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-8 bg-indigo-600"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
