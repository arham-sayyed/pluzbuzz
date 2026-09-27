import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

/** Client-side navigation for internal routes ("/…"); a plain anchor for in-page hashes and external URLs. */
export default function NavAnchor({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return href.startsWith('/') ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;
}
