"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.92 && rect.bottom > vh * 0.08;
}

function cleanupReveal() {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-visible");
    (el as HTMLElement).style.removeProperty("--reveal-delay");
  });
}

function setupReveal() {
  cleanupReveal();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "-4% 0px -4% 0px" },
  );

  const targets: Element[] = [];

  document.querySelectorAll("main section, footer").forEach((el) => {
    if (el.closest("[data-reveal-off]")) return;
    el.setAttribute("data-reveal", "section");
    targets.push(el);
  });

  document.querySelectorAll("[data-stagger]").forEach((container) => {
    Array.from(container.children).forEach((child, index) => {
      child.setAttribute("data-reveal", "item");
      (child as HTMLElement).style.setProperty(
        "--reveal-delay",
        `${index * 0.07}s`,
      );
      targets.push(child);
    });
  });

  document.querySelectorAll("[data-reveal-block]").forEach((el) => {
    el.setAttribute("data-reveal", "block");
    targets.push(el);
  });

  targets.forEach((el) => {
    if (isInViewport(el)) {
      el.classList.add("is-visible");
    }
    observer.observe(el);
  });

  return observer;
}

export default function ScrollRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let debounceTimer: number;

    const init = () => {
      observer?.disconnect();
      observer = setupReveal();
    };

    const raf = window.requestAnimationFrame(init);

    const mutationObserver = new MutationObserver(() => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(init, 150);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(raf);
      observer?.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(debounceTimer);
      cleanupReveal();
    };
  }, [pathname]);

  return <>{children}</>;
}
