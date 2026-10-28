---
name: portfolio-engineer
description: Triggers when building, migrating, laying out or styling the Next.js + Tailwind portfolio, including composing Tailwind classes for any section.
---

# Portfolio Engineering & Creative Design Directive

## 1. Architecture (Next.js, TypeScript, Tailwind, Cloudflare)
- **Component Isolation:** Every section is a self-contained component in `/components/*` (e.g. `HeroBento.tsx`, `ProjectsSection.tsx`, `ProjectCard.tsx`).
- **Tailwind Capsule Styling:** No component stylesheets. `app/globals.css` holds only design tokens and the few rules utilities cannot express (view-transition pseudo-elements, reduced-motion).
- **Unified State:** Filters, theme and navigation highlight live in React state/context, never in DOM classes toggled by hand.
- **Single Keyboard Router:** All shortcuts go through one hook (`useKeyboardShortcuts.ts`).
- **Hosting:** Cloudflare Workers via `@opennextjs/cloudflare`. No `runtime = "edge"`.
- **Contact Form:** Server-side Route Handler (`app/api/contact/route.ts`); secrets come from Cloudflare env, never from markup.

## 2. Content Integrity
- **All copy comes from `/data/portfolioData.ts`.** Never invent headlines, metrics, years of experience, technologies or status lines. If a layout needs copy that doesn't exist, add a field to the data file and flag it for the owner to confirm.
- Links render only when a real URL exists; no placeholders.
- Project visuals come from the owner's screenshots (`image` in the data). Without one, the card shows its outlined number. No emoji.
- The OG image `public/og.png` is rendered from the headline; regenerate it whenever the headline changes.

## 3. Structural Fluidity & Layout Architecture
- **Asymmetric Bento Matrix:** No uniform 3×3 blocks. Landing views use multi-column, multi-row spans (`md:col-span-2`, `lg:row-span-2`) with varying aspect ratios to create deliberate focal tiles. Grids must fill without orphaned empty cells.
- **Layered Dimensions:** Thin borders (`border-line`, i.e. neutral-200/60 light, white/10 dark) over a subtle noise texture; `backdrop-blur-md` only where content sits over imagery.
- **Radius:** Tiles and cards `rounded-3xl`; chips and filter pills `rounded-full`.

## 4. Typography
- **Display:** *Fraunces* (`font-display`), semibold, tight tracking at large sizes, fluid via `clamp()`.
- **Technical:** *JetBrains Mono* (`font-mono`) for labels, metadata and tech descriptors: uppercase, wide tracking (`tracking-[0.2em]`).

## 5. Motion
- **One spring curve:** `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)`, used as the Tailwind class `ease-spring` (e.g. `transition-[translate,border-color] duration-500 ease-spring`). Writing `cubic-bezier(...)` directly in a class list does nothing.
- **Reactive hover:** micro-translation (`hover:-translate-y-1`), progressive border shifts (`hover:border-ink/30`), `hover:brightness-110` on inverse tiles. No box-shadow.
- **Project grid exception:** project cards and grid re-flows (filter, expand, collapse) use `ease-smooth` (`cubic-bezier(0.22, 1, 0.36, 1)`, no overshoot) through the View Transitions API. The owner wants these smooth, not bouncy. No decorative toggle icons on project cards; the whole card is the click target.
- Always respect `prefers-reduced-motion`.

## 6. Palette
- Warm paper, strictly monochrome: ink is the only emphasis colour. The owner tried blue, orange, moss and Klein-blue accents and rejected a third colour; don't add one.
- Light: canvas `#f3efe7`, surface `#fbf9f5`, ink `#1a1814`, muted `#6b655b`, line-strong `#e3ddd1`. Dark: canvas `#12110f`, surface `#1a1916`, ink `#e6e1d6`, muted `#9a9488`, line-strong `rgba(255,248,235,0.14)`.
- A single semantic status dot (emerald) is the only saturated colour.

## 7. Mobile
- Check every change at 390px. Tap targets at least 40px tall on touch layouts; long copy is clamped or hidden on phones (project descriptions clamp until expanded, skill descriptions hide below `sm`), never removed from the data.
