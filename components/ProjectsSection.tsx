'use client';

import { useState } from 'react';
import { flushSync } from 'react-dom';
import { projectCategories, projects, type ProjectCategory } from '@/data/portfolioData';
import { prefersReducedMotion } from '@/lib/sections';
import ProjectCard, { type CardSize, type TileSize } from './ProjectCard';

type Filter = 'all' | ProjectCategory;

const LABELS: Record<Filter, string> = {
  all: 'All',
  mobile: 'Mobile',
  backend: 'Backend',
  web: 'Web',
  design: 'Design',
};

// Built from the data, so every button has projects behind it.
const FILTERS: Filter[] = ['all', ...projectCategories];

const countFor = (filter: Filter) =>
  filter === 'all' ? projects.length : projects.filter(p => p.category === filter).length;

// On the 4-column grid each group of six fills 3 rows exactly:
//   big(2×2) wide(2) / small small / wide wide
// Remainders get their own patterns so the last row never has holes.
const GROUP: TileSize[] = ['big', 'wide', 'small', 'small', 'wide', 'wide'];
const REMAINDER: Record<number, TileSize[]> = {
  0: [],
  1: ['full'],
  2: ['wide', 'wide'],
  3: ['wide', 'small', 'small'],
  4: ['big', 'wide', 'small', 'small'],
  5: ['big', 'wide', 'small', 'small', 'full'],
};

function layoutSizes(count: number): TileSize[] {
  const groups = Array.from({ length: Math.floor(count / 6) }, () => GROUP).flat();
  return [...groups, ...REMAINDER[count % 6]];
}

// Every layout change (filter, expand, collapse) goes through here so the grid
// re-flows smoothly. Cards get view-transition names only while
// this runs (see globals.css), so the theme reveal is unaffected.
function animateLayout(update: () => void, onDone?: () => void) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    flushSync(update);
    onDone?.();
    return;
  }
  const root = document.documentElement;
  root.dataset.vt = 'projects';
  const transition = document.startViewTransition(() => flushSync(update));
  // A skipped transition (hidden tab, or a newer one started) rejects `ready`; the update still applies.
  transition.ready.catch(() => {});
  transition.finished.finally(() => {
    delete root.dataset.vt;
    onDone?.();
  });
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const visible = projects.filter(p => filter === 'all' || p.category === filter);
  // The expanded project stays in place at full width. The cards before and after
  // it are laid out as separate groups, so each group fills whole rows and nothing
  // gets pulled across the expanded row.
  const split = visible.findIndex(p => p.id === expandedId);
  const sizes: CardSize[] =
    split === -1
      ? layoutSizes(visible.length)
      : [...layoutSizes(split), 'expanded', ...layoutSizes(visible.length - split - 1)];

  const selectFilter = (next: Filter) => {
    if (next === filter) return;
    animateLayout(() => {
      setFilter(next);
      setExpandedId(null);
    });
  };

  const toggle = (id: number) => {
    const opening = id !== expandedId;
    animateLayout(
      () => setExpandedId(opening ? id : null),
      () => {
        if (!opening) return;
        document
          .getElementById(`project-${id}`)
          ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      },
    );
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-8 py-[clamp(4rem,10vw,8rem)]">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Selected work</p>
          <h2
            id="projects-title"
            className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-tight"
          >
            Projects
          </h2>
        </div>

        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {FILTERS.map(cat => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => selectFilter(cat)}
                className={`rounded-full border px-4 py-2 text-xs tracking-wider uppercase transition-[background-color,border-color,color,scale] duration-500 ease-smooth active:scale-95 ${
                  active ? 'border-ink bg-ink text-canvas' : 'border-line-strong text-ink hover:border-ink'
                }`}
              >
                {LABELS[cat]} <span className="ml-1 tabular-nums opacity-60">{countFor(cat)}</span>
              </button>
            );
          })}
        </div>
      </header>

      <ul className="grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(15rem,auto)] lg:grid-cols-4">
        {visible.map((project, i) => (
          <ProjectCard key={project.id} project={project} size={sizes[i]} onToggle={toggle} />
        ))}
      </ul>
    </section>
  );
}
