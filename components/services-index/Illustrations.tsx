/* Card artwork for the services catalogue: static, decorative, drawn in HTML/SVG so it scales with the card. */

import type { CSSProperties, ReactNode } from 'react';
import type { ServiceId } from './data';

const mono = (size: string, extra?: CSSProperties): CSSProperties => ({ fontFamily: "'IBM Plex Mono'", fontSize: size, ...extra });
const fill: CSSProperties = { position: 'absolute', inset: 0 };
const dot = (bg: string, size = 6): CSSProperties => ({ width: size, height: size, borderRadius: '50%', background: bg });
const bar = (w: string, h: number, bg: string, extra?: CSSProperties): CSSProperties => ({ height: h, width: w, background: bg, ...extra });

function Browser() {
  return (
    <div style={{ ...fill, padding: '22px' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #0a0c24', borderRadius: '6px', background: '#fff', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 10px', borderBottom: '1px solid rgba(10,12,36,.15)' }}>
          <span style={dot('#c9cad6')} /><span style={dot('#c9cad6')} /><span style={dot('#c9cad6')} />
          <span style={mono('10px', { marginLeft: '8px', color: '#8a8ba0' })}>yourbrand.co.uk</span>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '10px', padding: '12px', minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <span style={bar('90%', 8, '#0a0c24')} /><span style={bar('64%', 8, '#0a0c24')} />
            <span style={bar('80%', 4, '#d9dae3', { marginTop: '4px' })} /><span style={bar('58%', 4, '#d9dae3')} />
            <span style={{ alignSelf: 'flex-start', marginTop: '6px', width: '52px', height: '16px', borderRadius: '3px', background: '#3a5bff' }} />
          </div>
          <div style={{ borderRadius: '4px', background: '#e8e9ef' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', padding: '0 12px 10px', ...mono('9.5px', { color: '#55566a' }) }}><span>WordPress</span><span>·</span><span>Shopify</span><span>·</span><span>CMS</span></div>
      </div>
    </div>
  );
}

function Viewfinder() {
  const line = 'rgba(255,255,255,.12)';
  const corner = (pos: CSSProperties, sides: CSSProperties): ReactNode => <span style={{ position: 'absolute', width: '16px', height: '16px', ...pos, ...sides }} />;
  const w = '1px solid #fff';
  return (
    <div style={{ ...fill, background: '#080b38', overflow: 'hidden' }}>
      <span style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: '1px', background: line }} />
      <span style={{ position: 'absolute', left: '66.6%', top: 0, bottom: 0, width: '1px', background: line }} />
      <span style={{ position: 'absolute', top: '33.3%', left: 0, right: 0, height: '1px', background: line }} />
      <span style={{ position: 'absolute', top: '66.6%', left: 0, right: 0, height: '1px', background: line }} />
      {corner({ left: '18px', top: '18px' }, { borderLeft: w, borderTop: w })}
      {corner({ right: '18px', top: '18px' }, { borderRight: w, borderTop: w })}
      {corner({ left: '18px', bottom: '18px' }, { borderLeft: w, borderBottom: w })}
      {corner({ right: '18px', bottom: '18px' }, { borderRight: w, borderBottom: w })}
      <span style={{ position: 'absolute', left: '66.6%', top: '33.3%', width: '44px', height: '44px', margin: '-22px 0 0 -22px', border: w }} />
      <div style={{ position: 'absolute', left: '44px', right: '44px', bottom: '24px', display: 'flex', justifyContent: 'space-between', ...mono('10px', { color: 'rgba(255,255,255,.7)' }) }}><span>f/2.8</span><span>1/250</span><span>ISO 100</span></div>
      <div style={{ position: 'absolute', left: '44px', top: '24px', display: 'flex', gap: '10px', ...mono('10px', { color: 'rgba(255,255,255,.7)' }) }}><span style={{ color: '#fff' }}>Product</span><span>Editorial</span><span>Campaign</span></div>
    </div>
  );
}

function SearchRank() {
  return (
    <div style={{ ...fill, padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '34px', padding: '0 14px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(10,12,36,.18)' }}>
        <span style={{ width: '9px', height: '9px', borderRadius: '50%', border: '1.5px solid #55566a', flex: 'none' }} />
        <span style={mono('10.5px', { color: '#0a0c24' })}>seo agency london</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '30px', padding: '0 12px', borderRadius: '5px', background: '#080b38', color: '#fff', ...mono('10.5px') }}><span>01</span><span style={{ flex: 1 }}>yourbrand.co.uk</span><span style={{ color: '#8fa2ff' }}>↑ 8</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px', ...mono('10.5px', { color: '#8a8ba0' }) }}><span>02</span><span style={bar('55%', 4, '#d9dae3')} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px', ...mono('10.5px', { color: '#b3b4c2' }) }}><span>03</span><span style={bar('42%', 4, '#e3e4ea')} /></div>
    </div>
  );
}

