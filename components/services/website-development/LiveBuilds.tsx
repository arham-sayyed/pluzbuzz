'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CAROUSEL, coverFontsReady, coverImage, DEVICES, SITES } from './data';

// WebGL (ogl) carousel: client-only.
const FlexCarousel = dynamic(() => import('@/components/FlexCarousel'), { ssr: false });

/** A live card must stay centred this long before the preview swaps to it, so fast drags don't load every site on the way. */
const SETTLE_MS = 800;
const DEFAULT_SITE = CAROUSEL[0].site ?? 0;

const scrollToEl = (el: Element | null, offset: number) => {
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
};

export default function LiveBuilds() {
  const liveRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [covers, setCovers] = useState<string[]>([]);
  const [site, setSite] = useState(DEFAULT_SITE);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [device, setDevice] = useState(0);
  const [liveOn, setLiveOn] = useState(false);
  const [box, setBox] = useState({ w: 1200, vh: 900 });

  useEffect(() => {
    let alive = true;
    coverFontsReady().then(() => alive && setCovers(CAROUSEL.map(coverImage)));

    // Load the iframe only as the preview approaches the viewport.
    const lio = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLiveOn(true);
          lio.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    if (liveRef.current) lio.observe(liveRef.current);

    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = Math.round(el.clientWidth);
      setBox(b => (Math.abs(w - b.w) > 2 || innerHeight !== b.vh ? { w, vh: innerHeight } : b));
    };
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    addEventListener('resize', measure);
    measure();
    return () => {
      alive = false;
      clearTimeout(settleTimer.current);
      lio.disconnect();
      ro.disconnect();
      removeEventListener('resize', measure);
    };
  }, []);

  // Follow the carousel: every index change restarts the settle timer; only a live card left centred wins.
  const onCarouselChange = (i: number) => {
    clearTimeout(settleTimer.current);
    const live = CAROUSEL[i]?.site;
    if (live !== undefined) settleTimer.current = setTimeout(() => setSite(live), SETTLE_MS);
  };

  const goLive = (i: number) => {
    clearTimeout(settleTimer.current);
    setSite(i);
    setLiveOn(true);
    scrollToEl(liveRef.current, 90);
  };

  // Frame the chosen device at true CSS width, scaled down to fit the stage.
  const vw = DEVICES[device][1];
  const W = Math.max(280, box.w);
  const avail = Math.max(320, box.vh - 210);
  const fw0 = device === 0 ? Math.min(W, avail * 1.6) : Math.min(W, vw);
  const scale = Math.min(1, fw0 / vw);
  const fw = vw * scale;
  const fh = device === 0 ? Math.min(avail, fw / 1.6) : avail;
  const [name, url] = SITES[site];
  const host = url.replace(/^https?:\/\//, '').replace(/%20/g, ' ');

  return (
    <section id="live" data-screen-label="Live builds" style={{ position: "relative", background: "#080b38", color: "#fff", padding: "clamp(64px,8vw,120px) 0 clamp(64px,8vw,110px)", overflow: "hidden" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px,4vw,56px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(50px,7vw,120px)", lineHeight: ".86", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Live.</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block", color: "#ffc83d" }}>Not a mockup.</span></span></h2>
        <p data-r="up" style={{ maxWidth: "420px", color: "rgba(255,255,255,.72)", fontSize: "17px", lineHeight: "1.55" }}>Drag through sites we’ve shipped. Pick a live one and it opens below, running for real. Scroll inside it.</p>
      </div>
      <div style={{ height: "clamp(360px,50vh,520px)", marginTop: "clamp(20px,3vw,40px)", color: "#fff" }}>
        {covers.length > 0 && (
          <FlexCarousel
            items={CAROUSEL.map((it, k) => ({ src: covers[k], alt: it.title + ' website', title: it.title, subtitle: it.subtitle }))}
            preset="liquid"
            intro="deal"
            fit="landscape"
            cardHeight={0.62}
            gap={14}
            radius={10}
            squeeze={0.2}
            focusOnClick={false}
            captureWheel={false}
            ariaLabel="Websites we have shipped"
            onChange={onCarouselChange}
            onSelect={i => {
              const it = CAROUSEL[i];
              if (it.site !== undefined) goLive(it.site);
              else scrollToEl(document.getElementById('cases'), 80);
            }}
          />
        )}
      </div>

      <div ref={liveRef} style={{ maxWidth: "1440px", margin: "clamp(24px,3vw,40px) auto 0", padding: "0 clamp(20px,4vw,56px)", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "14px" }}>
          <div role="tablist" aria-label="Live sites" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SITES.map(([n], i) => {
              const on = i === site;
              return <button key={n} type="button" role="tab" aria-selected={on} onClick={() => { clearTimeout(settleTimer.current); setSite(i); }} style={{ padding: "11px 16px", borderRadius: "6px", border: "1px solid rgba(255,255,255,.22)", background: on ? '#ffc83d' : 'transparent', color: on ? '#080b38' : '#fff', fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>{n}</button>;
            })}
          </div>
          <div role="group" aria-label="Device" style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "8px", background: "rgba(255,255,255,.08)" }}>
            {DEVICES.map(([n], i) => {
              const on = i === device;
              return <button key={n} type="button" aria-pressed={on} onClick={() => setDevice(i)} style={{ padding: "9px 14px", border: "0", borderRadius: "5px", background: on ? '#fff' : 'transparent', color: on ? '#080b38' : '#fff', fontFamily: "'IBM Plex Mono'", fontSize: "12px", cursor: "pointer" }}>{n}</button>;
            })}
          </div>
        </div>
        <div ref={stageRef} style={{ position: "relative", display: "flex", justifyContent: "center", padding: "18px 0 0" }}>
          <div style={{ width: fw + 'px', transition: "width .6s cubic-bezier(.7,0,.25,1)", borderRadius: device === 0 ? '12px' : '22px', overflow: "hidden", background: "#fff", border: device === 0 ? '0' : '8px solid #1a1f5c', boxShadow: "0 40px 80px -40px rgba(0,0,0,.7)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#f4f4f7", color: "#0a0c24" }}>
              <div style={{ display: "flex", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c3c5d4" }}></span><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c3c5d4" }}></span><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c3c5d4" }}></span></div>
              <div style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "5px", background: "#fff", fontFamily: "'IBM Plex Mono'", fontSize: "12px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2fbf71", flex: "none" }}></span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{host}</span></div>
              <a href={url} target="_blank" rel="noreferrer" style={{ flex: "none", fontFamily: "'IBM Plex Mono'", fontSize: "12px", fontWeight: "500", color: "#3a5bff" }}>Open ↗</a>
            </div>
            <div style={{ position: "relative", height: fh + 'px', overflow: "hidden", background: "#f4f4f7", transition: "height .6s" }}>
              <p style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#55566a" }}>Loading {host}…</p>
              {liveOn && (
                <iframe src={url} title={name + ' — live preview'} loading="lazy" style={{ position: "absolute", left: "0", top: "0", border: "0", background: "#fff", width: vw + 'px', height: fh / scale + 'px', transform: `scale(${scale})`, transformOrigin: "0 0" }}></iframe>
              )}
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "rgba(255,255,255,.55)", textAlign: "center" }}>Some sites block embedded previews. If one stays blank, use Open ↗.</p>
      </div>
    </section>
  );
}
