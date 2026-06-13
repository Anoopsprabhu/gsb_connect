"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 0, y: 40 },
  right: { x: 0, y: 40 },
  none: { x: 0, y: 0 },
};

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.65,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-8%" });
  const offset = offsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offset.y }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: offset.y }
      }
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function StaggerItem({ children, index, className }: StaggerItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.55,
        delay: isInView ? index * 0.06 : 0,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={
        isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
      }
      transition={{ duration: 0.5, ease }}
      className={className}
    >
      {value}
    </motion.span>
  );
}
