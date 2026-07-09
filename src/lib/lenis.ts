import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToHash(hash: string, offset = -84) {
  if (typeof document === "undefined") return;
  const target = document.querySelector(hash);
  if (!target) return;

  if (lenisRef.current) {
    lenisRef.current.scrollTo(target as HTMLElement, { offset, duration: 1.2 });
  } else {
    (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
