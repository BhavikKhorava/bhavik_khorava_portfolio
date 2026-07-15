import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 py-10 sm:px-10">
      <div className="section-divider mx-auto mb-8 w-full max-w-4xl" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 font-mono text-xs text-fg-dim sm:flex-row">
        <span>
          © {year} {profile.name} — SYSTEM_ONLINE
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          built with next.js, framer-motion &amp; gsap
        </span>
      </div>
    </footer>
  );
}
