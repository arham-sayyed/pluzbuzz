'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import NavAnchor from '@/components/site/NavAnchor';
import TearTicket from '@/components/TearTicket';
import ContactSection from '@/components/site/ContactSection';
import { CATALOGUE, CATEGORIES, MAX_QUERY, SEARCH_HINTS, cardTag, categoryLabel, hasOwnPage, type CategoryKey } from './data';
import { categoryCount, requestNumber, searchCatalogue, type SearchResult } from './search';
import { ILLUSTRATIONS } from './Illustrations';

const SEARCH_ID = 'service-search';
/** Masonry grid: rows are 4px tall and cards span enough of them to fit, plus the 16px gutter. */
const ROW = 4;
const GUTTER = 16;

const mono = { fontFamily: "'IBM Plex Mono'" } as const;
const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const headerHeight = () => document.querySelector('header')?.offsetHeight ?? 80;

/** Scroll so `el` sits just below the fixed header (and `extra` px more). */
function scrollBelowHeader(el: Element | null, extra = 0) {
  if (!el) return;
  scrollTo({ top: el.getBoundingClientRect().top + scrollY - headerHeight() - extra, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** Scrolls to the catalogue and puts the cursor in the search box. Used by the hero. */
export function focusCatalogueSearch() {
  const input = document.getElementById(SEARCH_ID) as HTMLInputElement | null;
  scrollBelowHeader(document.getElementById('services'));
  setTimeout(() => input?.focus({ preventScroll: true }), reducedMotion() ? 0 : 450);
}

export function BrowseButton() {
  return (
    <button type="button" className="sv-browse" onClick={focusCatalogueSearch} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 0 4px", border: "0", borderBottom: "1px solid currentColor", background: "none", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>
      Browse all services ↓
    </button>
  );
}

function statusLine(r: SearchResult, cat: CategoryKey) {
  const total = CATALOGUE.length;
  if (r.easter) return 'That’s us. Everything we do.';
  if (!r.filtered) return `${total} services`;
  return `${r.shown.length} of ${total} services` + (r.raw ? ` · “${r.short}”` : '') + (cat !== 'all' ? ` · ${categoryLabel(cat)}` : '');
}

function EmptyState({ r, cat, onPick, onAll, onCategoryAll, onTear }: {
  r: SearchResult;
  cat: CategoryKey;
  onPick: (q: string) => void;
  onAll: () => void;
  onCategoryAll: () => void;
  onTear: () => void;
}) {
  const total = CATALOGUE.length;
  let tag = '', before = '', after = '', sub = '', label = '';
  let options: { word: string; go: () => void }[] = [];
  if (r.empty === 'none') {
    tag = `0 of ${total} services`;
    before = 'No results for ';
    sub = 'It may still be something we do. Add it to your enquiry and we’ll scope it with you.';
    label = r.suggestions.length ? 'Did you mean' : 'Popular';
    options = (r.suggestions.length ? r.suggestions : ['website', 'seo', 'video']).map(word => ({ word, go: () => onPick(word) }));
  } else if (r.empty === 'cat') {
    const c = categoryLabel(cat);
    tag = `0 in ${c}`;
    before = 'No ';
    after = ` in ${c}`;
    sub = `${r.matches.length} ${r.matches.length === 1 ? 'service matches' : 'services match'} in other categories.`;
    label = 'Try';
    options = [{ word: 'All categories', go: onCategoryAll }];
  } else {
    tag = 'Nothing to search';
    after = ' has no letters';
    sub = 'Try a service, a platform, or the problem you need solved.';
    label = 'Try';
    options = ['shopify', 'ads', 'dashboard'].map(word => ({ word, go: () => onPick(word) }));
  }

  return (
    <div data-screen-label="No results" className="sv-empty" style={{ maxWidth: "1440px", margin: "14px auto 0", borderRadius: "10px", border: "1px solid rgba(10,12,36,.12)", background: "#fff" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: "0" }}>
        <p style={{ ...mono, fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#55566a" }}>{tag}</p>
        <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "clamp(38px,4vw,64px)", lineHeight: ".92", textTransform: "uppercase", overflowWrap: "anywhere" }}>{before}<span style={{ color: "#3a5bff" }}>“{r.short}”</span>{after}</h3>
        <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#55566a", maxWidth: "480px" }}>{sub}</p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 18px", paddingTop: "6px", borderTop: "1px solid rgba(10,12,36,.1)" }}>
          <span style={{ ...mono, fontSize: "12px", color: "#55566a", paddingTop: "12px" }}>{label}</span>
          {options.map(o => (
            <button key={o.word} type="button" className="sv-link" onClick={o.go} style={{ marginTop: "12px", padding: "0 0 2px", border: "0", borderBottom: "1px solid currentColor", background: "none", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>{o.word}</button>
          ))}
          <button type="button" className="sv-link sv-link--quiet" onClick={onAll} style={{ marginTop: "12px", padding: "0 0 2px", border: "0", background: "none", fontSize: "15px", cursor: "pointer" }}>Show all services</button>
        </div>
      </div>
      {r.empty === 'none' && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", minWidth: "0" }}>
          <div style={{ width: "100%", maxWidth: "420px" }}>
            {/* Keyed by query so a new search gets a fresh, untorn ticket. */}
            <TearTicket
              key={r.short}
              width={420}
              height={200}
              stubSize={96}
              radius={10}
              holes={11}
              background="#080b38"
              stubBackground="#3a5bff"
              color="#ffffff"
              border={false}
              rotate={0}
              tiltMax={5}
              ariaLabel={`Add ${r.short} to your enquiry`}
              onTear={onTear}
              stub={
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", ...mono, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase" }}>Add to enquiry</span>
                </div>
              }
            >
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "22px 24px" }}>
                <span style={{ ...mono, fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>Custom request · {requestNumber(r.short)}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "36px", lineHeight: "1.05", paddingBottom: "2px", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.short}</span>
                <span style={{ fontSize: "13px", lineHeight: "1.45", maxWidth: "250px", color: "rgba(255,255,255,.75)" }}>Not a listed service. Tear the stub and we’ll scope it with you.</span>
              </div>
            </TearTicket>
          </div>
          <p style={{ ...mono, fontSize: "12px", color: "#55566a" }}>Drag the stub to add this to your enquiry</p>
        </div>
      )}
    </div>
  );
}

/** Search + filter bar, masonry service grid, and the enquiry form custom requests are added to. */
export default function Catalogue() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CategoryKey>('all');
  const [hint, setHint] = useState(0);
  const [note, setNote] = useState('');
  const r = useMemo(() => searchCatalogue(q, cat), [q, cat]);
  const shownIds = useMemo(() => new Set(r.shown.map(s => s.id)), [r]);

  const barRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reset = useCallback((focus: boolean) => {
    setQ('');
    setCat('all');
    if (focus) inputRef.current?.focus({ preventScroll: true });
  }, []);
  const pick = (word: string) => {
    setQ(word);
    setCat('all');
  };

  // Sticky bar sits under the fixed header (its height changes with the breakpoint) and gets a rule once it sticks.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const bar = barRef.current;
      if (!bar) return;
      const hh = headerHeight();
      bar.style.top = hh + 'px';
      bar.style.borderBottomColor = bar.getBoundingClientRect().top <= hh + 1 && scrollY > 200 ? 'rgba(10,12,36,.1)' : 'transparent';
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, []);

  // When the filter chips overflow (phones), mark which edge still has chips behind it; CSS fades that edge.
  useEffect(() => {
    const row = chipsRef.current;
    if (!row) return;
    const update = () => {
      const more = row.scrollWidth - row.clientWidth;
      const left = row.scrollLeft > 2;
      const right = more > 2 && row.scrollLeft < more - 2;
      row.dataset.fade = left && right ? 'both' : left ? 'left' : right ? 'right' : '';
    };
    const ro = new ResizeObserver(update);
    ro.observe(row);
    row.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      ro.disconnect();
      row.removeEventListener('scroll', update);
    };
  }, []);

  // "/" jumps to the search box from anywhere on the page, unless the visitor is typing somewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      focusCatalogueSearch();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  // Rotate example searches in the placeholder while the box is idle.
  useEffect(() => {
    const id = setInterval(() => {
      const input = inputRef.current;
      if (input && !input.value && document.activeElement !== input) setHint(h => (h + 1) % SEARCH_HINTS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Masonry: measure each visible card and span that many 4px rows. Until this runs (or without JS) the grid is a
  // plain row grid, so cards never overlap.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let raf = 0;
    const layout = () => {
      raf = 0;
      const cards = [...grid.querySelectorAll<HTMLElement>('[data-card]')];
      const heights = cards.map(c => (c.style.display === 'none' ? 0 : c.offsetHeight));
      cards.forEach((c, i) => {
        if (!heights[i]) return;
        const span = 'span ' + Math.ceil((heights[i] + GUTTER) / ROW);
        if (c.style.gridRowEnd !== span) c.style.gridRowEnd = span;
      });
      grid.classList.add('is-masonry');
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(layout);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(grid);
    grid.querySelectorAll('[data-card]').forEach(c => ro.observe(c));
    document.fonts?.ready.then(schedule);
    layout();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Cards that remain after a new search or filter fade up in sequence.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const grid = gridRef.current;
    if (!grid || reducedMotion() || typeof Element.prototype.animate !== 'function') return;
    const raf = requestAnimationFrame(() => {
      [...grid.querySelectorAll<HTMLElement>('[data-card]')]
        .filter(el => el.style.display !== 'none')
        .forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: i * 30, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }));
    });
    return () => cancelAnimationFrame(raf);
  }, [q, cat]);

  // Deep links (/services#seo, from the footer and the home page) land on that card below the header and sticky bar
  // once the masonry has settled, then flash it so it's easy to spot.
  useEffect(() => {
    const land = () => {
      const s = CATALOGUE.find(c => c.slug === decodeURIComponent(location.hash.slice(1)));
      if (!s) return;
      reset(false);
      const go = () => {
        const card = gridRef.current?.querySelector<HTMLElement>(`[data-card="${s.id}"]`);
        const bar = barRef.current;
        if (!card) return;
        scrollBelowHeader(card, (bar && getComputedStyle(bar).position === 'sticky' ? bar.offsetHeight : 0) + 16);
        if (!reducedMotion() && typeof card.animate === 'function') {
          card.animate([{ boxShadow: '0 0 0 3px #3a5bff' }, { boxShadow: '0 0 0 3px #3a5bff', offset: 0.6 }, { boxShadow: '0 0 0 3px rgba(58,91,255,0)' }], { duration: 1800, delay: 350, easing: 'ease-out' });
        }
      };
      (document.fonts?.ready ?? Promise.resolve()).then(() => timers.current.push(setTimeout(go, 120)));
    };
    land();
    addEventListener('hashchange', land);
    return () => removeEventListener('hashchange', land);
  }, [reset]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Escape' && (q || cat !== 'all')) {
      e.preventDefault();
      reset(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Close the on-screen keyboard on phones so the results are visible.
      if (matchMedia('(pointer: coarse)').matches) e.currentTarget.blur();
      scrollBelowHeader(gridRef.current, (barRef.current?.offsetHeight ?? 0) + 12);
    }
  };

  // Tearing the ticket (or picking a service without its own page) adds it to the enquiry's "Services interested in"
  // field, then moves to the form.
  const addToEnquiry = (text: string) => {
    const form = document.querySelector<HTMLFormElement>('#contact form');
    const field = form?.elements.namedItem('services');
    if (field instanceof HTMLInputElement) {
      const current = field.value.trim();
      if (!current.toLowerCase().includes(text.toLowerCase())) field.value = current ? `${current}, ${text}` : text;
    }
    setNote(`Added “${text.length > 24 ? text.slice(0, 23) + '…' : text}”`);
    timers.current.push(
      setTimeout(() => {
        scrollBelowHeader(form ?? null, 24);
        const message = form?.elements.namedItem('message');
        timers.current.push(setTimeout(() => message instanceof HTMLTextAreaElement && message.focus({ preventScroll: true }), 700));
      }, 600)
    );
  };

  return (
    <>
      <section id="services" data-screen-label="Service index" className="sv-section" style={{ padding: "0 clamp(20px,4vw,56px) clamp(72px,9vw,130px)", background: "#f6f6f8", borderTop: "1px solid rgba(10,12,36,.1)" }}>
        <div ref={barRef} className="sv-bar" style={{ position: "sticky", top: "80px", zIndex: "40", background: "rgba(246,246,248,.94)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", margin: "0 calc(clamp(20px,4vw,56px) * -1)", padding: "12px clamp(20px,4vw,56px)", borderBottom: "1px solid transparent", transition: "border-color .3s" }}>
          <div className="sv-bar__inner" style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 20px" }}>
            <label className="sv-search" style={{ flex: "1 1 260px", maxWidth: "560px", display: "flex", alignItems: "center", gap: "12px", height: "48px", padding: "0 8px 0 16px", borderRadius: "8px", background: "#fff", border: "1px solid rgba(10,12,36,.14)", minWidth: "0", cursor: "text" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#55566a" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="#55566a" strokeWidth="2" strokeLinecap="round" /></svg>
              <input
                ref={inputRef}
                id={SEARCH_ID}
                type="search"
                value={q}
                onChange={e => setQ(e.target.value.slice(0, MAX_QUERY))}
                onKeyDown={onKeyDown}
                maxLength={MAX_QUERY}
                aria-label="Search services"
                aria-controls="service-grid"
                placeholder={SEARCH_HINTS[hint]}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                style={{ flex: "1", minWidth: "0", height: "100%", border: "0", outline: "none", background: "transparent", fontSize: "16px", color: "#0a0c24" }}
              />
              {q ? (
                <button type="button" className="sv-clear" onClick={() => reset(true)} aria-label="Clear search" style={{ flex: "none", height: "32px", padding: "0 10px", border: "0", borderRadius: "5px", background: "transparent", fontSize: "13px", cursor: "pointer" }}>Clear</button>
              ) : (
                <span aria-hidden="true" className="sv-kbd" style={{ flex: "none", placeItems: "center", width: "26px", height: "26px", borderRadius: "5px", border: "1px solid rgba(10,12,36,.18)", ...mono, fontSize: "12px", color: "#55566a" }}>/</span>
              )}
            </label>
            <div ref={chipsRef} role="group" aria-label="Filter by category" className="sv-chips" style={{ display: "flex", flexWrap: "nowrap", gap: "2px", flex: "0 1 auto", minWidth: "0" }}>
              {CATEGORIES.map(([k, label]) => {
                const count = categoryCount(r, k);
                const on = cat === k;
                return (
                  <button key={k} type="button" className="sv-chip" aria-pressed={on} onClick={() => setCat(k)} style={{ flex: "none", display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 14px", border: "0", borderRadius: "6px", opacity: count || on ? 1 : 0.4, fontWeight: "500", fontSize: "14px", cursor: "pointer", transition: "background .2s,color .2s" }}>
                    {label}
                    <span style={{ ...mono, fontSize: "11px", opacity: ".6" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p aria-live="polite" style={{ maxWidth: "1440px", margin: "18px auto 0", ...mono, fontSize: "12px", letterSpacing: ".04em", color: "#55566a" }}>{statusLine(r, cat)}</p>

        {r.empty && <EmptyState r={r} cat={cat} onPick={pick} onAll={() => reset(true)} onCategoryAll={() => setCat('all')} onTear={() => addToEnquiry(r.raw)} />}

        <div ref={gridRef} id="service-grid" className="sv-grid" style={{ maxWidth: "1440px", margin: "14px auto 0" }}>
          {CATALOGUE.map(s => {
            const Art = ILLUSTRATIONS[s.id];
            const hit = r.hits[s.id];
            const own = hasOwnPage(s);
            return (
              <NavAnchor
                key={s.id}
                id={s.slug}
                data-card={s.id}
                data-r="up"
                href={own ? s.href : '#contact'}
                onClick={own ? undefined : e => {
                  e.preventDefault();
                  addToEnquiry(s.name);
                }}
                className="sv-card" style={{ display: shownIds.has(s.id) ? 'flex' : 'none', flexDirection: "column", borderRadius: "10px", border: "1px solid rgba(10,12,36,.14)", background: s.tint, color: "#0a0c24", overflow: "hidden", boxShadow: "0 1px 0 rgba(10,12,36,.04)" }}>
                <div aria-hidden="true" className="sv-card__art" style={{ position: "relative", height: `${s.art}px`, ['--art' as string]: `${s.art}px`, borderBottom: "1px solid rgba(10,12,36,.1)" }}>
                  <Art />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 22px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", ...mono, fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase", color: "#8a8ba0" }}>
                    <span>{cardTag(s)}</span>
                    {hit && <span style={{ color: "#3a5bff", textAlign: "right" }}>Matches “{hit}”</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "30px", lineHeight: ".95", textTransform: "uppercase" }}>{s.name}</h3>
                  <p style={{ fontSize: "15px", lineHeight: "1.55", color: "#55566a" }}>{s.blurb}</p>
                  <span style={{ marginTop: "6px", paddingTop: "14px", borderTop: "1px solid rgba(10,12,36,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>{own ? 'Explore Service' : 'Enquire about this'} <span aria-hidden="true">→</span></span>
                </div>
              </NavAnchor>
            );
          })}
        </div>
      </section>
      <ContactSection
        heading={['Get in', 'touch.']}
        intro="Tell us which services you need, or the problem you want solved. We’ll come back with the right team and next steps."
        services={{ placeholder: 'Website, SEO, app, content, or campaign support' }}
        messagePlaceholder="Tell us about your goals, timelines, deliverables, or what needs fixing."
        note={note}
      />
    </>
  );
}
