import { useCallback, useEffect, useState, type RefObject } from 'react';
import type MatterJS from 'matter-js';

/** 'hover' has no meaning on touch screens; there it behaves like 'scroll' (drops once the stage is in view). */
export type FallTrigger = 'auto' | 'hover' | 'click' | 'scroll';

type Item = { el: HTMLElement; body: MatterJS.Body };

const STEP = 1000 / 60;
/** A touch that moves further than this is a scroll or a drag, not a tap. */
const TAP_SLOP = 10;

/**
 * Physics for text, adapted from React Bits' <FallingText />: every `[data-w]` element inside `layoutRef` becomes a
 * Matter.js body that falls, piles up, and can be grabbed and thrown (mouse or touch). Clicking or tapping empty space
 * shakes whatever is near. `layoutRef` must be positioned; the elements are moved with transforms relative to it.
 *
 * Matter.js is loaded on first drop, so it costs nothing until then.
 */
export function useFallingText(
  stageRef: RefObject<HTMLElement | null>,
  layoutRef: RefObject<HTMLElement | null>,
  { trigger = 'hover', gravity = 1, stiffness = 0.2 }: { trigger?: FallTrigger; gravity?: number; stiffness?: number } = {}
) {
  const [fallen, setFallen] = useState(false);
  const [throws, setThrows] = useState(0);
  const [epoch, setEpoch] = useState(0);

  const reset = useCallback(() => {
    setFallen(false);
    setThrows(0);
    setEpoch(e => e + 1);
  }, []);

  useEffect(() => {
    const st = stageRef.current;
    const lay = layoutRef.current;
    if (!st || !lay) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const trig: FallTrigger = coarse && trigger === 'hover' ? 'scroll' : trigger;

    let M: typeof MatterJS | null = null;
    let engine: MatterJS.Engine | null = null;
    let items: Item[] = [];
    const byEl = new Map<Element, MatterJS.Body>();
    let drag: MatterJS.Constraint | null = null;
    let dragEl: HTMLElement | null = null;
    let tap: { x: number; y: number; id: number; t: number } | null = null;
    let started = false;
    let disposed = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let off = { x: 0, y: 0 };
    let W = 0;
    let H = 0;
    let builtW = innerWidth;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const pt = (e: PointerEvent) => {
      const r = st.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    // Fixed 60Hz steps, so 120Hz phones don't play at double speed; paused while the stage is off screen.
    const loop = (now: number) => {
      raf = 0;
      if (!engine || !M) return;
      acc += Math.min(100, now - last);
      last = now;
      while (acc >= STEP) {
        M.Engine.update(engine, STEP);
        acc -= STEP;
      }
      paint();
      run();
    };
    const paint = () => {
      for (const { el, body } of items) {
        el.style.transform = `translate(${(body.position.x - off.x).toFixed(1)}px,${(body.position.y - off.y).toFixed(1)}px) translate(-50%,-50%) rotate(${body.angle.toFixed(4)}rad)`;
      }
    };
    // requestAnimationFrame already stops in background tabs, and the step catch-up above is capped at 100ms.
    const run = () => {
      if (raf || !engine || !visible) return;
      raf = requestAnimationFrame(loop);
    };
    const resume = () => {
      last = performance.now();
      acc = 0;
      run();
    };

    const start = async () => {
      if (started) return;
      started = true;
      const [{ default: Matter }] = await Promise.all([import('matter-js'), document.fonts?.ready]);
      if (disposed) return;
      M = Matter;
      const sr = st.getBoundingClientRect();
      const lr = lay.getBoundingClientRect();
      W = sr.width;
      H = sr.height;
      off = { x: lr.left - sr.left, y: lr.top - sr.top };
      builtW = innerWidth;
      // The words are about to leave the flow; hold the stage at its current size.
      lay.style.height = lr.height + 'px';

      const els = [...lay.querySelectorAll<HTMLElement>('[data-w]')];
      const boxes = els.map(el => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2, w: r.width, h: r.height };
      });
      const eng = M.Engine.create();
      eng.gravity.y = gravity;
      eng.positionIterations = 8;
      const wall = { isStatic: true };
      M.Composite.add(eng.world, [
        M.Bodies.rectangle(W / 2, H + 50, W * 3, 100, wall),
        M.Bodies.rectangle(-50, H / 2, 100, H * 4, wall),
        M.Bodies.rectangle(W + 50, H / 2, 100, H * 4, wall),
        // High ceiling: a hard throw flies out of view and drops back in.
        M.Bodies.rectangle(W / 2, -H - 50, W * 3, 100, wall)
      ]);
      items = boxes.map(b => {
        const big = b.h > 100;
        const body = M!.Bodies.rectangle(b.x, b.y, b.w, b.h, { restitution: big ? 0.2 : 0.35, friction: 0.3, frictionAir: 0.012, density: big ? 0.0006 : 0.0012, chamfer: { radius: Math.min(8, b.h / 4) } });
        M!.Body.setVelocity(body, { x: (Math.random() - 0.5) * (big ? 2 : 4), y: 0 });
        M!.Body.setAngularVelocity(body, (Math.random() - 0.5) * (big ? 0.02 : 0.05));
        M!.Composite.add(eng.world, body);
        byEl.set(b.el, body);
        Object.assign(b.el.style, { width: b.w + 'px', height: b.h + 'px', boxSizing: 'border-box' });
        return { el: b.el, body };
      });
      items.forEach(({ el }) => Object.assign(el.style, { position: 'absolute', left: '0', top: '0' }));
      // Pin everything where it stood before the first frame, so nothing jumps even if frames are delayed.
      paint();
      engine = eng;
      resume();
      setFallen(true);
    };

    const burst = (p: { x: number; y: number }) => {
      if (!M) return;
      const R = Math.max(W, H) * 0.35;
      items.forEach(({ body }) => {
        const dx = body.position.x - p.x;
        const dy = body.position.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d > R) return;
        const k = (1 - d / R) * 14;
        M!.Body.setVelocity(body, { x: body.velocity.x + (dx / d) * k, y: body.velocity.y + (dy / d) * k - k * 0.6 });
        M!.Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - 0.5) * 0.1);
      });
    };

    const release = () => {
      if (!drag || !M || !engine) return false;
      M.Composite.remove(engine.world, drag);
      drag = null;
      if (dragEl) dragEl.style.cursor = '';
      dragEl = null;
      return true;
    };

    const onDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      if (!started) {
        if (trig !== 'scroll' || coarse) start();
        return;
      }
      if (!M || !engine) return;
      const el = (e.target as Element).closest?.('[data-w]');
      const p = pt(e);
      const b = el && byEl.get(el);
      if (b) {
        drag = M.Constraint.create({ pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y }, stiffness, damping: 0.1, length: 0 });
        M.Composite.add(engine.world, drag);
        st.setPointerCapture(e.pointerId);
        dragEl = el as HTMLElement;
        dragEl.style.cursor = 'grabbing';
        e.preventDefault();
      } else if (e.pointerType === 'mouse') {
        burst(p);
      } else {
        // On touch, empty space scrolls the page; only a tap (no travel) shakes things.
        tap = { ...p, id: e.pointerId, t: e.timeStamp };
      }
    };
    const onMove = (e: PointerEvent) => {
      if (drag) drag.pointA = pt(e);
      else if (tap && e.pointerId === tap.id) {
        const p = pt(e);
        if (Math.hypot(p.x - tap.x, p.y - tap.y) > TAP_SLOP) tap = null;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (release()) setThrows(n => n + 1);
      else if (tap && e.pointerId === tap.id && e.timeStamp - tap.t < 500) burst(tap);
      tap = null;
    };
    const onCancel = () => {
      release();
      tap = null;
    };
    const onEnter = (e: PointerEvent) => {
      if (trig === 'hover' && e.pointerType === 'mouse') start();
    };
    const onResize = () => {
      if (started && Math.abs(innerWidth - builtW) > 60) {
        timers.forEach(clearTimeout);
        timers.push(setTimeout(reset, 250));
      }
    };

    const io = new IntersectionObserver(
      ([en]) => {
        visible = en.isIntersecting;
        if (visible) resume();
        if (trig === 'scroll' && !reduce && !started && en.intersectionRatio >= 0.4) timers.push(setTimeout(start, coarse ? 900 : 500));
      },
      { threshold: [0, 0.4] }
    );
    io.observe(st);
    if (trig === 'auto' && !reduce) timers.push(setTimeout(start, 1400));

    st.addEventListener('pointerdown', onDown);
    st.addEventListener('pointermove', onMove);
    st.addEventListener('pointerup', onUp);
    st.addEventListener('pointercancel', onCancel);
    st.addEventListener('pointerenter', onEnter);
    addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      io.disconnect();
      st.removeEventListener('pointerdown', onDown);
      st.removeEventListener('pointermove', onMove);
      st.removeEventListener('pointerup', onUp);
      st.removeEventListener('pointercancel', onCancel);
      st.removeEventListener('pointerenter', onEnter);
      removeEventListener('resize', onResize);
      if (M && engine) {
        M.Composite.clear(engine.world, false);
        M.Engine.clear(engine);
      }
      items.forEach(({ el }) => {
        for (const k of ['position', 'left', 'top', 'width', 'height', 'transform', 'boxSizing', 'cursor'] as const) el.style[k] = '';
      });
      lay.style.height = '';
    };
  }, [stageRef, layoutRef, trigger, gravity, stiffness, epoch, reset]);

  return { fallen, throws, reset };
}
