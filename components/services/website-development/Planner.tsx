'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { MOBILE_BP, useNarrowerThan } from '@/lib/use-viewport';
import { PLAN_FEATURES, PLAN_PLATFORMS, PLAN_SIZES, PLAN_TYPES } from './data';

const mono = (size: string, extra?: CSSProperties): CSSProperties => ({ fontFamily: "'IBM Plex Mono'", fontSize: size, ...extra });
const wire = '1px solid rgba(10,12,36,.55)';
/** Selected state: navy with the same yellow underline as the nav's current page. */
const selected: CSSProperties = { background: '#080b38', color: '#fff', boxShadow: 'inset 0 -3px 0 #ffc83d' };

function SpecRow({ num, label, cols, children }: { num: string; label: string; cols: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: '1px solid rgba(10,12,36,.12)' }}>
      <div style={{ padding: '20px 18px 8px', display: 'flex', flexDirection: 'column', gap: '4px', ...mono('11px', { letterSpacing: '.1em', textTransform: 'uppercase', color: '#55566a' }) }}>
        <span style={{ color: '#3a5bff' }}>{num}</span>
        <span style={{ color: '#0a0c24' }}>{label}</span>
      </div>
      <div style={{ padding: '14px 18px 18px', minWidth: '0' }}>{children}</div>
    </div>
  );
}

