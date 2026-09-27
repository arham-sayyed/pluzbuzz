'use client';

import { useState } from 'react';
import TearTicket from '@/components/TearTicket';
import { useHydrated } from '@/lib/use-viewport';

const mono = { fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', textTransform: 'uppercase' } as const;

export default function StrategyTicket() {
  const [claimed, setClaimed] = useState(false);
  // The ticket renders at full width until JS scales it to the column; clip it until then so phones never scroll sideways.
  const hydrated = useHydrated();

  return (
    <section data-screen-label="Ticket" style={{ padding: "clamp(64px,8vw,110px) clamp(20px,4vw,56px)", borderTop: "1px solid rgba(10,12,36,.12)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p data-r="up" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}>Strategy Call</p>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,5.4vw,84px)", lineHeight: ".9", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Tear away</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="80" style={{ display: "block" }}>the guesswork.</span></span></h2>
          <p data-r="up" data-d="120" style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.6", maxWidth: "520px" }}>We combine strategic thinking, modern creative production, and performance-led execution to help businesses scale with clarity rather than guesswork.</p>
          {!claimed && (
            <p data-r="up" data-d="180" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#55566a" }}>Pull the stub to claim a strategy call with the London team.</p>
          )}
          {claimed && (<>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              <p style={{ fontWeight: "600" }}>Ticket claimed. Tell us about your goals below.</p>
              <a className="hv1" href="#contact" style={{ padding: "11px 18px", borderRadius: "6px", background: "#080b38", color: "#fff", fontWeight: "600", fontSize: "14px" }}>Go to the form</a>
              <button type="button" onClick={() => setClaimed(false)} style={{ padding: "10px 14px", border: "0", background: "transparent", fontSize: "14px", textDecoration: "underline", cursor: "pointer", color: "#55566a" }}>Reset ticket</button>
            </div>
          </>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}><div style={{ width: "100%", maxWidth: "460px", overflowX: hydrated ? "visible" : "clip" }}>
          <TearTicket
            className="pb-ticket"
            torn={claimed}
            onTear={() => setClaimed(true)}
            width={460}
            height={250}
            stubSize={140}
            radius={14}
            rotate={-3}
            background="#080b38"
            stubBackground="#12176a"
            color="#ffffff"
            tearAngle={30}
            resistance={0.45}
            ariaLabel="Tear off the stub to claim a strategy call"
            stub={
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center' }}>
                <span style={{ ...mono, letterSpacing: '.14em', opacity: 0.65 }}>Admit</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '64px', lineHeight: 0.9 }}>01</span>
                <span style={{ ...mono, letterSpacing: '.1em', color: '#F2D458' }}>Pull to tear</span>
              </div>
            }
          >
            <div style={{ position: 'absolute', inset: 0, padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ ...mono, display: 'flex', justifyContent: 'space-between', letterSpacing: '.12em', opacity: 0.65 }}><span>PluzBuzz · London</span><span>No. 0001</span></div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '48px', lineHeight: 0.88, textTransform: 'uppercase' }}>Strategy<br />Call</div>
                <div style={{ marginTop: '10px', fontSize: '13px', opacity: 0.7 }}>Admit one ambitious brand</div>
              </div>
              <div style={{ ...mono, display: 'flex', gap: '16px', flexWrap: 'wrap', letterSpacing: '.08em', opacity: 0.65 }}><span>Old Street, Shoreditch</span><span>Mon–Sat 10:00–19:00</span></div>
            </div>
          </TearTicket>
        </div></div>
      </div>
    </section>
  );
}
