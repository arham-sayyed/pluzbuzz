'use client';

import { useState } from 'react';
import DriftWall, { type DriftWallItem } from '@/components/DriftWall';
import { useNarrowerThan } from '@/lib/use-viewport';

const PROJECTS = [
  ['Viviana London', 'Rebranding', 'A luxury gifting rebrand and digital refresh designed to modernise the product story, sharpen the premium identity, and create a stronger online buying journey.'],
  ['Fixomech', 'Website Dev', 'A B2B-focused website overhaul for an industrial engineering brand, built to clarify product capability, improve trust, and capture more qualified enquiries.'],
  ['Medi-Ex', 'Website Revamp', 'A healthcare infrastructure platform shaped to communicate specialist expertise, build confidence with enterprise buyers, and support higher-intent contact requests.'],
  ['LeaA', 'SaaS', 'Built a scalable SaaS platform for LeaA with a cleaner product experience.'],
  ['Cargoking', 'Web Development', 'Highlighting the web development projects delivered for the Cargoking brand.'],
  ['Website Development', 'Core lane 01', 'Conversion-ready websites and landing systems.'],
  ['SEO & Content', 'Core lane 02', 'Search visibility, content structure, and intent-led growth.'],
  ['Growth Marketing', 'Core lane 03', 'Performance campaigns built to improve lead quality.'],
  ['App / SaaS Systems', 'Core lane 04', 'Sharper product journeys and scalable digital experiences.'],
  ['AI Enablement', 'Core lane 05', 'Smarter workflows, creative systems, and automation support.'],
  ['Photo + Video Production', 'Core lane 06', 'Directed visual assets for launches, campaigns, and content.']
];
const TONES = [['#151a5c', '#fff'], ['#f4f4f7', '#0a0c24'], ['#1f2570', '#fff'], ['#10154f', '#fff'], ['#e7e8f2', '#0a0c24']];

// Two passes over the list with shifted tones so repeats don't line up.
const ITEMS: DriftWallItem[] = [0, 1].flatMap(k =>
  PROJECTS.map(([title, tag, desc], i) => {
    const [bg, fg] = TONES[(i + k * 2) % TONES.length];
    return { title, tag, desc, bg, fg };
  })
);

export default function SelectedWork() {
  const compact = useNarrowerThan(760);
  const [active, setActive] = useState<DriftWallItem | null>(null);
  const [brief, setBrief] = useState<DriftWallItem | null>(null);
  if (active && active !== brief) setBrief(active); // keep the last brief rendered while the popup fades out

  return (
    <section id="work" data-screen-label="Work" style={{ background: "#080b38", color: "#fff", paddingTop: "clamp(56px,7vw,100px)", overflow: "hidden" }}>
      <header style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px,4vw,56px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "20px" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,5.4vw,84px)", lineHeight: ".9", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Selected Work</span></span></h2>
        <div data-r="up" style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
          <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>Trusted by growing brands</p>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.75)" }}>Hover a tile to pause it and read the brief.</p>
        </div>
      </header>
      <div style={{ position: "relative", height: "clamp(480px,74vh,700px)" }}>
        <DriftWall
          items={ITEMS}
          columns={compact ? 3 : 6}
          tileWidth={230}
          tileHeight={150}
          gap={18}
          radius={10}
          overlayColor="#080b38"
          dim={0.62}
          speed={36}
          lift={60}
          onActiveChange={setActive}
        />
        <div aria-live="polite" style={{ position: "absolute", left: "clamp(16px,4vw,56px)", bottom: "clamp(16px,3vw,40px)", maxWidth: "min(380px,calc(100% - 32px))", padding: "20px 22px", borderRadius: "8px", background: "#fff", color: "#0a0c24", boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)", opacity: active ? 1 : 0, transform: active ? "none" : "translateY(12px)", transition: "opacity .3s,transform .35s cubic-bezier(.2,.7,.2,1)", pointerEvents: "none", zIndex: 5 }}>
          <p style={{ margin: "0 0 8px", fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#3a5bff" }}>{brief?.tag}</p>
          <p style={{ margin: "0 0 8px", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "30px", lineHeight: ".95", textTransform: "uppercase" }}>{brief?.title}</p>
          <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5", color: "#55566a" }}>{brief?.desc}</p>
        </div>
      </div>
    </section>
  );
}
