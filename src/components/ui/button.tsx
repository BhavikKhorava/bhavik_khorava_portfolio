"use client";

import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/magnetic";
import { scrollToHash } from "@/lib/lenis";
import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
}

export function Button({ children, href, variant = "primary", className, external }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-md px-6 py-3 font-mono text-sm transition-colors duration-200",
    variant === "primary"
      ? "accent-gradient text-accent-foreground transition-[filter] hover:brightness-110"
      : "border border-border-strong text-fg hover:border-accent/60 hover:text-accent",
    className
  );

  const isHashLink = href.startsWith("#");

  return (
    <Magnetic>
      <Link
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={
          isHashLink
            ? (e) => {
                e.preventDefault();
                scrollToHash(href);
              }
            : undefined
        }
      >
        {children}
      </Link>
    </Magnetic>
  );
}
