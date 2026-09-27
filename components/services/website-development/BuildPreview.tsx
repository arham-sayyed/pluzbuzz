'use client';

import { useEffect, useRef, useState } from 'react';

const BUILD_MSGS = ['compiling…', 'nav rendered', 'h1 set', 'copy in', 'cta wired', 'images lazy-loaded', 'schema valid', 'live'];

/** Code types itself line by line on the left while each matching piece of the page appears on the right, then loops. */
export default function BuildPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [built, setBuilt] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const lines = [...root.querySelectorAll<HTMLElement>('[data-cl]')];
    const parts = [...root.querySelectorAll<HTMLElement>('[data-bs]')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !lines.length) {
      setBuilt(7);
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const later = (f: () => void, t: number) => timers.push(setTimeout(f, t));
    const reset = () => {
      lines.forEach(l => {
        l.style.transition = 'none';
        l.style.width = '0ch';
      });
      parts.forEach(p => {
        p.style.transition = 'opacity .35s, transform .35s';
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
      });
    };
    const run = () => {
      timers.forEach(clearTimeout);
      timers = [];
      reset();
      setBuilt(0);
      let t = 500;
      lines.forEach((l, i) => {
        const n = (l.textContent ?? '').length;
        const d = n * 30;
        later(() => {
          l.style.transition = `width ${d}ms steps(${n})`;
          l.style.width = n + 'ch';
        }, t);
        t += d + 80;
        later(() => {
          parts
            .filter(p => p.dataset.bs === l.dataset.cl)
            .forEach(p => {
              p.style.transition = 'opacity .5s, transform .7s cubic-bezier(.2,.7,.2,1)';
              p.style.opacity = '1';
              p.style.transform = 'none';
            });
          setBuilt(i + 1);
        }, t);
        t += 360;
      });
      later(run, t + 3400);
    };
    reset();
    let building = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !building) {
        building = true;
        run();
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const live = built >= 7;
  return (
        <div ref={rootRef} data-r="up" data-d="200" aria-label="A website building itself: code on the left, the page rendering on the right" role="img" style={{ borderRadius: "12px", background: "#080b38", color: "#fff", overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(8,11,56,.55)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ display: "flex", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c3c5d4" }}></span><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c3c5d4" }}></span><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c3c5d4" }}></span></div>
            <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "6px", background: "rgba(255,255,255,.07)", fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "rgba(255,255,255,.75)", minWidth: "0" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: live ? "#2fbf71" : "#F2D458", flex: "none", transition: "background .4s" }}></span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{live ? "https://your-brand.co.uk" : "localhost:3000"}</span></div>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".1em", padding: "4px 8px", borderRadius: "4px", background: live ? "#2fbf71" : "rgba(255,255,255,.2)", color: "#080b38", transition: "background .4s" }}>{live ? "LIVE" : "BUILD"}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))" }}>
            <div style={{ padding: "18px 0", fontFamily: "'IBM Plex Mono'", fontSize: "12.5px", lineHeight: "2", borderRight: "1px solid rgba(255,255,255,.08)", minWidth: "0", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "34px 1fr" }}>
                <div style={{ textAlign: "right", paddingRight: "12px", color: "rgba(255,255,255,.28)" }}><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div></div>
                <div style={{ minWidth: "0" }}>
                  <div data-cl="1" style={{ whiteSpace: "pre", overflow: "hidden" }}><span style={{ color: "#8f9bff" }}>&lt;nav</span> <span style={{ color: "#E453EE" }}>class</span>=<span style={{ color: "#F2D458" }}>&quot;site-nav&quot;</span><span style={{ color: "#8f9bff" }}>&gt;</span></div>
                  <div data-cl="2" style={{ whiteSpace: "pre", overflow: "hidden" }}><span style={{ color: "#8f9bff" }}>&lt;h1&gt;</span>Own the spotlight.<span style={{ color: "#8f9bff" }}>&lt;/h1&gt;</span></div>
                  <div data-cl="3" style={{ whiteSpace: "pre", overflow: "hidden" }}><span style={{ color: "#8f9bff" }}>&lt;p</span> <span style={{ color: "#E453EE" }}>class</span>=<span style={{ color: "#F2D458" }}>&quot;lede&quot;</span><span style={{ color: "#8f9bff" }}>&gt;</span>Built to convert.</div>
                  <div data-cl="4" style={{ whiteSpace: "pre", overflow: "hidden" }}><span style={{ color: "#8f9bff" }}>&lt;a</span> <span style={{ color: "#E453EE" }}>class</span>=<span style={{ color: "#F2D458" }}>&quot;cta&quot;</span><span style={{ color: "#8f9bff" }}>&gt;</span>Book a call<span style={{ color: "#8f9bff" }}>&lt;/a&gt;</span></div>
                  <div data-cl="5" style={{ whiteSpace: "pre", overflow: "hidden" }}><span style={{ color: "#8f9bff" }}>&lt;img</span> <span style={{ color: "#E453EE" }}>loading</span>=<span style={{ color: "#F2D458" }}>&quot;lazy&quot;</span> <span style={{ color: "#E453EE" }}>alt</span>=<span style={{ color: "#F2D458" }}>&quot;…&quot;</span><span style={{ color: "#8f9bff" }}>&gt;</span></div>
                  <div data-cl="6" style={{ whiteSpace: "pre", overflow: "hidden" }}><span style={{ color: "#8f9bff" }}>&lt;script</span> <span style={{ color: "#E453EE" }}>type</span>=<span style={{ color: "#F2D458" }}>&quot;ld+json&quot;</span><span style={{ color: "#8f9bff" }}>&gt;</span></div>
                  <div data-cl="7" style={{ whiteSpace: "pre", overflow: "hidden", color: "#F2D458" }}>$ deploy --prod</div>
                </div>
              </div>
            </div>
            <div style={{ position: "relative", background: "#fff", color: "#0a0c24", minHeight: "300px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div data-bs="1" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", paddingBottom: "10px", borderBottom: "1px solid #ececf2" }}><span style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "15px", textTransform: "uppercase" }}><span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#3a5bff" }}></span>Your brand</span><span style={{ display: "flex", gap: "6px" }}><span style={{ width: "22px", height: "5px", borderRadius: "3px", background: "#dcdde6" }}></span><span style={{ width: "22px", height: "5px", borderRadius: "3px", background: "#dcdde6" }}></span><span style={{ width: "22px", height: "5px", borderRadius: "3px", background: "#dcdde6" }}></span></span></div>
              <p data-bs="2" style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(30px,3vw,42px)", lineHeight: ".9", textTransform: "uppercase" }}>Own the<br />spotlight.</p>
              <p data-bs="3" style={{ fontSize: "13px", color: "#55566a" }}>Built to convert.</p>
              <span data-bs="4" style={{ alignSelf: "flex-start", padding: "9px 14px", borderRadius: "5px", background: "#ffc83d", fontSize: "12px", fontWeight: "600" }}>Book a call →</span>
              <div data-bs="5" style={{ flex: "1", minHeight: "80px", borderRadius: "8px", backgroundColor: "#080b38", backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)", backgroundSize: "18px 18px", position: "relative", overflow: "hidden" }}><span style={{ position: "absolute", left: "16px", top: "14px", width: "36px", height: "6px", background: "#F2D458" }}></span></div>
              <span data-bs="6" style={{ position: "absolute", right: "14px", top: "58px", padding: "5px 9px", borderRadius: "4px", background: "#e9ecff", color: "#3a5bff", fontFamily: "'IBM Plex Mono'", fontSize: "10.5px" }}>schema ✓ LocalBusiness</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 16px", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,.1)", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px", color: "rgba(255,255,255,.6)" }}>
            <span>build {built}/7 · {BUILD_MSGS[built]}</span><span>mobile-first ✓ · Core Web Vitals ✓</span>
          </div>
        </div>
  );
}
