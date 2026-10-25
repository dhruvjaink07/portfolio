'use client';

import { useEffect } from 'react';
import { contact } from '@/data/portfolioData';

const emojiIcon = (emoji: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`,
  )}`;

// Console note for curious developers, and a tab that notices when you leave.
export function useEasterEggs() {
  useEffect(() => {
    console.log('%c👋 Hey there, fellow developer!', 'font: 600 20px ui-serif, Georgia, serif;');
    console.log(
      `%cIf you're poking around in the console, we should probably talk: ${contact.email}\nP.S. Press Ctrl + \` for something fun, or ⌘K for everything else.`,
      'font: 12px ui-monospace, monospace; line-height: 1.6; color: #8b909c;',
    );
  }, []);

  useEffect(() => {
    const originalTitle = document.title;
    let restore: ReturnType<typeof setTimeout> | undefined;
    const icon = () => document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    const originalIcon = icon()?.href;

    const onVisibility = () => {
      clearTimeout(restore);
      if (document.hidden) {
        document.title = 'Come back soon 🥺';
        const link = icon();
        if (link) link.href = emojiIcon('💤');
      } else {
        document.title = 'Welcome back 🚀';
        const link = icon();
        if (link && originalIcon) link.href = originalIcon;
        restore = setTimeout(() => (document.title = originalTitle), 2000);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(restore);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
}
