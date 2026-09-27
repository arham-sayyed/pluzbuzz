'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { drawFlames } from '@/lib/flames';

type RevealEl = HTMLElement & { __d?: number; __rev?: HTMLElement };

const EASE = 'cubic-bezier(.2,.7,.2,1)';
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeIn = (x: number) => x * x;

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count);
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / 1000);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Page shell: plays the flame + logo intro, then drives the scroll reveals
 * (`data-r`), word highlighting (`data-words`), counters (`data-count`) and
 * horizontal scroll parallax (`data-sx`) for everything rendered inside it.
 */
export default function MotionRoot({ intro = true, children }: { intro?: boolean; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [introVisible, setIntroVisible] = useState(intro);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let introRaf = 0;
    let raf = 0;
    let io: IntersectionObserver | null = null;
    let revealsOn = false;
    let logoShown = false;
    let lifted = false;
    let disposed = false;

    // word-by-word highlight
    const wordEls: { p: HTMLElement; spans: HTMLElement[]; last: number }[] = [];
    if (motion) {
      root.querySelectorAll<HTMLElement>('[data-words]').forEach(p => {
        const words = (p.textContent ?? '').trim().split(/\s+/);
        p.textContent = '';
        words.forEach((w, i) => {
          const s = document.createElement('span');
          s.textContent = w + (i < words.length - 1 ? ' ' : '');
          s.style.opacity = '.18';
          s.style.transition = 'opacity .2s';
          p.appendChild(s);
        });
        wordEls.push({ p, spans: [...p.children] as HTMLElement[], last: -1 });
      });
    }

    // reveal prep
    const revealEls = [...root.querySelectorAll<RevealEl>('[data-r]')];
    if (motion) {
      revealEls.forEach(el => {
        const k = el.dataset.r;
        el.__d = Number(el.dataset.d) || 0;
        el.style.transform = k === 'mask' ? 'translateY(102%)' : k === 'bar' ? 'scaleX(0)' : k === 'fade' ? 'none' : 'translateY(24px)';
        if (k !== 'mask' && k !== 'bar') el.style.opacity = '0';
      });
    }

    const startReveals = (extra: number) => {
      revealsOn = true;
      if (!motion || disposed) return;
      let firstBatch = true;
      const show = (el: RevealEl) => {
        const d = (el.__d ?? 0) + (firstBatch ? extra : 0);
        el.style.transition = `opacity .6s ${EASE} ${d}ms, transform .8s ${EASE} ${d}ms`;
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
      };
      io = new IntersectionObserver(
        es => {
          es.forEach(e => {
            if (!e.isIntersecting) return;
            const t = e.target as RevealEl;
            show(t.__rev || t);
            io?.unobserve(t);
          });
          firstBatch = false;
        },
        { threshold: 0, rootMargin: '0px 0px -6% 0px' }
      );
      revealEls.forEach(el => {
        const parent = el.parentElement as RevealEl | null;
        if (el.dataset.r === 'mask' && parent) {
          parent.__rev = el;
          io?.observe(parent);
        } else io?.observe(el);
      });
    };

    // scroll-linked effects
    const sx = [...root.querySelectorAll<HTMLElement>('[data-sx]')];
    const tick = () => {
      raf = 0;
      if (!motion) return;
      const vh = innerHeight;
      wordEls.forEach(o => {
        const r = o.p.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const n = Math.round(p * o.spans.length);
        if (n !== o.last) {
          o.spans.forEach((s, i) => {
            s.style.opacity = i < n ? '1' : '.18';
          });
          o.last = n;
        }
      });
      sx.forEach(el => {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        el.style.transform = `translate3d(${(r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.sx ?? '0')}px,0,0)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', tick);
    tick();

    // intro
    const endIntro = () => {
      document.documentElement.style.overflow = '';
      if (!revealsOn) startReveals(0);
      setIntroVisible(false);
    };
    const showLogo = () => {
      const lg = logoRef.current;
      if (!lg || logoShown) return;
      logoShown = true;
      lg.style.transition = 'opacity .45s ease .15s, transform .9s cubic-bezier(.2,.7,.2,1) .15s';
      lg.style.opacity = '1';
      lg.style.transform = 'translate(-50%,-50%) scale(1)';
    };
    const lift = () => {
      if (lifted) return;
      lifted = true;
      cancelAnimationFrame(introRaf);
      const el = introRef.current;
      const lg = logoRef.current;
      const cv = canvasRef.current;
      if (cv) cv.style.opacity = '0';
      if (!el) {
        startReveals(0);
        endIntro();
        return;
      }
      if (lg) {
        if (!logoShown) {
          lg.style.transition = 'none';
          lg.style.opacity = '1';
          lg.style.transform = 'translate(-50%,-50%) scale(1)';
          void lg.offsetWidth;
        }
        // zoom into the logo's "Z" until it swallows the screen
        lg.style.transformOrigin = '91.6% 44.4%';
        lg.style.transition = 'transform 1.15s cubic-bezier(.7,0,.25,1), opacity .45s ease .7s';
        lg.style.transform = 'translate(-50%,-50%) scale(60)';
        lg.style.opacity = '0';
      }
      el.style.transition = 'opacity .5s ease .7s';
      el.style.opacity = '0';
      startReveals(800);
      timers.push(setTimeout(endIntro, 1250));
    };
    const runIntro = () => {
      const cv = canvasRef.current;
      const ctx = cv?.getContext('2d');
      if (!cv || !ctx) return endIntro();
      document.documentElement.style.overflow = 'hidden';
      const w = (cv.width = innerWidth);
      const h = (cv.height = innerHeight);
      const t0 = performance.now();
      const frame = (now: number) => {
        const e = now - t0;
        const amp = e < 900 ? easeOut(e / 900) : e < 1700 ? 1 : e < 2400 ? 1 - easeIn((e - 1700) / 700) : 0;
        drawFlames(ctx, w, h, e / 1000, amp);
        if (e < 2400) introRaf = requestAnimationFrame(frame);
        else {
          ctx.clearRect(0, 0, w, h);
          timers.push(setTimeout(showLogo, 550), setTimeout(lift, 2300));
        }
      };
      introRaf = requestAnimationFrame(frame);
    };
    skipRef.current = () => {
      timers.forEach(clearTimeout);
      lift();
    };

    if (intro && motion) runIntro();
    else endIntro();

    return () => {
      disposed = true;
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', tick);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(introRaf);
      timers.forEach(clearTimeout);
      io?.disconnect();
      document.documentElement.style.overflow = '';
    };
  }, [intro]);

  return (
    <div ref={rootRef} style={{ position: 'relative', background: '#fff' }}>
      {introVisible && (
        <div
          ref={introRef}
          onClick={() => skipRef.current()}
          aria-hidden="true"
          style={{ position: 'fixed', inset: '0', zIndex: '200', background: '#220848', overflow: 'hidden', cursor: 'pointer', willChange: 'transform' }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}></canvas>
          {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF must not be re-encoded */}
          <img
            ref={logoRef}
            src="/assets/logo-intro.gif"
            alt=""
            width="1152"
            height="648"
            style={{ position: 'absolute', left: '50%', top: '50%', width: 'min(720px,84vw)', height: 'auto', transform: 'translate(-50%,-50%) scale(.92)', opacity: '0', willChange: 'transform,opacity', pointerEvents: 'none' }}
          />
          <span style={{ position: 'absolute', right: '24px', bottom: '20px', fontFamily: "'IBM Plex Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'rgba(255,255,255,.35)' }}>CLICK TO SKIP</span>
        </div>
      )}
      {children}
    </div>
  );
}
