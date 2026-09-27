'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SiteHeader from '@/components/site/SiteHeader';
import NavAnchor from '@/components/site/NavAnchor';
import { CATALOGUE } from '@/components/services-index/data';
import { CONTACT, HOME, SERVICES_INDEX, SOCIAL_LINKS, type NavLink } from '@/lib/site';
import { useFallingText } from '@/lib/use-falling-text';
import { MOBILE_BP, useHydrated, useMediaQuery, useNarrowerThan } from '@/lib/use-viewport';
import './not-found.css';

const ACCENT = '#3a5bff';
const mono = { fontFamily: "'IBM Plex Mono'" } as const;
const condensed = { fontFamily: "'Barlow Condensed'", fontWeight: 800, textTransform: 'uppercase' } as const;

const NAV: NavLink[] = [
  { href: HOME, label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: SERVICES_INDEX, label: 'Services' },
  { href: '/#journal', label: 'Blogs' }
];

/** Everything the request log can suggest. `mobile: false`: the target section is desktop-only. */
type Dest = { n: string; h: string; mobile?: false };
const PAGES: Dest[] = [
  { n: 'Home', h: HOME },
  { n: 'Services', h: SERVICES_INDEX },
  ...CATALOGUE.map(s => ({ n: s.name, h: s.href })),
  { n: 'About', h: '/#about' },
  { n: 'Our Work', h: '/#work', mobile: false },
  { n: 'Blogs', h: '/#journal' },
  { n: 'Contact', h: CONTACT }
];

const HEAD = 'This page went off-brief.';
const LEDE = 'The link may be old, mistyped, or the page has moved somewhere new. Grab anything here and throw it around, then find your way out below.';
const HIGHLIGHT = ['off-brief.', 'moved', 'throw'];
const words = (s: string) => s.split(' ').map(t => ({ t, on: HIGHLIGHT.includes(t.toLowerCase()) }));

