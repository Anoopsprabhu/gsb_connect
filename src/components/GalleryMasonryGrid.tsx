"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  altText: string | null;
  imageUrl: string;
};

type GalleryMasonryGridProps = {
  items: GalleryItem[];
};

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_COUNT = 12;

const aspectRatioClasses = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[5/6]",
  "aspect-square",
  "aspect-[4/6]",
  "aspect-[16/10]",
];

export default function GalleryMasonryGrid({ items }: GalleryMasonryGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const remainingCount = Math.max(items.length - visibleCount, 0);
  const hasMore = remainingCount > 0;

  // Handle escape key for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItemIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIndex]);

  const handleNext = () => {
    setSelectedItemIndex((prev) => 
      prev === null ? null : (prev + 1) % items.length
    );
  };

  const handlePrev = () => {
    setSelectedItemIndex((prev) => 
      prev === null ? null : (prev - 1 + items.length) % items.length
    );
  };

  return (
    <div className="relative">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 [column-gap:1.5rem]" data-stagger>
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => (
            <article
              key={item.id}
              className="group relative mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl hover:ring-indigo-200"
              onClick={() => setSelectedItemIndex(index)}
            >
              <div
                className={`relative overflow-hidden ${
                  aspectRatioClasses[index % aspectRatioClasses.length]
                }`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Icon indicator */}
                <div className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <Maximize2 className="w-5 h-5" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h2 className="text-lg font-bold text-white line-clamp-1">{item.title}</h2>
                  {item.caption && (
                    <p className="mt-1 text-sm text-slate-200 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <Button
            onClick={() =>
              setVisibleCount((currentCount) =>
                Math.min(currentCount + LOAD_MORE_COUNT, items.length)
              )
            }
            variant="indigo"
            size="large"
            className="group px-10"
            icon={<ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
          >
            Load More Moments
          </Button>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItemIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setSelectedItemIndex(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed top-6 right-6 z-[110] h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItemIndex(null);
              }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation */}
            <button
              className="fixed left-4 md:left-10 z-[110] h-14 w-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors hidden md:flex"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className="fixed right-4 md:right-10 z-[110] h-14 w-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors hidden md:flex"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[16/10] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={items[selectedItemIndex].imageUrl}
                  alt={items[selectedItemIndex].altText || items[selectedItemIndex].title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="mt-8 text-center max-w-2xl px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {items[selectedItemIndex].title}
                </h2>
                {items[selectedItemIndex].caption && (
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    {items[selectedItemIndex].caption}
                  </p>
                )}
                
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium uppercase tracking-widest">
                  <span>{selectedItemIndex + 1}</span>
                  <div className="w-8 h-px bg-slate-800" />
                  <span>{items.length}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
