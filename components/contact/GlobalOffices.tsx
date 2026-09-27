import OfficeGlobe from './OfficeGlobe';

const statNum = { fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(56px,6vw,88px)", lineHeight: ".9" } as const;
const statLabel = { fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" } as const;

export default function GlobalOffices() {
  return (
    <section id="global" data-screen-label="Global presence" style={{ background: "#080b38", color: "#fff", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)", overflow: "hidden" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "720px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "#ffc83d" }}>Global Network</p>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(50px,7vw,120px)", lineHeight: ".86", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Our Global Presence</span></span></h2>
            <p data-r="up" style={{ color: "rgba(255,255,255,.72)", fontSize: "17px", lineHeight: "1.6", maxWidth: "560px" }}>From our London headquarters to regional delivery hubs, we support partners across markets with consistent execution, strategic oversight, and local context.</p>
          </div>
          <div data-r="up" data-d="100" style={{ display: "flex", gap: "clamp(28px,4vw,56px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><strong data-count="7" style={statNum}>7</strong><span style={statLabel}>Total Offices</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><strong data-count="7" style={statNum}>7</strong><span style={statLabel}>Countries</span></div>
          </div>
        </div>
        <OfficeGlobe />
      </div>
    </section>
  );
}
