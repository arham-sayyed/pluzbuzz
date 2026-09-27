import { WEBSITE_DEVELOPMENT } from '@/lib/site';

export type CategoryKey = 'all' | 'build' | 'grow' | 'create' | 'ai';

export const CATEGORIES: [CategoryKey, string][] = [
  ['all', 'All'],
  ['build', 'Build'],
  ['grow', 'Grow'],
  ['create', 'Create'],
  ['ai', 'AI']
];

export type ServiceId = 'web' | 'photo' | 'seo' | 'aiEn' | 'aiPh' | 'video' | 'app' | 'social' | 'marketing' | 'ads';

export interface CatalogueService {
  id: ServiceId;
  name: string;
  blurb: string;
  cats: Exclude<CategoryKey, 'all'>[];
  /** Search terms beyond the name and blurb: platforms, synonyms and the problems people type in. */
  keywords: string[];
  href: string;
  /** Card tint behind the illustration. */
  tint: string;
  /** Illustration height on desktop, in px; phones scale it down. */
  art: number;
}

/** In catalogue order; the number on each card is its position here. */
export const CATALOGUE: CatalogueService[] = [
  { id: 'web', name: 'Website Development', blurb: 'Custom UX/UI website design. WordPress, Shopify and CMS builds.', cats: ['build'], keywords: ['website', 'web', 'wordpress', 'shopify', 'cms', 'ux', 'ui', 'design', 'landing page', 'ecommerce', 'store', 'webflow', 'redesign', 'site'], href: WEBSITE_DEVELOPMENT, tint: '#dfe5f3', art: 340 },
  { id: 'photo', name: 'Professional Photo Shoot', blurb: 'Creative direction and shot planning. Product, editorial and campaign shoots.', cats: ['create'], keywords: ['photo', 'photography', 'photographer', 'shoot', 'product', 'editorial', 'camera', 'images', 'headshots', 'lookbook'], href: '/#svc-6', tint: '#eee4d8', art: 200 },
  { id: 'seo', name: 'Search Engine Optimization', blurb: 'Technical SEO and content structure. Keyword-led page optimisation.', cats: ['grow'], keywords: ['seo', 'search', 'google', 'ranking', 'keywords', 'technical', 'organic', 'traffic', 'local seo', 'backlinks', 'audit'], href: '/#svc-2', tint: '#dcebe2', art: 270 },
  { id: 'aiEn', name: 'AI Enabled Marketing', blurb: 'Workflow automation and content acceleration. Campaign support with smarter operations.', cats: ['ai'], keywords: ['ai', 'automation', 'workflow', 'crm', 'chatgpt', 'chatbot', 'operations', 'llm', 'agents', 'zapier'], href: '/#svc-5', tint: '#e6e0f2', art: 190 },
  { id: 'aiPh', name: 'AI Generated Photos & Videos', blurb: 'Concept-led AI image generation. Campaign visuals and rapid creative variants.', cats: ['create', 'ai'], keywords: ['ai', 'generated', 'generative', 'image', 'visuals', 'variants', 'midjourney', 'renders', 'cgi'], href: '/#svc-5', tint: '#f1e6d6', art: 320 },
  { id: 'video', name: 'Video Shoot', blurb: 'Concept development and shot planning. Brand, campaign and product video capture.', cats: ['create'], keywords: ['video', 'film', 'filming', 'production', 'brand film', 'reels', 'commercial', 'motion', 'youtube'], href: '/#svc-6', tint: '#dde6ee', art: 250 },
  { id: 'app', name: 'App & SaaS Development', blurb: 'Product UX and workflow design. Dashboards, APIs and auth systems.', cats: ['build'], keywords: ['app', 'saas', 'mobile', 'dashboard', 'api', 'auth', 'software', 'platform', 'ios', 'android', 'mvp', 'portal'], href: '/#svc-4', tint: '#d9ebeb', art: 210 },
  { id: 'social', name: 'Social Media Management', blurb: 'Content planning and platform posting. Campaign support and visual direction.', cats: ['grow'], keywords: ['social', 'instagram', 'tiktok', 'facebook', 'linkedin', 'posting', 'community', 'influencer', 'content calendar'], href: '/#svc-3', tint: '#f1dfe3', art: 330 },
  { id: 'marketing', name: 'Digital Marketing', blurb: 'Campaign planning and channel strategy. Performance-led execution systems.', cats: ['grow'], keywords: ['marketing', 'digital', 'strategy', 'channel', 'performance', 'growth', 'funnel', 'email', 'leads'], href: '/#svc-3', tint: '#e8e7d3', art: 180 },
  { id: 'ads', name: 'Advertising Campaigns', blurb: 'Paid campaign setup and optimisation. Creative aligned to conversion goals.', cats: ['grow'], keywords: ['advertising', 'ads', 'ppc', 'paid', 'google ads', 'meta ads', 'tiktok ads', 'conversion', 'cpc', 'retargeting'], href: '/#svc-3', tint: '#dfe8d9', art: 280 }
];

export const categoryLabel = (k: CategoryKey) => CATEGORIES.find(c => c[0] === k)?.[1] ?? '';

/** "01 · Build", "05 · Create · AI" */
export const cardTag = (s: CatalogueService) =>
  [String(CATALOGUE.indexOf(s) + 1).padStart(2, '0'), ...s.cats.map(categoryLabel)].join(' · ');

/** The search box cycles through these while it is empty and unfocused. */
export const SEARCH_HINTS = ['Search services', 'Try “Shopify”', 'Try “TikTok ads”', 'Try “dashboard”', 'Try “local SEO”', 'Try “automation”'];

export const MAX_QUERY = 80;
