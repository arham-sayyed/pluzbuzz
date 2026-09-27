'use client';

import { useEffect, useRef, useState } from 'react';
import { PIN_STEPS_QUERY, useMediaQuery, usePinnedStep } from '@/lib/use-viewport';
import { INCLUDED } from './data';

const DEV_CHIPS: [string, string, string][] = [['WordPress', '16%', '20%'], ['Shopify', '84%', '20%'], ['CRM', '12%', '56%'], ['Payments', '88%', '56%'], ['WooCommerce', '26%', '86%'], ['APIs', '74%', '86%']];
/** Resting handle position (%) after the intro wipe: a sliver of the old site; the new site's content is inset to clear it. */
const REDO_REST = 10;
const SEO_ROWS: [string, string][] = [['Competitor agency', 'competitor-one.co.uk'], ['Another agency', 'another-agency.com'], ['Your brand — Website Development London', 'your-brand.co.uk']];

export default function Included() {
  const visualRef = useRef<HTMLDivElement>(null);
  const animTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [file, setFile] = useState(0);
  const [animOn, setAnimOn] = useState(false);
  // null until the visitor drags; before that the handle plays an intro sweep
  const [redo, setRedo] = useState<number | null>(null);

  // Play the first visual once it's properly on screen.
  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnimOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(animTimer.current);
    };
  }, []);

  // Each tab replays its visual from the "before" state.
  const pick = (i: number) => {
    if (i === file) return;
    clearTimeout(animTimer.current);
    setFile(i);
    setAnimOn(false);
    setRedo(null);
    animTimer.current = setTimeout(() => setAnimOn(true), 80);
  };

  // Phones: the tab grid pins to one screen and scrolling steps through the five parts, one at a time.
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery(PIN_STEPS_QUERY);
  usePinnedStep(trackRef, INCLUDED.length, pinned, pick);

  const a = animOn;
  const line = a ? 'solid' : 'dashed';
  const [, , title, desc, , plus] = INCLUDED[file];
  // Handle position in %: the rebuilt site shows to the right of it. Opens all "before", then wipes the new site in.
  const split = redo ?? (a ? REDO_REST : 100);
  const sweeping = redo === null;

  return (
    <section id="included" data-screen-label="What's included" style={{ position: "relative", background: "#f4f4f7", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(46px,6vw,96px)", lineHeight: ".88", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>What’s in</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block" }}>the build</span></span></h2>
          <p data-r="up" style={{ maxWidth: "420px", color: "#55566a", fontSize: "17px", lineHeight: "1.55" }}>Five parts of every website project. Select one to see what’s included.</p>
        </div>
        <div ref={trackRef} className="wd-incl-track">
          <div className="wd-incl" data-r="up" style={{ display: "grid", gap: "clamp(20px,3vw,48px)", alignItems: "start" }}>
          <div role="tablist" aria-label="Services included" style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #0a0c24" }}>
            {INCLUDED.map(([, , t], i) => {
              const on = i === file;
              return (
                <button key={t} type="button" role="tab" aria-selected={on} onClick={() => pick(i)} onMouseEnter={() => pick(i)} onFocus={() => pick(i)} style={{ display: "grid", gridTemplateColumns: "44px 1fr 24px", alignItems: "center", gap: "8px", padding: "20px 10px", border: "0", borderBottom: "1px solid rgba(10,12,36,.14)", background: on ? '#fff' : 'transparent', color: on ? '#0a0c24' : '#55566a', cursor: "pointer", textAlign: "left", fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "clamp(22px,2vw,28px)", lineHeight: "1", textTransform: "uppercase", transition: "background .25s,color .25s" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono'", fontWeight: "400", fontSize: "12px", color: on ? '#3a5bff' : '#9a9bab' }}>{'0' + (i + 1)}</span><span>{t}</span><span style={{ fontFamily: "'Schibsted Grotesk'", fontSize: "18px" }}>{on ? '→' : ''}</span>
                </button>
              );
            })}
          </div>
          <div role="tabpanel" style={{ minWidth: "0", display: "flex", flexDirection: "column", gap: "22px", padding: "clamp(18px,2.4vw,32px)", borderRadius: "12px", background: "#fff" }}>
            <div ref={visualRef} className="wd-incl__visual" style={{ position: "relative", borderRadius: "10px", background: "#f4f4f7", overflow: "hidden" }}>
              {file === 0 && (<>
                {/* Wireframe fills in to a finished design */}
                <div style={{ position: "absolute", inset: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ height: "30px", borderRadius: "6px", border: `1.5px ${line} #9a9bab`, background: a ? '#fff' : 'transparent', transition: "all .6s" }}></div>
                  <div style={{ position: "relative", flex: "1", borderRadius: "8px", border: `1.5px ${line} #9a9bab`, background: a ? '#080b38' : 'transparent', transition: "all .7s .1s", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "16px" }}><span style={{ position: "relative", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(24px,2.4vw,34px)", lineHeight: ".9", textTransform: "uppercase", color: a ? '#fff' : '#9a9bab', transition: "color .6s .3s" }}>Designed<br />to convert</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", height: "52px" }}><span style={{ borderRadius: "6px", border: `1.5px ${line} #9a9bab`, background: a ? '#3a5bff' : 'transparent', transition: "all .6s .2s" }}></span><span style={{ borderRadius: "6px", border: `1.5px ${line} #9a9bab`, background: a ? '#e3e4ec' : 'transparent', transition: "all .6s .3s" }}></span><span style={{ borderRadius: "6px", border: `1.5px ${line} #9a9bab`, background: a ? '#e3e4ec' : 'transparent', transition: "all .6s .4s" }}></span></div>
                </div>
                <span style={{ position: "absolute", right: "14px", bottom: "12px", fontFamily: "'IBM Plex Mono'", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", background: "#fff", color: "#0a0c24" }}>{a ? 'Final design' : 'Wireframe'}</span>
              </>)}
              {file === 1 && (<>
                {/* Integrations fan out from the site */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }} aria-hidden="true"><g stroke="#3a5bff" strokeWidth=".4" strokeDasharray="1.4 1.2" opacity={a ? 1 : 0} style={{ transition: "opacity .6s .4s" }}><line x1="50" y1="50" x2="16" y2="20"></line><line x1="50" y1="50" x2="84" y2="20"></line><line x1="50" y1="50" x2="12" y2="56"></line><line x1="50" y1="50" x2="88" y2="56"></line><line x1="50" y1="50" x2="26" y2="86"></line><line x1="50" y1="50" x2="74" y2="86"></line></g></svg>
                {DEV_CHIPS.map(([name, x, y], i) => <span key={name} style={{ position: "absolute", left: a ? x : '50%', top: a ? y : '50%', transform: `translate(-50%,-50%) scale(${a ? 1 : 0.4})`, opacity: a ? 1 : 0, transition: `all .6s cubic-bezier(.2,.7,.2,1) ${i * 70}ms`, padding: "8px 12px", borderRadius: "6px", background: "#fff", border: "1.5px solid #0a0c24", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>{name}</span>)}
                <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", padding: "14px 18px", borderRadius: "8px", background: "#080b38", color: "#fff", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "20px", textTransform: "uppercase", whiteSpace: "nowrap" }}>Your website</span>
              </>)}
              {file === 2 && (
                /* Add to basket, basket slides in */
                <div style={{ position: "absolute", inset: "18px", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", borderRadius: "8px", background: "#fff" }}><span style={{ flex: "1", borderRadius: "6px", backgroundColor: "#080b38", backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)", backgroundSize: "18px 18px" }}></span><span style={{ fontWeight: "600", fontSize: "14px" }}>Signature tote</span><span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: "700" }}>£48</span><span style={{ padding: "6px 10px", borderRadius: "4px", background: a ? '#2fbf71' : '#080b38', color: "#fff", fontSize: "11px", fontWeight: "600", transition: "all .4s .3s" }}>{a ? 'Added ✓' : 'Add to basket'}</span></span></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", borderRadius: "8px", background: "#080b38", color: "#fff", transform: `translateX(${a ? '0px' : '30px'})`, opacity: a ? 1 : 0, transition: "all .7s cubic-bezier(.2,.7,.2,1) .5s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".1em", color: "#F2D458" }}>BASKET · 1</span><span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span>Signature tote</span><span>£48</span></span><span style={{ height: "1px", background: "rgba(255,255,255,.2)" }}></span><span style={{ fontSize: "12px", opacity: ".7" }}>Card · Apple Pay · PayPal</span><span style={{ marginTop: "auto", padding: "10px", borderRadius: "5px", background: "#ffc83d", color: "#080b38", fontSize: "12px", fontWeight: "700", textAlign: "center" }}>Secure checkout</span></div>
                </div>
              )}
              {file === 3 && (
                /* Your brand climbs from #3 to #1 */
                <div style={{ position: "absolute", inset: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", borderRadius: "999px", background: "#fff", border: "1px solid #dcdde6", fontSize: "14px" }}><span style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #55566a" }}></span>website development london</div>
                  <div style={{ position: "relative", flex: "1" }}>
                    {SEO_ROWS.map(([t, url], i) => {
                      const you = i === 2;
                      const pos = a ? (you ? 0 : i + 1) : i;
                      const hi = you && a;
                      return <div key={url} style={{ position: "absolute", left: "0", right: "0", top: pos * 34 + '%', height: "30%", display: "flex", alignItems: "center", gap: "12px", padding: "0 14px", borderRadius: "8px", background: hi ? '#080b38' : '#fff', color: hi ? '#fff' : '#0a0c24', transition: "top .9s cubic-bezier(.7,0,.25,1) .3s,background .5s .9s,color .5s .9s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", width: "26px" }}>{'#' + (pos + 1)}</span><span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}><span style={{ fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</span><span style={{ fontSize: "11.5px", opacity: ".65" }}>{url}</span></span></div>;
                    })}
                  </div>
                </div>
              )}
              {file === 4 && (<>
                {/* Before / after slider */}
                {/* Before: a tired, dated site */}
                <div style={{ position: "absolute", inset: "0", background: "#e9e7e1", padding: "22px", display: "flex", flexDirection: "column", gap: "10px", filter: "grayscale(1)" }}><span style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#6b665c" }}>Welcome to our website</span><span style={{ height: "8px", width: "70%", background: "#cfccc4" }}></span><span style={{ height: "8px", width: "55%", background: "#cfccc4" }}></span><span style={{ fontFamily: "Georgia,serif", fontSize: "12px", color: "#6b665c", textDecoration: "underline" }}>Click here for more information</span><span style={{ flex: "1", border: "1px solid #cfccc4", background: "#f3f1ec" }}></span><span style={{ fontFamily: "'Times New Roman',serif", fontSize: "10.5px", color: "#8a857a", textAlign: "center" }}>Best viewed in 800×600 · Last updated 2014</span></div>
                {/* After: the rebuilt site in PluzBuzz's own language, revealed right of the handle */}
                <div className="wd-after" style={{ position: "absolute", inset: "0", background: "#fff", color: "#0a0c24", clipPath: `inset(0 0 0 ${split}%)`, transition: sweeping ? 'clip-path 1.1s cubic-bezier(.7,0,.25,1) .15s' : 'none', overflow: "hidden" }}>
                  <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", gap: "12px", padding: `14px 18px 40px calc(${REDO_REST}% + 28px)` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid #ececf2" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "7px", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "14px", textTransform: "uppercase" }}><span style={{ width: "11px", height: "11px", borderRadius: "2px", background: "#080b38" }}></span>Your brand</span>
                      <span className="wd-after-links" style={{ display: "flex", gap: "14px", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", letterSpacing: ".08em", color: "#55566a" }}><span>WORK</span><span>SERVICES</span><span>ABOUT</span></span>
                      <span style={{ padding: "5px 10px", borderRadius: "4px", background: "#080b38", color: "#fff", fontSize: "10.5px", fontWeight: "600" }}>Book a call</span>
                    </div>
                    <div className="wd-after-body" style={{ flex: "1", minHeight: "0", display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)", gap: "16px", alignItems: "end" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", letterSpacing: ".08em", textTransform: "uppercase", color: "#55566a" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffc83d" }}></span>Rebuilt · 2026</span>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(32px,3.4vw,50px)", lineHeight: ".86", letterSpacing: "-.01em", textTransform: "uppercase" }}>Built for<br /><span style={{ position: "relative", display: "inline-block", padding: "0 .06em" }}><span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: ".06em", height: ".38em", background: "#ffc83d" }}></span><span style={{ position: "relative" }}>today.</span></span></span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px", borderTop: "2px solid #0a0c24", paddingTop: "9px" }}>
                          <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#55566a", maxWidth: "240px" }}>Clear, fast and built to turn visits into enquiries.</span>
                          <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}><span style={{ padding: "7px 11px", borderRadius: "4px", background: "#080b38", color: "#fff", fontSize: "11px", fontWeight: "600" }}>Book a call →</span><span style={{ padding: "6px 10px", borderRadius: "4px", border: "1.5px solid #0a0c24", fontSize: "11px", fontWeight: "600" }}>See work</span></span>
                        </div>
                      </div>
                      <div className="wd-after-stats" style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                        <div style={{ position: "relative", borderRadius: "8px", background: "#080b38", color: "#fff", overflow: "hidden", padding: "10px 12px 12px" }}>
                          <span aria-hidden="true" style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(135deg,rgba(255,255,255,.045) 0 9px,transparent 9px 18px)" }}></span>
                          <span style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono'", fontSize: "8.5px", letterSpacing: ".1em", color: "rgba(255,255,255,.55)" }}><span>PAGESPEED</span><span>MOBILE</span></span>
                          <span style={{ position: "relative", display: "block", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "46px", lineHeight: "1", color: "#ffc83d", marginTop: "2px" }}>98</span>
                          <span style={{ position: "relative", display: "block", height: "3px", marginTop: "6px", background: "rgba(255,255,255,.12)" }}><span style={{ display: "block", height: "100%", width: "98%", background: "#3a5bff" }}></span></span>
                          <span style={{ position: "relative", display: "block", marginTop: "7px", fontFamily: "'IBM Plex Mono'", fontSize: "8.5px", color: "rgba(255,255,255,.6)" }}>LCP 1.1s · CLS 0.01</span>
                        </div>
                        <span style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", fontFamily: "'IBM Plex Mono'", fontSize: "9px", color: "#55566a" }}><span><span style={{ color: "#3a5bff" }}>✓</span> mobile-first</span><span><span style={{ color: "#3a5bff" }}>✓</span> schema</span><span><span style={{ color: "#3a5bff" }}>✓</span> a11y</span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <span style={{ position: "absolute", top: "0", bottom: "0", left: split + '%', width: "3px", marginLeft: "-1.5px", background: "#ffc83d", pointerEvents: "none", transition: sweeping ? 'left 1.1s cubic-bezier(.7,0,.25,1) .15s' : 'none' }}></span>
                <span style={{ position: "absolute", top: "50%", left: split + '%', width: "40px", height: "40px", margin: "-20px 0 0 -20px", borderRadius: "50%", background: "#ffc83d", color: "#080b38", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", pointerEvents: "none", transition: sweeping ? 'left 1.1s cubic-bezier(.7,0,.25,1) .15s' : 'none', boxShadow: "0 6px 18px rgba(8,11,56,.35)" }}>⇆</span>
                <span style={{ position: "absolute", left: "12px", bottom: "12px", padding: "4px 8px", borderRadius: "4px", background: "#6b665c", color: "#fff", fontFamily: "'IBM Plex Mono'", fontSize: "10.5px", pointerEvents: "none" }}>BEFORE</span><span style={{ position: "absolute", right: "12px", bottom: "12px", padding: "4px 8px", borderRadius: "4px", background: "#ffc83d", color: "#080b38", fontFamily: "'IBM Plex Mono'", fontSize: "10.5px", pointerEvents: "none" }}>AFTER</span>
                <input type="range" min="0" max="100" value={split} onChange={e => setRedo(Number(e.target.value))} aria-label="Drag to compare before and after" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", margin: "0", opacity: "0", cursor: "ew-resize" }} />
              </>)}
            </div>
            <span className="wd-incl__num" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>{'0' + (file + 1)} / 05</span>
            <h3 className="wd-incl__title" style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(34px,3.6vw,56px)", lineHeight: ".92", textTransform: "uppercase" }}>{title}</h3>
            <p className="wd-incl__desc" style={{ fontSize: "17px", lineHeight: "1.6", color: "#33344a", maxWidth: "680px", textWrap: "pretty" }}>{desc}</p>
            <ul className="wd-incl__list" style={{ listStyle: "none", margin: "0", padding: "22px 0 0", borderTop: "1px solid rgba(10,12,36,.12)", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,230px),1fr))", gap: "14px 24px" }}>
              {plus.map(p => (
                <li key={p} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: "500" }}><span style={{ flex: "none", width: "24px", height: "24px", borderRadius: "50%", background: "#ffc83d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#080b38" }}>✓</span>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
