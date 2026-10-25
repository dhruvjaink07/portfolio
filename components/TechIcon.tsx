import { iconFor, monogram } from '@/lib/techIcons';

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Decorative: the technology's name is always rendered next to it.
export default function TechIcon({ name, size = 16, className = '' }: TechIconProps) {
  const icon = iconFor(name);
  if (icon) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={`shrink-0 ${className}`}>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`grid shrink-0 place-items-center rounded-[25%] border border-current font-mono leading-none font-semibold ${className}`}
    >
      {monogram(name)}
    </span>
  );
}

export function TechChip({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-1.5 rounded-full border border-line-strong py-1 pr-3 pl-2 text-[0.7rem] tracking-wider uppercase">
      <TechIcon name={name} size={12} />
      {name}
    </li>
  );
}
