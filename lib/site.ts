/* Site-wide routes and link sets shared by the header, footer and service cards. */

/** `hideOnMobile`: the target section is desktop-only, so drop the link below the mobile breakpoint. */
export type NavLink = { href: string; label: string; current?: boolean; hideOnMobile?: boolean };

export const HOME = '/';
export const WEBSITE_DEVELOPMENT = '/services/website-development-services';

export const SOCIAL_LINKS: NavLink[] = [
  { href: 'https://www.instagram.com/pluzbuzz/', label: 'Instagram' },
  { href: 'https://x.com/PluzBuzz', label: 'X' },
  { href: 'https://www.facebook.com/people/PluzBuzz/61579035273110/', label: 'Facebook' },
  { href: 'https://in.linkedin.com/company/pluzbuzz', label: 'LinkedIn' }
];

/** Service identities: any page or card can look a service up by key and inherit its look. */
export type ServiceKey = 'web' | 'seo' | 'growth' | 'app' | 'ai' | 'media' | 'all';
export type ServiceMotif = 'browser' | 'search' | 'phone' | 'bars' | 'nodes' | 'viewfinder' | 'grid';
export interface ServiceStyle {
  name: string;
  blurb: string;
  href: string;
  bg: string;
  fg: string;
  sub: string;
  accent: string;
  border: string;
  motif: ServiceMotif;
}

export const SERVICES: Record<ServiceKey, ServiceStyle> = {
  web: { name: 'Website Development', blurb: 'Conversion-ready websites and landing systems.', href: WEBSITE_DEVELOPMENT, bg: '#080b38', fg: '#ffffff', sub: 'rgba(255,255,255,.72)', accent: '#ffc83d', border: '#080b38', motif: 'browser' },
  seo: { name: 'SEO Agency London', blurb: 'SEO strategy for websites built to rank', href: '/#svc-2', bg: '#ffffff', fg: '#0a0c24', sub: '#55566a', accent: '#2fbf71', border: '#0a0c24', motif: 'search' },
  growth: { name: 'Growth Marketing', blurb: 'Performance campaigns built to improve lead quality.', href: '/#svc-3', bg: '#ffc83d', fg: '#080b38', sub: 'rgba(8,11,56,.72)', accent: '#080b38', border: '#ffc83d', motif: 'bars' },
  app: { name: 'App & SaaS Development', blurb: 'Custom apps and scalable SaaS product systems for growing teams', href: '/#svc-4', bg: '#555AFE', fg: '#ffffff', sub: 'rgba(255,255,255,.8)', accent: '#F2D458', border: '#555AFE', motif: 'phone' },
  ai: { name: 'AI Enablement', blurb: 'Smarter workflows, creative systems, and automation support.', href: '/#svc-5', bg: '#0a0c24', fg: '#ffffff', sub: 'rgba(255,255,255,.7)', accent: '#E453EE', border: '#0a0c24', motif: 'nodes' },
  media: { name: 'Photo + Video Production', blurb: 'Directed visual assets for launches, campaigns, and content.', href: '/#svc-6', bg: '#141414', fg: '#ffffff', sub: 'rgba(255,255,255,.7)', accent: '#ff4d4d', border: '#141414', motif: 'viewfinder' },
  all: { name: 'All Services', blurb: 'See the complete PluzBuzz service catalogue', href: '/#services', bg: '#f4f4f7', fg: '#0a0c24', sub: '#55566a', accent: '#3a5bff', border: '#f4f4f7', motif: 'grid' }
};
