"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";
import { SPRING_SNAPPY } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Touch browsers fire synthetic mousemove on tap, which would shift the
  // element and leave it stuck (no mouseleave follows). Only react on
  // devices with a real hover-capable fine pointer.
  const enabled = useRef(false);
  const x = useSpring(0, SPRING_SNAPPY);
  const y = useSpring(0, SPRING_SNAPPY);

  useEffect(() => {
    enabled.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !enabled.current) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
