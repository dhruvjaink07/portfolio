'use client';

import { useEffect, useRef } from 'react';

const MIN_CELL = 14; // grid spacing in CSS px on normal screens
const MAX_CELLS = 8000; // per-frame budget; large viewports get coarser cells instead of more work
const LEVELS = 11; // contour lines
const FRAME_MS = 1000 / 30; // 30fps is plenty for a slow drift
const DRIFT = 0.00004; // noise z-offset per ms
const BUMP_RADIUS = 180;
const BUMP_HEIGHT = 0.32;

// ---- 3D value noise -------------------------------------------------------
function hash(x: number, y: number, z: number) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1440662683)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const u = fade(x - xi), v = fade(y - yi), w = fade(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}

const fbm = (x: number, y: number, z: number) => 0.65 * noise3(x, y, z) + 0.35 * noise3(x * 2.1 + 17, y * 2.1 + 9, z * 1.7);

// ---- Marching squares -----------------------------------------------------
// Corner bits: top-left 8, top-right 4, bottom-right 2, bottom-left 1.
// Edges: 0 top, 1 right, 2 bottom, 3 left.
const SEGMENTS: number[][][] = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 1], [2, 3]], [[0, 2]], [[3, 0]],
  [[3, 0]], [[0, 2]], [[0, 3], [1, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], [],
];

export default function TopoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');

    let width = 0, height = 0, cols = 0, rows = 0, CELL = MIN_CELL;
    let field = new Float32Array(0);
    let stroke = '';
    let frame = 0, last = 0;
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

    const readColour = () => {
      stroke = getComputedStyle(document.documentElement).getPropertyValue('--line-strong').trim() || 'rgba(0,0,0,0.12)';
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CELL = Math.max(MIN_CELL, Math.sqrt((width * height) / MAX_CELLS));
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      field = new Float32Array(cols * rows);
    };

    const sample = (time: number) => {
      const z = time * DRIFT;
      const r2 = BUMP_RADIUS * BUMP_RADIUS;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const px = i * CELL, py = j * CELL;
          let v = fbm(px * 0.0024, py * 0.0024, z);
          const dx = px - pointer.x, dy = py - pointer.y;
          v += BUMP_HEIGHT * Math.exp(-(dx * dx + dy * dy) / r2);
          field[j * cols + i] = v;
        }
      }
    };

    const draw = (time: number) => {
      sample(time);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;

      for (let k = 1; k <= LEVELS; k++) {
        const iso = 0.1 + (k / (LEVELS + 1)) * 0.95;
        // Every fourth line is an "index contour", drawn stronger, like a survey map.
        ctx.globalAlpha = k % 4 === 0 ? 1 : 0.55;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const tl = field[j * cols + i], tr = field[j * cols + i + 1];
            const bl = field[(j + 1) * cols + i], br = field[(j + 1) * cols + i + 1];
            const c = (tl > iso ? 8 : 0) | (tr > iso ? 4 : 0) | (br > iso ? 2 : 0) | (bl > iso ? 1 : 0);
            const segs = SEGMENTS[c];
            if (segs.length === 0) continue;
            const x = i * CELL, y = j * CELL;
            const point = (edge: number): [number, number] => {
              switch (edge) {
                case 0: return [x + CELL * ((iso - tl) / (tr - tl)), y];
                case 1: return [x + CELL, y + CELL * ((iso - tr) / (br - tr))];
                case 2: return [x + CELL * ((iso - bl) / (br - bl)), y + CELL];
                default: return [x, y + CELL * ((iso - tl) / (bl - tl))];
              }
            };
            for (const [a, b] of segs) {
              const [ax, ay] = point(a);
              const [bx, by] = point(b);
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
            }
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (time - last < FRAME_MS) return;
      last = time;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      draw(time);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!finePointer.matches) return;
      // Start the bump at the cursor instead of sliding in from off-screen.
      if (pointer.x < -1e3) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };
    const onPointerLeave = () => {
      pointer.tx = pointer.ty = -1e4;
      pointer.x = pointer.y = -1e4;
    };
    const onResize = () => {
      resize();
      if (reducedMotion.matches) draw(0);
    };

    // Re-read the line colour when the theme flips.
    const themeObserver = new MutationObserver(() => {
      readColour();
      if (reducedMotion.matches) draw(0);
    });

    readColour();
    resize();
    start();
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    reducedMotion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      reducedMotion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />;
}
