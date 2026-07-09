import { experience } from "@/data/experience";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="03" title="experience" command="ps aux --sort=-start" />
        </Reveal>

        <Reveal delay={0.1}>
          <TerminalWindow title="bhavik@portfolio:~$ ps aux" bodyClassName="p-0">
            <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-border px-5 py-3 font-mono text-[11px] text-fg-dim sm:px-6">
              <span>PID</span>
              <span>PROCESS</span>
              <span>STATUS</span>
            </div>

            <div className="divide-y divide-border">
              {experience.map((entry, i) => (
                <Reveal key={entry.company} delay={i * 0.08} y={16}>
                  <div className="px-5 py-6 sm:px-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-mono text-xs text-fg-dim">
                          [{entry.pid}]
                        </span>
                        <span className="font-mono text-sm text-fg">
                          {entry.role}
                        </span>
                        <span className="font-mono text-sm text-accent">
                          @{entry.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-fg-dim">{entry.period}</span>
                        <span
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-2 py-0.5",
                            entry.status === "RUNNING"
                              ? "border-success/40 text-success"
                              : "border-border-strong text-fg-dim"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              entry.status === "RUNNING"
                                ? "bg-success animate-pulse"
                                : "bg-fg-dim"
                            )}
                          />
                          {entry.status}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 pl-1">
                      {entry.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2 text-sm text-fg-muted"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-fg-dim" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </TerminalWindow>
        </Reveal>
      </div>
    </section>
  );
}
