"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

// Elements the cursor reacts to. `data-cursor-label` on the element (or any
// ancestor) shows a small caption next to the ring, e.g. "VIEW" / "OPEN".
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-cursor]';
const TEXT_FIELD_SELECTOR = "input, textarea, select";

type CursorMode = "default" | "hover" | "text";

interface Ping {
  id: number;
  x: number;
  y: number;
}

// Only mounted client-side (see the `dynamic(..., { ssr: false })` export below),
// so reading matchMedia in the lazy initializer is safe — mirrors BootScreen.
function getCursorEnabled() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return finePointer && !prefersReducedMotion;
}

function CustomCursorClient() {
  const [enabled] = useState(getCursorEnabled);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pings, setPings] = useState<Ping[]>([]);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  // Dot tracks almost 1:1; the ring trails behind on a softer spring.
  const dotX = useSpring(mx, { stiffness: 900, damping: 55, mass: 0.15 });
  const dotY = useSpring(my, { stiffness: 900, damping: 55, mass: 0.15 });
  const ringX = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.4 });
  const ringY = useSpring(my, { stiffness: 220, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || !(target instanceof Element)) return;
      if (target.closest(TEXT_FIELD_SELECTOR)) {
        setMode("text");
        setLabel(null);
        return;
      }
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive) {
        setMode("hover");
        setLabel(
          interactive.closest("[data-cursor-label]")?.getAttribute("data-cursor-label") ??
            null
        );
      } else {
        setMode("default");
        setLabel(null);
      }
    };

    const onDown = (e: MouseEvent) => {
      const id = Date.now();
      setPings((p) => [...p.slice(-3), { id, x: e.clientX, y: e.clientY }]);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, mx, my]);

  if (!enabled) return null;

  const isHover = mode === "hover";
  const isText = mode === "text";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      {/* click ping — expanding ring echo, like a command firing */}
      <AnimatePresence>
        {pings.map((ping) => (
          <motion.span
            key={ping.id}
            initial={{ opacity: 0.5, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() =>
              setPings((p) => p.filter((x) => x.id !== ping.id))
            }
            className="absolute h-12 w-12 rounded-full border border-accent"
            style={{ left: ping.x - 24, top: ping.y - 24 }}
          />
        ))}
      </AnimatePresence>

      {/* trailing ring — morphs into [ ] brackets over interactive elements */}
      {/* Tailwind's -translate-* uses the independent CSS `translate` property,
          so it composes with the framer-driven `transform` for centering. */}
      <motion.div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center font-mono"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          animate={{
            width: isHover ? 44 : 32,
            height: isHover ? 30 : 32,
            opacity: isText ? 0 : 1,
            borderColor: isHover
              ? "color-mix(in srgb, var(--accent) 0%, transparent)"
              : "color-mix(in srgb, var(--accent) 45%, transparent)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative flex items-center justify-between rounded-full border"
          style={{ boxShadow: "0 0 18px color-mix(in srgb, var(--accent) 20%, transparent)" }}
        >
          <motion.span
            animate={{ opacity: isHover ? 1 : 0, x: isHover ? 0 : 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="text-sm leading-none text-accent"
          >
            [
          </motion.span>
          <motion.span
            animate={{ opacity: isHover ? 1 : 0, x: isHover ? 0 : -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="text-sm leading-none text-accent"
          >
            ]
          </motion.span>
        </motion.div>

        <AnimatePresence>
          {isHover && label && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 whitespace-nowrap text-[10px] tracking-widest text-accent"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* core dot */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        animate={{
          width: isText ? 2 : isHover ? 4 : 6,
          height: isText ? 18 : isHover ? 4 : 6,
          borderRadius: isText ? 1 : 999,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          x: dotX,
          y: dotY,
          boxShadow: "0 0 12px color-mix(in srgb, var(--accent) 60%, transparent)",
        }}
      />
    </div>
  );
}

export const CustomCursor = dynamic(() => Promise.resolve(CustomCursorClient), {
  ssr: false,
});
