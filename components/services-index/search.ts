/* Catalogue search: pure functions, no DOM, so it behaves the same on the server, in the browser and in tests. */

import { CATALOGUE, MAX_QUERY, type CatalogueService, type CategoryKey, type ServiceId } from './data';

const STOP = new Set(['and', 'the', 'a', 'an', 'for', 'of', 'service', 'services', 'agency', 'my', 'i', 'need', 'we', 'want', 'to', 'with', 'in', 'on', 'some', 'help', 'our', 'me']);

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/** Lower-case, "&" to a space, anything else that isn't a letter, digit or space dropped, whitespace collapsed. */
export const normalise = (q: string) =>
  q.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Every word a service can be found by. */
const haystack = new Map<ServiceId, string[]>(
  CATALOGUE.map(s => [s.id, words([s.name, s.blurb, ...s.keywords, ...s.cats].join(' '))])
);

/** Distinct words (3+ letters) from names and keywords: the dictionary for "Did you mean". */
const vocabulary = [...new Set(CATALOGUE.flatMap(s => words([s.name, ...s.keywords].join(' '))).filter(w => w.length >= 3))];

/** A word prefix matches anywhere; 4+ letter fragments may also match inside a word ("shop" → "eshop"). */
const hasToken = (s: CatalogueService, t: string) => {
  const W = haystack.get(s.id)!;
  return W.some(w => w.startsWith(t)) || (t.length >= 4 && W.some(w => w.includes(t)));
};

/** Edit distance where swapping two neighbouring letters ("vidoe" → "video") counts as one edit, like a typo. */
function editDistance(a: string, b: string) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let before: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], before[j - 2] + 1);
    }
    before = prev;
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Up to three dictionary words within a typo's reach of any token, closest first. The allowance scales with the
 * shorter of the two words, so a long dictionary word can't absorb an unrelated token ("footage" ≠ "professional").
 */
function suggestions(tokens: string[]) {
  const found: [number, string][] = [];
  for (const t of tokens) {
    for (const w of vocabulary) {
      const d = Math.min(editDistance(t, w), editDistance(t, w.slice(0, t.length + 1)));
      if (d > 0 && d <= Math.max(1, Math.floor(Math.min(t.length, w.length) / 4))) found.push([d, w]);
    }
  }
  found.sort((a, b) => a[0] - b[0]);
  return [...new Set(found.map(f => f[1]))].slice(0, 3);
}

/** Why nothing is showing: no match at all, matches only in other categories, or a query with no letters or digits. */
export type EmptyKind = '' | 'none' | 'cat' | 'symbols';

export interface SearchResult {
  /** Trimmed query, capped at MAX_QUERY. */
  raw: string;
  /** Query shortened for headings and the ticket. */
  short: string;
  tokens: string[];
  /** Matches for the query, ignoring the category. */
  matches: CatalogueService[];
  /** Matches in the chosen category: what the grid shows. */
  shown: CatalogueService[];
  /** Keyword that made a card match, when the name alone doesn't explain it. */
  hits: Partial<Record<ServiceId, string>>;
  empty: EmptyKind;
  suggestions: string[];
  /** Searched for the agency itself. */
  easter: boolean;
  /** Anything narrowing the list (query or category). */
  filtered: boolean;
}

export function searchCatalogue(query: string, cat: CategoryKey): SearchResult {
  const raw = query.trim().slice(0, MAX_QUERY);
  const n = normalise(raw);
  const easter = n.replace(/ /g, '') === 'pluzbuzz';
  const symbols = !!raw && !n;
  // Stop words out; simple plurals folded ("dashboards" → "dashboard") but not "ss" words ("business").
  const tokens = easter
    ? []
    : n.split(' ').filter(t => t && !STOP.has(t)).map(t => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t));

  // Every word must match. Words no service knows at all ("business websites") are dropped rather than sinking the
  // whole query, as long as at least one word is left; pure gibberish still finds nothing.
  const known = tokens.filter(t => CATALOGUE.some(s => hasToken(s, t)));
  const required = known.length && known.length < tokens.length ? known : tokens;
  const matches = symbols ? [] : CATALOGUE.filter(s => required.every(t => hasToken(s, t)));
  const hits: SearchResult['hits'] = {};
  for (const s of matches) {
    const nameWords = words(s.name);
    for (const t of required) {
      if (nameWords.some(w => w.startsWith(t))) continue;
      const kw = s.keywords.find(k => words(k).some(w => w.startsWith(t)));
      if (kw) {
        hits[s.id] = kw;
        break;
      }
    }
  }
  const shown = matches.filter(s => cat === 'all' || s.cats.includes(cat));
  const empty: EmptyKind = shown.length ? '' : symbols ? 'symbols' : matches.length ? 'cat' : 'none';

  return {
    raw,
    short: raw.length > 26 ? raw.slice(0, 25) + '…' : raw,
    tokens,
    matches,
    shown,
    hits,
    empty,
    suggestions: empty === 'none' ? suggestions(tokens) : [],
    easter,
    filtered: tokens.length > 0 || cat !== 'all' || symbols
  };
}

/** Matches per category chip for the current query. */
export const categoryCount = (r: SearchResult, cat: CategoryKey) => r.matches.filter(s => cat === 'all' || s.cats.includes(cat)).length;

/** Stable 4-digit "request number" for a query, shown on the custom-request ticket. */
export const requestNumber = (q: string) => String([...q].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7)).padStart(4, '0');
