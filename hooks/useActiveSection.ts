'use client';

import { useEffect, useState } from 'react';
import { SECTIONS, SECTION_NAVIGATE_EVENT, type SectionId } from '@/lib/sections';

// Where `scrollend` exists it releases the hold; the timeout is only a safety net.
// Elsewhere, scrolling counts as finished after this long without scroll events.
const SETTLE_MS = typeof window !== 'undefined' && 'onscrollend' in window ? 1000 : 150;

// The active section is the last one whose top has passed 40% of the viewport.
// At the very bottom of the page the last section wins, even if it is too short
// to ever reach that line.
function sectionAtScroll(): SectionId {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) return SECTIONS[SECTIONS.length - 1].id;
  const line = window.innerHeight * 0.4;
  let active: SectionId = SECTIONS[0].id;
  for (const { id } of SECTIONS) {
    const top = document.getElementById(id)?.getBoundingClientRect().top;
    if (top !== undefined && top <= line) active = id;
  }
  return active;
}

export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTIONS[0].id);

  useEffect(() => {
    let frame = 0;
    let locked = false;
    let settle: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      frame = 0;
      setActive(sectionAtScroll());
    };
    const unlock = () => {
      locked = false;
      sync();
    };
    // While a jump is in flight, hold the target and wait for scrolling to settle.
    const holdUntilSettled = () => {
      clearTimeout(settle);
      settle = setTimeout(unlock, SETTLE_MS);
    };

    const onScroll = () => {
      if (locked) holdUntilSettled();
      else if (!frame) frame = requestAnimationFrame(sync);
    };
    const onNavigate = (e: Event) => {
      locked = true;
      setActive((e as CustomEvent<SectionId>).detail);
      holdUntilSettled();
    };

    const onScrollEnd = () => {
      if (!locked) return;
      clearTimeout(settle);
      unlock();
    };

    sync(); // covers reloads mid-page and #hash links
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('resize', onScroll);
    window.addEventListener(SECTION_NAVIGATE_EVENT, onNavigate);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener(SECTION_NAVIGATE_EVENT, onNavigate);
    };
  }, []);

  return active;
}
