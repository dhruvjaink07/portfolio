'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SECTIONS } from '@/lib/sections';
import { useUI } from './providers/UIProvider';
import SectionLink from './SectionLink';
import ThemeToggle from './ThemeToggle';

interface Indicator {
  left: number;
  width: number;
  animate: boolean;
}

// Floating pill nav. One indicator slides between links on the spring curve.
export default function Nav() {
  const active = useActiveSection();
  const { setOverlay } = useUI();
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef(active);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [modKey, setModKey] = useState('⌘');

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setModKey('Ctrl ');
  }, []);

  // Measured against the list itself (links sit in their own positioned <li>,
  // so offsetLeft would always be 0).
  const measure = (animate: boolean) => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-section="${activeRef.current}"]`);
    if (!list || !link) return;
    const listRect = list.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setIndicator({ left: linkRect.left - listRect.left, width: linkRect.width, animate });
  };

  // Section changes slide the pill.
  useLayoutEffect(() => {
    activeRef.current = active;
    measure(indicator !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Size changes (font swap, breakpoints, window resize) re-place it instantly.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => measure(false));
    observer.observe(list);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav aria-label="Primary" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line-strong bg-surface/75 p-1.5 backdrop-blur-md">
        <SectionLink section="home" className="hidden px-3 font-display text-base font-semibold sm:block" aria-label="Back to top">
          DJ
        </SectionLink>

        <ul ref={listRef} className="relative flex items-center">
          {indicator && (
            <li
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 rounded-full bg-accent ${
                indicator.animate ? 'transition-[translate,width] duration-500 ease-spring' : ''
              }`}
              style={{ translate: `${indicator.left}px 0`, width: indicator.width }}
            />
          )}
          {SECTIONS.map(s => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="relative">
                <SectionLink
                  section={s.id}
                  data-section={s.id}
                  aria-current={isActive ? 'location' : undefined}
                  className={`block rounded-full px-2.5 py-2 text-[0.65rem] tracking-wider uppercase transition-colors duration-300 ease-spring sm:px-4 sm:text-xs ${
                    isActive ? 'text-canvas' : 'text-muted hover:text-ink'
                  }`}
                >
                  {s.label}
                </SectionLink>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOverlay('palette')}
          aria-label="Open command palette"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink transition-[scale] duration-300 ease-spring active:scale-90 sm:w-auto sm:px-3"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:hidden">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <kbd className="hidden rounded-md border border-line-strong px-1.5 py-0.5 text-[0.65rem] text-muted sm:block">
            {modKey}K
          </kbd>
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}
