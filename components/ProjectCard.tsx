import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Project } from '@/data/portfolioData';
import LabeledPoint from './LabeledPoint';
import { TechChip } from './TechIcon';

export type TileSize = 'big' | 'wide' | 'small' | 'full';
export type CardSize = TileSize | 'expanded';

const SIZE_CLASS: Record<CardSize, string> = {
  expanded: 'md:col-span-2 lg:col-span-4 lg:p-10',
  big: 'md:col-span-2 lg:row-span-2 lg:p-10',
  wide: 'md:col-span-2',
  small: '',
  full: 'md:col-span-2 lg:col-span-4',
};

interface ProjectCardProps {
  project: Project;
  size: CardSize;
  // Position in the full list as "01", "02"…; stays fixed when filtering.
  number: string;
  onToggle: (id: number) => void;
}

// Links sit above the card-wide toggle overlay, so they stay independently clickable.
const linkClass =
  'relative z-10 -my-2 inline-block py-2 underline-offset-4 transition-colors duration-300 ease-smooth hover:underline';

function Links({ title, liveUrl, codeUrl }: Pick<Project, 'title' | 'liveUrl' | 'codeUrl'>) {
  if (!liveUrl && !codeUrl) return null;
  return (
    <div className="flex gap-5 text-sm">
      {liveUrl && (
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Live ↗<span className="sr-only"> ({title})</span>
        </a>
      )}
      {codeUrl && (
        <a href={codeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Code ↗<span className="sr-only"> ({title})</span>
        </a>
      )}
    </div>
  );
}

function TechList({ technologies }: { technologies: string[] }) {
  return (
    <ul aria-label="Technologies" className="flex flex-wrap gap-2">
      {technologies.map(tech => (
        <TechChip key={tech} name={tech} />
      ))}
    </ul>
  );
}

// The card's focal visual: the owner's screenshot when there is one, otherwise the
// project number as an outlined display numeral.
function Visual({ image, title, number, className = '' }: { image?: string; title: string; number: string; className?: string }) {
  if (image) {
    return (
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line ${className}`}>
        <Image src={image} alt={`${title} screenshot`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-top" />
      </div>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`font-display text-[clamp(6rem,13vw,10rem)] leading-[0.8] font-semibold tracking-tight text-transparent tabular-nums opacity-25 [-webkit-text-stroke:1.5px_var(--color-ink)] ${className}`}
    >
      {number}
    </span>
  );
}

// Category label, with an "Ongoing" badge for projects still in progress.
function CategoryLabel({ category, ongoing }: Pick<Project, 'category' | 'ongoing'>) {
  return (
    <span className="flex items-center gap-2">
      {category}
      {ongoing && (
        <span className="rounded-full bg-ink px-2 py-0.5 text-[0.6rem] tracking-wider text-canvas">Ongoing</span>
      )}
    </span>
  );
}

export default function ProjectCard({ project, size, number, onToggle }: ProjectCardProps) {
  const { id, title, description, technologies, category, image, ongoing, highlights, codeUrl, liveUrl } = project;
  const expanded = size === 'expanded';
  const big = size === 'big';

  const toggleButton = (
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-expanded={expanded}
      className="text-left after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
    >
      {title}
    </button>
  );

  return (
    <li
      id={`project-${id}`}
      style={{ '--vt-name': `project-${id}` } as CSSProperties}
      className={`vt-card reveal relative flex scroll-mt-8 flex-col justify-between gap-8 rounded-3xl border bg-surface p-6 transition-[translate,border-color] duration-500 ease-smooth hover:-translate-y-1 ${
        expanded ? 'border-ink/40' : 'border-line hover:border-ink/30'
      } ${SIZE_CLASS[size]}`}
    >
      {expanded ? (
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.2em] text-muted uppercase">
              <CategoryLabel category={category} ongoing={ongoing} />
            </p>
            <h3 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-semibold tracking-tight">
              {toggleButton}
            </h3>
            <p className="max-w-prose text-sm leading-relaxed text-ink/80 md:text-base">{description}</p>
            {highlights && (
              <ul className="max-w-prose space-y-2.5 text-sm leading-relaxed text-muted">
                {highlights.map(h => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-ink" />
                    <span>
                      <LabeledPoint text={h} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Links title={title} liveUrl={liveUrl} codeUrl={codeUrl} />
          </div>
          <div className="flex flex-col justify-between gap-8">
            <Visual image={image} title={title} number={number} className="lg:self-end" />
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] text-muted uppercase">Stack</p>
              <TechList technologies={technologies} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between gap-3 text-xs tracking-[0.2em] text-muted uppercase">
              <CategoryLabel category={category} ongoing={ongoing} />
              <span aria-hidden="true" className="tabular-nums">
                {number}
              </span>
            </div>
            <h3
              className={`mt-6 font-display leading-[1.05] font-semibold tracking-tight ${
                big ? 'text-[clamp(2.25rem,4.5vw,3.5rem)]' : 'text-2xl'
              }`}
            >
              {toggleButton}
            </h3>
            {/* Clamped on phones; tapping the card expands it to the full text. */}
            <p className={`mt-4 text-sm leading-relaxed text-muted max-md:line-clamp-4 ${big ? 'max-w-prose md:text-base' : ''}`}>
              {description}
            </p>
          </div>

          {/* The feature tile spans two rows; an oversized visual gives it a focal point. */}
          {big && (
            <div className="hidden flex-1 items-end justify-end lg:flex">
              <Visual image={image} title={title} number={number} />
            </div>
          )}

          <div className="flex flex-col gap-5">
            <TechList technologies={technologies} />
            {/* No link, no button: nothing here can open a blank tab. */}
            <Links title={title} liveUrl={liveUrl} codeUrl={codeUrl} />
          </div>
        </>
      )}
    </li>
  );
}
