import { ragPipeline } from "@/data/rag-pipeline";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";

export function AiSystems() {
  return (
    <section id="ai" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="03" title="ai systems" command="cat rag_pipeline.json" />
        </Reveal>

        <Reveal delay={0.1}>
          <TerminalWindow title="bhavik@portfolio:~$ cat rag_pipeline.json" bodyClassName="p-5 sm:p-6">
            <p className="mb-8 max-w-2xl font-sans text-[15px] leading-relaxed text-fg-muted">
              The retrieval-augmented generation pattern I design and ship in
              production backends: embed the data, index it in a vector store,
              retrieve what&apos;s relevant, and let the LLM answer with real
              context instead of guesswork.
            </p>

            {/* pipeline flow — receding-plane stage cards linked by arrows */}
            <RevealGroup
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
            >
              {ragPipeline.map((stage, i) => (
                <RevealItem key={stage.key} className="relative h-full">
                  <Tilt3DCard maxTilt={6} className="h-full">
                    <div className="hover-glow relative h-full rounded-lg border border-border bg-bg-elevated/60 p-4">
                      <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-fg-dim">
                          [{String(i).padStart(2, "0")}]
                        </span>
                        {i < ragPipeline.length - 1 && (
                          <span className="text-accent/70">→</span>
                        )}
                      </div>
                      <div className="font-mono text-sm text-fg">
                        &quot;{stage.label}&quot;
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-accent">
                        {stage.tech}
                      </div>
                      <p className="mt-2 font-sans text-xs leading-relaxed text-fg-muted">
                        {stage.detail}
                      </p>
                    </div>
                  </Tilt3DCard>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* one-line pipeline summary, kubectl-log style */}
            <Reveal delay={0.15}>
              <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-bg-elevated/60 px-4 py-3 font-mono text-xs text-fg-muted">
                <span className="text-accent">$</span> data → embed(
                <span className="text-accent">text-embedding-3-small</span>) →
                index(<span className="text-accent">Pinecone</span>) → retrieve(top_k)
                → llm(<span className="text-accent">GPT-4o-mini / Claude</span>) →{" "}
                <span className="text-success">grounded_response</span>
              </div>
            </Reveal>
          </TerminalWindow>
        </Reveal>
      </div>
    </section>
  );
}
