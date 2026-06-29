"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isAbout = pathname === "/about";
  const isTeam = pathname === "/team";
  const isContact = pathname === "/contact";
  const isEvents = pathname === "/events" || pathname.startsWith("/events/");
  const isWebinars = pathname === "/webinars" || pathname.startsWith("/webinars/");
  const isGallery = pathname === "/gallery";
  const isRegister = pathname.includes("/register");
  const isHome = pathname === "/";

  const useScrolledStyle =
    isScrolled ||
    isAbout ||
    isTeam ||
    isContact ||
    isRegister ||
    isEvents ||
    isWebinars ||
    isGallery;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Events", href: "/events" },
    { name: "Webinars", href: "/webinars" },
    { name: "Gallery", href: "/gallery" },
    { name: "About Us", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <div className="fixed top-3 sm:top-4 md:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 md:px-0">
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={`w-full md:w-[95%] lg:w-[92%] py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-500 border overflow-visible ${useScrolledStyle || isMenuOpen
              ? "bg-white/95 shadow-md border-slate-200 backdrop-blur-xl"
              : "bg-white/10 backdrop-blur-xl border-white/20 shadow-none"
            }`}
        >
          <div className="container mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 h-[52px] sm:h-[56px] overflow-visible">
            <Link href="/" className="flex items-center shrink-0 group relative -my-3 sm:-my-4">
              <img
                src="/images/logo.png"
                alt="GSB"
                className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] md:w-[104px] md:h-[104px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <nav
              className={`hidden md:flex items-center gap-6 lg:gap-7 text-sm font-semibold transition-colors ${useScrolledStyle || !isHome ? "text-slate-600" : "text-white/90"
                }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-indigo-500 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-3">
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <button
                      className={`text-sm font-bold px-3.5 py-2 rounded-lg transition-all ${useScrolledStyle
                          ? "text-indigo-600 hover:bg-indigo-50"
                          : "text-white hover:bg-white/10"
                        }`}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                )}
                <Button
                  href="/contact"
                  variant={useScrolledStyle ? "primary" : "white"}
                  label="Join Community"
                  className="!px-5 !py-2.5 !text-sm"
                />
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className={`md:hidden p-2 transition-colors rounded-lg ${useScrolledStyle || isMenuOpen
                    ? "text-slate-700"
                    : "text-white"
                  }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </motion.header>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="absolute top-[4.25rem] sm:top-[4.75rem] left-3 right-3 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-3 px-4 rounded-xl text-base font-semibold transition-colors ${pathname === link.href
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                {isSignedIn ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                    <UserButton />
                    <span className="text-slate-700 font-semibold text-sm">
                      My Account
                    </span>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="w-full py-3.5 rounded-xl text-base font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                )}
                <Button
                  href="/contact"
                  variant="primary"
                  className="w-full py-3.5"
                  label="Join Community"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
