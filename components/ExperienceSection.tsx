import { education, isCurrent, workExperience, type TimelineEntry } from '@/data/portfolioData';
import BentoTile, { TileLabel } from './BentoTile';
import LabeledPoint from './LabeledPoint';
import { TechChip } from './TechIcon';

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="mt-8 space-y-10 border-l border-line-strong pl-6">
      {entries.map(entry => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden="true"
            className={`absolute top-1 -left-[29.5px] size-2.5 rounded-full border ${
              isCurrent(entry.period) ? 'border-accent bg-accent' : 'border-ink bg-surface'
            }`}
          />
          <p className="text-xs tracking-[0.2em] text-muted uppercase tabular-nums">{entry.period}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight font-semibold tracking-tight">{entry.heading}</h3>
          <p className="mt-1 text-sm text-muted">{entry.organization}</p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            {entry.points.map(point => (
              <li key={point}>
                <LabeledPoint text={point} />
              </li>
            ))}
          </ul>
          {entry.technologies && (
            <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
              {entry.technologies.map(tech => (
                <TechChip key={tech} name={tech} />
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function ExperienceSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-8 pt-[clamp(4rem,10vw,8rem)]">
      <header className="mb-10">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Background</p>
        <h2
          id="about-title"
          className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-tight"
        >
          Experience
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <BentoTile className="justify-start lg:col-span-7">
          <TileLabel>Work</TileLabel>
          <Timeline entries={workExperience} />
        </BentoTile>
        <BentoTile className="justify-start lg:col-span-5">
          <TileLabel>Education</TileLabel>
          <Timeline entries={education} />
        </BentoTile>
      </div>
    </section>
  );
}