function lev(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

/** The page whose path is closest to the one that 404'd, or Home when nothing is close. */
function closest(path: string, pages: Dest[]) {
  const r = path.toLowerCase().replace(/\/+$/, '');
  let best = pages[0];
  let score = Infinity;
  pages.forEach(p => {
    if (p.h === HOME) return;
    const s = lev(r, p.h) / Math.max(r.length, p.h.length);
    if (s < score) {
      score = s;
      best = p;
    }
  });
  return score < 0.6 ? best : pages[0];
}

const DESTINATIONS = [
  { href: SERVICES_INDEX, id: 'services', title: 'Services', sub: `All ${CATALOGUE.length} services`, bg: '#dfe5f3', minH: 220 },
  { href: '/#work', id: 'work', title: 'Our Work', sub: 'Recent projects', bg: '#e1eadf', minH: 260, desktopOnly: true },
  { href: '/#journal', id: 'blogs', title: 'Blogs', sub: 'Insights and notes', bg: '#e6e1f1', minH: 200 },
  { href: CONTACT, id: 'contact', title: 'Contact Us', sub: 'Tell us what you were looking for', bg: '#080b38', minH: 240, dark: true }
];

export default function NotFound() {
  const router = useRouter();
  // The 404 is prerendered once for every missing URL, so the requested path only exists after hydration.
  const hydrated = useHydrated();
  const pathname = usePathname() || '/';
  const reqPath = hydrated ? pathname.slice(0, 80) : '';
  const mobile = useNarrowerThan(MOBILE_BP);
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const pages = useMemo(() => (mobile ? PAGES.filter(p => p.mobile !== false) : PAGES), [mobile]);
  const best = useMemo(() => closest(reqPath, pages), [reqPath, pages]);

  const stageRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const { fallen, throws, reset } = useFallingText(stageRef, layoutRef, { trigger: 'hover', gravity: 1, stiffness: 0.2 });

  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const results = (query
    ? pages.filter(p => (p.n + ' ' + p.h).toLowerCase().includes(query))
    : [best, ...pages.filter(p => p !== best && [SERVICES_INDEX, '/#work', CONTACT].includes(p.h))]
  ).slice(0, 5);

  const hint = fallen
    ? coarse
      ? 'Drag anything · tap empty space to shake'
      : 'Grab anything · click empty space to shake'
    : reduced
      ? coarse ? 'Tap to drop it' : 'Click to drop it'
      : coarse ? 'Hold on…' : 'Hover to drop it';

  return (
    <>
      <SiteHeader links={NAV} homeHref={HOME} />
      <main className="nf-main">
        <section data-screen-label="404 stage">
          <div ref={stageRef} className={'nf-stage' + (fallen ? ' is-fallen' : '')}>
            <div ref={layoutRef} className="nf-layout">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span data-w="" className="nf-pill" style={{ background: '#ffc83d', color: '#080b38', borderColor: '#ffc83d' }}>Lost</span>
                <span data-w="" className="nf-pill">Error 404</span>
                <span data-w="" className="nf-pill">Page not found</span>
              </div>
              <div aria-hidden="true" className="nf-digits" style={{ ...condensed }}>
                <span data-w="" style={{ color: '#080b38' }}>4</span>
                <span data-w="" style={{ color: ACCENT }}>0</span>
                <span data-w="" style={{ color: '#080b38' }}>4</span>
              </div>
              <h1 aria-label={HEAD} style={{ ...condensed, display: 'flex', flexWrap: 'wrap', gap: '0 .22em', fontSize: 'clamp(40px,5.6vw,92px)', lineHeight: '.92' }}>
                {words(HEAD).map((w, i) => (
                  <span key={i} data-w="" aria-hidden="true" style={{ display: 'block', whiteSpace: 'nowrap', color: w.on ? ACCENT : undefined }}>{w.t}</span>
                ))}
              </h1>
              <p aria-label={LEDE} style={{ display: 'flex', flexWrap: 'wrap', gap: '.2em .3em', maxWidth: '600px', fontSize: 'clamp(16px,1.3vw,19px)', lineHeight: '1.45', color: '#55566a' }}>
                {words(LEDE).map((w, i) => (
                  <span key={i} data-w="" aria-hidden="true" style={{ display: 'block', whiteSpace: 'nowrap', color: w.on ? ACCENT : undefined, fontWeight: w.on ? 600 : 400 }}>{w.t}</span>
                ))}
              </p>
            </div>
            <p className="nf-hint" style={{ ...mono }}>{hint}</p>
          </div>
        </section>

        <section data-screen-label="Recovery" style={{ padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,56px) clamp(56px,7vw,100px)' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: 'clamp(28px,4vw,72px)', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
              <p style={{ ...mono, fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: '#55566a' }}>Ways out</p>
              <h2 style={{ ...condensed, fontSize: 'clamp(40px,4.6vw,72px)', lineHeight: '.9', textWrap: 'balance' }}>Done playing? <span style={{ color: ACCENT }}>Let’s get you back.</span></h2>
              <p style={{ fontSize: 'clamp(16px,1.25vw,18px)', lineHeight: '1.6', color: '#55566a', maxWidth: '520px', textWrap: 'pretty' }}>Try the closest match in the log, search the site, or head back home.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '6px' }}>
                <Link className="hv1" href={HOME} style={{ padding: '15px 24px', background: '#080b38', color: '#fff', borderRadius: '6px', fontWeight: 600, fontSize: '15px' }}>Back to home →</Link>
                <Link className="nf-outline" href={SERVICES_INDEX} style={{ padding: '15px 24px', border: '1px solid #0a0c24', borderRadius: '6px', fontWeight: 600, fontSize: '15px' }}>All services</Link>
                <button type="button" className="nf-reset" onClick={reset} style={{ padding: '15px 18px', border: 0, background: 'none', color: '#55566a', fontWeight: 500, fontSize: '15px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Reset the page</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '10px', background: '#080b38', color: '#fff', overflow: 'hidden', minWidth: 0, ...mono, fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,.2)' }} />)}
                <span style={{ marginLeft: 'auto', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Request log</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px 18px 16px', lineHeight: '1.5', overflowWrap: 'anywhere' }}>
                <p><span style={{ color: 'rgba(255,255,255,.45)' }}>$ GET </span>{reqPath}</p>
                <p><span style={{ color: '#ff8a7a' }}>✕ 404</span><span style={{ color: 'rgba(255,255,255,.7)' }}> Not Found · pluzbuzz.com</span></p>
                <p style={{ color: 'rgba(255,255,255,.7)' }}>→ closest match <NavAnchor className="nf-match" href={best.h} style={{ color: '#ffc83d', borderBottom: '1px solid rgba(255,200,61,.5)' }}>{best.h}</NavAnchor></p>
                <p style={{ color: 'rgba(255,255,255,.45)' }}>{fallen ? '→ status: everything fell over' + (throws ? ` · ${throws} ${throws === 1 ? 'throw' : 'throws'}` : '') : '→ status: holding together'}</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 18px', padding: '0 12px', height: '46px', borderRadius: '6px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', cursor: 'text' }}>
                <span style={{ color: '#ffc83d' }}>&gt;</span>
                <input
                  type="search"
                  className="nf-search"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && results[0]) router.push(results[0].h);
                    else if (e.key === 'Escape') setQ('');
                  }}
                  aria-label="Search pages"
                  placeholder="Search pages"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  maxLength={60}
                  style={{ flex: 1, minWidth: 0, height: '100%', border: 0, outline: 'none', background: 'transparent', color: '#fff', ...mono, fontSize: '16px' }}
                />
                {!q && <span aria-hidden="true" className="nf-caret" />}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 8px 12px' }}>
                {results.map(r => (
                  <NavAnchor key={r.n} className="nf-result" href={r.h}>
                    <span style={{ fontFamily: "'Schibsted Grotesk'", fontSize: '15px', fontWeight: 500 }}>{r.n}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.h}</span>
                  </NavAnchor>
                ))}
                {query && !results.length && (
                  <p style={{ padding: '10px', color: 'rgba(255,255,255,.6)', overflowWrap: 'anywhere' }}>Nothing for “{q.trim()}”. <Link href={CONTACT} style={{ color: '#ffc83d' }}>Ask us instead →</Link></p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section data-screen-label="Destinations" style={{ padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,56px)', background: '#f6f6f8', borderTop: '1px solid rgba(10,12,36,.1)' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <p style={{ ...mono, fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: '#55566a' }}>Where people usually go</p>
            <div className="nf-dests">
              {DESTINATIONS.map(d => (
                <NavAnchor key={d.id} href={d.href} className={'nf-dest' + (d.dark ? ' nf-dest--dark' : '') + (d.desktopOnly ? ' hide-mobile' : '')} style={{ minHeight: d.minH + 'px', background: d.bg }}>
                  <span className="nf-dest__n" style={{ ...mono, fontSize: '12px', color: d.dark ? 'rgba(255,255,255,.6)' : '#55566a' }} />
                  <span style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: '34px', lineHeight: '.95', textTransform: 'uppercase' }}>{d.title}</span>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px', color: d.dark ? 'rgba(255,255,255,.75)' : '#55566a' }}>
                      {d.sub}
                      <span aria-hidden="true" style={{ color: d.dark ? '#ffc83d' : '#0a0c24' }}>→</span>
                    </span>
                  </span>
                </NavAnchor>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '24px clamp(20px,4vw,56px)', borderTop: '1px solid rgba(10,12,36,.12)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#55566a' }}>
          <p>© 2026 — PluzBuzz All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {SOCIAL_LINKS.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ color: '#55566a' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
