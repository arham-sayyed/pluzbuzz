/* Layered solid "flame" bands used by the intro and the Who We Are frame. */

export const FLAME_COLORS = ['#555AFE', '#E453EE', '#F2D458'] as const;

/**
 * `waveWidth`: the width the wave pattern spans (defaults to the canvas width, so every screen shows the same number
 * of tongues). `base` / `spread`: each band's height is base + spread × tongue, as a fraction of its full height.
 */
export interface FlameShape {
  waveWidth?: number;
  base: number;
  spread: number;
}

export const DEFAULT_FLAME_SHAPE: FlameShape = { base: 0.16, spread: 0.84 };

/**
 * Phones: the default pattern squeezes the same tongues into a narrow, tall screen, so they turn into tall thin
 * spikes. Spread the waves as if the screen were wider and soften the peaks and troughs.
 */
export const PHONE_FLAME_SHAPE: FlameShape = { waveWidth: 1000, base: 0.3, spread: 0.46 };

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function drawFlames(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  amp: number,
  colors: readonly string[] = FLAME_COLORS,
  shape: FlameShape = DEFAULT_FLAME_SHAPE
) {
  const span = shape.waveWidth ?? w;
  ctx.clearRect(0, 0, w, h);
  if (amp <= 0.001) return;
  const L = [
    { c: colors[0], s: 1.0, sp: 0.8, o: 0 },
    { c: colors[1], s: 0.72, sp: 1.2, o: 2.1 },
    { c: colors[2], s: 0.44, sp: 1.7, o: 4.2 }
  ];
  for (const l of L) {
    ctx.fillStyle = l.c;
    ctx.beginPath();
    ctx.moveTo(-20, h + 20);
    for (let x = -20; x <= w + 20; x += 4) {
      const u = x / span;
      const n =
        Math.sin(u * 8 + t * l.sp * 1.6 + l.o) * 0.5 +
        Math.sin(u * 21 - t * l.sp * 2.5 + l.o * 1.7) * 0.32 +
        Math.sin(u * 43 + t * l.sp * 4.1) * 0.18;
      const tongue = Math.pow(Math.max(0, (n + 1) / 2), 2.1);
      ctx.lineTo(x, h - h * l.s * amp * (shape.base + shape.spread * tongue));
    }
    ctx.lineTo(w + 20, h + 20);
    ctx.closePath();
    ctx.fill();
  }
}

/** Animates flames on a canvas while it is on screen. Returns a cleanup function. */
export function flameCanvas(canvas: HTMLCanvasElement, opts: { amp?: number; speed?: number } = {}) {
  const amp = opts.amp ?? 0.45;
  const speed = opts.speed ?? 0.5;
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  let raf = 0;
  let live = false;
  const fit = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };
  const loop = (now: number) => {
    fit();
    drawFlames(ctx, canvas.width, canvas.height, (now / 1000) * speed, amp);
    if (live) raf = requestAnimationFrame(loop);
  };
  if (reduceMotion()) {
    fit();
    drawFlames(ctx, canvas.width, canvas.height, 2, amp);
    return () => {};
  }
  const io = new IntersectionObserver(([e]) => {
    const was = live;
    live = e.isIntersecting;
    if (live && !was) raf = requestAnimationFrame(loop);
  });
  io.observe(canvas);
  return () => {
    live = false;
    cancelAnimationFrame(raf);
    io.disconnect();
  };
}
