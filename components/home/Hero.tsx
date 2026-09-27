import Link from 'next/link';
import { CONTACT } from '@/lib/site';

export default function Hero() {
  return (
    <section id="home" data-screen-label="Hero" style={{ padding: "clamp(120px,13vw,160px) clamp(20px,4vw,56px) clamp(40px,5vw,64px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,3.4vw,48px)" }}>
        <p data-r="up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase", color: "#55566a" }}>
          <span style={{ width: "8px", height: "8px", background: "#ffc83d", borderRadius: "50%" }}></span><span>London SEO + growth marketing</span><span aria-hidden="true">/</span><span>for ambitious UK brands</span>
        </p>
        <h1 aria-label="SEO and Growth Marketing Agency London" style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(58px,10.4vw,168px)", lineHeight: ".86", letterSpacing: "-.01em", textTransform: "uppercase" }}>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="0" style={{ display: "block" }}>SEO &amp; Growth</span></span>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="90" style={{ display: "block" }}>Marketing Agency</span></span>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="180" style={{ display: "flex", alignItems: "flex-end", gap: ".18em", flexWrap: "wrap" }}><span style={{ position: "relative", display: "inline-block", padding: "0 .06em" }}><span data-r="bar" data-d="650" style={{ position: "absolute", left: "0", right: "0", bottom: ".06em", height: ".38em", background: "#ffc83d", transformOrigin: "0 50%" }}></span><span style={{ position: "relative" }}>London</span></span><span style={{ fontFamily: "'Schibsted Grotesk'", fontWeight: "500", fontSize: "clamp(15px,1.25vw,19px)", lineHeight: "1.5", letterSpacing: "0", textTransform: "none", color: "#55566a", maxWidth: "380px", paddingBottom: ".9em" }}>We help UK brands grow with SEO, conversion-focused websites, and growth marketing systems.</span></span></span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "32px clamp(32px,5vw,80px)", borderTop: "2px solid #0a0c24", paddingTop: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
            <p data-r="up" data-d="260" style={{ fontSize: "clamp(18px,1.6vw,24px)", lineHeight: "1.4", fontWeight: "500", maxWidth: "520px", textWrap: "pretty" }}>Built in London to increase qualified traffic, leads, and revenue — commercial growth, not vanity metrics.</p>
            <div data-r="up" data-d="340" style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <Link className="hv1" href={CONTACT} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "17px 26px", background: "#080b38", color: "#fff", borderRadius: "6px", fontWeight: "600" }}>Book a strategy call</Link>
              <a className="hv2" href="#work" style={{ padding: "17px 26px", border: "1.5px solid #0a0c24", borderRadius: "6px", fontWeight: "600" }}>See our work</a>
            </div>
          </div>
          <nav aria-label="Core services" data-r="up" data-d="300">
            <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a", marginBottom: "8px" }}>Core Services</p>
            <a className="hv3" href="#svc-1" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: "12px", padding: "15px 12px", borderBottom: "1px solid rgba(10,12,36,.12)", transition: "background .25s,padding .25s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>01</span><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "26px", textTransform: "uppercase", lineHeight: "1" }}>Website Development</span><span aria-hidden="true">↘</span></a>
            <a className="hv3" href="#svc-2" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: "12px", padding: "15px 12px", borderBottom: "1px solid rgba(10,12,36,.12)", transition: "background .25s,padding .25s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>02</span><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "26px", textTransform: "uppercase", lineHeight: "1" }}>SEO &amp; Content</span><span aria-hidden="true">↘</span></a>
            <a className="hv3" href="#svc-3" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: "12px", padding: "15px 12px", borderBottom: "1px solid rgba(10,12,36,.12)", transition: "background .25s,padding .25s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>03</span><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "26px", textTransform: "uppercase", lineHeight: "1" }}>Growth Marketing</span><span aria-hidden="true">↘</span></a>
            <a className="hv3" href="#svc-4" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: "12px", padding: "15px 12px", borderBottom: "1px solid rgba(10,12,36,.12)", transition: "background .25s,padding .25s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>04</span><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "26px", textTransform: "uppercase", lineHeight: "1" }}>App / SaaS Systems</span><span aria-hidden="true">↘</span></a>
            <a className="hv3" href="#svc-5" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: "12px", padding: "15px 12px", borderBottom: "1px solid rgba(10,12,36,.12)", transition: "background .25s,padding .25s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>05</span><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "26px", textTransform: "uppercase", lineHeight: "1" }}>AI Enablement</span><span aria-hidden="true">↘</span></a>
            <a className="hv3" href="#svc-6" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: "12px", padding: "15px 12px", borderBottom: "1px solid rgba(10,12,36,.12)", transition: "background .25s,padding .25s" }}><span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>06</span><span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "26px", textTransform: "uppercase", lineHeight: "1" }}>Photo + Video Production</span><span aria-hidden="true">↘</span></a>
          </nav>
        </div>
      </div>
    </section>
  );
}
