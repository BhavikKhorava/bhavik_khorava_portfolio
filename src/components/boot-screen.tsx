"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const BOOT_LINES = [
  { text: "$ ssh bhavik@portfolio.dev", delay: 0 },
  { text: "connecting to remote_host... OK", delay: 120 },
  { text: "$ initializing_portfolio --env=production", delay: 120 },
  { text: "loading modules: experience, projects, tech_stack... OK", delay: 260 },
  { text: "mounting AI layer: openai, vector-db... OK", delay: 260 },
  { text: "$ whoami", delay: 200 },
  { text: "bhavik_khorava — node.js backend developer", delay: 260 },
  { text: "SYSTEM_ONLINE", delay: 340 },
];

const STORAGE_KEY = "portfolio_booted_v1";

// This component is only ever mounted client-side (see the `dynamic(..., { ssr: false })`
// export below), so it's safe to read sessionStorage/matchMedia in the lazy initializer —
// it never runs during server rendering.
function getInitialBootState() {
  const alreadyBooted = sessionStorage.getItem(STORAGE_KEY);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const skip = Boolean(alreadyBooted || prefersReducedMotion);
  return { visible: !skip, done: skip };
}

function BootScreenClient() {
  const [{ visible, done: initialDone }] = useState(getInitialBootState);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(initialDone);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || done) return;

    if (lineIndex >= BOOT_LINES.length) {
      const exitTimer = setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setDone(true);
      }, 480);
      return () => clearTimeout(exitTimer);
    }

    const timer = setTimeout(
      () => setLineIndex((i) => i + 1),
      BOOT_LINES[lineIndex].delay + 90
    );
    return () => clearTimeout(timer);
  }, [visible, lineIndex, done]);

  const handleSkip = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDone(true);
  };

  if (done) return null;

  return (
    <AnimatePresence>
      {visible && !done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="relative w-full max-w-xl px-6 font-mono text-sm">
            {BOOT_LINES.slice(0, lineIndex).map((line, i) => (
              <div key={i} className="mb-1.5 text-fg-muted">
                <span className="text-accent">›</span>{" "}
                <span className={i === BOOT_LINES.length - 1 ? "text-success" : ""}>
                  {line.text}
                </span>
              </div>
            ))}
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
          </div>

          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 font-mono text-xs text-fg-dim transition-colors hover:text-accent cursor-pointer"
          >
            skip_intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const BootScreen = dynamic(() => Promise.resolve(BootScreenClient), {
  ssr: false,
});
