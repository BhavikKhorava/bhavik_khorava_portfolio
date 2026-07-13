import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TerminalWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function TerminalWindow({
  title,
  children,
  className,
  bodyClassName,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "glass-panel overflow-hidden rounded-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-bg-elevated/80 px-4 py-3">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <span className="ml-2 min-w-0 truncate font-mono text-xs text-fg-dim">{title}</span>
      </div>
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </div>
  );
}
