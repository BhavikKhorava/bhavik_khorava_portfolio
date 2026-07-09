# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@project_details.md

## Commands

```bash
npm run dev      # start dev server (Turbopack) at http://localhost:3000
npm run build    # production build (runs TypeScript check + static generation)
npm run lint     # ESLint (flat config, eslint.config.mjs)
npm run start    # serve the production build
```

No test suite is configured. There is a single route (`/`) — `npm run build` is
the fastest way to catch type errors across the whole app.

## Architecture

Static single-page Next.js App Router site (no API routes, no CMS, no
database). `src/app/page.tsx` composes one section component per resume
section in order; each section component reads its content from a
corresponding typed file in `src/data/` rather than hardcoding copy.

Read `project_details.md` (imported above) before making changes — it documents
the data-file-to-section mapping, the design token system in `globals.css`,
the Lenis/GSAP scroll wiring, and several deliberate non-obvious decisions
(e.g. why the boot screen is client-only, why anchor links route through a
custom `scrollToHash`) that should not be "fixed" back to more conventional
patterns.

`AGENTS.md` (imported above) flags that this project's Next.js version has
breaking changes relative to training data — check `node_modules/next/dist/docs/`
for the installed version's actual API before assuming standard Next.js
conventions apply.
