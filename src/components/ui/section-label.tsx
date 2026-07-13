import { cn } from "@/lib/utils";

interface SectionLabelProps {
  index: string;
  title: string;
  command?: string;
  className?: string;
}

export function SectionLabel({ index, title, command, className }: SectionLabelProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-2", className)}>
      <span className="font-mono text-xs tracking-wider text-fg-dim">
        {"// "}
        {index}_{title.toUpperCase().replace(/\s+/g, "_")}
      </span>
      <h2 className="break-words text-2xl font-semibold tracking-tight text-fg sm:text-3xl md:text-4xl">
        {command ? (
          <span className="font-mono text-xl text-accent sm:text-2xl md:text-3xl">$ </span>
        ) : null}
        {command ?? title}
      </h2>
    </div>
  );
}
