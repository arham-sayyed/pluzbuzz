/* Content for the Website Development service page. */

/** What's in the build: [file, colour, title, description, minus, plus] */
export const INCLUDED: [string, string, string, string, string[], string[]][] = [
  ['custom-design.fig', '#E453EE', 'Custom Website Design', 'Our custom website design services create modern, brand-focused websites with strategic UX/UI design, wireframing, conversion-focused layouts, and user journey optimisation designed to engage UK audiences and increase enquiries.', [], ['strategic UX/UI design', 'wireframing', 'conversion-focused layouts', 'user journey optimisation']],
  ['build.php', '#555AFE', 'Website Development', 'Our website development services build secure, scalable websites with advanced functionality using platforms like WordPress, WooCommerce, and Shopify with API integrations, payment gateways, CRM connections, and custom CMS solutions.', [], ['WordPress, WooCommerce, Shopify', 'API integrations', 'payment gateways', 'CRM connections', 'custom CMS solutions']],
  ['store.liquid', '#F2D458', 'E-Commerce Website Development UK', 'Our e-commerce website development services create high-converting online stores with custom product pages, category architecture, secure checkout optimisation, conversion rate optimisation, and product schema integration designed to increase online sales and customer trust.', [], ['custom product pages', 'category architecture', 'secure checkout optimisation', 'conversion rate optimisation', 'product schema integration']],
  ['seo-architecture.json', '#3a5bff', 'SEO-Ready Website Architecture', 'Our SEO-ready website development approach ensures websites are built with clean URL structures, fast page speed, Core Web Vitals optimisation, structured data implementation, schema markup, and mobile-first indexing readiness to improve Google rankings.', [], ['clean URL structures', 'fast page speed', 'Core Web Vitals optimisation', 'structured data + schema markup', 'mobile-first indexing readiness']],
  ['redesign.diff', '#e5484d', 'Website Redesign Services', 'Our website redesign services transform outdated websites into high-performance digital platforms through UX improvements, speed optimisation, modern design updates, conversion optimisation, and SEO restructuring.', ['outdated website'], ['UX improvements', 'speed optimisation', 'modern design updates', 'conversion optimisation', 'SEO restructuring']]
];

/** Process stages: [tag, title, description, preview url] */
export const STAGES: [string, string, string, string][] = [
  ['Discover', 'Research & competitor analysis', 'We map your business, your audience and the competitors ranking where you want to be.', 'localhost:3000/sitemap'],
  ['Plan', 'UX strategy', 'Sitemaps, user journeys and wireframes that decide what every page has to do.', 'localhost:3000/wireframe'],
  ['Design', 'Design prototyping', 'Brand-led layouts and clickable prototypes you review before anything gets built.', 'localhost:3000/prototype'],
  ['Build', 'Development & testing', 'Clean, secure builds tested across desktop, tablet and mobile.', 'staging.your-brand.dev'],
  ['Rank', 'SEO optimisation', 'Clean URLs, schema markup, metadata and Core Web Vitals handled before launch.', 'staging.your-brand.dev'],
  ['Grow', 'Launch & ongoing improvement', 'We go live, monitor performance and keep improving what converts.', 'your-brand.co.uk']
];

/** Live sites embedded in the preview: [name, url, kind] */
export const SITES: [string, string, string][] = [
  ['Bhagirath Print', 'https://bhagirathprint.com/', 'Website build'],
  ['TeamBounters · The Perimeter', 'https://teambounters.buildincredibles.com/3D/TeamBounters%20-%20The%20Perimeter%20v5.dc.html', '3D experience'],
  ['TeamBounters · Home', 'https://teambounters.buildincredibles.com/parallax/TeamBounters%20Home%20v3.dc.html', 'Parallax site']
];

export const DEVICES: [string, number][] = [['Desktop', 1440], ['Tablet', 820], ['Phone', 390]];

export interface CarouselItem {
  title: string;
  subtitle: string;
  /** Index into SITES when the project has a live preview. */
  site?: number;
  bg: string;
  fg: string;
  ac: string;
}

