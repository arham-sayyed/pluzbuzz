'use client';

import { useEffect, useRef, useState } from 'react';
import { MOBILE_BP, PIN_STEPS_QUERY, useMediaQuery, useNarrowerThan, usePinnedStep } from '@/lib/use-viewport';
import { STAGES } from './data';

/** Browser preview that morphs through six build stages as the matching step scrolls past (sticky on desktop, pinned with the current step on phones). */
export default function Process() {
  const mobile = useNarrowerThan(MOBILE_BP);
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [sg, setStage] = useState(0);
  // Phones: one pinned screen, stepping through the stages with scroll progress.
  const pinned = useMediaQuery(PIN_STEPS_QUERY);
  usePinnedStep(trackRef, STAGES.length, pinned, setStage);

  // Desktop (and short landscape phones): the step nearest the middle of the screen is active.
  useEffect(() => {
    if (pinned) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const rows = listRef.current?.querySelectorAll('[data-stage]');
      if (!rows?.length) return;
      const target = innerHeight * (mobile ? 0.72 : 0.5);
      let best = 0;
      let bd = Infinity;
      rows.forEach((r, i) => {
        const b = r.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - target);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setStage(best);
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
  }, [mobile, pinned]);

  const dz = sg >= 2; // designed: colour arrives from stage 3 on
  const v = {
    pv: {
      num: '0' + (sg + 1),
      url: STAGES[sg][3],
      lock: sg === 5 ? '#2fbf71' : sg >= 3 ? '#F2D458' : '#b4b7c9',
      frameW: sg === 3 ? '360px' : '100%',
      research: sg === 0 ? 1 : 0,
      site: sg >= 1 ? 1 : 0,
      wf: sg === 1 ? 1 : 0,
      dz: dz ? 1 : 0,
      box: sg === 1 ? '1.5px dashed #b4b7c9' : '1.5px solid transparent',
      ink: dz ? '#0a0c24' : '#8a8ca0',
      hero: dz ? '#080b38' : 'transparent',
      heroInk: dz ? '#fff' : '#b4b7c9',
      cta: dz ? '#ffc83d' : 'transparent',
      ctaInk: dz ? '#080b38' : '#8a8ca0',
      card: dz ? '#f4f4f7' : 'transparent',
      dev: sg === 3 ? 1 : 0,
      devY: sg === 3 ? '0px' : '12px',
      seo: sg === 4 ? 1 : 0,
      live: sg === 5 ? 1 : 0,
      liveY: sg === 5 ? '0px' : '14px',
      dash: sg === 5 ? 0 : 1
    },
    stages: STAGES.map(([tag, title, desc], i) => ({
      i,
      num: '0' + (i + 1),
      tag,
      title,
      desc,
      op: i === sg ? 1 : 0.32,
      numC: i === sg ? '#3a5bff' : '#55566a',
      bar: i < sg ? '100%' : i === sg ? '50%' : '0%'
    }))
  };

  return (
    <section id="process" data-screen-label="Process" style={{ position: "relative", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div className="wd-proc" style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", columnGap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
        <div className="wd-proc__head">
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,5.4vw,88px)", lineHeight: ".88", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Watch it</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block" }}>get built</span></span></h2>
            <p data-r="up" style={{ marginTop: "20px", maxWidth: "520px", color: "#55566a", fontSize: "17px", lineHeight: "1.6" }}>At PluzBuzz, our website development process includes business research, competitor analysis, UX strategy, design prototyping, development and testing, SEO optimisation, website launch, and ongoing performance improvement</p>
        </div>
        {/* Desktop: track and stage are display: contents, so browser and steps sit in the two-column grid.
            Phones: the stage pins to one screen, showing the browser and only the current step. */}
        <div ref={trackRef} className="wd-proc__track">
          <div className="wd-proc__pin">
            <div className="wd-proc__browser" style={{ zIndex: "2", background: "#fff", paddingBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: v.pv.frameW, maxWidth: "100%", transition: "width .7s cubic-bezier(.7,0,.25,1)", borderRadius: "12px", border: "1.5px solid #0a0c24", overflow: "hidden", background: "#fff", boxShadow: "0 30px 60px -34px rgba(8,11,56,.5)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderBottom: "1.5px solid #0a0c24", background: "#f4f4f7" }}>
                    <div style={{ display: "flex", gap: "6px" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", border: "1.5px solid #0a0c24" }}></span><span style={{ width: "9px", height: "9px", borderRadius: "50%", border: "1.5px solid #0a0c24" }}></span><span style={{ width: "9px", height: "9px", borderRadius: "50%", border: "1.5px solid #0a0c24" }}></span></div>
                    <div style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px", borderRadius: "5px", background: "#fff", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: v.pv.lock, flex: "none" }}></span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.pv.url}</span></div>
                    <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "11px", color: "#3a5bff" }}>{v.pv.num}/06</span>
                  </div>
                  <div className="wd-proc__screen" style={{ position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: "0", padding: "22px", display: "flex", flexDirection: "column", alignItems: "center", gap: "22px", opacity: v.pv.research, transition: "opacity .5s", pointerEvents: "none" }}>
                      <span style={{ padding: "10px 18px", border: "1.5px solid #0a0c24", borderRadius: "6px", fontFamily: "'IBM Plex Mono'", fontSize: "12px" }}>/ home</span>
                      <span style={{ width: "70%", height: "1.5px", background: "#0a0c24" }}></span>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px" }}><span style={{ padding: "8px 12px", border: "1.5px solid #0a0c24", borderRadius: "6px" }}>/services</span><span style={{ padding: "8px 12px", border: "1.5px solid #0a0c24", borderRadius: "6px" }}>/work</span><span style={{ padding: "8px 12px", border: "1.5px solid #0a0c24", borderRadius: "6px" }}>/about</span><span style={{ padding: "8px 12px", border: "1.5px solid #0a0c24", borderRadius: "6px" }}>/contact</span></div>
                      <div style={{ marginTop: "auto", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".1em", color: "#55566a" }}>COMPETITORS AUDITED</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "8px" }}><span style={{ height: "54px", borderRadius: "6px", background: "#f4f4f7", border: "1px solid #e1e2ea" }}></span><span style={{ height: "54px", borderRadius: "6px", background: "#f4f4f7", border: "1px solid #e1e2ea" }}></span><span style={{ height: "54px", borderRadius: "6px", background: "#f4f4f7", border: "1px solid #e1e2ea" }}></span></div>
                      </div>
                    </div>
                    <div style={{ position: "absolute", inset: "0", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", opacity: v.pv.site, transition: "opacity .5s" }}>
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "6px", border: v.pv.box, transition: "border-color .5s" }}>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "16px", textTransform: "uppercase", color: v.pv.ink, transition: "color .5s" }}>Your brand</span>
                        <span style={{ display: "flex", gap: "8px" }}><span style={{ width: "26px", height: "6px", borderRadius: "3px", background: "#dcdde6" }}></span><span style={{ width: "26px", height: "6px", borderRadius: "3px", background: "#dcdde6" }}></span><span style={{ width: "26px", height: "6px", borderRadius: "3px", background: "#dcdde6" }}></span></span>
                        <span style={{ position: "absolute", left: "10px", top: "-8px", padding: "0 5px", background: "#fff", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", color: "#8a8ca0", opacity: v.pv.wf, transition: "opacity .4s" }}>NAV</span>
                      </div>
                      <div style={{ position: "relative", flex: "1.3", borderRadius: "8px", border: v.pv.box, background: v.pv.hero, padding: "18px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "10px", transition: "background .6s,border-color .5s", overflow: "hidden" }}>
                        <p style={{ position: "relative", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(28px,3vw,44px)", lineHeight: ".9", textTransform: "uppercase", color: v.pv.heroInk, transition: "color .6s" }}>Own the<br />spotlight.</p>
                        <span style={{ position: "relative", alignSelf: "flex-start", padding: "9px 14px", borderRadius: "5px", border: v.pv.box, background: v.pv.cta, color: v.pv.ctaInk, fontSize: "12px", fontWeight: "600", transition: "background .6s,color .6s" }}>Book a call →</span>
                        <span style={{ position: "absolute", left: "10px", top: "8px", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", color: "#8a8ca0", opacity: v.pv.wf, transition: "opacity .4s" }}>HERO · H1 · CTA</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "10px", flex: ".7" }}>
                        <div style={{ position: "relative", borderRadius: "6px", border: v.pv.box, background: v.pv.card, transition: "background .6s" }}><span style={{ position: "absolute", left: "8px", top: "6px", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", color: "#8a8ca0", opacity: v.pv.wf }}>CARD</span><span style={{ position: "absolute", left: "10px", right: "10px", bottom: "12px", height: "6px", borderRadius: "3px", background: "#3a5bff", opacity: v.pv.dz, transition: "opacity .6s" }}></span></div>
                        <div style={{ position: "relative", borderRadius: "6px", border: v.pv.box, background: v.pv.card, transition: "background .6s" }}><span style={{ position: "absolute", left: "8px", top: "6px", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", color: "#8a8ca0", opacity: v.pv.wf }}>CARD</span><span style={{ position: "absolute", left: "10px", right: "10px", bottom: "12px", height: "6px", borderRadius: "3px", background: "#ffc83d", opacity: v.pv.dz, transition: "opacity .6s" }}></span></div>
                        <div style={{ position: "relative", borderRadius: "6px", border: v.pv.box, background: v.pv.card, transition: "background .6s" }}><span style={{ position: "absolute", left: "8px", top: "6px", fontFamily: "'IBM Plex Mono'", fontSize: "9.5px", color: "#8a8ca0", opacity: v.pv.wf }}>CARD</span><span style={{ position: "absolute", left: "10px", right: "10px", bottom: "12px", height: "6px", borderRadius: "3px", background: "#9a9bab", opacity: v.pv.dz, transition: "opacity .6s" }}></span></div>
                      </div>
                    </div>
                    <div style={{ position: "absolute", left: "14px", right: "14px", bottom: "14px", display: "flex", flexWrap: "wrap", gap: "6px", opacity: v.pv.dev, transform: `translateY(${v.pv.devY})`, transition: "opacity .4s,transform .5s", fontFamily: "'IBM Plex Mono'", fontSize: "11px" }}>
                      <span style={{ padding: "6px 10px", borderRadius: "4px", background: "#080b38", color: "#9be3a4" }}>✓ responsive</span><span style={{ padding: "6px 10px", borderRadius: "4px", background: "#080b38", color: "#9be3a4" }}>✓ forms</span><span style={{ padding: "6px 10px", borderRadius: "4px", background: "#080b38", color: "#9be3a4" }}>✓ cross-browser</span><span style={{ padding: "6px 10px", borderRadius: "4px", background: "#080b38", color: "#9be3a4" }}>✓ secure</span>
                    </div>
                    <div style={{ position: "absolute", inset: "0", pointerEvents: "none", opacity: v.pv.seo, transition: "opacity .45s", fontFamily: "'IBM Plex Mono'", fontSize: "11px" }}>
                      <span style={{ position: "absolute", left: "24px", top: "8px", padding: "5px 9px", borderRadius: "4px", background: "#3a5bff", color: "#fff" }}>&lt;title&gt; + meta</span>
                      <span style={{ position: "absolute", left: "36px", top: "40%", padding: "5px 9px", borderRadius: "4px", background: "#3a5bff", color: "#fff" }}>h1 · one per page</span>
                      <span style={{ position: "absolute", right: "24px", top: "22%", padding: "5px 9px", borderRadius: "4px", background: "#ffc83d", color: "#080b38" }}>schema.org ✓</span>
                      <span style={{ position: "absolute", right: "30px", bottom: "22%", padding: "5px 9px", borderRadius: "4px", background: "#3a5bff", color: "#fff" }}>alt=&quot;…&quot;</span>
                      <span style={{ position: "absolute", left: "24px", bottom: "12px", padding: "5px 9px", borderRadius: "4px", background: "#080b38", color: "#fff" }}>/services/website-development</span>
                    </div>
                    <div style={{ position: "absolute", right: "14px", bottom: "14px", width: "min(46%,220px)", padding: "12px", borderRadius: "8px", background: "#080b38", color: "#fff", opacity: v.pv.live, transform: `translateY(${v.pv.liveY})`, transition: "opacity .45s,transform .6s" }}>
                      <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "10px", letterSpacing: ".1em", color: "#F2D458" }}>● LIVE · ENQUIRIES</p>
                      <svg viewBox="0 0 200 60" style={{ display: "block", width: "100%", height: "auto", marginTop: "6px" }} aria-hidden="true"><polyline points="0,52 30,46 60,48 90,34 120,30 150,18 200,6" fill="none" stroke="#F2D458" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={v.pv.dash} style={{ transition: "stroke-dashoffset 1.4s ease .2s" }}></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ol ref={listRef} className="wd-proc__steps" style={{ listStyle: "none", margin: "28px 0 0", padding: "0", display: "flex", flexDirection: "column" }}>
              {v.stages.map(s => (
                <li key={s.i} className="wd-proc__stage" data-stage={s.i} data-active={s.i === sg ? '' : undefined} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px", borderTop: "1px solid rgba(10,12,36,.14)", padding: "28px 0", opacity: s.op, transition: "opacity .35s" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: s.numC }}>{s.num} — {s.tag}</span>
                  <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(32px,3.4vw,52px)", lineHeight: ".95", textTransform: "uppercase" }}>{s.title}</h3>
                  <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "460px" }}>{s.desc}</p>
                  <span style={{ display: "block", height: "3px", background: "#ececf2", borderRadius: "2px", overflow: "hidden", maxWidth: "220px" }}><span style={{ display: "block", height: "100%", width: s.bar, background: "#3a5bff", transition: "width .5s" }}></span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
