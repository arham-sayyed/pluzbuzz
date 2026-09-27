import Link from 'next/link';
import BuildPreview from './BuildPreview';

export default function Hero() {
  return (
    <section id="top" data-screen-label="Hero" style={{ position: "relative", padding: "clamp(116px,12vw,150px) clamp(20px,4vw,56px) clamp(56px,7vw,96px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,3.4vw,44px)" }}>
        <nav aria-label="Breadcrumb" data-r="up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase", color: "#55566a" }}>
          <span style={{ width: "8px", height: "8px", background: "#ffc83d", borderRadius: "50%" }}></span>
          <Link href="/#services" style={{ color: "#55566a" }}>Services</Link><span aria-hidden="true">/</span><span style={{ color: "#0a0c24" }}>Website Development</span>
        </nav>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(56px,10vw,168px)", lineHeight: ".86", letterSpacing: "-.01em", textTransform: "uppercase" }}>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Website</span></span>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="90" style={{ display: "flex", alignItems: "flex-end", gap: ".12em", flexWrap: "wrap" }}>Development<span aria-hidden="true" style={{ display: "inline-block", width: ".09em", height: ".72em", marginBottom: ".1em", background: "#3a5bff" }}></span></span></span>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="180" style={{ display: "block", color: "#3a5bff" }}>Services</span></span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(32px,4vw,64px)", alignItems: "start", borderTop: "2px solid #0a0c24", paddingTop: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "560px" }}>
            <p data-r="up" data-d="240" style={{ fontSize: "clamp(18px,1.6vw,23px)", lineHeight: "1.45", fontWeight: "500", textWrap: "pretty" }}>PluzBuzz is a website development agency in London, UK, building conversion-focused websites, landing pages, and SEO-ready digital experiences for ambitious brands and global growth teams.</p>
            <div data-r="up" data-d="300" style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <a className="hv1" href="#contact" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "17px 26px", background: "#080b38", color: "#fff", borderRadius: "6px", fontWeight: "600" }}>Talk to our team <span aria-hidden="true">→</span></a>
              <a className="hv2" href="#live" style={{ padding: "17px 26px", border: "1.5px solid #0a0c24", borderRadius: "6px", fontWeight: "600" }}>See live builds</a>
            </div>
            <ul data-r="up" data-d="360" style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "13px", color: "#55566a" }}>
              <li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>✓</span>Conversion-focused layouts</li>
              <li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>✓</span>SEO-ready structure from day one</li>
              <li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>✓</span>Responsive on desktop, tablet and mobile</li>
            </ul>
          </div>
          <BuildPreview />
        </div>
      </div>
    </section>
  );
}
