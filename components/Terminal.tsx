'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { awards, community, contact, profile, projects, topSkills, workExperience } from '@/data/portfolioData';
import { toggleTheme } from '@/lib/theme';
import Snake from './terminal/Snake';

type Tone = 'cmd' | 'info' | 'ok' | 'warn' | 'err';
interface Line {
  id: number;
  text: string;
  tone?: Tone;
}

const TONE: Record<Tone, string> = {
  cmd: 'font-semibold',
  info: 'opacity-70',
  ok: 'text-emerald-400',
  warn: 'italic opacity-90',
  err: 'opacity-90',
};

const PROMPT = 'dhruv@portfolio:~$';

const HELP: [string, string][] = [
  ['whoami', 'Displays profile information'],
  ['experience', 'Where I have worked'],
  ['community', 'Clubs, roles and awards'],
  ['skills', 'Lists core competencies'],
  ['projects', 'Shows recent project builds'],
  ['contact', 'Initiates secure channel'],
  ['resume', 'Downloads my resume'],
  ['theme', 'Toggles light / dark mode'],
  ['hack', '[RESTRICTED] Bypasses mainframe security'],
  ['matrix', 'Initiates visual data stream'],
  ['snake', 'Starts the local snake emulator'],
  ['sudo', 'Executes a command as superuser'],
  ['fullscreen', 'Toggles immersive mode'],
  ['clear', 'Clears the screen'],
  ['exit', 'Closes the terminal'],
];
const COMMAND_NAMES = ['help', ...HELP.map(([name]) => name), 'gui'];

let lineId = 0;
const line = (text: string, tone?: Tone): Line => ({ id: lineId++, text, tone });
const welcome = () => [line('Dhruv OS v2.0.0', 'info'), line("Type 'help' to see available commands. Welcome, recruiter!")];

const isAbort = (err: unknown) => err instanceof DOMException && err.name === 'AbortError';

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

