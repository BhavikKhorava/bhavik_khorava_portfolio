"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(projects[0]?.slug ?? null);

  return (
    <section id="projects" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="05" title="projects" command="kubectl get deployments" />
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
                <Tilt3DCard maxTilt={2} disabled={isOpen}>
                  <div
                    className={cn(
                      "hover-glow group overflow-hidden rounded-lg border border-border bg-bg-panel/60",
                      isOpen && "border-border-strong"
                    )}
                  >
                    <button
                      onClick={() => setOpenSlug(isOpen ? null : project.slug)}
                      data-cursor-label={isOpen ? "CLOSE" : "VIEW"}
                      className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 px-5 py-4 text-left font-mono text-sm sm:grid-cols-[1fr_auto_auto_auto]"
                    >
                      <span className="flex flex-col">
                        <span className="flex flex-wrap items-center gap-2 text-fg">
                          {project.name}
                          {project.ai && (
                            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] tracking-wider text-accent">
                              AI/RAG
                            </span>
                          )}
                          {/* hover reveal: expand hint slides in on collapsed rows */}
                          {!isOpen && (
                            <span className="hidden translate-x-1 text-[10px] text-fg-dim opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-accent sm:inline">
                              [ enter ] view_details
                            </span>
                          )}
                        </span>
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
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                          className="border-t border-border"
                        >
                          <div className="px-5 py-5 sm:px-6">
                            <div className="mb-4 flex flex-wrap gap-2">
                              {project.stack.map((tech) => (
                                <span
                                  key={tech}
                                  className="tag-chip rounded-md border border-border bg-bg-elevated/70 px-2.5 py-1 font-mono text-[11px] text-fg-muted"
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
                </Tilt3DCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
