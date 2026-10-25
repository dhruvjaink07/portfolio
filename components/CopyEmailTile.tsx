'use client';

import { useState } from 'react';
import type { SocialPlatform } from '@/data/portfolioData';
import BentoTile, { TileLabel } from './BentoTile';

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'X',
  instagram: 'Instagram',
};

interface CopyEmailTileProps {
  email: string;
  social: Record<SocialPlatform, string>;
  className?: string;
}

export default function CopyEmailTile({ email, social, className = '' }: CopyEmailTileProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <BentoTile className={className}>
      <TileLabel>Let&apos;s collaborate</TileLabel>

      <div className="mt-6 flex items-center justify-between gap-4">
        <a
          href={`mailto:${email}`}
          className="min-w-0 font-display text-lg leading-snug font-semibold break-all transition-colors duration-300 ease-spring hover:text-muted"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs tracking-wider text-canvas uppercase transition-[scale] duration-300 ease-spring hover:scale-105 active:scale-95"
        >
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Retry' : 'Copy'}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {status === 'copied' ? 'Email address copied' : status === 'failed' ? 'Copy failed, use the email link instead' : ''}
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-wider uppercase">
        {(Object.entries(social) as [SocialPlatform, string][]).map(([platform, url]) => (
          <li key={platform}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors duration-300 ease-spring hover:text-ink"
            >
              {SOCIAL_LABELS[platform]} ↗
            </a>
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}
