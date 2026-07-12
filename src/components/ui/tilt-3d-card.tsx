"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep small (2–6) — this is depth, not a gimmick. */
  maxTilt?: number;
  /** Set false to keep the glare/glow highlight off (e.g. on busy surfaces). */
  glare?: boolean;
  disabled?: boolean;
}

/**
 * Perspective tilt-on-hover wrapper. Pure CSS transform driven by springs —
 * no 3D library. Skips itself entirely for reduced-motion users; hover
 * doesn't exist on touch devices so coarse pointers are unaffected.
 */
export function Tilt3DCard({
  children,
  className,
  maxTilt = 4,
  glare = true,
  disabled = false,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useSpring(0, SPRING_SOFT);
  const rotateY = useSpring(0, SPRING_SOFT);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, SPRING_SOFT);

  const glareBackground = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)`;

  const inactive = disabled || prefersReducedMotion;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || inactive) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * maxTilt);
    rotateX.set((0.5 - py) * 2 * maxTilt);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: inactive ? 0 : rotateX,
        rotateY: inactive ? 0 : rotateY,
        transformPerspective: 900,
      }}
      className={cn("relative", className)}
    >
      {children}
      {glare && !inactive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  );
}
