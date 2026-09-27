import type { Metadata } from 'next';
import MotionRoot from '@/components/site/MotionRoot';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ContactSection from '@/components/site/ContactSection';
import Hero from '@/components/services/website-development/Hero';
import Included from '@/components/services/website-development/Included';
import Process from '@/components/services/website-development/Process';
import LiveBuilds from '@/components/services/website-development/LiveBuilds';
import Cases from '@/components/services/website-development/Cases';
import Planner from '@/components/services/website-development/Planner';
import Packages from '@/components/services/website-development/Packages';
import Reviews from '@/components/services/website-development/Reviews';
import Faq from '@/components/services/website-development/Faq';
import Related from '@/components/services/website-development/Related';
import { FAQS } from '@/components/services/website-development/data';
import { CONTACT, HOME, SERVICES_INDEX, WEBSITE_DEVELOPMENT, type NavLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Website Development Services London | Web Design Agency UK | PluzBuzz',
  description:
    'PluzBuzz is a website development agency in London, UK, building conversion-focused websites, landing pages, and SEO-ready digital experiences for ambitious brands and global growth teams.',
  alternates: { canonical: 'https://pluzbuzz.com' + WEBSITE_DEVELOPMENT }
};

const NAV: NavLink[] = [
  { href: SERVICES_INDEX, label: 'Services', current: true },
  { href: '#live', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/#journal', label: 'Journal' }
];
const DISCOVER: NavLink[] = [
  { href: '/#work', label: 'Our Work', hideOnMobile: true },
  { href: '/#journal', label: 'Insights' },
  { href: '/#global', label: 'Global Presence' },
  { href: CONTACT, label: 'Contact' }
];
const SERVICE_LINKS: NavLink[] = [
  { href: '#top', label: 'Web Development', current: true },
  { href: '/#svc-2', label: 'SEO Services' },
  { href: '/#svc-3', label: 'Digital Marketing' },
  { href: '/#svc-4', label: 'App & SaaS' },
  { href: '/#svc-5', label: 'AI Marketing' },
  { href: '/#svc-6', label: 'Photography' },
  { href: '/#svc-6', label: 'Video Production' }
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Website Development',
  provider: {
    '@type': 'LocalBusiness',
    name: 'PluzBuzz',
    url: 'https://pluzbuzz.com/',
    address: { '@type': 'PostalAddress', streetAddress: 'Old Street, Shoreditch', addressLocality: 'London', addressCountry: 'GB' }
  },
  areaServed: 'GB'
};

// The FAQ copy is on the page, so it can also be exposed as FAQPage structured data.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.join(' ') } }))
};

const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />
      <MotionRoot intro={false}>
        <SiteHeader links={NAV} homeHref={HOME} />
        <main>
          <Hero />
          <Included />
          <Process />
          <LiveBuilds />
          <Cases />
          <Planner />
          <Packages />
          <Reviews />
          <Faq />
          <Related />
          <ContactSection
            heading={['Get in', 'touch.']}
            intro="Tell us what the website needs to do. We’ll come back with scope, timeline and the right build."
            services={{ defaultValue: 'Website' }}
            messagePlaceholder="Pages, platform, integrations, launch date, or what needs fixing on the current site."
            flames
          />
        </main>
        <SiteFooter discover={DISCOVER} services={SERVICE_LINKS} legalHref="#top" />
      </MotionRoot>
    </>
  );
}
