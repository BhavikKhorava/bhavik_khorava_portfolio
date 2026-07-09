import { education } from "@/data/education";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";

export function Education() {
  return (
    <section id="education" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="06" title="education" command="cat education.log" />
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {education.map((entry) => (
            <RevealItem key={entry.degree}>
              <Tilt3DCard maxTilt={5} className="h-full">
                <div className="hover-glow h-full rounded-lg border border-border bg-bg-panel/60 p-6">
                <div className="mb-3 flex items-center justify-between font-mono text-xs text-fg-dim">
                  <span>{entry.period}</span>
                  <span className="rounded-full border border-border-strong px-2 py-0.5 text-accent">
                    {entry.score}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-fg">{entry.degree}</h3>
                <p className="mt-1 text-sm text-fg-muted">{entry.field}</p>
                  <p className="mt-3 font-mono text-xs text-fg-dim">
                    {entry.institution}
                  </p>
                </div>
              </Tilt3DCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