function AiFlow() {
  const node = (x: number, y: number, label: string, solid?: boolean) => (
    <g key={label}>
      <rect x={x} y={y} width="76" height="34" rx="5" fill={solid ? '#fff' : 'none'} stroke={solid ? 'none' : 'rgba(255,255,255,.6)'} strokeWidth="1" />
      <text x={x + 38} y={y + 21} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill={solid ? '#080b38' : '#fff'}>{label}</text>
    </g>
  );
  return (
    <div style={{ ...fill, background: '#080b38', display: 'grid', placeItems: 'center', padding: '18px' }}>
      <svg viewBox="0 0 320 170" style={{ width: '100%', height: '100%' }}>
        <g className="sv-dash" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeDasharray="4 5">
          <path d="M82 85H132" /><path d="M188 85C212 85 212 32 236 32" /><path d="M188 85H236" /><path d="M188 85C212 85 212 138 236 138" />
        </g>
        <rect x="10" y="68" width="72" height="34" rx="5" fill="none" stroke="#fff" strokeWidth="1" />
        <text x="46" y="89" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#fff">Trigger</text>
        <circle cx="160" cy="85" r="28" fill="#3a5bff" />
        <text x="160" y="91" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="700" fontSize="18" fill="#fff">AI</text>
        {node(236, 15, 'Email')}
        {node(236, 68, 'Content')}
        {node(236, 121, 'Campaign', true)}
      </svg>
    </div>
  );
}

function Variants() {
  const tile = (bg: string): CSSProperties => ({ borderRadius: '4px', background: bg });
  return (
    <div style={{ ...fill, padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(2,1fr)', gap: '6px' }}>
        <span style={tile('#080b38')} /><span style={tile('#c9cad6')} />
        <span style={{ ...tile('#e3e4ea'), position: 'relative', outline: '1.5px solid #3a5bff', outlineOffset: '2px' }}><span style={{ position: 'absolute', left: '6px', top: '5px', ...mono('9.5px', { color: '#3a5bff' }) }}>V3 ✓</span></span>
        <span style={tile('#d9dae3')} /><span style={tile('#55566a')} /><span style={tile('#e8e9ef')} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '30px', padding: '0 12px', borderRadius: '5px', background: '#fff', border: '1px solid rgba(10,12,36,.12)', ...mono('10.5px', { color: '#55566a' }) }}><span style={{ color: '#0a0c24' }}>›</span>campaign visual · 6 variants</div>
    </div>
  );
}

function Timeline() {
  const clip = (left: string, width: string, bg: string, opacity = 1): CSSProperties => ({ position: 'absolute', left, width, top: 0, bottom: 0, borderRadius: '2px', background: bg, opacity });
  return (
    <div style={{ ...fill, background: '#080b38', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative', flex: 1, border: '1px solid rgba(255,255,255,.25)', borderRadius: '4px' }}>
        <span style={{ position: 'absolute', left: '10px', top: '8px', display: 'flex', alignItems: 'center', gap: '6px', ...mono('10px', { color: '#fff' }) }}><span style={dot('#fff')} />REC</span>
        <span style={{ position: 'absolute', right: '10px', top: '8px', ...mono('10px', { color: 'rgba(255,255,255,.7)' }) }}>00:00:14:08</span>
        <span style={{ position: 'absolute', left: '50%', top: '50%', margin: '-8px 0 0 -5px', borderLeft: '13px solid #fff', borderTop: '8px solid transparent', borderBottom: '8px solid transparent' }} />
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ position: 'relative', height: '9px' }}><span style={clip('0', '34%', '#3a5bff')} /><span style={clip('36%', '40%', '#3a5bff', 0.6)} /><span style={clip('78%', '22%', '#3a5bff', 0.35)} /></div>
        <div style={{ position: 'relative', height: '9px' }}><span style={clip('10%', '28%', 'rgba(255,255,255,.5)')} /><span style={clip('52%', '30%', 'rgba(255,255,255,.3)')} /></div>
        <span className="sv-playhead" style={{ position: 'absolute', top: '-3px', bottom: '-3px', left: '4%', width: '1px', background: '#fff' }} />
      </div>
    </div>
  );
}

