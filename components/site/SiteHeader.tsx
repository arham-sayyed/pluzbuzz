'use client';

import { useEffect, useRef, useState } from 'react';
import { CONTACT, type NavLink } from '@/lib/site';
import NavAnchor from './NavAnchor';
import { MOBILE_BP, useNarrowerThan } from '@/lib/use-viewport';

const currentStyle = { boxShadow: 'inset 0 -3px 0 #ffc83d', paddingBottom: '2px' };

/** `ctaHref`: where "Book a strategy call" goes; the contact page points it at its own form. */
export default function SiteHeader({ links, homeHref = '#home', ctaHref = CONTACT }: { links: NavLink[]; homeHref?: string; ctaHref?: string }) {
  const headRef = useRef<HTMLElement>(null);
  const mobile = useNarrowerThan(MOBILE_BP);
  const [menu, setMenu] = useState(false);
  const [wasMobile, setWasMobile] = useState(mobile);
  if (mobile !== wasMobile) {
    setWasMobile(mobile);
    setMenu(false);
  }
  const closeMenu = () => setMenu(false);

  useEffect(() => {
    const onScroll = () => {
      if (headRef.current) headRef.current.style.borderBottomColor = scrollY > 30 ? 'rgba(10,12,36,.12)' : 'transparent';
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={headRef} style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "60", background: "#fff", borderBottom: "1px solid transparent", transition: "border-color .3s,padding .3s" }}>
      <div style={{ maxWidth: "calc(1440px + 2 * clamp(20px,4vw,56px))", margin: "0 auto", padding: "16px clamp(20px,4vw,56px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF logo */}
        <NavAnchor href={homeHref} aria-label="PluzBuzz home" style={{ display: "block", flex: "none" }}><img src="/assets/logo.gif" alt="PluzBuzz — We Create the Buzz, You Own the Spotlight" width="1200" height="224" style={{ display: "block", height: "clamp(40px,4vw,58px)", width: "auto" }} /></NavAnchor>
        {/* Both controls are always rendered; CSS (.site-nav / .site-burger) picks one per breakpoint, so the server HTML is already right on phones. */}
        <nav className="site-nav" aria-label="Primary" style={{ alignItems: "center", gap: "clamp(14px,2vw,32px)", fontSize: "15px", fontWeight: "500", whiteSpace: "nowrap" }}>
            {links.map(l => (
              <NavAnchor key={l.label} href={l.href} aria-current={l.current ? 'page' : undefined} style={l.current ? currentStyle : undefined}>{l.label}</NavAnchor>
            ))}
            <NavAnchor className="hv1" href={ctaHref} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 20px", background: "#080b38", color: "#fff", borderRadius: "6px" }}>Book a strategy call</NavAnchor>
        </nav>
        <button className="site-burger" type="button" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(m => !m)} style={{ width: "48px", height: "48px", border: "0", borderRadius: "6px", background: "#080b38", color: "#fff", fontSize: "18px", cursor: "pointer" }}>{menu ? '✕' : '☰'}</button>
      </div>
      {menu && (
        <nav className="site-menu" aria-label="Mobile" style={{ flexDirection: "column", padding: "8px clamp(20px,4vw,56px) 24px", background: "#fff", borderBottom: "1px solid rgba(10,12,36,.12)", fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "34px", textTransform: "uppercase" }}>
          {links.filter(l => !l.hideOnMobile).map(l => (
            <NavAnchor key={l.label} href={l.href} onClick={closeMenu} style={{ padding: "8px 0" }}>{l.label}</NavAnchor>
          ))}
          <NavAnchor href={ctaHref} onClick={closeMenu} style={{ marginTop: "10px", padding: "14px 18px", background: "#080b38", color: "#fff", borderRadius: "6px", fontSize: "22px" }}>Book a strategy call</NavAnchor>
        </nav>
      )}
    </header>
  );
}