// Opens on TeamBounters · Home, the default live preview.
export const CAROUSEL: CarouselItem[] = [
  { title: 'TeamBounters — Home', subtitle: 'Live · parallax site', site: 2, bg: '#f4f4f7', fg: '#0a0c24', ac: '#3a5bff' },
  { title: 'Bhagirath Print', subtitle: 'Live · open preview', site: 0, bg: '#080b38', fg: '#ffffff', ac: '#ffc83d' },
  { title: 'TeamBounters — The Perimeter', subtitle: 'Live · 3D experience', site: 1, bg: '#0a0c24', fg: '#ffffff', ac: '#8f9bff' },
  { title: 'Fixomech', subtitle: 'Website Dev', bg: '#ffffff', fg: '#0a0c24', ac: '#3a5bff' },
  { title: 'Medi-Ex', subtitle: 'Website Revamp', bg: '#1a1f5c', fg: '#ffffff', ac: '#ffc83d' },
  { title: 'Cargoking', subtitle: 'Web Development', bg: '#e9eaf1', fg: '#0a0c24', ac: '#080b38' },
  { title: 'Viviana London', subtitle: 'Rebrand + digital refresh', bg: '#080b38', fg: '#ffffff', ac: '#8f9bff' }
];

/** Case cards: [carousel index, tag, description] */
export const CASES: [number, string, string][] = [
  [3, 'Website Dev', 'A B2B-focused website overhaul for an industrial engineering brand, built to clarify product capability, improve trust, and capture more qualified enquiries.'],
  [4, 'Website Revamp', 'A healthcare infrastructure platform shaped to communicate specialist expertise, build confidence with enterprise buyers, and support higher-intent contact requests.'],
  [5, 'Web Development', 'Highlighting the web development projects delivered for the Cargoking brand.']
];

export const FAQS: [string, string[]][] = [
  ['How long does a website development project usually take?', ['Most website projects take between 4 to 10 weeks depending on the number of pages, custom functionality, revision cycles, and content readiness.', 'Larger e-commerce or custom platform builds may require a longer delivery timeline because of integrations, QA, and staging requirements.']],
  ['What is included in your website development service?', ['Our website development service includes business research, UX/UI planning, responsive design, front-end and back-end development, SEO-ready structure, speed optimisation, testing, and launch support.', 'Where needed, we also support CMS setup, e-commerce features, API integrations, payment gateways, and post-launch performance improvements.']],
  ['Do you build SEO-ready websites from the start?', ['Yes. We structure websites with clean URLs, mobile-first layouts, fast-loading pages, schema opportunities, and search-friendly architecture from the beginning.']],
  ['Can you redesign an existing business website?', ['Yes. We redesign outdated websites to improve performance, user experience, messaging clarity, conversion flow, and overall visual quality without losing business continuity.']],
  ['Do you develop e-commerce websites as well?', ['Yes. We create e-commerce stores with custom product pages, category structures, secure checkout flows, payment integrations, and conversion-focused shopping experiences.']],
  ['Will my website work properly on mobile devices?', ['Yes. Every website we build is responsive and tested across common screen sizes so the experience remains consistent on desktop, tablet, and mobile.']],
  ['Do you provide support after launch?', ['Yes. We can support you with maintenance, fixes, iterative improvements, performance monitoring, and future enhancements after the initial website goes live.']]
];

