'use client';

import { useState } from 'react';
import { FAQS } from './data';

export default function Faq() {
  const [open, setOpen] = useState(1);

  return (
    <section id="faq" data-screen-label="FAQ" style={{ position: "relative", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div className="wd-faq" style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(56px,7vw,120px)", lineHeight: ".86", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>FAQ’s</span></span></h2>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #0a0c24", minWidth: "0" }}>
          {FAQS.map(([q, a], i) => {
            const isOpen = i === open;
            return (
              <div key={q} style={{ borderBottom: "1px solid rgba(10,12,36,.14)" }}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(o => (o === i ? -1 : i))} style={{ width: "100%", display: "grid", gridTemplateColumns: "44px 1fr 28px", gap: "12px", alignItems: "center", padding: "22px 4px", border: "0", background: "transparent", textAlign: "left", cursor: "pointer", color: "#0a0c24" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#3a5bff" }}>{'0' + (i + 1)}</span>
                  <span style={{ fontSize: "clamp(17px,1.5vw,21px)", fontWeight: "600", lineHeight: "1.35" }}>{q}</span>
                  <span style={{ fontSize: "22px", lineHeight: "1", transform: `rotate(${isOpen ? '45deg' : '0deg'})`, transition: "transform .3s" }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 40px 24px 60px", display: "flex", flexDirection: "column", gap: "10px", color: "#55566a", fontSize: "16px", lineHeight: "1.6", maxWidth: "820px" }}>
                    {a.map(line => <p key={line}>{line}</p>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
