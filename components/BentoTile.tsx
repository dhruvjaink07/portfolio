import type { ElementType, ReactNode } from 'react';

interface BentoTileProps {
  as?: ElementType;
  inverse?: boolean;
  padded?: boolean;
  className?: string;
  children: ReactNode;
}

const base =
  'relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-[translate,border-color,filter] duration-500 ease-spring hover:-translate-y-1';

export default function BentoTile({
  as: Tag = 'div',
  inverse = false,
  padded = true,
  className = '',
  children,
}: BentoTileProps) {
  const tone = inverse
    ? 'border-transparent bg-ink text-canvas hover:brightness-110'
    : 'border-line bg-surface hover:border-ink/30';

  return <Tag className={`${base} ${tone} ${padded ? 'p-6 lg:p-8' : ''} ${className}`}>{children}</Tag>;
}

// Mono eyebrow label; uses opacity so it reads on both normal and inverse tiles.
export function TileLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs tracking-[0.2em] uppercase opacity-60">{children}</p>;
}
