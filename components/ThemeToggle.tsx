'use client';

import { toggleTheme } from '@/lib/theme';

// Icons switch through the `dark:` variant, so the button never renders the
// wrong icon before hydration.
export default function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      title="Toggle theme (T)"
      onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className="grid size-9 shrink-0 place-items-center rounded-full text-ink transition-[scale,rotate] duration-500 ease-spring hover:rotate-12 active:scale-90"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dark:hidden">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden dark:block">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
