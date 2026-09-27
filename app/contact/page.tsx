import type { Metadata } from 'next';
import MotionRoot from '@/components/site/MotionRoot';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ContactSection from '@/components/site/ContactSection';
import Hero from '@/components/contact/Hero';
import Headquarters from '@/components/contact/Headquarters';
import GlobalOffices from '@/components/contact/GlobalOffices';
import { CONTACT, HOME, WEBSITE_DEVELOPMENT, type NavLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact PluzBuzz | Digital Agency London | PluzBuzz',
  description:
    'Contact PluzBuzz in London to discuss SEO, web development, app development, SaaS, digital marketing, and creative production projects.',
  alternates: { canonical: 'https://pluzbuzz.com' + CONTACT }
};

const NAV: NavLink[] = [
  { href: HOME, label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { href: '/#journal', label: 'Blogs' }
];
const DISCOVER: NavLink[] = [
  { href: '/#work', label: 'Our Work', hideOnMobile: true },
  { href: '/#journal', label: 'Insights' },
  { href: '#global', label: 'Global Presence' },
  { href: '#contact', label: 'Contact', current: true }
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

const contactPage = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact PluzBuzz',
  url: 'https://pluzbuzz.com' + CONTACT,
  mainEntity: {
    '@type': 'LocalBusiness',
    name: 'PluzBuzz',
    url: 'https://pluzbuzz.com/',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Old Street, Shoreditch',
      addressLocality: 'London',
      addressRegion: 'Greater London',
      addressCountry: 'GB'
    },
    geo: { '@type': 'GeoCoordinates', latitude: 51.5262, longitude: -0.087 },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00'
    },
    areaServed: ['GB', 'IN', 'AE', 'US', 'KE', 'UG', 'PL']
  }
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPage).replace(/</g, '\\u003c') }} />
      <MotionRoot intro={false}>
        <SiteHeader links={NAV} homeHref={HOME} ctaHref="#contact" />
        <main>
          <Hero />
          <ContactSection
            heading={['Get in', 'touch.']}
            intro="Tell us about your goals, timelines, deliverables, or what needs fixing. We’ll come back with the right team and next steps."
            services={{ placeholder: 'Website, SEO, app, content, or campaign support' }}
            messagePlaceholder="Tell us about your goals, timelines, deliverables, or what needs fixing."
          />
          <Headquarters />
          <GlobalOffices />
        </main>
        <SiteFooter discover={DISCOVER} services={SERVICE_LINKS} legalHref="#top" />
      </MotionRoot>
    </>
  );
}
