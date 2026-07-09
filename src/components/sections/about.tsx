import { profile } from "@/data/profile";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="01" title="about" command="cat about.txt" />
        </Reveal>

        <Reveal delay={0.1}>
          <TerminalWindow title="bhavik@portfolio:~$ neofetch">
            <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
              <pre className="hidden select-none font-mono text-[11px] leading-[1.15] text-accent/70 sm:block">
{String.raw`     ___
    /  /\
   /  /  \    bhavik@portfolio
  /  /____\   ----------------
 /__/\    /\
 \  \ \  / /
  \  \ \/ /
   \  \  /
    \__\/`}
              </pre>

              <div className="font-mono text-sm">
                <RevealGroup className="space-y-1.5">
                  {[
                    ["os", "Backend Engineering"],
                    ["host", profile.title],
                    ["shell", "node.js / typescript"],
                    ["uptime", "4+ years"],
                  ].map(([k, v]) => (
                    <RevealItem key={k} className="flex gap-3">
                      <span className="w-16 shrink-0 text-accent">{k}</span>
                      <span className="text-fg-muted">{v}</span>
                    </RevealItem>
                  ))}
                </RevealGroup>

                <p className="mt-6 text-balance font-sans text-[15px] leading-relaxed text-fg-muted">
                  {profile.about}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {profile.quickStats.map((stat) => (
                    <Tilt3DCard key={stat.label} maxTilt={6} className="h-full">
                      <div className="hover-glow h-full rounded-lg border border-border bg-bg-elevated/60 p-4">
                        <div className="text-lg font-semibold text-fg sm:text-xl">
                          {stat.value}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-fg-dim">
                          {stat.label}
                        </div>
                      </div>
                    </Tilt3DCard>
                  ))}
                </div>
              </div>
            </div>
          </TerminalWindow>
        </Reveal>
      </div>
    </section>
  );
}
