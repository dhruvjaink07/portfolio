'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { contact, profile } from '@/data/portfolioData';
import { useEasterEggs } from '@/hooks/useEasterEggs';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { SECTIONS, scrollToSection } from '@/lib/sections';
import { applyTheme, savedTheme, toggleTheme } from '@/lib/theme';
import CommandPalette, { type Command } from '../CommandPalette';
import Terminal from '../Terminal';

export type Overlay = 'palette' | 'terminal' | null;

interface UIContextValue {
  overlay: Overlay;
  setOverlay: (overlay: Overlay) => void;
  notify: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}

const SPRING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

// Single owner of cross-section UI state: which overlay is open (only one at a
// time) and toasts.
export default function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  const notify = useCallback((message: string) => setToast({ id: Date.now(), message }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Follow OS theme changes until the visitor picks one explicitly.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!savedTheme()) applyTheme(query.matches ? 'dark' : 'light', false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEasterEggs();

  useKeyboardShortcuts({
    overlayOpen: overlay !== null,
    togglePalette: () => setOverlay(o => (o === 'palette' ? null : 'palette')),
    toggleTerminal: () => setOverlay(o => (o === 'terminal' ? null : 'terminal')),
    onKonami: () => {
      const root = document.documentElement;
      root.style.transition = `filter 1.2s ${SPRING}`;
      root.style.filter = 'invert(1) hue-rotate(180deg)';
      notify('Konami code accepted. Developer level 99 unlocked.');
      setTimeout(() => (root.style.filter = ''), 8000);
    },
  });

  const commands = useMemo<Command[]>(
    () => [
      ...SECTIONS.map(s => ({
        id: `go-${s.id}`,
        title: `Go to ${s.label}`,
        group: 'Navigate',
        hint: s.key.toUpperCase(),
        run: () => scrollToSection(s.id),
      })),
      { id: 'theme', title: 'Toggle theme', group: 'Appearance', hint: 'T', run: () => toggleTheme() },
      {
        id: 'copy-email',
        title: 'Copy email address',
        group: 'Contact',
        run: async () => {
          try {
            await navigator.clipboard.writeText(contact.email);
            notify('Email address copied');
          } catch {
            notify(contact.email);
          }
        },
      },
      {
        id: 'resume',
        title: 'Download resume',
        group: 'Contact',
        run: () => {
          const a = document.createElement('a');
          a.href = profile.cv;
          a.download = '';
          a.click();
        },
      },
      { id: 'github', title: 'Open GitHub', group: 'Links', run: () => window.open(profile.social.github, '_blank', 'noopener') },
      { id: 'linkedin', title: 'Open LinkedIn', group: 'Links', run: () => window.open(profile.social.linkedin, '_blank', 'noopener') },
      { id: 'terminal', title: 'Open terminal', group: 'Developer', hint: 'Ctrl `', run: () => setOverlay('terminal') },
    ],
    [notify],
  );

  const value = useMemo(() => ({ overlay, setOverlay, notify }), [overlay, notify]);
  const close = useCallback(() => setOverlay(null), []);

  return (
    <UIContext.Provider value={value}>
      {children}
      <CommandPalette open={overlay === 'palette'} onClose={close} commands={commands} />
      <Terminal open={overlay === 'terminal'} onClose={close} />
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
        {toast && (
          <p
            key={toast.id}
            className="rounded-full bg-ink px-5 py-2.5 text-xs tracking-wider text-canvas uppercase transition-[opacity,translate] duration-500 ease-spring starting:translate-y-3 starting:opacity-0"
          >
            {toast.message}
          </p>
        )}
      </div>
    </UIContext.Provider>
  );
}
