"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(projects[0]?.slug ?? null);

  return (
    <section id="projects" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="04" title="projects" command="kubectl get deployments" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-4 grid grid-cols-[1fr_auto_auto] gap-3 rounded-t-lg border border-border bg-bg-elevated/60 px-5 py-3 font-mono text-[11px] text-fg-dim sm:grid-cols-[1fr_auto_auto_auto]">
            <span>NAME</span>
            <span className="hidden sm:block">NAMESPACE</span>
            <span>READY</span>
            <span>STATUS</span>
          </div>
        </Reveal>

        <div className="space-y-3">
          {projects.map((project, i) => {
            const isOpen = openSlug === project.slug;
            return (
              <Reveal key={project.slug} delay={i * 0.06} y={16}>
                <div className="overflow-hidden rounded-lg border border-border bg-bg-panel/60 transition-colors hover:border-border-strong">
                  <button
                    onClick={() => setOpenSlug(isOpen ? null : project.slug)}
                    className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 px-5 py-4 text-left font-mono text-sm sm:grid-cols-[1fr_auto_auto_auto]"
                  >
                    <span className="flex flex-col">
                      <span className="text-fg">{project.name}</span>
                      <span className="text-xs text-fg-dim">
                        {project.org} · {project.period}
                      </span>
                    </span>
                    <span className="hidden text-xs text-fg-muted sm:block">
                      {project.namespace}
                    </span>
                    <span className="text-xs text-fg-muted">
                      {project.replicas}/{project.replicas}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Deployed
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="border-t border-border"
                      >
                        <div className="px-5 py-5 sm:px-6">
                          <div className="mb-4 flex flex-wrap gap-2">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-border bg-bg-elevated/70 px-2.5 py-1 font-mono text-[11px] text-fg-muted"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <ul className="space-y-2">
                            {project.bullets.map((bullet, bi) => (
                              <motion.li
                                key={bullet}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: bi * 0.06 }}
                                className="flex gap-2 font-mono text-[13px] leading-relaxed text-fg-muted"
                              >
                                <span className="mt-0.5 shrink-0 text-accent">›</span>
                                <span className={cn("font-sans")}>{bullet}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
