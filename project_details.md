# Project Details — Bhavik Khorava Portfolio

Reference doc for AI-assisted edits. Read this first before making changes so
suggestions match the existing architecture, design system, and conventions.

Original build spec (positioning, content facts, requirements) lives in
`Bhavik_Khorava_Portfolio_Prompt.txt` — that's the source of truth for tone
and factual content (resume data). This file is the source of truth for how
the codebase is organized.

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack), **TypeScript**, **React 19**
- **Tailwind CSS v4** — CSS-first config via `@theme inline` in `globals.css`
  (no `tailwind.config.ts` file — this version of Tailwind doesn't use one)
- **Framer Motion** — section reveals, stagger, hover/tap micro-interactions
- **GSAP + ScrollTrigger** — registered globally, synced to Lenis's scroll tick
- **Lenis** — smooth scrolling, driven by `gsap.ticker` (see
  `src/components/providers/smooth-scroll-provider.tsx`)
- **clsx + tailwind-merge** — combined into the `cn()` helper (`src/lib/utils.ts`)
- No CMS, no backend/API routes — everything is static, content lives in
  typed data files, contact form falls back to `mailto:`

Run locally: `npm run dev`. Build: `npm run build`. Lint: `npm run lint`.

---

## Editing content (do this first, before touching components)

All resume/profile content is in **typed data files** under `src/data/` —
edit these, not the components, to change what's displayed:

| File | Powers | Notes |
|---|---|---|
| `src/data/profile.ts` | Hero, About, Contact, Footer | name, title, tagline, email, phone, LinkedIn, GitHub (placeholder `#` — update `profile.github.url` once you have a real URL), status label, about paragraph, quick stats |
| `src/data/experience.ts` | Experience ("ps aux") section | Array of `ExperienceEntry`. **Veloc entry has placeholder bullets** marked with `// placeholder — refine with real detail` comments — replace once finalized. `status: "RUNNING"` is what marks the current/active role (green pulsing badge); everything else is `"EXITED"` |
| `src/data/projects.ts` | Projects ("kubectl get deployments") section | Array of `ProjectEntry`. `stack` renders as tag chips, `bullets` renders as the expanded detail list, `namespace`/`replicas` are cosmetic (kubectl-flavored labels, not real infra) |
| `src/data/skills.ts` | Tech Stack ("package.json") section | Array of `SkillGroup`, each with a `label`, fake semver `version` (cosmetic), and `items` list rendered as chips |
| `src/data/education.ts` | Education section | Array of `EducationEntry` |

Adding a new project/experience/skill entry = add an object to the array; no
component changes needed. Removing sections entirely = delete the import +
JSX line in `src/app/page.tsx`.

---

## Page structure

`src/app/page.tsx` assembles the whole page in order:

```
Navbar → Hero → About → TechStack → Experience → Projects → Education → Contact → Footer
```

Section order/inclusion is controlled entirely here. Nav anchors
(`#about`, `#stack`, `#experience`, `#projects`, `#education`, `#contact`)
must match each section's `id` prop — defined in `src/components/navbar.tsx`
`NAV_ITEMS` array and each `src/components/sections/*.tsx` file's outer
`<section id="...">`.

`src/app/layout.tsx` wraps everything with: fonts, global `<Metadata>`
(title/description/OG/Twitter tags — **update `siteUrl` here** once a real
domain is chosen, it's currently the placeholder `https://bhavikkhorava.dev`,
also used in `sitemap.ts` and `robots.ts`), `BootScreen`, `ScrollProgress`,
`SmoothScrollProvider`.

---

## Design system (globals.css)

Single source for all color tokens — `src/app/globals.css`, declared as CSS
vars in `:root` and re-exposed as Tailwind utilities via `@theme inline`
(so `bg-accent`, `text-fg-muted`, `border-border-strong` etc. all work as
normal Tailwind classes).

| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-elevated` / `--bg-panel` | near-black charcoal shades | page bg / raised surfaces / card panels |
| `--fg` / `--fg-muted` / `--fg-dim` | off-white → gray gradient | primary text / secondary text / faint labels |
| `--accent` | `#f2a93b` (amber) | **the one accent color** — buttons, links, highlights, prompt `$` glyphs. Deliberately singular per the design brief (avoid green/cyan "hacker cliché") |
| `--success` | `#3ddc84` | semantic only — "RUNNING"/"Deployed" status dots, not decorative |
| `--danger` | `#ff5c5c` | semantic only — used sparingly (e.g. terminal traffic-light dot) |
| `--font-mono` / `--font-sans` | JetBrains Mono / Inter | set via `next/font/google` in `layout.tsx`, mapped to CSS vars |

To re-theme the whole site (e.g. swap accent color), change the values in
`:root` in `globals.css` — everything downstream uses the Tailwind token
classes, nothing is hardcoded as a raw hex in components.

Utility classes also defined there: `.bg-grid` (faint grid backdrop),
`.bg-scanlines`, `.glow-accent` (text glow), `.glass-panel` (blurred
translucent card), `.text-balance`. Reduced-motion users get all animations
disabled via the `@media (prefers-reduced-motion: reduce)` block.

---

## Shared UI primitives (`src/components/ui/`)

Reusable building blocks used across every section — prefer these over
one-off markup when adding new sections:

- **`section-label.tsx`** — the `// 0X_SECTION_NAME` + `$ command` heading style used at the top of every section
- **`terminal-window.tsx`** — the traffic-light-dot card chrome wrapper (used by About, Tech Stack, Experience, Contact)
- **`reveal.tsx`** — `Reveal` (single fade+slide-up on scroll into view), `RevealGroup`/`RevealItem` (staggered children variant) — built on Framer Motion `whileInView`
- **`magnetic.tsx`** — wraps any element so it subtly follows the cursor on hover (buttons, links)
- **`button.tsx`** — the shared CTA button; auto-detects `href="#..."` and routes it through Lenis's `scrollToHash` instead of a hard jump
- **`typewriter.tsx`** — character-by-character reveal with blinking cursor, used in Hero's `$ whoami` line

## Section components (`src/components/sections/`)

One file per landing-page section (`hero.tsx`, `about.tsx`, `tech-stack.tsx`,
`experience.tsx`, `projects.tsx`, `education.tsx`, `contact.tsx`). Each reads
from its corresponding `src/data/*.ts` file and composes the `ui/` primitives
above — there's intentionally no shared "Section" wrapper component since
each one's internal layout (table-ish rows, JSON-styled blocks, cards) is
different enough that a generic wrapper would fight the content.

## Other top-level components (`src/components/`)

- **`navbar.tsx`** — fixed header, condenses/blurs past 24px scroll (`glass-panel` applied conditionally), mobile hamburger menu, all internal links go through `scrollToHash`
- **`boot-screen.tsx`** — first-load terminal intro. Client-only via `next/dynamic(..., { ssr: false })` (deliberate — see "Known gotchas" below). Skip state persisted in `sessionStorage` under key `portfolio_booted_v1`; bump that key if you ever want to force it to show again for all returning visitors
- **`scroll-progress.tsx`** — thin accent-colored progress bar fixed to the very top, driven by Framer Motion's `useScroll`
- **`footer.tsx`** — copyright + build-credits line

## Providers / lib (`src/components/providers/`, `src/lib/`)

- **`smooth-scroll-provider.tsx`** — instantiates Lenis once at the root, ticks it via `gsap.ticker`, syncs `ScrollTrigger.update` on scroll. Skips entirely if the user has `prefers-reduced-motion`. Stores the live instance in the module-level `lenisRef` (see below) so other components can trigger scrolls imperatively
- **`lib/lenis.ts`** — exports `lenisRef` (mutable ref holding the current Lenis instance) and `scrollToHash(hash, offset?)`, which every internal anchor link (`Navbar`, `Button`) calls on click instead of relying on native `<a href="#...">` jump behavior
- **`lib/utils.ts`** — `cn()` = `twMerge(clsx(...))`, standard Tailwind class-merging helper

---

## Known gotchas / deliberate decisions (don't "fix" these)

- **`BootScreen` is `dynamic(..., { ssr: false })`** — this is intentional,
  not an oversight. It reads `sessionStorage`/`matchMedia` in a `useState`
  lazy initializer, which is only safe because the component never renders
  server-side. Don't add a `mounted` state guard back in; the project's ESLint
  config (`react-hooks/set-state-in-effect`) will flag synchronous `setState`
  calls in `useEffect` bodies as errors.
- **Anchor links always call `scrollToHash`, never a bare `<a href="#x">`
  click-through** — because Lenis owns scroll position via its own RAF loop,
  a native browser jump desyncs it and causes a visible snap-back. If you add
  a new internal link anywhere, route it through `scrollToHash` from
  `src/lib/lenis.ts`.
- **`section[id] { scroll-margin-top: 6rem }`** (global, in `globals.css`) —
  fallback offset so sections don't render underneath the fixed navbar on
  direct hash navigation (e.g. pasting `/#projects`). If the navbar's height
  changes meaningfully, update both this value and the `offset` default in
  `scrollToHash`.
- **Single accent color rule** — the brief explicitly asked for exactly one
  accent (amber) with green/red reserved for semantic status only. Resist the
  urge to add more accent colors for "variety"; add a second CSS var and
  reuse the amber-role convention instead.

---

## Content still marked TODO / placeholder

- `profile.github.url` — currently `"#"`, needs a real GitHub URL
- `experience.ts` → Veloc entry bullets — generic placeholders, replace once
  finalized (each line has an inline comment flagging it)
- `siteUrl` in `layout.tsx`, `sitemap.ts`, `robots.ts` — placeholder domain
  `https://bhavikkhorava.dev`, update once a real domain is live
