"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-border/60">
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-accent shadow-[0_0_12px_var(--accent)]"
      />
    </div>
  );
}
