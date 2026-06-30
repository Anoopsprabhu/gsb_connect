"use client";

import { useEffect, useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import Button from "./Button";

interface FloatingRegisterButtonProps {
  registerUrl: string;
  title: string;
  dateText: string;
  subText: string;
}

export default function FloatingRegisterButton({
  registerUrl,
  title,
  dateText,
  subText,
}: FloatingRegisterButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed z-[100] transition-all duration-300 ease-out transform
        bottom-6 left-4 right-4
        sm:left-1/2 sm:right-auto sm:-translate-x-1/2
        lg:left-auto lg:translate-x-0 lg:right-8 lg:bottom-8
        ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
        }`}
    >
      <div className="w-auto max-w-xl sm:min-w-[450px] bg-white/90 backdrop-blur-lg border border-slate-200/80 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-4 flex items-center justify-between gap-6">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600 truncate">
            {subText}
          </span>
          <h4 className="text-slate-900 font-semibold text-sm sm:text-base truncate leading-snug mt-0.5">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
            <Calendar size={12} className="text-slate-400" />
            <span className="truncate">{dateText}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            href={registerUrl}
            variant="primary"
            size="normal"
            className="shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm font-semibold !py-2.5 px-5"
            iconPosition="right"
            label="Register Now"
          />
        </div>
      </div>
    </div>
  );
}