function Options({ items, value, onPick, min }: { items: { name: string; sub?: string }[]; value: number; onPick: (i: number) => void; min: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))`, gap: '1px', background: 'rgba(10,12,36,.18)', border: '1px solid rgba(10,12,36,.18)', borderRadius: '6px', overflow: 'hidden' }}>
      {items.map(({ name, sub }, i) => {
        const on = i === value;
        return (
          <button key={name} type="button" aria-pressed={on} onClick={() => onPick(i)} style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px', border: '0', background: '#fff', color: '#0a0c24', textAlign: 'left', cursor: 'pointer', transition: 'background .2s,color .2s,box-shadow .2s', ...(on ? selected : {}) }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>{name}</span>
            {sub && <span style={{ fontSize: '12.5px', opacity: '.72' }}>{sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Scope picker: the wireframe, spec and timeline estimate update live and can be sent as a brief. */
export default function Planner() {
  const mobile = useNarrowerThan(MOBILE_BP);
  const [ptype, setType] = useState(0);
  const [psize, setSize] = useState(1);
  const [pplat, setPlat] = useState(0);
  const [pfeat, setFeat] = useState<number[]>([0]);

  const typeName = PLAN_TYPES[ptype][0];
  const features = pfeat.map(i => PLAN_FEATURES[i][0]);
  const estimate = (() => {
    const [a, b] = PLAN_TYPES[ptype][3];
    const add = PLAN_SIZES[psize][1] + Math.floor(pfeat.length / 2);
    const lo = a + add;
    const hi = b + add;
    return hi > 10 ? (lo >= 10 ? '10+ weeks' : lo + '–10+ weeks') : lo + '–' + hi + ' weeks';
  })();
  const toggleFeature = (i: number) => setFeat(f => (f.includes(i) ? f.filter(x => x !== i) : [...f, i].sort()));

  // Prefill the contact form with this spec and jump to it.
  const sendBrief = () => {
    const msg = `Website brief: ${typeName}, ${PLAN_SIZES[psize][0]}. Platform: ${PLAN_PLATFORMS[pplat]}.` + (features.length ? ` Needs: ${features.join(', ')}.` : '') + ` Typical timeline shown: ${estimate}.`;
    const c = document.getElementById('contact');
    const f = c?.querySelector('form');
    if (f) {
      (f.elements.namedItem('message') as HTMLTextAreaElement).value = msg;
      (f.elements.namedItem('services') as HTMLInputElement).value = 'Website — ' + typeName;
    }
    if (c) window.scrollTo({ top: c.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  };

  const cols = mobile ? 'minmax(0,1fr)' : '150px minmax(0,1fr)';
  const planUrl = 'your-brand.co.uk' + PLAN_TYPES[ptype][2];
  const hasBlog = pfeat.includes(3) && ptype !== 2;
  const navDots = ptype === 2 ? 1 : PLAN_SIZES[psize][2];
  const badges = pfeat.map(i => PLAN_FEATURES[i][1]).concat(pplat ? [PLAN_PLATFORMS[pplat].toUpperCase()] : []);
  const specRows: [string, string][] = [
    ['Type', typeName],
    ['Size', PLAN_SIZES[psize][0]],
    ['Platform', PLAN_PLATFORMS[pplat]],
    ['Features', features.join(', ') || 'None selected']
  ];

  return (
    <section id="plan" data-screen-label="Plan your website" style={{ position: "relative", background: "#f4f4f7", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(46px,6vw,96px)", lineHeight: ".88", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Plan your</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block", color: "#3a5bff" }}>website</span></span></h2>
          <p data-r="up" style={{ maxWidth: "460px", color: "#55566a", fontSize: "17px", lineHeight: "1.55" }}>Set the scope of your project. The layout, spec and timeline update as you choose, and you can send it to us as your brief.</p>
        </div>
        <div data-r="up" style={{ border: "1.5px solid #0a0c24", borderRadius: "12px", background: "#fff", overflow: "hidden" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px 20px", padding: "12px 18px", borderBottom: "1.5px solid #0a0c24", ...mono('11.5px', { letterSpacing: '.08em', textTransform: 'uppercase' }) }}>
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "7px", height: "7px", background: "#3a5bff" }}></span>Project spec</span>
            <span style={{ color: "#55566a", textTransform: "none", letterSpacing: "0" }}>{planUrl}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#55566a" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2fbf71" }}></span>Draft · updates live</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)' }}>
            <div style={{ borderRight: "1px solid rgba(10,12,36,.14)", minWidth: "0" }}>
              <SpecRow num="01" label="Website type" cols={cols}><Options min={170} value={ptype} onPick={setType} items={PLAN_TYPES.map(([name, sub]) => ({ name, sub }))} /></SpecRow>
              <SpecRow num="02" label="Size" cols={cols}><Options min={120} value={psize} onPick={setSize} items={PLAN_SIZES.map(([name]) => ({ name }))} /></SpecRow>
              <SpecRow num="03" label="Platform" cols={cols}><Options min={120} value={pplat} onPick={setPlat} items={PLAN_PLATFORMS.map(name => ({ name }))} /></SpecRow>
              <SpecRow num="04" label="Features" cols={cols}>
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(10,12,36,.18)", borderRadius: "6px", overflow: "hidden" }}>
                  {PLAN_FEATURES.map(([name, , kind], i) => {
                    const on = pfeat.includes(i);
                    return (
                      <button key={name} type="button" aria-pressed={on} onClick={() => toggleFeature(i)} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", alignItems: "center", gap: "12px", padding: "13px 14px", border: "0", borderBottom: "1px solid rgba(10,12,36,.1)", background: on ? '#f4f5fb' : '#fff', color: "#0a0c24", textAlign: "left", cursor: "pointer" }}>
                        <span style={{ width: "16px", height: "16px", border: "1.5px solid #0a0c24", background: on ? '#080b38' : '#fff', display: "flex", alignItems: "center", justifyContent: "center", color: "#ffc83d", fontSize: "10px", fontWeight: "700" }}>{on ? '✓' : ''}</span>
                        <span style={{ fontSize: "15px", fontWeight: "500" }}>{name}</span>
                        <span style={mono('10.5px', { letterSpacing: '.08em', textTransform: 'uppercase', color: '#55566a' })}>{kind}</span>
                      </button>
                    );
                  })}
                </div>
              </SpecRow>
            </div>
            <div style={{ minWidth: "0", display: "flex", flexDirection: "column" }}>
              {/* Live wireframe */}
              <div style={{ padding: "18px", backgroundColor: "#f7f8fb", backgroundImage: "linear-gradient(#e8eaf2 1px,transparent 1px),linear-gradient(90deg,#e8eaf2 1px,transparent 1px)", backgroundSize: "24px 24px", borderBottom: "1px solid rgba(10,12,36,.14)" }}>
                <div style={{ position: "relative", border: wire, borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderBottom: wire }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", border: "1px solid #9a9bab" }}></span><span style={{ width: "8px", height: "8px", borderRadius: "50%", border: "1px solid #9a9bab" }}></span><span style={{ width: "8px", height: "8px", borderRadius: "50%", border: "1px solid #9a9bab" }}></span>
                    <span style={{ flex: "1", marginLeft: "6px", ...mono('10.5px', { color: '#55566a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }) }}>{planUrl}</span>
                  </div>
                  <div style={{ position: "relative", height: "clamp(300px,40vh,400px)", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "8px 10px", border: wire, borderRadius: "4px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", ...mono('10px', { letterSpacing: '.08em' }) }}><span style={{ width: "12px", height: "12px", border: "1px solid #0a0c24" }}></span>LOGO</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {Array.from({ length: navDots }, (_, i) => <span key={i} style={{ width: "20px", height: "2px", background: "#0a0c24", opacity: ".45" }}></span>)}
                        {ptype === 1 && <span style={{ padding: "2px 6px", border: "1px solid #0a0c24", ...mono('10px') }}>CART</span>}
                      </span>
                    </div>
                    {ptype === 0 && (<>
                      <div style={{ flex: "1.3", border: wire, borderRadius: "4px", background: "#f4f4f7", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "8px" }}><span style={{ height: "10px", width: "62%", background: "#0a0c24" }}></span><span style={{ height: "10px", width: "44%", background: "#0a0c24" }}></span><span style={{ height: "3px", width: "52%", background: "#9a9bab", marginTop: "4px" }}></span><span style={{ alignSelf: "flex-start", marginTop: "6px", padding: "6px 12px", background: "#3a5bff", color: "#fff", ...mono('10px') }}>CTA</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "10px", flex: ".7" }}>{[0, 1, 2].map(i => <div key={i} style={{ border: wire, borderRadius: "4px", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "5px" }}><span style={{ height: "3px", width: "70%", background: "#0a0c24", opacity: ".6" }}></span><span style={{ height: "3px", width: "45%", background: "#9a9bab" }}></span></div>)}</div>
                    </>)}
                    {ptype === 1 && (<>
                      <div style={{ border: wire, borderRadius: "4px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f4f4f7" }}><span style={{ height: "8px", width: "40%", background: "#0a0c24" }}></span><span style={{ padding: "4px 10px", background: "#3a5bff", color: "#fff", ...mono('10px') }}>SHOP</span></div>
                      <div style={{ flex: "1", display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gridAutoRows: "1fr", gap: "10px", minHeight: "0" }}>{Array.from({ length: psize === 0 ? 3 : 6 }, (_, i) => <div key={i} style={{ border: wire, borderRadius: "4px", padding: "7px", display: "flex", flexDirection: "column", gap: "5px", minHeight: "0" }}><span style={{ flex: "1", backgroundImage: "repeating-linear-gradient(45deg,#e3e4ec 0 1px,transparent 1px 7px)" }}></span><span style={{ height: "3px", width: "70%", background: "#0a0c24", opacity: ".6" }}></span><span style={mono('9.5px')}>£ —</span></div>)}</div>
                    </>)}
                    {ptype === 2 && (
                      <div style={{ flex: "1", display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "12px", border: wire, borderRadius: "4px", background: "#f4f4f7", padding: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}><span style={{ height: "10px", width: "80%", background: "#0a0c24" }}></span><span style={{ height: "10px", width: "55%", background: "#0a0c24" }}></span><span style={{ height: "3px", width: "70%", background: "#9a9bab", marginTop: "4px" }}></span></div>
                        <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", gap: "7px", padding: "10px", border: wire, background: "#fff" }}><span style={mono('9.5px', { color: '#55566a' })}>FORM</span><span style={{ height: "20px", border: "1px solid #c3c5d4" }}></span><span style={{ height: "20px", border: "1px solid #c3c5d4" }}></span><span style={{ height: "22px", background: "#3a5bff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", ...mono('10px') }}>SUBMIT</span></div>
                      </div>
                    )}
                    {ptype === 3 && (
                      <div style={{ flex: "1", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "10px", minHeight: "0" }}>
                        <div style={{ position: "relative", border: "1px dashed #9a9bab", borderRadius: "4px", backgroundImage: "repeating-linear-gradient(45deg,#e3e4ec 0 1px,transparent 1px 7px)", padding: "12px", display: "flex", flexDirection: "column", gap: "7px" }}><span style={mono('10px', { color: '#55566a' })}>BEFORE</span><span style={{ height: "6px", width: "80%", background: "#c3c5d4" }}></span><span style={{ height: "6px", width: "60%", background: "#c3c5d4" }}></span><span style={{ flex: "1", border: "1px solid #c3c5d4", background: "#fff" }}></span></div>
                        <div style={{ position: "relative", border: wire, borderRadius: "4px", background: "#f4f4f7", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "7px" }}><span style={{ position: "absolute", left: "12px", top: "12px", ...mono('10px', { color: '#3a5bff' }) }}>AFTER</span><span style={{ height: "9px", width: "70%", background: "#0a0c24" }}></span><span style={{ height: "9px", width: "50%", background: "#0a0c24" }}></span><span style={{ alignSelf: "flex-start", marginTop: "4px", padding: "5px 10px", background: "#3a5bff", color: "#fff", ...mono('10px') }}>CTA</span></div>
                      </div>
                    )}
                    {hasBlog && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "10px" }}>{[0, 1, 2].map(i => <div key={i} style={{ border: "1px dashed #3a5bff", borderRadius: "4px", padding: "7px", display: "flex", flexDirection: "column", gap: "5px" }}><span style={mono('9px', { color: '#3a5bff' })}>POST</span><span style={{ height: "3px", width: "80%", background: "#0a0c24", opacity: ".5" }}></span></div>)}</div>
                    )}
                    <div style={{ position: "absolute", right: "22px", top: "58px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", pointerEvents: "none" }}>
                      {badges.map(label => <span key={label} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", border: "1px solid #3a5bff", background: "#fff", color: "#3a5bff", ...mono('10px', { letterSpacing: '.06em' }) }}><span style={{ width: "5px", height: "5px", background: "#3a5bff" }}></span>{label}</span>)}
                    </div>
                  </div>
                </div>
              </div>
              {/* Spec summary */}
              <dl style={{ margin: "0", display: "flex", flexDirection: "column" }}>
                {specRows.map(([k, val]) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", padding: "12px 18px", borderBottom: "1px solid rgba(10,12,36,.1)" }}>
                    <dt style={{ paddingTop: "2px", ...mono('11px', { letterSpacing: '.1em', textTransform: 'uppercase', color: '#55566a' }) }}>{k}</dt>
                    <dd style={{ margin: "0", fontSize: "15px", fontWeight: "500" }}>{val}</dd>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", padding: "16px 18px", borderBottom: "1px solid rgba(10,12,36,.1)", alignItems: "baseline" }}>
                  <dt style={mono('11px', { letterSpacing: '.1em', textTransform: 'uppercase', color: '#55566a' })}>Timeline</dt>
                  <dd style={{ margin: "0", fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "34px", lineHeight: "1", color: "#080b38" }}>
                    <span style={{ position: "relative", display: "inline-block", padding: "0 .06em" }}><span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: ".06em", height: ".38em", background: "#ffc83d" }}></span><span style={{ position: "relative" }}>{estimate}</span></span>
                  </dd>
                </div>
              </dl>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "18px" }}>
                <p style={{ fontSize: "13px", color: "#55566a", maxWidth: "300px" }}>Estimate only. We confirm scope and timeline after a discovery call.</p>
                <button className="hv7" type="button" onClick={sendBrief} style={{ padding: "15px 22px", border: "0", borderRadius: "6px", background: "#080b38", color: "#fff", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>Send this brief →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
