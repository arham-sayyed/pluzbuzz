'use client';

import { useEffect, useRef, useState } from 'react';
import { geoContains, geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, Geometry } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { formatTime, useClock } from '@/components/home/LocalTime';
import { OFFICES } from '@/lib/offices';

type Country = Feature<Geometry, { name: string }>;
type Rotation = [number, number, number];

const HQ = OFFICES[0];
const OFFICE_IDS = new Set(OFFICES.map(o => o.id));
const monoLabel = { fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase" } as const;

const easeCubicInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function tzOffset(tz: string, d: Date) {
  const s = d.toLocaleString('en-US', { timeZone: tz });
  const u = d.toLocaleString('en-US', { timeZone: 'UTC' });
  return Math.round((new Date(s).getTime() - new Date(u).getTime()) / 60000);
}

function km(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180;
  const dLat = (b[1] - a[1]) * r;
  const dLon = (b[0] - a[0]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function diffFromLondon(tz: string, now: number | null) {
  if (now === null) return '';
  const d = new Date(now);
  const m = tzOffset(tz, d) - tzOffset(HQ.tz, d);
  if (m === 0) return 'Same time';
  const abs = Math.abs(m);
  return `${m > 0 ? '+' : '−'}${Math.floor(abs / 60)}h${abs % 60 ? ' ' + (abs % 60) + 'm' : ''}`;
}

/** Office list + draggable orthographic globe. The globe is canvas-drawn; `flyTo` is exposed to the list via a ref. */
export default function OfficeGlobe() {
  const now = useClock();
  const [sel, setSel] = useState(0);
  const [hover, setHover] = useState({ name: '', coord: '' });
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selRef = useRef(0);
  const flyToRef = useRef<(i: number) => void>(() => {});

  const pick = (i: number) => {
    selRef.current = i;
    setSel(i);
    flyToRef.current(i);
  };
  const pickRef = useRef(pick);
  useEffect(() => {
    pickRef.current = pick;
  });

  useEffect(() => {
    const host = stageRef.current;
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (!host || !cv || !ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const proj = geoOrthographic().clipAngle(90).precision(0.4);
    const path = geoPath(proj, ctx);
    const grat = geoGraticule10();
    let rot: Rotation = [-HQ.ll[0] - 18, -HQ.ll[1] + 14, 0];
    let zoom = 1;
    let lastInteract = -1e9;
    let visible = true;
    let raf = 0;
    let W = 0, H = 0, dpr = 1, R = 0, CY = 0;
    let land: Country[] | null = null;
    let hoverF: Country | null = null;
    let fly: { r0: Rotation; r1: Rotation; t0: number; dur: number; dip: number } | null = null;
    let hoverT = 0;
    let lastHover = { name: '', coord: '' };
    let disposed = false;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = host.clientWidth;
      H = host.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      // Narrow stages keep the lower part clear for the office card.
      if (W < 640) {
        const avail = H - 280;
        R = Math.min(W, avail) * 0.45;
        CY = avail / 2 + 16;
      } else {
        R = Math.min(W, H) * 0.43;
        CY = H / 2;
      }
    };

    const flyTo = (i: number, dur?: number) => {
      const [lon, lat] = OFFICES[i].ll;
      const r0 = rot.slice() as Rotation;
      const d = ((-lon - r0[0]) % 360 + 540) % 360 - 180;
      const r1: Rotation = [r0[0] + d, Math.max(-60, Math.min(60, -lat + 8)), 0];
      const dist = Math.hypot(d, r1[1] - r0[1]);
      fly = { r0, r1, t0: performance.now(), dur: dur ?? Math.max(900, Math.min(2000, 500 + dist * 9)), dip: Math.min(0.16, dist / 900) };
      lastInteract = performance.now();
    };
    flyToRef.current = i => flyTo(i);

    const onFront = (ll: [number, number]) => geoDistance(ll, [-rot[0], -rot[1]]) <= Math.PI / 2;
    const featureAt = (p: [number, number]) => {
      if (!land) return null;
      const ll = proj.invert?.(p);
      if (!ll || !onFront(ll)) return null;
      return land.find(f => geoContains(f, ll)) ?? null;
    };

    const updateHover = (p: [number, number]) => {
      const t = performance.now();
      if (t - hoverT < 60) return;
      hoverT = t;
      const f = featureAt(p);
      hoverF = f;
      const ll = proj.invert?.(p);
      const coord = ll && onFront(ll) ? `${Math.abs(ll[1]).toFixed(2)}° ${ll[1] >= 0 ? 'N' : 'S'} · ${Math.abs(ll[0]).toFixed(2)}° ${ll[0] >= 0 ? 'E' : 'W'}` : '';
      const isOffice = !!f && OFFICE_IDS.has(String(f.id));
      const name = f ? f.properties.name + (isOffice ? ' · office' : '') : '';
      cv.style.cursor = isOffice ? 'pointer' : 'grab';
      if (name !== lastHover.name || coord !== lastHover.coord) {
        lastHover = { name, coord };
        setHover(lastHover);
      }
    };

    const draw = (t: number) => {
      if (!W) return;
      const r = R * zoom, cx = W / 2, cy = CY;
      const selected = OFFICES[selRef.current];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      proj.scale(r).translate([cx, cy]).rotate(rot);

      const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.25);
      glow.addColorStop(0, 'rgba(58,91,255,.22)');
      glow.addColorStop(1, 'rgba(58,91,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.25, 0, 7);
      ctx.fill();

      const sea = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      sea.addColorStop(0, '#16206e');
      sea.addColorStop(1, '#0a0f45');
      ctx.beginPath();
      path({ type: 'Sphere' });
      ctx.fillStyle = sea;
      ctx.fill();

      ctx.beginPath();
      path(grat);
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      if (land) {
        ctx.beginPath();
        land.forEach(f => {
          if (!OFFICE_IDS.has(String(f.id)) && f !== hoverF) path(f);
        });
        ctx.fillStyle = '#232a72';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.13)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        if (hoverF && !OFFICE_IDS.has(String(hoverF.id))) {
          ctx.beginPath();
          path(hoverF);
          ctx.fillStyle = '#2e3685';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,.4)';
          ctx.stroke();
        }
        land.forEach(f => {
          if (!OFFICE_IDS.has(String(f.id))) return;
          const on = f.id === selected.id, hov = f === hoverF;
          ctx.beginPath();
          path(f);
          ctx.fillStyle = on ? '#3a5bff' : hov ? '#5268d6' : '#3a4598';
          ctx.fill();
          ctx.strokeStyle = on ? '#fff' : 'rgba(170,182,255,.7)';
          ctx.lineWidth = on ? 1.1 : 0.7;
          ctx.stroke();
        });
      }

      // Routes from the London hub; the selected one is solid, the rest march.
      OFFICES.forEach((o, i) => {
        if (i === 0) return;
        const on = i === selRef.current;
        ctx.beginPath();
        path({ type: 'LineString', coordinates: [HQ.ll, o.ll] });
        ctx.setLineDash(on ? [] : [3, 4]);
        ctx.lineDashOffset = on || reduced ? 0 : -t / 60;
        ctx.strokeStyle = on ? '#ffc83d' : 'rgba(255,200,61,.3)';
        ctx.lineWidth = on ? 1.6 : 0.9;
        ctx.stroke();
      });
      ctx.setLineDash([]);

      const center: [number, number] = [-rot[0], -rot[1]];
      OFFICES.forEach((o, i) => {
        if (geoDistance(o.ll, center) >= Math.PI / 2 - 0.02) return;
        const pt = proj(o.ll);
        if (!pt) return;
        const [x, y] = pt, on = i === selRef.current;
        if (on && !reduced) {
          const ph = (t % 1800) / 1800;
          ctx.beginPath();
          ctx.arc(x, y, 5 + ph * 18, 0, 7);
          ctx.strokeStyle = `rgba(255,200,61,${0.8 * (1 - ph)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, on ? 5 : 3, 0, 7);
        ctx.fillStyle = on ? '#ffc83d' : '#fff';
        ctx.fill();
        if (on) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#080b38';
          ctx.stroke();
        }
        if (on || o.hub) {
          ctx.font = "500 11px 'IBM Plex Mono', monospace";
          const label = o.city.toUpperCase() + (o.hub && !on ? ' · HQ' : '');
          const tw = ctx.measureText(label).width;
          ctx.fillStyle = on ? '#ffc83d' : 'rgba(8,11,56,.85)';
          ctx.fillRect(x + 10, y - 19, tw + 12, 18);
          ctx.fillStyle = on ? '#080b38' : '#fff';
          ctx.fillText(label, x + 16, y - 6);
        }
      });

      ctx.beginPath();
      path({ type: 'Sphere' });
      ctx.strokeStyle = 'rgba(255,255,255,.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!land) {
        ctx.font = "500 12px 'IBM Plex Mono', monospace";
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.textAlign = 'center';
        ctx.fillText('LOADING MAP…', cx, cy);
        ctx.textAlign = 'left';
      }
    };

    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible || disposed) return;
      const t = performance.now();
      if (fly) {
        const p = Math.min(1, (t - fly.t0) / fly.dur), e = easeCubicInOut(p);
        rot = [fly.r0[0] + (fly.r1[0] - fly.r0[0]) * e, fly.r0[1] + (fly.r1[1] - fly.r0[1]) * e, 0];
        zoom = 1 - fly.dip * Math.sin(Math.PI * p);
        if (p >= 1) {
          fly = null;
          zoom = 1;
          lastInteract = t;
        }
      } else if (!reduced && t - lastInteract > 7000) {
        rot = [rot[0] + 0.05, rot[1], 0];
      }
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    // Pointer: drag to spin, tap an office country to select it.
    let drag: { p: [number, number]; r: Rotation; moved: number } | null = null;
    const pos = (e: PointerEvent): [number, number] => {
      const b = cv.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onDown = (e: PointerEvent) => {
      drag = { p: pos(e), r: rot.slice() as Rotation, moved: 0 };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
      fly = null;
      lastInteract = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      const p = pos(e);
      if (drag) {
        const dx = p[0] - drag.p[0], dy = p[1] - drag.p[1], k = 70 / R;
        drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(dy));
        rot = [drag.r[0] + dx * k, Math.max(-75, Math.min(75, drag.r[1] - dy * k)), 0];
        lastInteract = performance.now();
      }
      updateHover(p);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      cv.style.cursor = 'grab';
      if (drag.moved < 5) {
        const f = featureAt(pos(e));
        const i = f ? OFFICES.findIndex(o => o.id === String(f.id)) : -1;
        if (i >= 0) pickRef.current(i);
      }
      drag = null;
    };
    const onCancel = () => {
      drag = null;
      cv.style.cursor = 'grab';
    };
    const onLeave = () => {
      hoverF = null;
      if (lastHover.name || lastHover.coord) {
        lastHover = { name: '', coord: '' };
        setHover(lastHover);
      }
    };
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onCancel);
    cv.addEventListener('pointerleave', onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) loop();
    });
    io.observe(host);

    // The country shapes (~100 KB) are split into their own chunk and only fetched once the globe mounts.
    import('world-atlas/countries-110m.json').then(mod => {
      if (disposed) return;
      const topo = (mod.default ?? mod) as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
      land = feature(topo, topo.objects.countries).features as Country[];
      flyTo(selRef.current, 1800);
    }).catch(() => {});

    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onCancel);
      cv.removeEventListener('pointerleave', onLeave);
      flyToRef.current = () => {};
    };
  }, []);

  const o = OFFICES[sel];
  const num = String(sel + 1).padStart(2, '0');

  return (
    <div className="ct-globe" style={{ gap: "clamp(20px,3vw,48px)", alignItems: "stretch", borderTop: "1px solid rgba(255,255,255,.16)", paddingTop: "clamp(20px,2.4vw,32px)" }}>
      <div className="ct-globe__list" role="tablist" aria-label="Office locations" style={{ display: "flex", flexDirection: "column" }}>
        {OFFICES.map((office, i) => {
          const on = i === sel;
          return (
            <button key={office.code} className="ct-office" type="button" role="tab" aria-selected={on} onClick={() => pick(i)} style={{ display: "grid", gridTemplateColumns: "34px minmax(0,1fr) auto", alignItems: "center", gap: "14px", padding: "16px 14px", border: "0", borderBottom: "1px solid rgba(255,255,255,.1)", color: "#fff", textAlign: "left", cursor: "pointer", borderRadius: "6px", transition: "background .25s" }}>
              <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: on ? '#ffc83d' : 'rgba(255,255,255,.5)' }}>{office.code}</span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}><span style={{ fontWeight: "600", fontSize: "16px" }}>{office.country}</span><span style={{ fontSize: "13px", color: "rgba(255,255,255,.6)" }}>{office.city}{office.hub ? ' · Main Hub' : ''}</span></span>
              <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "rgba(255,255,255,.6)" }}>{formatTime(now, office.tz)}</span>
            </button>
          );
        })}
        <p style={{ marginTop: "auto", padding: "18px 14px 0", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px", lineHeight: "1.7", color: "rgba(255,255,255,.5)" }}>Drag to spin the globe. Click a highlighted country to fly to that office.</p>
      </div>

      <div ref={stageRef} className="ct-globe__stage" style={{ position: "relative", border: "1px solid rgba(255,255,255,.12)", borderRadius: "12px", overflow: "hidden", backgroundColor: "#080b38", backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)", backgroundSize: "48px 48px" }}>
        <canvas ref={canvasRef} role="img" aria-label="Interactive globe showing PluzBuzz office locations" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", cursor: "grab", touchAction: "pan-y" }}></canvas>
        <div style={{ position: "absolute", left: "16px", top: "14px", right: "16px", display: "flex", justifyContent: "space-between", gap: "12px", fontFamily: "'IBM Plex Mono'", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", pointerEvents: "none" }}>
          <span>{hover.coord || 'Drag to explore'}</span><span>{hover.name}</span>
        </div>
        <article aria-live="polite" style={{ position: "absolute", left: "clamp(12px,1.6vw,20px)", bottom: "clamp(12px,1.6vw,20px)", width: "min(320px,calc(100% - 24px))", display: "flex", flexDirection: "column", gap: "12px", padding: "18px 20px", borderRadius: "10px", background: "rgba(8,11,56,.86)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.14)" }}>
          <div style={{ ...monoLabel, fontSize: "11px", display: "flex", justifyContent: "space-between", gap: "10px" }}><span style={{ color: "#ffc83d" }}>{o.code} · {o.hub ? 'Main hub' : 'Regional delivery'}</span><span style={{ color: "rgba(255,255,255,.55)" }}>{num} / 07</span></div>
          <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(30px,2.6vw,40px)", lineHeight: ".9", textTransform: "uppercase" }}>{o.country}</h3>
          <p style={{ fontSize: "15px", fontWeight: "500", marginTop: "-6px" }}>{o.city}</p>
          <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "auto 1fr", gap: "7px 16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,.14)", fontFamily: "'IBM Plex Mono'", fontSize: "12px" }}>
            <dt style={{ color: "rgba(255,255,255,.55)" }}>Local time</dt><dd style={{ margin: "0" }}>{formatTime(now, o.tz)}</dd>
            <dt style={{ color: "rgba(255,255,255,.55)" }}>vs London</dt><dd style={{ margin: "0" }}>{o.hub ? 'Headquarters' : diffFromLondon(o.tz, now)}</dd>
            <dt style={{ color: "rgba(255,255,255,.55)" }}>From HQ</dt><dd style={{ margin: "0" }}>{o.hub ? '—' : Math.round(km(HQ.ll, o.ll)).toLocaleString('en-GB') + ' km'}</dd>
          </dl>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,.7)" }}>{o.hub ? 'Primary coordination hub. Supporting partners across United Kingdom.' : `Regional delivery presence. Supporting partners across ${o.country}.`}</p>
        </article>
      </div>
    </div>
  );
}