function Dashboard() {
  const nav = <span style={bar('12px', 3, 'rgba(255,255,255,.4)')} />;
  return (
    <div style={{ ...fill, padding: '22px' }}>
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '38px 1fr', border: '1px solid rgba(10,12,36,.15)', borderRadius: '6px', background: '#fff', overflow: 'hidden' }}>
        <div style={{ background: '#080b38', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px', padding: '12px 0' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fff' }} />{nav}{nav}{nav}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
            {[0, 1, 2].map(i => <span key={i} style={{ height: '28px', borderRadius: '4px', background: '#f4f4f7' }} />)}
          </div>
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <path d="M0 52 L30 44 L60 47 L90 32 L120 35 L150 18 L180 22 L200 8" fill="none" stroke="#3a5bff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <div style={{ display: 'flex', gap: '8px', ...mono('9.5px', { color: '#55566a' }) }}><span>Dashboards</span><span>·</span><span>API</span><span>·</span><span>Auth</span></div>
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  const days: [string, 'on' | 'off' | 'accent'][] = [['M', 'on'], ['T', 'off'], ['W', 'on'], ['T', 'off'], ['F', 'on'], ['S', 'accent'], ['S', 'off']];
  const mark = (s: 'on' | 'off' | 'accent'): CSSProperties =>
    s === 'off' ? { ...dot('transparent'), border: '1px solid rgba(255,255,255,.4)' } : dot(s === 'on' ? '#fff' : '#3a5bff');
  return (
    <div style={{ ...fill, background: '#080b38', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
        <span style={{ height: '58px', borderRadius: '4px', background: '#3a5bff' }} />
        <span style={{ height: '58px', borderRadius: '4px', background: 'rgba(255,255,255,.22)' }} />
        <span style={{ height: '58px', borderRadius: '4px', border: '1px dashed rgba(255,255,255,.4)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', ...mono('9.5px', { color: 'rgba(255,255,255,.55)' }) }}>
        {days.map(([d, s], i) => <span key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>{d}<span style={mark(s)} /></span>)}
      </div>
    </div>
  );
}

function ChannelMix() {
  const rows: [string, string, string][] = [['Search', '86%', '#080b38'], ['Social', '64%', '#3a5bff'], ['Email', '46%', '#8a8ba0'], ['Display', '30%', '#c9cad6']];
  return (
    <div style={{ ...fill, padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
      <span style={mono('10px', { letterSpacing: '.08em', textTransform: 'uppercase', color: '#8a8ba0' })}>Channel mix</span>
      <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center', gap: '9px 10px', ...mono('10px', { color: '#55566a' }) }}>
        {rows.map(([label, w, bg]) => [<span key={label}>{label}</span>, <span key={label + '-bar'} style={bar(w, 8, bg, { borderRadius: '2px' })} />])}
      </div>
    </div>
  );
}

function AbTest() {
  return (
    <div style={{ ...fill, background: '#080b38', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', borderRadius: '5px', background: '#fff' }}>
        <span style={mono('9px', { letterSpacing: '.08em', textTransform: 'uppercase', color: '#8a8ba0' })}>Sponsored</span>
        <span style={bar('88%', 7, '#0a0c24')} /><span style={bar('64%', 4, '#d9dae3')} />
        <span style={{ alignSelf: 'flex-start', marginTop: '6px', width: '48px', height: '14px', borderRadius: '3px', background: '#3a5bff' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '14px 1fr', alignItems: 'center', gap: '10px 8px', ...mono('10px', { color: 'rgba(255,255,255,.7)' }) }}>
        <span>A</span><span style={bar('50%', 8, 'rgba(255,255,255,.3)', { borderRadius: '2px' })} />
        <span style={{ color: '#fff' }}>B</span><span style={bar('88%', 8, '#fff', { borderRadius: '2px' })} />
      </div>
    </div>
  );
}

export const ILLUSTRATIONS: Record<ServiceId, () => ReactNode> = {
  web: Browser,
  photo: Viewfinder,
  seo: SearchRank,
  aiEn: AiFlow,
  aiPh: Variants,
  video: Timeline,
  app: Dashboard,
  social: Calendar,
  marketing: ChannelMix,
  ads: AbTest
};
