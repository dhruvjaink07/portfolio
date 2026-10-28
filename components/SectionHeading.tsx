import { sectionNumber, type SectionId } from '@/lib/sections';

// Eyebrow with the section's number ("02 — Selected work") over the display title.
// The title's id is what each <section aria-labelledby> points at.
export default function SectionHeading({ section, eyebrow, title }: { section: SectionId; eyebrow: string; title: string }) {
  return (
    <div className="reveal">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">
        <span className="text-ink tabular-nums">{sectionNumber(section)}</span> — {eyebrow}
      </p>
      <h2
        id={`${section}-title`}
        className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-tight"
      >
        {title}
      </h2>
    </div>
  );
}
