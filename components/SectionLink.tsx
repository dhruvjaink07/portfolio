'use client';

import type { AnchorHTMLAttributes } from 'react';
import { scrollToSection, type SectionId } from '@/lib/sections';

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { section: SectionId };

// A real #anchor (works without JS, middle-click, copy link), but clicks go
// through scrollToSection so the nav state stays in sync.
export default function SectionLink({ section, onClick, ...props }: SectionLinkProps) {
  return (
    <a
      href={`#${section}`}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        scrollToSection(section);
      }}
      {...props}
    />
  );
}
