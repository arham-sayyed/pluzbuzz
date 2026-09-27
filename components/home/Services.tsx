'use client';

import { useEffect, useRef, useState } from 'react';
import { MOBILE_BP, useNarrowerThan } from '@/lib/use-viewport';
import Link from 'next/link';
import { WEBSITE_DEVELOPMENT } from '@/lib/site';

const PREVIEW_LABELS = ['website preview', 'seo preview', 'campaign preview', 'app / saas preview', 'ai workflow preview', 'photo + video still'];

export default function Services() {
  const listRef = useRef<HTMLDivElement>(null);
  const mobile = useNarrowerThan(MOBILE_BP);
  const [svc, setSvc] = useState(0);

  // The row nearest 45% of the viewport is "active": it stays opaque and drives the preview panel.
  useEffect(() => {
    const rows = [...(listRef.current?.querySelectorAll<HTMLElement>('[data-svcrow]') ?? [])];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = innerHeight;
      let best = 0;
      let bd = Infinity;
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - vh * 0.45);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      rows.forEach((row, i) => {
        row.style.opacity = mobile || i === best ? '1' : '.32';
      });
      setSvc(best);
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
  }, [mobile]);

  return (
    <section id="services" data-screen-label="Services" style={{ padding: "clamp(56px,7vw,100px) clamp(20px,4vw,56px)", borderTop: "1px solid rgba(10,12,36,.12)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
        <div className="svc-aside" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(40px,4.6vw,72px)", lineHeight: ".92", textTransform: "uppercase" }}>
            <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>The six lanes we</span></span>
            <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block" }}>usually activate first</span></span>
          </h2>
          <p data-r="up" data-d="120" style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>When brands need sharper digital growth. A compact view of the services we combine most often across websites, campaigns, product systems, search, and creative production.</p>
          {/* Preview panel is desktop-only; hidden by CSS (.svc-preview) so phones never get it in the server HTML */}
            <div className="svc-preview" data-r="fade" style={{ position: "relative", height: "clamp(260px,40vh,420px)", borderRadius: "10px", background: "#080b38", overflow: "hidden", color: "#fff" }}>
              <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(135deg,rgba(255,255,255,.045) 0 9px,transparent 9px 18px)" }}></div>
              <span style={{ position: "absolute", left: "24px", top: "18px", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(90px,10vw,160px)", lineHeight: "1", color: "#ffc83d", transition: "opacity .3s" }}>{'0' + (svc + 1)}</span>
              <span style={{ position: "absolute", right: "20px", bottom: "18px", fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".08em", color: "rgba(255,255,255,.5)" }}>{PREVIEW_LABELS[svc]}</span>
              <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "50px", height: "3px", background: "rgba(255,255,255,.12)" }}><div style={{ height: "100%", background: "#3a5bff", transition: "width .4s", width: ((svc + 1) / 6) * 100 + '%' }}></div></div>
            </div>
        </div>
        <div ref={listRef} style={{ display: "flex", flexDirection: "column" }}>
          <article id="svc-1" data-svcrow="" style={{ padding: "clamp(28px,3.4vw,44px) 0", borderTop: "1px solid rgba(10,12,36,.14)", transition: "opacity .35s", display: "flex", flexDirection: "column", gap: "14px", scrollMarginTop: "100px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>01 — Core lane</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(36px,4vw,60px)", lineHeight: ".95", textTransform: "uppercase" }}>Website Development</h3>
            <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>Conversion-ready websites and landing systems.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>Web Development</span><Link href={WEBSITE_DEVELOPMENT} style={{ marginLeft: "auto", fontWeight: "600", fontSize: "15px" }}>Explore service →</Link></div>
          </article>
          <article id="svc-2" data-svcrow="" style={{ padding: "clamp(28px,3.4vw,44px) 0", borderTop: "1px solid rgba(10,12,36,.14)", transition: "opacity .35s", display: "flex", flexDirection: "column", gap: "14px", scrollMarginTop: "100px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>02 — Core lane</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(36px,4vw,60px)", lineHeight: ".95", textTransform: "uppercase" }}>SEO &amp; Content</h3>
            <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>Search visibility, content structure, and intent-led growth.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>SEO Services</span><a href="#svc-2" style={{ marginLeft: "auto", fontWeight: "600", fontSize: "15px" }}>Explore service →</a></div>
          </article>
          <article id="svc-3" data-svcrow="" style={{ padding: "clamp(28px,3.4vw,44px) 0", borderTop: "1px solid rgba(10,12,36,.14)", transition: "opacity .35s", display: "flex", flexDirection: "column", gap: "14px", scrollMarginTop: "100px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>03 — Core lane</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(36px,4vw,60px)", lineHeight: ".95", textTransform: "uppercase" }}>Growth Marketing</h3>
            <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>Performance campaigns built to improve lead quality.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>Digital Marketing</span><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>Social Media</span><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>Advertising</span><a href="#svc-3" style={{ marginLeft: "auto", fontWeight: "600", fontSize: "15px" }}>Explore service →</a></div>
          </article>
          <article id="svc-4" data-svcrow="" style={{ padding: "clamp(28px,3.4vw,44px) 0", borderTop: "1px solid rgba(10,12,36,.14)", transition: "opacity .35s", display: "flex", flexDirection: "column", gap: "14px", scrollMarginTop: "100px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>04 — Core lane</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(36px,4vw,60px)", lineHeight: ".95", textTransform: "uppercase" }}>App / SaaS Systems</h3>
            <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>Sharper product journeys and scalable digital experiences.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>App &amp; SaaS</span><a href="#svc-4" style={{ marginLeft: "auto", fontWeight: "600", fontSize: "15px" }}>Explore service →</a></div>
          </article>
          <article id="svc-5" data-svcrow="" style={{ padding: "clamp(28px,3.4vw,44px) 0", borderTop: "1px solid rgba(10,12,36,.14)", transition: "opacity .35s", display: "flex", flexDirection: "column", gap: "14px", scrollMarginTop: "100px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>05 — Core lane</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(36px,4vw,60px)", lineHeight: ".95", textTransform: "uppercase" }}>AI Enablement</h3>
            <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>Smarter workflows, creative systems, and automation support.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>AI Marketing</span><a href="#svc-5" style={{ marginLeft: "auto", fontWeight: "600", fontSize: "15px" }}>Explore service →</a></div>
          </article>
          <article id="svc-6" data-svcrow="" style={{ padding: "clamp(28px,3.4vw,44px) 0", borderTop: "1px solid rgba(10,12,36,.14)", borderBottom: "1px solid rgba(10,12,36,.14)", transition: "opacity .35s", display: "flex", flexDirection: "column", gap: "14px", scrollMarginTop: "100px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>06 — Core lane</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(36px,4vw,60px)", lineHeight: ".95", textTransform: "uppercase" }}>Photo + Video Production</h3>
            <p style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.55", maxWidth: "520px" }}>Directed visual assets for launches, campaigns, and content.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>Photography</span><span style={{ padding: "6px 12px", borderRadius: "4px", background: "#f4f4f7", fontSize: "13px", fontWeight: "500" }}>Video Production</span><a href="#svc-6" style={{ marginLeft: "auto", fontWeight: "600", fontSize: "15px" }}>Explore service →</a></div>
          </article>
        </div>
      </div>
    </section>
  );
}
