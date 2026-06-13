"use client";

import Link from "next/link";
import { Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-navy text-white pt-14 sm:pt-16 pb-8 overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3rem] md:rounded-t-[4rem]">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/30 rounded-full blur-2xl -ml-24 -mb-24" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-12 mb-10 sm:mb-12">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-4 mb-5 group">
              <img
                src="/images/logo.png"
                alt="GSB Startup Angels"
                className="w-[114px] h-[114px] object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <span className="block font-bold text-lg sm:text-xl tracking-tight leading-tight">
                  GSB Startup Angels
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  Community · Capital · Growth
                </span>
              </div>
            </Link>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Building a culture of entrepreneurship within the GSB community
              — one founder at a time.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16 md:gap-24">
            <div>
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-3">
                {["Home", "Events", "Gallery", "About Us", "Contact"].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href={
                          link === "Home"
                            ? "/"
                            : `/${link.toLowerCase().replace(" ", "")}`
                        }
                        className="text-slate-300 hover:text-brand-gold transition-colors text-sm font-medium"
                      >
                        {link}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="flex flex-col gap-3">
                {["Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/ /g, "-")}`}
                      className="text-slate-300 hover:text-brand-gold transition-colors text-sm font-medium"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="py-8 border-y border-white/10 mb-8">
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
            Get in Touch
          </h3>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-16">
            <div className="flex items-start gap-3 text-sm max-w-xs md:max-w-sm">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <span className="text-slate-200 leading-snug">
                No7, VijayNest, 2nd floor, 14th A Cross, Malleshwaram,
                Bangalore-560003
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-brand-gold shrink-0" />
              <a
                href="mailto:contact@gsbstartupangels.com"
                className="text-slate-200 hover:text-white transition-colors break-all"
              >
                contact@gsbstartupangels.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-5 h-5 text-brand-gold shrink-0" />
              <a
                href="https://gsbstartupangels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-white transition-colors"
              >
                gsbstartupangels.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {currentYear} GSB Startup Angels. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            Designed &amp; Developed by{" "}
            <a
              href="https://foxwel.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold hover:text-brand-gold transition-colors flex items-center gap-1"
            >
              Foxwel.AI
              <Globe size={14} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
