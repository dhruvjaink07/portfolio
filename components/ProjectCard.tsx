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
  onToggle: (id: number) => void;
}

// Links sit above the card-wide toggle overlay, so they stay independently clickable.
const linkClass =
  'relative z-10 underline-offset-4 transition-colors duration-300 ease-smooth hover:text-accent hover:underline';

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

// Category label, with an "Ongoing" badge for projects still in progress.
function CategoryLabel({ category, ongoing }: Pick<Project, 'category' | 'ongoing'>) {
  return (
    <span className="flex items-center gap-2">
      {category}
      {ongoing && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] tracking-wider text-canvas">Ongoing</span>
      )}
    </span>
  );
}

export default function ProjectCard({ project, size, onToggle }: ProjectCardProps) {
  const { id, title, description, technologies, category, icon, ongoing, highlights, codeUrl, liveUrl } = project;
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
      className={`vt-card relative flex scroll-mt-8 flex-col justify-between gap-8 rounded-3xl border bg-surface p-6 transition-[translate,border-color] duration-500 ease-smooth hover:-translate-y-1 ${
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
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
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
            <span aria-hidden="true" className="text-[clamp(5rem,10vw,8rem)] leading-none">
              {icon}
            </span>
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
              {!big && (
                <span aria-hidden="true" className="text-2xl">
                  {icon}
                </span>
              )}
            </div>
            <h3
              className={`mt-6 font-display leading-[1.05] font-semibold tracking-tight ${
                big ? 'text-[clamp(2.25rem,4.5vw,3.5rem)]' : 'text-2xl'
              }`}
            >
              {toggleButton}
            </h3>
            <p className={`mt-4 text-sm leading-relaxed text-muted ${big ? 'max-w-prose md:text-base' : ''}`}>
              {description}
            </p>
          </div>

          {/* The feature tile spans two rows; an oversized mark gives it a focal point. */}
          {big && (
            <div
              aria-hidden="true"
              className="hidden flex-1 items-center justify-center text-[clamp(5rem,10vw,8rem)] leading-none lg:flex"
            >
              {icon}
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
