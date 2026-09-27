import { SERVICES, type ServiceKey, type ServiceStyle } from '@/lib/site';
import NavAnchor from './NavAnchor';

function Motif({ s }: { s: ServiceStyle }) {
  switch (s.motif) {
    case 'browser':
      return (
        <div style={{ position: "absolute", inset: "0", borderRadius: "8px", border: `1.5px solid ${s.accent}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "5px", padding: "7px 9px", borderBottom: `1.5px solid ${s.accent}` }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.accent }}></span><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.accent, opacity: ".6" }}></span><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.accent, opacity: ".3" }}></span></div>
          <div style={{ flex: "1", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "8px", padding: "10px" }}><span style={{ borderRadius: "4px", background: s.accent }}></span><span style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ flex: "1", borderRadius: "4px", background: "rgba(255,255,255,.14)" }}></span><span style={{ flex: "1", borderRadius: "4px", background: "rgba(255,255,255,.14)" }}></span></span></div>
        </div>
      );
    case 'search':
      return (
        <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "999px", border: `1.5px solid ${s.fg}` }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", border: `2px solid ${s.fg}` }}></span><span style={{ height: "5px", width: "55%", borderRadius: "3px", background: "#c9cad6" }}></span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ padding: "3px 7px", borderRadius: "4px", background: s.accent, color: "#fff", fontFamily: "'IBM Plex Mono'", fontSize: "11px" }}>#1</span><span style={{ height: "6px", width: "60%", borderRadius: "3px", background: s.fg }}></span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: ".35" }}><span style={{ padding: "3px 7px", borderRadius: "4px", border: `1px solid ${s.fg}`, fontFamily: "'IBM Plex Mono'", fontSize: "11px" }}>#2</span><span style={{ height: "6px", width: "48%", borderRadius: "3px", background: s.fg }}></span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: ".2" }}><span style={{ padding: "3px 7px", borderRadius: "4px", border: `1px solid ${s.fg}`, fontFamily: "'IBM Plex Mono'", fontSize: "11px" }}>#3</span><span style={{ height: "6px", width: "40%", borderRadius: "3px", background: s.fg }}></span></div>
        </div>
      );
    case 'phone':
      return (
        <>
          <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "72px", borderRadius: "14px", border: `2px solid ${s.fg}`, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ height: "6px", width: "50%", borderRadius: "3px", background: s.fg }}></span><span style={{ flex: "1", borderRadius: "6px", background: s.accent }}></span><span style={{ height: "14px", borderRadius: "4px", background: "rgba(255,255,255,.3)" }}></span></div>
          <div style={{ position: "absolute", left: "88px", right: "0", top: "10px", display: "flex", flexDirection: "column", gap: "8px" }}><span style={{ height: "28px", borderRadius: "6px", background: "rgba(255,255,255,.18)" }}></span><span style={{ height: "28px", borderRadius: "6px", background: "rgba(255,255,255,.18)" }}></span><span style={{ alignSelf: "flex-start", padding: "5px 9px", borderRadius: "4px", background: s.accent, color: "#080b38", fontFamily: "'IBM Plex Mono'", fontSize: "10.5px" }}>v2.0 shipped</span></div>
        </>
      );
    case 'bars':
      return (
        <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "flex-end", gap: "10px" }}>
          {[['22%', '.35'], ['38%', '.5'], ['52%', '.65'], ['74%', '.8'], ['100%', '1']].map(([h, o]) => <span key={h} style={{ flex: "1", height: h, background: s.accent, opacity: o }}></span>)}
        </div>
      );
    case 'nodes':
      return (
        <svg viewBox="0 0 240 120" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }}><g stroke={s.accent} strokeWidth="1.5" opacity=".6"><line x1="30" y1="30" x2="120" y2="60"></line><line x1="30" y1="90" x2="120" y2="60"></line><line x1="120" y1="60" x2="210" y2="25"></line><line x1="120" y1="60" x2="210" y2="95"></line></g><circle cx="30" cy="30" r="7" fill={s.fg}></circle><circle cx="30" cy="90" r="7" fill={s.fg}></circle><circle cx="120" cy="60" r="14" fill={s.accent}></circle><circle cx="210" cy="25" r="7" fill={s.fg}></circle><circle cx="210" cy="95" r="7" fill={s.fg}></circle></svg>
      );
    case 'viewfinder':
      return (
        <div style={{ position: "absolute", inset: "0" }}>
          <span style={{ position: "absolute", left: "0", top: "0", width: "22px", height: "22px", borderLeft: `2px solid ${s.fg}`, borderTop: `2px solid ${s.fg}` }}></span><span style={{ position: "absolute", right: "0", top: "0", width: "22px", height: "22px", borderRight: `2px solid ${s.fg}`, borderTop: `2px solid ${s.fg}` }}></span><span style={{ position: "absolute", left: "0", bottom: "0", width: "22px", height: "22px", borderLeft: `2px solid ${s.fg}`, borderBottom: `2px solid ${s.fg}` }}></span><span style={{ position: "absolute", right: "0", bottom: "0", width: "22px", height: "22px", borderRight: `2px solid ${s.fg}`, borderBottom: `2px solid ${s.fg}` }}></span>
          <span style={{ position: "absolute", left: "14px", top: "12px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'IBM Plex Mono'", fontSize: "11px", color: s.fg }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.accent }}></span>REC</span>
          <span style={{ position: "absolute", left: "50%", top: "50%", width: "26px", height: "26px", margin: "-13px 0 0 -13px", borderRadius: "50%", border: `1.5px solid ${s.fg}` }}></span>
        </div>
      );
    case 'grid':
      return (
        <div style={{ position: "absolute", inset: "0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          <span style={{ borderRadius: "6px", background: "#080b38" }}></span><span style={{ borderRadius: "6px", background: "#fff", border: "1.5px solid #0a0c24" }}></span><span style={{ borderRadius: "6px", background: "#ffc83d" }}></span><span style={{ borderRadius: "6px", background: "#555AFE" }}></span><span style={{ borderRadius: "6px", background: "#0a0c24" }}></span><span style={{ borderRadius: "6px", background: "#141414" }}></span>
        </div>
      );
  }
}

/** A linked card for a service, styled from the service registry. */
export default function ServiceCard({ service, kicker = 'Service', href }: { service: ServiceKey; kicker?: string; href?: string }) {
  const s = SERVICES[service];
  return (
    <NavAnchor className="hv-card" href={href || s.href} style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "22px", height: "100%", minHeight: "280px", padding: "24px", borderRadius: "12px", overflow: "hidden", background: s.bg, border: `1.5px solid ${s.border}`, textDecoration: "none", transition: "transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s", boxSizing: "border-box" }}>
      <div aria-hidden="true" style={{ position: "relative", height: "120px" }}>
        <Motif s={s} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: s.fg }}>
        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: s.sub }}>{kicker}</span>
        <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(28px,2.4vw,34px)", lineHeight: ".95", textTransform: "uppercase" }}>{s.name} →</span>
        <span style={{ fontFamily: "'Schibsted Grotesk',sans-serif", fontSize: "15px", lineHeight: "1.5", color: s.sub }}>{s.blurb}</span>
      </div>
    </NavAnchor>
  );
}
