import type { Metadata } from 'next';
import './globals.css';

// Site-wide defaults; each page sets its own title, description and canonical URL.
export const metadata: Metadata = {
  metadataBase: new URL('https://pluzbuzz.com'),
  robots: { index: true, follow: true },
  openGraph: { locale: 'en_GB', siteName: 'PluzBuzz' }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* The canvas-drawn artwork references these families by name, so load them under their real names. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Schibsted+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/assets/logo-intro.gif" />
        {/* Without JS the intro can't play or dismiss itself; skip it entirely. */}
        <noscript>
          <style>{'.pb-intro{display:none}'}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
