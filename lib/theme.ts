import { prefersReducedMotion } from './sections';

export type Theme = 'light' | 'dark';

const SPRING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

export function applyTheme(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  if (!persist) return;
  try {
    localStorage.setItem('theme', theme);
  } catch {}
}

export const savedTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem('theme');
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
};

// Reveals the new theme as a circle growing from `origin` (defaults to the viewport centre).
export function toggleTheme(origin?: { x: number; y: number }): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';

  if (!document.startViewTransition || prefersReducedMotion()) {
    applyTheme(next, true);
    return next;
  }

  const { x, y } = origin ?? { x: innerWidth / 2, y: innerHeight / 2 };
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(() => applyTheme(next, true));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: SPRING, pseudoElement: '::view-transition-new(root)' },
      );
    })
    // Skipped transitions (hidden tab, rapid toggling) reject `ready`; the theme is still applied.
    .catch(() => {});
  return next;
}
