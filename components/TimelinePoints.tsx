'use client';

import { useId, useState } from 'react';
import LabeledPoint from './LabeledPoint';

// On phones only the first point shows until "Show details" is tapped; the
// Experience section was otherwise several screens long. From md up, all show.
export default function TimelinePoints({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const hidden = points.length - 1;

  return (
    <>
      <ul id={listId} className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
        {points.map((point, i) => (
          <li key={point} className={i > 0 && !open ? 'max-md:hidden' : ''}>
            <LabeledPoint text={point} />
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls={listId}
          className="-my-2 mt-1 py-3 text-[0.65rem] tracking-[0.2em] text-ink uppercase underline-offset-4 hover:underline md:hidden"
        >
          {open ? 'Show less' : `Show details (+${hidden})`}
        </button>
      )}
    </>
  );
}
