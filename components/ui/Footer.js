'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '../../translations';
import './Footer.css';

export default function Footer() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'de';
  const t = useTranslations(locale);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copyright">{t.footer.copyright}</p>
        <nav className="footer-nav">
          <Link href={`/${locale}/privacy`}>{t.footer.privacy}</Link>
          <Link href={`/${locale}/imprint`}>{t.footer.imprint}</Link>
          <Link href={`/${locale}/terms`}>{t.footer.terms}</Link>
        </nav>
      </div>
    </footer>
  );
}