/** Planner: [name, sub, path, [min, max] weeks] */
export const PLAN_TYPES: [string, string, string, [number, number]][] = [
  ['Business website', 'Services, credibility, enquiries', '/', [4, 6]],
  ['E-commerce store', 'Products, checkout, payments', '/shop', [8, 10]],
  ['Landing page', 'One campaign, one goal', '/offer', [3, 4]],
  ['Website redesign', 'Refresh what you already have', '/', [6, 8]]
];
/** [name, extra weeks, nav items] */
export const PLAN_SIZES: [string, number, number][] = [['Up to 5 pages', 0, 3], ['6–15 pages', 1, 5], ['16+ pages', 2, 7]];
export const PLAN_PLATFORMS = ['Not sure yet', 'WordPress', 'Shopify', 'WooCommerce', 'Custom CMS'];
/** [name, badge, kind] */
export const PLAN_FEATURES: [string, string, string][] = [
  ['Enquiry forms + CRM', 'CRM · CONNECTED', 'Integration'],
  ['Payment gateway', 'CHECKOUT · SECURE', 'Commerce'],
  ['API integrations', 'API · SYNCED', 'Integration'],
  ['Blog & insights', 'BLOG · CMS', 'Content']
];

/** Poster-style cover art for a project, drawn to a PNG data URL. Needs the web fonts loaded. */
export function coverImage(it: CarouselItem) {
  const c = document.createElement('canvas');
  c.width = 1200;
  c.height = 780;
  const x = c.getContext('2d')!;
  x.fillStyle = it.bg;
  x.fillRect(0, 0, 1200, 780);
  x.strokeStyle = it.fg;
  x.globalAlpha = 0.07;
  x.lineWidth = 1;
  for (let gx = 0; gx <= 1200; gx += 60) {
    x.beginPath();
    x.moveTo(gx + 0.5, 0);
    x.lineTo(gx + 0.5, 780);
    x.stroke();
  }
  for (let gy = 0; gy <= 780; gy += 60) {
    x.beginPath();
    x.moveTo(0, gy + 0.5);
    x.lineTo(1200, gy + 0.5);
    x.stroke();
  }
  x.globalAlpha = 0.5;
  x.lineWidth = 2;
  x.strokeRect(780, 170, 350, 230);
  x.globalAlpha = 0.25;
  x.fillStyle = it.fg;
  x.fillRect(810, 200, 180, 12);
  x.fillRect(810, 226, 120, 12);
  x.fillRect(810, 330, 290, 44);
  x.globalAlpha = 1;
  x.fillStyle = it.ac;
  x.fillRect(72, 628, 90, 6);
  x.fillStyle = it.fg;
  x.globalAlpha = 0.9;
  x.font = "800 34px 'Barlow Condensed', sans-serif";
  x.fillText(it.title.split(' ')[0].toUpperCase(), 70, 92);
  x.globalAlpha = 0.35;
  [0, 1, 2].forEach(i => x.fillRect(640 + i * 110, 80, 80, 8));
  x.globalAlpha = 1;
  x.font = "800 128px 'Barlow Condensed', sans-serif";
  const words = it.title.toUpperCase().split(' ');
  let line = '';
  const out: string[] = [];
  words.forEach(w => {
    const t = line ? line + ' ' + w : w;
    if (x.measureText(t).width > 1000 && line) {
      out.push(line);
      line = w;
    } else line = t;
  });
  out.push(line);
  let y = 600 - (out.length - 1) * 118;
  out.forEach(l => {
    x.fillText(l, 70, y);
    y += 118;
  });
  x.globalAlpha = 0.7;
  x.font = "500 26px 'IBM Plex Mono', monospace";
  x.fillText(it.subtitle.toUpperCase(), 72, 700);
  x.globalAlpha = 1;
  if (it.site !== undefined) {
    x.strokeStyle = it.fg;
    x.lineWidth = 2;
    x.strokeRect(930, 660, 200, 56);
    x.fillStyle = it.fg;
    x.font = "500 24px 'IBM Plex Mono', monospace";
    x.fillText('LIVE ↗', 975, 697);
  }
  return c.toDataURL('image/png');
}

/** Resolves once the fonts the canvas art uses are ready (or failed). */
export function coverFontsReady() {
  if (!document.fonts) return Promise.resolve();
  return Promise.all([document.fonts.load("800 128px 'Barlow Condensed'"), document.fonts.load("500 26px 'IBM Plex Mono'")]).then(
    () => undefined,
    () => undefined
  );
}
