'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { PaperCrumpleState } from '@/components/PaperCrumple';
import { CONTACT } from '@/lib/site';

// three.js is heavy: only fetch it once the sheet is about to scroll into view.
const PaperCrumple = dynamic(() => import('@/components/PaperCrumple'), { ssr: false });

/** An aged "legacy brand contract", stamped EXPIRED, drawn to a PNG for the crumple sheet. */
function contractSheet() {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 800;
  const x = c.getContext('2d')!;
  let seed = 7;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  x.fillStyle = '#f4f0e8';
  x.fillRect(0, 0, 640, 800);
  x.fillStyle = '#6b665c';
  x.font = "500 13px 'IBM Plex Mono', monospace";
  x.fillText('AGREEMENT NO. 0417  ·  LEGACY BRAND', 56, 70);
  x.fillStyle = '#2a2824';
  x.font = '700 44px Georgia, serif';
  x.fillText('Brand Identity', 56, 130);
  x.fillText('Contract', 56, 180);
  x.fillStyle = '#6b665c';
  x.font = 'italic 17px Georgia, serif';
  x.fillText('Old logo · old colours · old positioning', 56, 214);
  x.fillStyle = '#2a2824';
  x.fillRect(56, 236, 528, 2);
  let y = 272;
  for (let sec = 1; sec <= 4; sec++) {
    x.fillStyle = '#2a2824';
    x.font = '700 14px Georgia, serif';
    x.fillText('Clause ' + sec, 56, y);
    y += 20;
    const lines = 3 + Math.floor(R() * 2);
    for (let i = 0; i < lines; i++) {
      x.fillStyle = 'rgba(42,40,36,.22)';
      const w = i === lines - 1 ? 180 + R() * 180 : 470 + R() * 58;
      x.fillRect(56, y, w, 7);
      y += 17;
    }
    y += 16;
  }
  x.fillStyle = '#2a2824';
  x.fillRect(56, 720, 220, 1.5);
  x.fillRect(364, 720, 220, 1.5);
  x.font = "500 12px 'IBM Plex Mono', monospace";
  x.fillStyle = '#6b665c';
  x.fillText('SIGNED', 56, 742);
  x.fillText('DATE', 364, 742);
  x.save();
  x.translate(430, 560);
  x.rotate(-0.24);
  x.strokeStyle = '#b8322a';
  x.lineWidth = 5;
  x.strokeRect(-120, -42, 240, 84);
  x.fillStyle = '#b8322a';
  x.font = "700 46px 'Barlow Condensed', sans-serif";
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('EXPIRED', 0, 3);
  x.restore();
  return c.toDataURL('image/png');
}

export default function Rebrand() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState('');
  const [paper, setPaper] = useState<PaperCrumpleState>('flat');
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setSheet(contractSheet());
      },
      { rootMargin: '500px 0px' }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  const crumpled = paper === 'crumpled';
  const hint = crumpled ? 'Gone. Now let us build the new one.' : paper === 'holding' ? 'Keep holding. Drag it aside.' : 'Hold the sheet to crumple it.';

  return (
    <section data-screen-label="Rebrand" style={{ padding: "clamp(64px,8vw,110px) clamp(20px,4vw,56px)", background: "#fff" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p data-r="up" style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}>Rebranding</p>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,5.4vw,84px)", lineHeight: ".9", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Throw away the</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="80" style={{ display: "block" }}>old contract.</span></span></h2>
          <p data-r="up" data-d="120" style={{ color: "#55566a", fontSize: "17px", lineHeight: "1.6", maxWidth: "520px" }}>Then give your brand a new identity, with sharper positioning, stronger systems, and more commercially useful execution.</p>
          <div data-r="up" data-d="180" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#55566a" }}>{hint}</p>
            {crumpled && (<>
              <button className="hv2" type="button" onClick={() => { setResetKey(k => k + 1); setPaper('flat'); }} style={{ padding: "10px 16px", border: "1.5px solid #0a0c24", borderRadius: "6px", background: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>Bring it back</button>
              <Link className="hv1" href={CONTACT} style={{ padding: "11px 18px", borderRadius: "6px", background: "#080b38", color: "#fff", fontWeight: "600", fontSize: "14px" }}>Start a rebrand</Link>
            </>)}
          </div>
        </div>
        <div ref={stageRef} style={{ position: "relative", height: "clamp(440px,62vh,580px)", borderRadius: "10px", background: "#f4f4f7", overflow: "hidden" }}>
          {sheet && (
            <PaperCrumple
              src={sheet}
              alt="An old brand contract"
              width={320}
              height={400}
              style={{ height: '100%' }}
              releaseBehavior="stay"
              crumpleAmount={1}
              crumpleDuration={0.55}
              releaseDuration={0.4}
              foldCount={6}
              foldSharpness={0.85}
              wrinkleDepth={1.3}
              creaseStrength={0.18}
              paperColor="#f4f0e8"
              paperTexture={0.55}
              returnToOrigin={false}
              seed={15}
              detail={56}
              resetKey={resetKey}
              onStateChange={setPaper}
            />
          )}
        </div>
      </div>
    </section>
  );
}
