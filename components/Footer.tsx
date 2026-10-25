import { profile } from '@/data/portfolioData';

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-line px-4 pt-8 pb-28 text-xs tracking-wider text-muted uppercase sm:flex-row sm:justify-between sm:px-6 lg:px-10">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>
        <kbd>⌘K</kbd> for commands · <kbd>Ctrl `</kbd> for something else
      </p>
    </footer>
  );
}
