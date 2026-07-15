"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { profile } from "@/data/profile";
import { Typewriter } from "@/components/ui/typewriter";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroVisual } from "@/components/hero-visual";
import { EASE_OUT } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Layered parallax: background grid, glow, and the 3D globe each scroll
  // away at different speeds for depth. Neutralized for reduced motion.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16 sm:px-10"
    >
      <motion.div
        className="bg-grid pointer-events-none absolute inset-0"
        style={{ y: prefersReducedMotion ? 0 : gridY }}
      />
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "var(--accent)", y: prefersReducedMotion ? 0 : glowY }}
      />

      {/* 3D node-graph globe — decorative, right-anchored, desktop only */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-24 z-0 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-70 lg:block xl:-right-8"
        style={{ y: prefersReducedMotion ? 0 : visualY }}
      >
        <HeroVisual />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-4xl"
      >
        <motion.div variants={item} className="mb-6 font-mono text-sm text-fg-muted">
          <div>
            <span className="text-accent">$</span> whoami
          </div>
          <div className="mt-1">
            <Typewriter
              text="bhavik_khorava — backend / ai systems engineer"
              startDelay={400}
              speed={28}
              className="text-fg"
            />
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="gradient-text text-balance text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.div variants={item} className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-border-strong bg-bg-elevated px-3 py-1 font-mono text-xs text-accent">
            {profile.title}
          </span>
          <span className="rounded-full border border-border-strong bg-bg-elevated px-3 py-1 font-mono text-xs text-fg-muted">
            {profile.subtitle}
          </span>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-balance text-base text-fg-muted sm:text-lg"
        >
          {profile.tagline}
          {" "}REST APIs, PostgreSQL &amp; MongoDB, secure payment workflows,
          and RAG pipelines wiring OpenAI &amp; Claude to Pinecone.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="#projects">view_deployments()</Button>
          <Button href="#contact" variant="ghost">
            curl -X POST /contact
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-fg-dim"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)] animate-pulse" />
            <span className="text-success">{profile.statusLabel}</span>
          </div>
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-accent"
              data-cursor-label="EMAIL"
            >
              {profile.email}
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
              data-cursor-label="OPEN"
            >
              linkedin/{profile.linkedin.label}
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
