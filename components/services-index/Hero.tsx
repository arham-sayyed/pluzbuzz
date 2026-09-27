import Link from 'next/link';
import { HOME } from '@/lib/site';
import { BrowseButton } from './Catalogue';

const lineStyle = { display: "block", overflow: "hidden" } as const;

export default function Hero() {
  return (
    <section id="top" data-screen-label="Hero" style={{ padding: "clamp(116px,12vw,150px) clamp(20px,4vw,56px) clamp(32px,4vw,48px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,40px)" }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase", color: "#55566a" }}>
          <span style={{ width: "8px", height: "8px", background: "#ffc83d", borderRadius: "50%" }}></span>
          <Link href={HOME} style={{ color: "#55566a" }}>Home</Link><span aria-hidden="true">/</span><span aria-current="page" style={{ color: "#0a0c24" }}>Services</span>
        </nav>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(56px,9.4vw,160px)", lineHeight: ".86", letterSpacing: "-.01em", textTransform: "uppercase" }}>
          <span style={lineStyle}><span data-r="mask" style={{ display: "block" }}>Website, App &amp;</span></span>
          <span style={lineStyle}><span data-r="mask" data-d="90" style={{ display: "block" }}>Marketing <span style={{ color: "#3a5bff" }}>Services</span></span></span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "24px clamp(32px,5vw,80px)", borderTop: "1px solid rgba(10,12,36,.16)", paddingTop: "24px", alignItems: "end" }}>
          <p data-r="up" data-d="200" style={{ fontSize: "clamp(17px,1.3vw,19px)", lineHeight: "1.6", color: "#55566a", maxWidth: "640px", textWrap: "pretty" }}>At PluzBuzz, we deliver website development, app and SaaS development, digital marketing, SEO, and creative production services for brands that need stronger visibility, better performance, and measurable commercial growth.</p>
          <div data-r="up" data-d="260" className="sv-hero__cta" style={{ display: "flex", justifyContent: "flex-end" }}>
            <BrowseButton />
          </div>
        </div>
      </div>
    </section>
  );
}
