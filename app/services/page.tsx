import type { Metadata } from 'next';
import MotionRoot from '@/components/site/MotionRoot';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import Hero from '@/components/services-index/Hero';
import Catalogue from '@/components/services-index/Catalogue';
import { CATALOGUE } from '@/components/services-index/data';
import { CONTACT, HOME, SERVICES_INDEX, WEBSITE_DEVELOPMENT, type NavLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Digital Agency Services | SEO, Web, Apps, AI Marketing | PluzBuzz',
  description:
    'Explore PluzBuzz services including SEO, website development, app and SaaS development, AI marketing, advertising, video production, and photography.',
  alternates: { canonical: 'https://pluzbuzz.com' + SERVICES_INDEX }
};

const NAV: NavLink[] = [
  { href: HOME, label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '#top', label: 'Services', current: true },
  { href: '/#journal', label: 'Blogs' }
];
const DISCOVER: NavLink[] = [
  { href: '/#work', label: 'Our Work', hideOnMobile: true },
  { href: '/#journal', label: 'Insights' },
  { href: CONTACT + '#global', label: 'Global Presence' },
  { href: CONTACT, label: 'Contact' }
];
const SERVICE_LINKS: NavLink[] = [
  { href: WEBSITE_DEVELOPMENT, label: 'Web Development' },
  { href: '/#svc-2', label: 'SEO Services' },
  { href: '/#svc-3', label: 'Digital Marketing' },
  { href: '/#svc-4', label: 'App & SaaS' },
  { href: '/#svc-5', label: 'AI Marketing' },
  { href: '/#svc-6', label: 'Photography' },
  { href: '/#svc-6', label: 'Video Production' },
  { href: '/#svc-3', label: 'Social Media' },
  { href: '/#svc-3', label: 'Advertising' }
];

const provider = { '@type': 'LocalBusiness', name: 'PluzBuzz', url: 'https://pluzbuzz.com/' };
const serviceList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PluzBuzz services',
  url: 'https://pluzbuzz.com' + SERVICES_INDEX,
  numberOfItems: CATALOGUE.length,
  itemListElement: CATALOGUE.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'Service', name: s.name, description: s.blurb, url: 'https://pluzbuzz.com' + s.href, provider, areaServed: 'GB' }
  }))
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceList).replace(/</g, '\\u003c') }} />
      <MotionRoot intro={false}>
        <SiteHeader links={NAV} homeHref={HOME} />
        <main>
          <Hero />
          <Catalogue />
        </main>
        <SiteFooter discover={DISCOVER} services={SERVICE_LINKS} legalHref="#top" />
      </MotionRoot>
    </>
  );
}
