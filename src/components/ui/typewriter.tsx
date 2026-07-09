"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  cursor?: boolean;
}

export function Typewriter({
  text,
  className,
  speed = 32,
  startDelay = 0,
  onDone,
  cursor = true,
}: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            onDone?.();
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  const finished = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {cursor && (
        <span
          className={cn(
            "ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.1em] bg-accent align-middle",
            finished && "animate-pulse"
          )}
        />
      )}
    </span>
  );
}
