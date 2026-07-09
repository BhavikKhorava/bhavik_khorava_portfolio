import { skillGroups } from "@/data/skills";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export function TechStack() {
  return (
    <section id="stack" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="02" title="tech stack" command="cat package.json" />
        </Reveal>

        <Reveal delay={0.1}>
          <TerminalWindow title="package.json" bodyClassName="p-0">
            <div className="p-5 font-mono text-sm sm:p-6">
              <div className="text-fg-muted">{"{"}</div>
              <div className="pl-4 text-fg-muted">
                <span className="text-accent">&quot;name&quot;</span>: &quot;bhavik-khorava&quot;,
              </div>
              <div className="pl-4 text-fg-muted">
                <span className="text-accent">&quot;role&quot;</span>: &quot;backend-developer&quot;,
              </div>
              <div className="pl-4 text-fg-muted">
                <span className="text-accent">&quot;dependencies&quot;</span>: {"{"}
              </div>

              <RevealGroup className="pl-8" stagger={0.12}>
                {skillGroups.map((group) => (
                  <RevealItem key={group.key} className="mb-5 last:mb-0">
                    <div className="mb-2 text-fg-dim">
                      &quot;{group.label}&quot;: &quot;{group.version}&quot;
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="tag-chip rounded-md border border-border bg-bg-elevated/70 px-2.5 py-1 text-xs text-fg-muted"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <div className="pl-4 text-fg-muted">{"}"}</div>
              <div className="text-fg-muted">{"}"}</div>
            </div>
          </TerminalWindow>
        </Reveal>
      </div>
    </section>
  );
}
