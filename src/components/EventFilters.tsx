"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventFiltersProps {
  categories: string[];
}

export default function EventFilters({ categories }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const selectedTypes = searchParams.get("type")?.split(",") || [];
  const selectedTimeline = searchParams.get("timeline") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleTypeChange = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    const value = newTypes.join(",");
    startTransition(() => {
      router.push(`?${createQueryString("type", value)}`, { scroll: false });
    });
  };

  const handleTimelineChange = (timeline: string) => {
    startTransition(() => {
      router.push(`?${createQueryString("timeline", timeline)}`, { scroll: false });
    });
  };

  return (
    <div className={`bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24 transition-opacity z-30 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between md:cursor-default group"
      >
        <h3 className="font-bold text-slate-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Filter size={16} />
          </div>
          Filter Events
        </h3>
        <div className="md:hidden text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-6 md:mt-0 pt-0 md:pt-4`}>
        <div className="hidden md:block h-px bg-slate-100 w-full mb-6" />
      
      {/* Categories Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Categories
        </h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={selectedTypes.length === 0}
            onChange={() => {
               startTransition(() => {
                router.push(`?${createQueryString("type", "")}`, { scroll: false });
              });
            }}
          />
          <span className={`text-sm transition-colors ${selectedTypes.length === 0 ? 'text-indigo-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
            All Categories
          </span>
        </label>
        {categories.map((type) => (
          <label
            key={type}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              checked={selectedTypes.includes(type.toLowerCase())}
              onChange={() => handleTypeChange(type.toLowerCase())}
            />
            <span className={`text-sm transition-colors ${selectedTypes.includes(type.toLowerCase()) ? 'text-indigo-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
              {type}
            </span>
          </label>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Timeline
        </h4>
        <div className="space-y-3">
          {[
            { label: "All Events", value: "all" },
            { label: "Upcoming", value: "upcoming" },
            { label: "Past", value: "past" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="timeline"
                className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                checked={selectedTimeline === item.value}
                onChange={() => handleTimelineChange(item.value)}
              />
              <span className={`text-sm transition-colors ${selectedTimeline === item.value ? 'text-indigo-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}
