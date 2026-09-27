'use client';

import { useCallback, useEffect, useRef } from 'react';
import ScrollExpand from '@/components/ScrollExpand';
import { flameCanvas } from '@/lib/flames';
import { useNarrowerThan } from '@/lib/use-viewport';

export default function WhoWeAre() {
  const compact = useNarrowerThan(760);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  // Same three-colour flame bands as the intro, behind the expanding frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return flameCanvas(canvas, { amp: 0.42, speed: 0.45 });
  }, []);

  return (
    <section id="about" data-screen-label="Who we are" style={{ position: "relative", background: "#fff" }}>
      <ScrollExpand
        className="pb-se"
        mediaType="canvas"
        onCanvas={onCanvas}
        title="We Create the Buzz"
        scrollHint="Scroll"
        useWindowScroll
        {...(compact ? { startWidth: 84, startHeight: 46 } : {})}
      >
        <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>Who We Are</p>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".9", textTransform: "uppercase", maxWidth: "1000px" }}>UK&apos;s Trusted Digital Marketing Agency for Measurable Growth</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "18px 56px", maxWidth: "1100px" }}>
          <p style={{ fontSize: "clamp(16px,1.3vw,19px)", lineHeight: "1.6", color: "rgba(255,255,255,.85)" }}>We work with UK businesses that are serious about growth - not just ticking boxes, but building something that actually moves the needle.</p>
          <p style={{ fontSize: "clamp(16px,1.3vw,19px)", lineHeight: "1.6", color: "rgba(255,255,255,.7)" }}>Over the years, we&apos;ve helped everyone from early-stage startups finding their feet to established brands looking to sharpen their edge online. Whether you&apos;re based in London or anywhere across the UK, we bring the same level of care and strategic thinking to every project we take on.</p>
        </div>
      </ScrollExpand>
    </section>
  );
}
