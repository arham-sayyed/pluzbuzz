import Link from 'next/link';
import LocalTime from '@/components/home/LocalTime';
import { HOME } from '@/lib/site';

const lineStyle = { display: "block", overflow: "hidden" } as const;

export default function Hero() {
  return (
    <section id="top" data-screen-label="Hero" style={{ padding: "clamp(116px,12vw,150px) clamp(20px,4vw,56px) clamp(40px,5vw,72px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,40px)" }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase", color: "#55566a" }}>
          <span style={{ width: "8px", height: "8px", background: "#ffc83d", borderRadius: "50%" }}></span>
          <Link href={HOME} style={{ color: "#55566a" }}>Home</Link><span aria-hidden="true">/</span><span aria-current="page" style={{ color: "#0a0c24" }}>Contact us</span>
        </nav>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(56px,9.4vw,160px)", lineHeight: ".86", letterSpacing: "-.01em", textTransform: "uppercase", maxWidth: "14ch" }}>
          <span style={lineStyle}><span data-r="mask" style={{ display: "block" }}>Talk to our <span style={{ color: "#3a5bff" }}>London</span></span></span>
          <span style={lineStyle}><span data-r="mask" data-d="80" style={{ display: "block" }}>digital agency</span></span>
        </h1>
        <div data-r="up" data-d="160" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px 32px", borderTop: "2px solid #0a0c24", paddingTop: "22px", fontFamily: "'IBM Plex Mono'", fontSize: "13px", color: "#55566a" }}>
          <span>Old Street, Shoreditch, London</span>
          <span>Mon–Sat · 10:00–19:00</span>
          <span>London now · <LocalTime timeZone="Europe/London" color="#55566a" /></span>
          <a href="#global" style={{ color: "#0a0c24" }}>7 offices worldwide ↓</a>
        </div>
      </div>
    </section>
  );
}
