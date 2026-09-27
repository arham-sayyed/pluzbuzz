import { OFFICES } from '@/lib/offices';
import LocalTime from './LocalTime';

export default function GlobalPresence() {
  return (
    <section id="global" data-screen-label="Global presence" style={{ background: "#f4f4f7", padding: "clamp(56px,7vw,100px) 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "calc(1440px + 2 * clamp(20px,4vw,56px))", margin: "0 auto", padding: "0 clamp(20px,4vw,56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "24px 64px", alignItems: "end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}>Global Network</p>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,5.4vw,84px)", lineHeight: ".9", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Our Global Presence</span></span></h2>
          <p data-r="up" style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.6", maxWidth: "560px" }}>From our London headquarters to regional delivery hubs, we support partners across markets with consistent execution, strategic oversight, and local context.</p>
        </div>
        <div data-r="up" data-d="100" style={{ display: "flex", gap: "40px", justifyContent: "flex-start" }}>
          <div><strong data-count="7" style={{ display: "block", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(72px,7vw,110px)", lineHeight: ".9" }}>7</strong><span style={{ color: "#55566a", fontSize: "15px" }}>Total Offices</span></div>
          <div><strong data-count="7" style={{ display: "block", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(72px,7vw,110px)", lineHeight: ".9" }}>7</strong><span style={{ color: "#55566a", fontSize: "15px" }}>Countries</span></div>
        </div>
      </div>
      <div aria-hidden="true" style={{ margin: "clamp(32px,4vw,56px) 0" }}>
        <p data-sx="traverse" style={{ whiteSpace: "nowrap", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(64px,9vw,150px)", lineHeight: "1", textTransform: "uppercase", color: "transparent", WebkitTextStroke: "1.5px #0a0c24", paddingLeft: "10vw" }}>London · Mumbai · Dubai · New York · Nairobi · Kampala · Warsaw · London</p>
      </div>
      <div style={{ maxWidth: "calc(1440px + 2 * clamp(20px,4vw,56px))", margin: "0 auto", padding: "0 clamp(20px,4vw,56px)", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {/* Wrapping flex, not grid: each row stretches to full width, so 7 cards never leave a lone orphan */}
        {OFFICES.map(({ code: flag, country, city, tz, hub }) => {
          return (
            <div key={city} style={{ flex: "1 1 150px", borderRadius: "8px", padding: "18px", display: "flex", flexDirection: "column", gap: "26px", background: hub ? '#080b38' : '#fff', color: hub ? '#fff' : '#0a0c24' }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".1em", opacity: ".7" }}>{flag}</span><LocalTime timeZone={tz} color={hub ? '#ffc83d' : '#55566a'} /></div>
              <div><p style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "28px", lineHeight: "1", textTransform: "uppercase" }}>{city}</p><p style={{ fontSize: "13px", opacity: ".7", marginTop: "4px" }}>{hub ? country + ' · Main Hub' : country}</p></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
