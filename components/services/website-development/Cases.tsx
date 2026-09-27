'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CAROUSEL, CASES, coverFontsReady, coverImage } from './data';

export default function Cases() {
  const [covers, setCovers] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    coverFontsReady().then(() => alive && setCovers(CASES.map(([k]) => coverImage(CAROUSEL[k]))));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="cases" data-screen-label="Our work" style={{ position: "relative", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(36px,4vw,60px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(50px,7vw,120px)", lineHeight: ".86", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Our</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block" }}>work</span></span></h2>
          <div data-r="up" style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "420px" }}><p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55" }}>Recent website projects, and what each one had to achieve for the business behind it.</p><Link href="/#work" style={{ fontWeight: "600" }}>See all work →</Link></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "16px" }}>
          {CASES.map(([k, tag, desc], j) => {
            const it = CAROUSEL[k];
            return (
              <Link key={it.title} className="hv6" href="/#work" data-r="up" style={{ display: "flex", flexDirection: "column", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(10,12,36,.12)", background: "#fff", transition: "transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s" }}>
                <div role="img" aria-label={it.title + ' website'} style={{ aspectRatio: "16/10", backgroundColor: it.bg, backgroundImage: covers[j] ? `url(${covers[j]})` : 'none', backgroundSize: "cover", backgroundPosition: "center" }}></div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "clamp(20px,2.2vw,28px)", flex: "1" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#3a5bff" }}>{tag}</span>
                  <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(32px,3vw,44px)", lineHeight: ".95", textTransform: "uppercase" }}>{it.title}</h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.55", color: "#55566a" }}>{desc}</p>
                  <span style={{ marginTop: "auto", paddingTop: "10px", fontWeight: "600" }}>View project →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
