'use client';

import { useEffect, useRef, useState } from 'react';
import SlideCommit from '@/components/SlideCommit';
import { flameCanvas } from '@/lib/flames';

const fieldStyle = { padding: "14px 16px", borderRadius: "6px", border: "1px solid rgba(255,255,255,.18)", background: "rgba(8,11,56,.6)", color: "#fff", outline: "none" };
const labelStyle = { display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,.65)" } as const;

export interface ContactSectionProps {
  heading: [string, string];
  intro: string;
  /** Placeholder or prefilled value for "Services interested in". */
  services: { placeholder?: string; defaultValue?: string };
  messagePlaceholder: string;
  /** Three-colour flame band along the bottom edge. */
  flames?: boolean;
  /** Frosted form panel. */
  frosted?: boolean;
  /** Short status beside the form title, e.g. what another section just added to the enquiry. */
  note?: string;
}

export default function ContactSection({ heading, intro, services, messagePlaceholder, flames = false, frosted = false, note }: ContactSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const flameRef = useRef<HTMLCanvasElement>(null);
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  // SlideCommit takes a pixel width (its drag distance depends on it): fit it to its slot, up to 320px.
  const [slideW, setSlideW] = useState(320);

  useEffect(() => {
    const box = slideBoxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([e]) => setSlideW(Math.min(320, Math.round(e.contentRect.width)) || 320));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!flames || !flameRef.current) return;
    return flameCanvas(flameRef.current, { amp: 0.62, speed: 0.55 });
  }, [flames]);

  const confirm = () => {
    const f = formRef.current;
    if (f && !f.checkValidity()) {
      f.reportValidity();
      return Promise.reject(new Error('invalid'));
    }
    return new Promise(r => setTimeout(r, 900)).then(() => {
      f?.reset();
      setSent(true);
    });
  };

  return (
    <section id="contact" data-screen-label="Contact" style={{ position: "relative", background: "#080b38", color: "#fff", padding: "clamp(72px,9vw,130px) clamp(20px,4vw,56px) clamp(120px,14vw,200px)", overflow: "hidden" }}>
      {flames && <canvas ref={flameRef} aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", width: "100%", height: "clamp(90px,12vw,170px)", pointerEvents: "none" }}></canvas>}
      <div style={{ position: "relative", maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "clamp(36px,5vw,80px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(64px,9vw,150px)", lineHeight: ".86", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>{heading[0]}</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="80" style={{ display: "block", color: "#ffc83d" }}>{heading[1]}</span></span></h2>
          <p data-r="up" data-d="120" style={{ color: "rgba(255,255,255,.75)", fontSize: "17px", lineHeight: "1.6", maxWidth: "480px" }}>{intro}</p>
          <p data-r="up" data-d="180" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "13px", color: "rgba(255,255,255,.6)", lineHeight: "1.7" }}>Old Street, Shoreditch, London<br />Mon–Sat · 10:00–19:00</p>
        </div>
        <form data-r="up" data-d="100" ref={formRef} onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "14px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "10px", padding: "clamp(22px,2.6vw,34px)", ...(frosted ? { backdropFilter: "blur(6px)" } : {}) }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "30px", textTransform: "uppercase" }}>Let’s talk, get in touch!</h3>
            {note && <span role="status" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#ffc83d" }}>{note}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "12px" }}>
            <label style={labelStyle}>Name<input className="fc1" type="text" name="name" required placeholder="Your name" autoComplete="name" style={fieldStyle} /></label>
            <label style={labelStyle}>Email<input className="fc1" type="email" name="email" required placeholder="Work email address" autoComplete="email" style={fieldStyle} /></label>
            <label style={labelStyle}>Company<input className="fc1" type="text" name="company" placeholder="Company or brand" autoComplete="organization" style={fieldStyle} /></label>
            <label style={labelStyle}>Services interested in<input className="fc1" type="text" name="services" placeholder={services.placeholder} defaultValue={services.defaultValue} style={fieldStyle} /></label>
          </div>
          <textarea className="fc1" name="message" required rows={4} placeholder={messagePlaceholder} style={{ ...fieldStyle, resize: "vertical" }}></textarea>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
            <div ref={slideBoxRef} style={{ width: "100%", maxWidth: "320px" }}>
              <SlideCommit
                className="pb-slide"
                label="Slide to send enquiry"
                doneLabel="Enquiry sent"
                errorLabel="Add name, email and message"
                width={slideW}
                height={58}
                radius={8}
                trackColor="#171b52"
                handleColor="#ffffff"
                successColor="#F2D458"
                dangerColor="#e5484d"
                holdMs={2200}
                onConfirm={confirm}
              />
            </div>
            <p aria-live="polite" style={{ fontSize: "14px", color: "rgba(255,255,255,.75)" }}>{sent ? 'Thanks. The London team will be in touch shortly.' : ''}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
