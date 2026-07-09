"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { scrollToHash } from "@/lib/lenis";

const NAV_ITEMS = [
  { href: "#about", label: "about" },
  { href: "#stack", label: "stack" },
  { href: "#experience", label: "experience" },
  { href: "#projects", label: "projects" },
  { href: "#education", label: "education" },
  { href: "#contact", label: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-4xl items-center justify-between rounded-xl border transition-all duration-300",
          scrolled
            ? "glass-panel border-border px-4 py-2.5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]"
            : "border-transparent px-4 py-3"
        )}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToHash("#top", 0);
          }}
          className="font-mono text-sm text-fg"
        >
          <span className="text-accent">~/</span>bhavik.khorava
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(item.href);
                }}
                className="font-mono text-xs text-fg-muted transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollToHash("#contact");
          }}
          className="hidden font-mono text-xs text-accent md:inline-flex items-center gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          available
        </a>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            className={cn(
              "h-px w-5 bg-fg transition-transform",
              menuOpen && "translate-y-[3px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-fg transition-transform",
              menuOpen && "-translate-y-[3px] -rotate-45"
            )}
          />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-4 right-4 rounded-xl border border-border bg-bg-elevated p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] md:hidden"
          >
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      scrollToHash(item.href);
                    }}
                    className="font-mono text-sm text-fg-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