export default function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  const [lines, setLines] = useState<Line[]>(welcome);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      abortRef.current?.abort();
      setPlaying(false);
    }
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines, playing]);

  const print = (text: string, tone?: Tone) => setLines(ls => [...ls, line(text, tone)]);

  const typeOut = async (text: string, tone: Tone, signal: AbortSignal) => {
    const l = line('', tone);
    setLines(ls => [...ls, l]);
    for (let i = 1; i <= text.length; i++) {
      await sleep(18 + Math.random() * 18, signal);
      setLines(ls => ls.map(x => (x.id === l.id ? { ...x, text: text.slice(0, i) } : x)));
    }
  };

  const focusInput = () => requestAnimationFrame(() => inputRef.current?.focus());

  const run = async (raw: string) => {
    const cmd = raw.trim();
    print(`${PROMPT} ${cmd}`, 'cmd');
    if (!cmd) return;
    history.current.unshift(cmd);
    historyIndex.current = -1;

    const normalized = cmd.toLowerCase();
    const [name] = normalized.split(/\s+/);
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;
    setBusy(true);

    try {
      switch (name) {
        case 'help':
          print('Available commands:');
          HELP.forEach(([n, desc]) => print(`  ${n.padEnd(12)}${desc}`));
          break;
        case 'whoami':
          print(profile.bio, 'info');
          break;
        case 'experience':
          workExperience.forEach(e => print(`> ${e.heading} @ ${e.organization} (${e.period})`, 'warn'));
          break;
        case 'community':
          community.forEach(c => print(`> ${c.roles[0].title} @ ${c.organization} (${c.roles[0].period})`, 'warn'));
          awards.forEach(a => print(`★ ${a.title}, ${a.issuer} (${a.period})`, 'ok'));
          break;
        case 'skills':
          print(topSkills.join(' | '), 'ok');
          break;
        case 'projects':
          projects.forEach(p => print(`> ${p.title}: ${p.technologies.join(', ')}`, 'warn'));
          break;
        case 'contact':
          print(`Send encrypted transmission to: ${contact.email}`, 'ok');
          break;
        case 'resume': {
          const a = document.createElement('a');
          a.href = profile.cv;
          a.download = '';
          a.click();
          print('Downloading resume.pdf …', 'ok');
          break;
        }
        case 'theme':
          print(`Theme switched to ${toggleTheme()}.`, 'ok');
          break;
        case 'hack':
          await typeOut('INITIATING SECURE HANDSHAKE...', 'warn', signal);
          print('[LOCAL OVERRIDE] Cloud intercept failed. Reverting to local exploits.', 'err');
          await sleep(500, signal);
          for (let i = 0; i < 8; i++) {
            const hex = Math.random().toString(16).slice(2, 8).toUpperCase();
            print(`0x${hex} bypassing firewall proxy _${Math.floor(Math.random() * 90) + 10}%`, 'ok');
            await sleep(200, signal);
          }
          print('[SUCCESS] ACCESS GRANTED. Welcome to the root terminal.', 'ok');
          break;
        case 'matrix':
          for (let i = 0; i < 24; i++) {
            let row = '';
            for (let j = 0; j < 36; j++) row += String.fromCharCode(Math.floor(Math.random() * 94) + 33) + ' ';
            print(row, 'ok');
            await sleep(45, signal);
          }
          break;
        case 'snake':
          setPlaying(true);
          break;
        case 'fullscreen':
          setFullscreen(f => !f);
          print(`[SYSTEM] Switched to ${fullscreen ? 'windowed' : 'fullscreen'} mode.`, 'info');
          break;
        case 'clear':
          setLines([]);
          break;
        case 'exit':
        case 'gui':
          print('Closing session. Returning to graphical window manager...', 'ok');
          await sleep(600, signal);
          onClose();
          break;
        case 'sudo':
          if (normalized === 'sudo rm -rf /') {
            print('Nice try, but I have elevated privileges. 😉', 'err');
            break;
          }
          print('[sudo] password for recruiter:', 'warn');
          await sleep(1400, signal);
          print('Sorry, try again. This incident will be reported.', 'err');
          break;
        default:
          print(`bash: ${name}: command not found. Type 'help' for available commands.`, 'err');
      }
    } catch (err) {
      if (!isAbort(err)) throw err;
    } finally {
      setBusy(false);
      focusInput();
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (busy) {
      if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        abortRef.current?.abort();
        print('^C', 'info');
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      setInput('');
      void run(input);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIndex.current + (e.key === 'ArrowUp' ? 1 : -1);
      if (next < -1 || next >= history.current.length) return;
      historyIndex.current = next;
      setInput(next === -1 ? '' : history.current[next]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMAND_NAMES.find(c => input && c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Developer terminal"
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      className={`flex-col overflow-hidden border border-white/10 bg-terminal p-0 font-mono text-sm text-terminal-ink transition-[opacity,scale] duration-300 ease-spring backdrop:bg-black/50 backdrop:backdrop-blur-sm open:flex starting:scale-95 starting:opacity-0 ${
        fullscreen
          ? 'm-0 h-dvh max-h-none w-dvw max-w-none rounded-none'
          : 'm-auto h-[min(30rem,80dvh)] w-[min(48rem,calc(100%-2rem))] rounded-2xl'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <button type="button" aria-label="Close terminal" onClick={onClose} className="size-3 rounded-full bg-[#ff5f57]" />
        <button type="button" aria-label="Minimize terminal" onClick={onClose} className="size-3 rounded-full bg-[#febc2e]" />
        <button
          type="button"
          aria-label="Toggle fullscreen"
          onClick={() => {
            setFullscreen(f => !f);
            focusInput();
          }}
          className="size-3 rounded-full bg-[#28c840]"
        />
        <p className="flex-1 pr-12 text-center text-xs opacity-60">dhruv@portfolio: ~</p>
      </div>

      <div
        ref={bodyRef}
        onClick={() => !playing && inputRef.current?.focus()}
        className="flex-1 overflow-y-auto px-4 py-3 leading-relaxed"
      >
        <div role="log" aria-live="polite">
          {lines.map(l => (
            <p key={l.id} className={`break-words whitespace-pre-wrap ${l.tone ? TONE[l.tone] : ''}`}>
              {l.tone === 'err' ? `✘ ${l.text}` : l.text}
            </p>
          ))}
        </div>

        {playing ? (
          <Snake
            onExit={(score, reason) => {
              setPlaying(false);
              print(`[GAME OVER] ${reason} Score: ${score}`, 'warn');
              focusInput();
            }}
          />
        ) : (
          <label className="flex gap-2">
            <span className="shrink-0 text-emerald-400">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              readOnly={busy}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              aria-label="Terminal command"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent caret-emerald-400 outline-none"
            />
          </label>
        )}
      </div>
    </dialog>
  );
}
