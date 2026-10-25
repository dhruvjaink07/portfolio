'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

const W = 20;
const H = 10;
const TICK_MS = 130;

type Point = { x: number; y: number };
interface GameState {
  snake: Point[];
  dir: Point;
  next: Point;
  food: Point;
  score: number;
}

const DIRECTIONS: Record<string, Point> = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
};

const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

function randomFood(snake: Point[]): Point {
  const free: Point[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!snake.some(p => p.x === x && p.y === y)) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)];
}

function render({ snake, food, score }: GameState) {
  const border = `+${'-'.repeat(W)}+`;
  const rows = [border];
  for (let y = 0; y < H; y++) {
    let row = '|';
    for (let x = 0; x < W; x++) {
      const cell = { x, y };
      row += same(snake[0], cell) ? '@' : snake.some(p => same(p, cell)) ? 'o' : same(food, cell) ? '*' : ' ';
    }
    rows.push(`${row}|`);
  }
  rows.push(border, `SCORE ${score}   arrows/WASD to move, Q to quit`);
  return rows.join('\n');
}

// Keys arrive through this element's own onKeyDown; there is no global listener.
export default function Snake({ onExit }: { onExit: (score: number, reason: string) => void }) {
  const boardRef = useRef<HTMLPreElement>(null);
  const state = useRef<GameState>({
    snake: [{ x: 10, y: 5 }],
    dir: { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: { x: 15, y: 5 },
    score: 0,
  });
  const [frame, setFrame] = useState(() => render(state.current));
  const onExitRef = useRef(onExit);
  useEffect(() => {
    onExitRef.current = onExit;
  });

  useEffect(() => {
    boardRef.current?.focus();
    const timer = setInterval(() => {
      const s = state.current;
      s.dir = s.next;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) {
        clearInterval(timer);
        onExitRef.current(s.score, 'Hit a wall!');
        return;
      }
      if (s.snake.some(p => same(p, head))) {
        clearInterval(timer);
        onExitRef.current(s.score, 'Ate yourself!');
        return;
      }
      s.snake.unshift(head);
      if (same(head, s.food)) {
        s.score += 10;
        s.food = randomFood(s.snake);
      } else {
        s.snake.pop();
      }
      setFrame(render(s));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLPreElement>) => {
    const key = e.key.toLowerCase();
    const s = state.current;
    const dir = DIRECTIONS[key];
    if (dir) {
      e.preventDefault();
      if (!(dir.x === -s.dir.x && dir.y === -s.dir.y)) s.next = dir;
    } else if (key === 'q') {
      e.preventDefault();
      onExitRef.current(s.score, 'Game terminated.');
    }
  };

  return (
    <pre
      ref={boardRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Snake game. Arrow keys or WASD to move, Q to quit."
      className="my-2 leading-none text-emerald-400 outline-none"
    >
      {frame}
    </pre>
  );
}
