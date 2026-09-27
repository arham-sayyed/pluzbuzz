import type { Metadata } from 'next';
import NotFound from '@/components/not-found/NotFound';

// Replaces the layout's `index, follow`, which would otherwise sit beside the `noindex` Next adds to 404s.
export const metadata: Metadata = {
  title: 'Page Not Found | PluzBuzz',
  robots: { index: false, follow: true }
};

export default function NotFoundPage() {
  return <NotFound />;
}
