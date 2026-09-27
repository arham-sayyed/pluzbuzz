'use client';

import { useEffect, useRef, useState } from 'react';
import { MOBILE_BP } from '@/lib/use-viewport';

const STEPS = [
  ['Strategy', 'Positioning'],
  ['Build', 'Website + UX'],
  ['Acquire', 'SEO + Advert'],
  ['Optimise', 'Analytics']
];

export default function HowWeWork() {
  const howRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const step = Math.min(3, Math.floor(progress * 4));

  // Pinned for 340vh on desktop; unpins (plain flow) on mobile or when the content is taller than the viewport.
  useEffect(() => {
    const how = howRef.current;
    if (!how) return;
    const frame = how.firstElementChild as HTMLElement;
    const grid = frame.firstElementChild as HTMLElement;
    let unpinned = false;
    let raf = 0;
    const layout = () => {
      const m = innerWidth < MOBILE_BP;
      Object.assign(frame.style, { position: 'sticky', height: '100svh', padding: '88px clamp(20px,4vw,56px) 24px' });
      grid.style.gridTemplateColumns = m ? '' : 'minmax(0,1fr) minmax(0,1fr)';
      unpinned = m || grid.offsetHeight > innerHeight - 112;
      how.style.height = unpinned ? 'auto' : '340vh';
      if (unpinned) {
        grid.style.gridTemplateColumns = '';
        Object.assign(frame.style, { position: 'relative', height: 'auto', padding: '64px clamp(20px,4vw,56px)' });
      }
    };
    const tick = () => {
      raf = 0;
      const vh = innerHeight;
      const r = how.getBoundingClientRect();
      setProgress(
        unpinned
          ? Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height))
          : Math.min(1, Math.max(0, -r.top / (r.height - vh)))
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      layout();
      tick();
    };
    onResize();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section ref={howRef} data-screen-label="How we work" style={{ position: "relative", height: "340vh", background: "#f4f4f7" }}>
      <div style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", display: "flex", alignItems: "center", padding: "96px clamp(20px,4vw,56px) 32px" }}>
        <div style={{ maxWidth: "1440px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(28px,5vw,80px)", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: "0" }}>
            <p style={{ display: "flex", gap: "12px", alignItems: "center", fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}><span>How We Work</span><span style={{ padding: "4px 10px", background: "#fff", borderRadius: "4px", letterSpacing: ".04em" }}>One connected team</span></p>
            <div style={{ position: "relative", height: "clamp(72px,min(11vw,22vh),190px)", overflow: "hidden" }}>
              {STEPS.map(([word], i) => (
                <span key={word} style={{ position: "absolute", left: "0", top: "0", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(72px,min(11vw,22vh),190px)", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-.01em", transition: "transform .6s cubic-bezier(.7,0,.2,1),opacity .4s", transform: `translateY(${(i - step) * 105}%)`, opacity: i === step ? 1 : 0 }}>{word}</span>
              ))}
            </div>
            <p style={{ fontSize: "clamp(18px,1.6vw,24px)", fontWeight: "500" }}>{STEPS[step][1]}</p>
            <p style={{ color: "#55566a", fontSize: "16px", lineHeight: "1.55", maxWidth: "460px" }}>Every lane is planned as one commercial system, not as separate tasks.</p>
          </div>
          <ol style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
            {STEPS.map(([word, sub], i) => {
              const on = i === step;
              return (
                <li key={word} style={{ borderRadius: "8px", padding: "clamp(10px,1.8vh,18px) 22px", display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: "14px", transition: "background .35s,color .35s", background: on ? '#080b38' : '#fff', color: on ? '#fff' : '#0a0c24' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: on ? '#ffc83d' : '#3a5bff' }}>{'0' + (i + 1)}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "10px" }}><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "28px", textTransform: "uppercase", lineHeight: "1" }}>{word}</span><span style={{ height: "2px", background: "rgba(127,127,160,.25)", position: "relative", overflow: "hidden" }}><span style={{ position: "absolute", left: "0", top: "0", bottom: "0", background: "#ffc83d", width: Math.min(1, Math.max(0, progress * 4 - i)) * 100 + '%' }}></span></span></span>
                  <span style={{ fontSize: "14px", opacity: ".75" }}>{sub}</span>
                </li>
              );
            })}
            <li style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "8px", fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#55566a" }}><span>Web</span><span>/</span><span>SEO</span><span>/</span><span>Advertise</span><span>/</span><span>Creative</span><span>/</span><span>Content</span><span>/</span><span>Analytics</span></li>
          </ol>
        </div>
      </div>
    </section>
  );
}
