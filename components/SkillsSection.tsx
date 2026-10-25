'use client';

import { skillGroups, topSkills, type Skill, type SkillGroup, type SkillLevel } from '@/data/portfolioData';
import { employersUsing } from '@/lib/skills';
import BentoTile, { TileLabel } from './BentoTile';
import TechIcon from './TechIcon';

const LEVELS: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

// Tech first: the two tech groups stack on the left; tools take the tall column on the right.
// Tools is pinned explicitly so it sits beside both groups whatever their heights.
const GROUP_LAYOUT: Record<SkillGroup['id'], string> = {
  frontend: 'lg:col-span-7',
  backend: 'lg:col-span-7',
  tools: 'lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-2',
};
const GROUP_ORDER: SkillGroup['id'][] = ['frontend', 'backend', 'tools'];

function LevelMeter({ level }: { level: SkillLevel }) {
  const filled = LEVELS.indexOf(level) + 1;
  return (
    <span role="img" aria-label={`${level.toLowerCase()}, ${filled} of 4`} className="flex shrink-0 gap-1">
      {LEVELS.map((l, i) => (
        <span key={l} className={`h-1.5 w-4 rounded-full ${i < filled ? 'bg-accent' : 'bg-line-strong'}`} />
      ))}
    </span>
  );
}

// Skills are not linked to projects; the only cross-reference is where they were used at work.
function SkillRow({ skill }: { skill: Skill }) {
  const employers = employersUsing(skill.name);
  return (
    <li className="flex flex-col border-b border-line py-4 last:border-b-0">
      <span className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2.5">
          <TechIcon name={skill.name} size={18} />
          <span className="font-display text-lg leading-tight font-semibold">{skill.name}</span>
        </span>
        <LevelMeter level={skill.level} />
      </span>
      <span className="mt-1 text-xs leading-relaxed text-muted">{skill.description}</span>
      {employers.length > 0 && (
        <span className="mt-1.5 text-[0.65rem] tracking-wider text-ink uppercase">Used at {employers.join(' · ')}</span>
      )}
    </li>
  );
}

export default function SkillsSection() {
  const groups = GROUP_ORDER.map(id => skillGroups.find(g => g.id === id)!);

  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-8 pb-[clamp(4rem,10vw,8rem)]">
      <header className="mb-10">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Toolkit</p>
        <h2
          id="skills-title"
          className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-tight"
        >
          Skills
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Core stack marquee: the second copy makes the loop seamless and is hidden from screen readers. */}
        <BentoTile inverse padded={false} className="group/marquee py-5 lg:col-span-12">
          <p className="sr-only">Core stack: {topSkills.join(', ')}</p>
          <div aria-hidden="true" className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
            {[0, 1].map(copy => (
              <ul key={copy} className="flex shrink-0 items-center">
                {topSkills.map(s => (
                  <li key={s} className="flex items-center font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold">
                    <span className="flex items-center gap-3 px-6">
                      <TechIcon name={s} size={28} />
                      {s}
                    </span>
                    <span className="text-base opacity-40">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </BentoTile>

        {groups.map(group => (
          <BentoTile key={group.id} className={`justify-start ${GROUP_LAYOUT[group.id]}`}>
            <div className="flex items-baseline justify-between">
              <TileLabel>{group.label}</TileLabel>
              <p className="text-xs text-muted tabular-nums">{group.skills.length}</p>
            </div>
            {/* Rows spread to fill the tile, so the shorter column never ends in an empty gap. */}
            <ul className="mt-4 flex flex-1 flex-col justify-between">
              {group.skills.map(skill => (
                <SkillRow key={skill.name} skill={skill} />
              ))}
            </ul>
          </BentoTile>
        ))}
      </div>
    </section>
  );
}
