'use client';

import { useEffect, useRef, useState } from 'react';
import RefineFrame, { type RefineFrameStatus } from '@/components/RefineFrame';

const LABELS = { queued: 'Your brand', generating: 'Positioning', refining: 'Identity', complete: 'Clear picture' };

/** The "brand poster" the frame resolves into: logo on white over a navy services band. */
function brandPoster(logo: HTMLImageElement) {
  const c = document.createElement('canvas');
  c.width = 1200;
  c.height = 900;
  const x = c.getContext('2d')!;
  x.fillStyle = '#ffffff';
  x.fillRect(0, 0, 1200, 600);
  if (logo.naturalWidth) {
    const w = 920;
    const h = (w * logo.naturalHeight) / logo.naturalWidth;
    x.drawImage(logo, (1200 - w) / 2, 300 - h / 2, w, h);
  }
  x.fillStyle = '#080b38';
  x.fillRect(0, 600, 1200, 300);
  x.fillStyle = '#F2D458';
  x.fillRect(80, 680, 72, 8);
  x.fillStyle = '#ffffff';
  x.font = "800 76px 'Barlow Condensed', sans-serif";
  x.fillText('SEO · WEBSITES · GROWTH · APP', 80, 790);
  x.fillStyle = 'rgba(255,255,255,.6)';
  x.font = "500 24px 'IBM Plex Mono', monospace";
  x.fillText('OLD STREET, SHOREDITCH — LONDON', 80, 845);
  return c.toDataURL('image/png');
}

export default function ClearPicture() {
  const secRef = useRef<HTMLElement>(null);
  const [poster, setPoster] = useState('');
  const [status, setStatus] = useState<RefineFrameStatus>('queued');

  useEffect(() => {
    let alive = true;
    const logo = new Image();
    logo.src = '/assets/logo.gif';
    Promise.all([
      new Promise(r => (logo.complete ? r(0) : (logo.onload = logo.onerror = r))),
      document.fonts?.ready
    ]).then(() => alive && setPoster(brandPoster(logo)));
    return () => {
      alive = false;
    };
  }, []);

  // Scroll progress through the section walks the frame from pixelated to sharp.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const sec = secRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height * 0.85)));
      setStatus(p < 0.25 ? 'queued' : p < 0.5 ? 'generating' : p < 0.75 ? 'refining' : 'complete');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={secRef} data-screen-label="Clear picture" style={{ padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)", background: "#f4f4f7" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "640px" }}>
            <RefineFrame className="pb-refine" status={status} width={640} radius={10} background="#e9e9ef" color="#0a0c24" stageDuration={420} sweep={false} hideAfter={0} labels={LABELS}>
              {/* eslint-disable-next-line @next/next/no-img-element -- canvas-generated data URL */}
              {poster ? <img src={poster} alt="PluzBuzz brand identity" /> : null}
            </RefineFrame>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p data-r="up" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}>Brand + Positioning</p>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,5.4vw,84px)", lineHeight: ".9", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Your brand exists.</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="80" style={{ display: "block" }}>It just needs a</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="160" style={{ display: "block" }}><span style={{ position: "relative", display: "inline-block", padding: "0 .06em" }}><span data-r="bar" data-d="700" style={{ position: "absolute", left: "0", right: "0", bottom: ".06em", height: ".38em", background: "#ffc83d", transformOrigin: "0 50%" }}></span><span style={{ position: "relative" }}>clear picture.</span></span></span></span></h2>
          <p data-r="up" data-d="120" style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.6", maxWidth: "520px" }}>We build digital ecosystems through strategy, design, engineering, and performance-led marketing that create long-term, measurable business impact.</p>
          <p data-r="up" data-d="180" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#55566a" }}>Keep scrolling to bring it into focus.</p>
        </div>
      </div>
    </section>
  );
}
