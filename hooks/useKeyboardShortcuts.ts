'use client';

import { useEffect, useRef } from 'react';
import { SECTIONS, scrollToSection } from '@/lib/sections';
import { toggleTheme } from '@/lib/theme';

export interface ShortcutHandlers {
  overlayOpen: boolean;
  togglePalette: () => void;
  toggleTerminal: () => void;
  onKonami: () => void;
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const sameKey = (key: string, expected: string) => key === expected || key.toLowerCase() === expected;

/**
 * The only global keydown listener on the site.
 *   ⌘K / Ctrl+K   command palette (works everywhere)
 *   Ctrl+`        terminal (works everywhere)
 *   h a p s c     jump to section     t   toggle theme
 *   ↑↑↓↓←→←→ b a  Konami
 * While an overlay is open the overlay's own dialog handles keys, so nothing
 * else here fires: Escape, arrows and the snake game never collide.
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    let konami = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const h = ref.current;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        h.togglePalette();
        return;
      }
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        h.toggleTerminal();
        return;
      }
      if (h.overlayOpen || e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) {
        konami = 0;
        return;
      }

      if (sameKey(e.key, KONAMI[konami])) {
        konami++;
        const done = konami === KONAMI.length;
        if (done) {
          konami = 0;
          h.onKonami();
        }
        // Swallow the trailing "b a" so "a" doesn't also jump to About.
        if (done || konami > 8) return;
      } else {
        konami = sameKey(e.key, KONAMI[0]) ? 1 : 0;
      }

      const key = e.key.toLowerCase();
      const section = SECTIONS.find(s => s.key === key);
      if (section) {
        e.preventDefault();
        scrollToSection(section.id);
      } else if (key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}
