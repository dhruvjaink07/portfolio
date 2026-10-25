'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

export interface Command {
  id: string;
  title: string;
  group: string;
  hint?: string;
  run: () => void | Promise<void>;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

export default function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery('');
      setIndex(0);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const term = query.trim().toLowerCase();
  const results = commands.filter(c => !term || `${c.title} ${c.group}`.toLowerCase().includes(term));
  const selected = Math.min(index, Math.max(results.length - 1, 0));

  const execute = (command: Command | undefined) => {
    if (!command) return;
    onClose();
    void command.run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setIndex((selected + step + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      execute(results[selected]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      onClick={e => e.target === dialogRef.current && onClose()}
      className="mx-auto mt-[12vh] w-[min(36rem,calc(100%-2rem))] overflow-hidden rounded-3xl border border-line-strong bg-surface p-0 text-ink transition-[opacity,scale] duration-300 ease-spring backdrop:bg-ink/30 backdrop:backdrop-blur-sm starting:scale-95 starting:opacity-0"
    >
      <div className="flex items-center gap-3 border-b border-line px-5">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="command-list"
          aria-activedescendant={results[selected] ? `command-${results[selected].id}` : undefined}
          placeholder="Type a command or search…"
          className="w-full bg-transparent py-4 text-sm placeholder:text-muted focus:outline-none"
        />
        <kbd className="rounded-md border border-line-strong px-1.5 py-0.5 text-[0.65rem] text-muted">ESC</kbd>
      </div>

      <ul id="command-list" role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No commands found.</li>}
        {results.map((command, i) => (
          <li
            key={command.id}
            id={`command-${command.id}`}
            role="option"
            aria-selected={i === selected}
            onMouseMove={() => i !== selected && setIndex(i)}
            onClick={() => execute(command)}
            className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-3 py-2.5 text-sm transition-colors duration-200 ease-spring ${
              i === selected ? 'bg-ink text-canvas' : ''
            }`}
          >
            <span>
              {command.title}
              <span className="ml-2 text-xs opacity-50">{command.group}</span>
            </span>
            {command.hint && <kbd className="text-[0.65rem] tracking-wider opacity-60">{command.hint}</kbd>}
          </li>
        ))}
      </ul>
    </dialog>
  );
}
