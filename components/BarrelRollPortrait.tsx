'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { prefersReducedMotion } from '@/lib/sections';
import { useUI } from './providers/UIProvider';

// Easter egg: five quick clicks on the portrait.
export default function BarrelRollPortrait({ src, alt }: { src: string; alt: string }) {
  const { notify } = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const clicks = useRef<number[]>([]);

  const onClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter(t => now - t < 2000), now];
    if (clicks.current.length < 5) return;
    clicks.current = [];
    notify('Do a barrel roll! 🛩');
    if (!prefersReducedMotion()) {
      ref.current?.animate([{ rotate: '0deg' }, { rotate: '360deg' }], {
        duration: 1000,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      });
    }
  };

  return (
    <div ref={ref} onClick={onClick} className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover grayscale transition-[filter,scale] duration-700 ease-spring group-hover:scale-[1.03] group-hover:grayscale-0"
      />
    </div>
  );
}
