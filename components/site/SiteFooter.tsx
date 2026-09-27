'use client';

import { useRef, useState } from 'react';
import DepthText from '@/components/DepthText';
import SlingButton from '@/components/SlingButton';
import { SOCIAL_LINKS, type NavLink } from '@/lib/site';
import { MOBILE_BP, useNarrowerThan } from '@/lib/use-viewport';
import NavAnchor from './NavAnchor';

const headingStyle = { fontFamily: "'IBM Plex Mono'", fontWeight: "400", fontSize: "12px", letterSpacing: ".12em", color: "#55566a", marginBottom: "6px" };
const navStyle = { display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" } as const;

function LinkColumn({ title, links, external }: { title: string; links: NavLink[]; external?: boolean }) {
  return (
    <nav aria-label={title.charAt(0) + title.slice(1).toLowerCase()} style={navStyle}>
      <h4 style={headingStyle}>{title}</h4>
      {links.map((l, i) => (
        <NavAnchor key={i} href={l.href} className={l.hideOnMobile ? 'hide-mobile' : undefined} style={l.current ? { color: '#3a5bff' } : undefined} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{l.label}</NavAnchor>
      ))}
    </nav>
  );
}

export default function SiteFooter({ discover, services, legalHref = '#home' }: { discover: NavLink[]; services: NavLink[]; legalHref?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [subbed, setSubbed] = useState(false);
  // Phones get the animated logo GIF; the 3D wordmark (and its animation loop) only mounts on larger screens.
  const phone = useNarrowerThan(MOBILE_BP);

  const send = () => {
    const f = formRef.current;
    if (f && !f.checkValidity()) {
      f.reportValidity();
      return;
    }
    f?.reset();
    setSubbed(true);
  };

  return (
    <footer style={{ background: "#fff", padding: "clamp(48px,6vw,80px) clamp(20px,4vw,56px) 28px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(36px,4vw,56px)" }}>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))", gap: "32px" }}>
          <div className="site-footer__lead" style={{ display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
            <p style={{ fontSize: "17px", fontWeight: "500", lineHeight: "1.5", maxWidth: "420px" }}>Get practical growth insights, launch notes, and creative ideas from the PluzBuzz team.</p>
            <form ref={formRef} onSubmit={e => { e.preventDefault(); e.currentTarget.reset(); setSubbed(true); }} style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "440px" }}>
              <label htmlFor="newsletterEmail" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}>Newsletter</label>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", borderBottom: "2px solid #0a0c24", padding: "8px 0" }}><input id="newsletterEmail" type="email" required placeholder="Work email address" autoComplete="email" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", padding: "12px 0", outline: "none", fontSize: "16px" }} /><SlingButton size={46} strokeWidth={3} armAt={44} maxPull={140} padColor="#080b38" iconColor="#ffffff" accentColor="#555AFE" wellColor="#e9e9f1" bandColor="#c3c5da" particles={14} spread={60} flight={110} ariaLabel="Subscribe to the newsletter" onSend={send} /></div>
              <p aria-live="polite" style={{ fontSize: "13px", color: "#55566a", minHeight: "18px" }}>{subbed ? 'You’re on the list.' : ''}</p>
            </form>
          </div>
          <LinkColumn title="DISCOVER" links={discover} />
          <LinkColumn title="SERVICES" links={services} />
          <LinkColumn title="FOLLOW" links={SOCIAL_LINKS} external />
        </section>
        <div role="img" aria-label="PluzBuzz" style={{ display: "flex", justifyContent: "center", overflow: "hidden", padding: "clamp(10px,2vw,30px) 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF logo */}
          <img className="footer-mark--gif" src="/assets/logo.gif" alt="" width="1200" height="224" loading="lazy" style={{ width: "100%", maxWidth: "560px", height: "auto" }} />
          {!phone && <div className="footer-mark--depth"><DepthText
          text="PLUZBUZZ"
          parts={[['PLUZBU', '#0a0c24'], ['ZZ', '#2a1260']]}
          fontFamily="'Barlow Condensed', sans-serif"
          fontWeight={800}
          fontSize="clamp(84px,19vw,300px)"
          letterSpacing="0em"
          faceColor="#0a0c24"
          depthColor="#555AFE"
          depthColors={['#F2D458', '#E453EE', '#555AFE']}
          shadow={false}
          layers={30}
          depth={2.2}
          tilt={7}
          orbitSpeed={0.25}
        /></div>}
        </div>
        <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", paddingTop: "20px", borderTop: "1px solid rgba(10,12,36,.12)", fontSize: "13px", color: "#55566a" }}>
          <p>© 2026 — PluzBuzz All rights reserved. Old Street, Shoreditch, London.</p>
          <div style={{ display: "flex", gap: "20px" }}><a href={legalHref} style={{ color: "#55566a" }}>Privacy Policy</a><a href={legalHref} style={{ color: "#55566a" }}>Terms &amp; Conditions</a></div>
        </section>
      </div>
    </footer>
  );
}
