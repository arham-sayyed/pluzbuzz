import type { Metadata } from 'next';
import MotionRoot from '@/components/site/MotionRoot';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ContactSection from '@/components/site/ContactSection';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import HowWeWork from '@/components/home/HowWeWork';
import WhoWeAre from '@/components/home/WhoWeAre';
import WhoReveal from '@/components/home/WhoReveal';
import WhyUs from '@/components/home/WhyUs';
import ClearPicture from '@/components/home/ClearPicture';
import SelectedWork from '@/components/home/SelectedWork';
import Rebrand from '@/components/home/Rebrand';
import GlobalPresence from '@/components/home/GlobalPresence';
import Journal from '@/components/home/Journal';
import StrategyTicket from '@/components/home/StrategyTicket';
import { CONTACT, WEBSITE_DEVELOPMENT, type NavLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Digital Agency London | SEO, Marketing & Web Development UK | PluzBuzz',
  description:
    'PluzBuzz is a London digital agency delivering SEO, web development, app development, AI marketing, creative production, and scalable digital growth services across the UK.',
  alternates: { canonical: 'https://pluzbuzz.com' }
};

const NAV: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work', hideOnMobile: true },
  { href: '#about', label: 'About' },
  { href: '#global', label: 'Global' },
  { href: '#journal', label: 'Journal' }
];
const DISCOVER: NavLink[] = [
  { href: '#work', label: 'Our Work', hideOnMobile: true },
  { href: '#journal', label: 'Insights' },
  { href: '#global', label: 'Global Presence' },
  { href: CONTACT, label: 'Contact' },
  { href: '#about', label: 'About' }
];
const SERVICE_LINKS: NavLink[] = [
  { href: WEBSITE_DEVELOPMENT, label: 'Web Development' },
  { href: '#svc-2', label: 'SEO Services' },
  { href: '#svc-3', label: 'Digital Marketing' },
  { href: '#svc-4', label: 'App & SaaS' },
  { href: '#svc-5', label: 'AI Marketing' },
  { href: '#svc-6', label: 'Photography' },
  { href: '#svc-6', label: 'Video Production' },
  { href: '#svc-3', label: 'Social Media' },
  { href: '#svc-3', label: 'Advertising' }
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'PluzBuzz',
  url: 'https://pluzbuzz.com/',
  slogan: 'We Create the Buzz, You Own the Spotlight',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Old Street, Shoreditch',
    addressLocality: 'London',
    addressRegion: 'Greater London',
    addressCountry: 'GB'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 51.5255, longitude: -0.0888 },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '19:00'
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }}
      />
      <MotionRoot>
        <SiteHeader links={NAV} />
        <main>
          <Hero />
          <Services />
          <HowWeWork />
          <WhoWeAre />
          <WhoReveal />
          <WhyUs />
          <ClearPicture />
          <SelectedWork />
          <Rebrand />
          <GlobalPresence />
          <Journal />
          <StrategyTicket />
          <ContactSection
            heading={["Let's build", 'the buzz.']}
            intro="From conversion-focused websites to AI-assisted campaign systems, PluzBuzz builds the digital foundations brands need to attract better traffic, improve lead quality, and move with more confidence online."
            services={{ placeholder: 'Website, SEO, app, content, or campaign support' }}
            messagePlaceholder="Tell us about your goals, timelines, deliverables, or what needs fixing."
            frosted
          />
        </main>
        <SiteFooter discover={DISCOVER} services={SERVICE_LINKS} />
      </MotionRoot>
    </>
  );
}
