import { awards, community, contact, isCurrent, profile, workExperience } from '@/data/portfolioData';
import BarrelRollPortrait from './BarrelRollPortrait';
import BentoTile, { TileLabel } from './BentoTile';
import CopyEmailTile from './CopyEmailTile';
import SectionLink from './SectionLink';

const toTitleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const current = workExperience[0];
const currentSince = toTitleCase(current.period.split(' - ')[0]);
const githubUser = new URL(profile.social.github).pathname.replace(/\//g, '');

const pillClass =
  'rounded-full border border-line-strong px-4 py-2 text-xs tracking-wider uppercase transition-[border-color,translate] duration-500 ease-spring hover:-translate-y-0.5 hover:border-ink';

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <BentoTile padded={false} className="col-span-1 p-5 lg:p-6">
      <p className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <div className="mt-6">
        <TileLabel>{label}</TileLabel>
      </div>
    </BentoTile>
  );
}

/*
 * 6-column matrix on desktop, filled exactly (no orphan cells):
 *   row 1–2  headline ×4            | portrait ×2
 *   row 3    now ×2 | stat | stat   | email ×2
 *   row 4    bio ×3                 | community & awards ×3   (similar heights, so no stretched gaps)
 *   row 5    github activity ×6
 * Tablet (4 cols) and mobile (2 cols) reflow with grid-flow-dense.
 */
export default function HeroBento() {
  return (
    <section id="home" aria-labelledby="hero-title" className="scroll-mt-8 pt-[clamp(2rem,6vw,5rem)]">
      <div className="grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-4 lg:auto-rows-[minmax(11rem,auto)] lg:grid-cols-6">
        <BentoTile className="col-span-2 min-h-[22rem] md:col-span-4 lg:row-span-2">
          <TileLabel>
            {profile.name} · {contact.location}
          </TileLabel>
          <h1
            id="hero-title"
            className="mt-10 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,5.25rem)] leading-[0.98] font-semibold tracking-tight"
          >
            {profile.headline}
          </h1>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <p className="text-xs tracking-[0.2em] text-muted uppercase">{profile.title}</p>
            <div className="flex gap-3">
              <SectionLink section="projects" className={pillClass}>
                Projects ↓
              </SectionLink>
              <a href={profile.cv} download className={pillClass}>
                Resume ↗
              </a>
            </div>
          </div>
        </BentoTile>

        <BentoTile padded={false} className="group col-span-2 min-h-[20rem] md:row-span-2">
          <BarrelRollPortrait src={profile.image} alt={`Portrait of ${profile.name}`} />
        </BentoTile>

        <BentoTile inverse className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            <TileLabel>Now</TileLabel>
          </div>
          <div className="mt-6">
            <p className="font-display text-2xl leading-tight font-semibold">{current.heading}</p>
            <p className="mt-1 text-sm opacity-70">
              {current.organization} · since {currentSince}
            </p>
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] uppercase opacity-60">{contact.availability}</p>
        </BentoTile>

        <StatTile value={profile.stats.experience} label="Years of experience" />
        <StatTile value={profile.stats.rating} label="Diploma aggregate" />

        <CopyEmailTile email={contact.email} social={profile.social} className="col-span-2" />

        <BentoTile className="col-span-2 justify-start lg:col-span-3">
          <TileLabel>Bio</TileLabel>
          <p className="mt-6 font-display text-[clamp(1.15rem,1.75vw,1.4rem)] leading-relaxed">{profile.bio}</p>
        </BentoTile>

        {/* Roles at the top, awards anchored to the bottom, so the tile ends flush with Bio. */}
        <BentoTile className="col-span-2 lg:col-span-3">
          <div>
            <TileLabel>Community</TileLabel>
            <ul className="mt-6 divide-y divide-line">
              {community.map(({ id, organization, roles: [latest, ...earlier] }) => (
                <li key={id} className="py-3 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="flex items-center gap-2 font-display text-lg font-semibold">
                      {latest.title}
                      {isCurrent(latest.period) && (
                        <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[0.6rem] font-normal tracking-wider text-canvas uppercase">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs tracking-[0.2em] text-muted uppercase tabular-nums">{latest.period}</p>
                  </div>
                  <p className="text-xs text-muted">{organization}</p>
                  {earlier.map(role => (
                    <p key={role.title} className="mt-1 text-xs text-muted">
                      Previously <span className="text-ink">{role.title}</span> · {toTitleCase(role.period)}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-line-strong pt-5">
            <TileLabel>Awards</TileLabel>
            <ul className="mt-4 space-y-3">
              {awards.map(award => (
                <li key={award.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div>
                    <p className="font-display text-lg font-semibold">{award.title}</p>
                    <p className="text-xs text-muted">{award.issuer}</p>
                  </div>
                  <p className="text-xs tracking-[0.2em] text-muted uppercase tabular-nums">{award.period}</p>
                </li>
              ))}
            </ul>
          </div>
        </BentoTile>

        <BentoTile className="col-span-2 md:col-span-4 lg:col-span-6">
          <TileLabel>GitHub activity</TileLabel>
          {/* External SVG chart; plain <img> since it needs no optimisation. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/1a1814/${githubUser}`}
            alt={`${profile.name}'s GitHub contribution chart`}
            width={663}
            height={104}
            loading="lazy"
            className="mt-6 h-auto w-full dark:invert"
          />
        </BentoTile>
      </div>
    </section>
  );
}
