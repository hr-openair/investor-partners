'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '../../translations';
import ThemeToggle from './ThemeToggle';
import DbStatus from './DbStatus';
import './Header.css';

export default function Header() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'de';
  const t = useTranslations(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/services`, label: 'Investment-Services' },
    { href: `/${locale}/real-estate`, label: 'Immobilien' },
    { href: `/${locale}/partners`, label: 'Globale Partner' },
    { href: `/${locale}/contact`, label: 'Kontakt' },
    { href: `/${locale}/login`, label: 'Investor Login' },
    // ✅ Nur EIN Admin-Link (keine Unterpunkte)
    { href: `/${locale}/admin`, label: '🛡️ Admin' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href={`/${locale}`} className="logo" onClick={closeMenu}>
          <span className="logo-text">Investor</span>
          <span className="logo-accent">Partners</span>
        </Link>

        <div className="header-right">
          <DbStatus />
          <ThemeToggle />

          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menü öffnen/schließen"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'nav-link active' : 'nav-link'}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          <div className="language-switcher-mobile">
            <Link
              href={pathname.replace(`/${locale}`, '/de')}
              className={locale === 'de' ? 'lang-link active-lang' : 'lang-link'}
              onClick={closeMenu}
            >
              DE
            </Link>
            <span className="lang-divider">|</span>
            <Link
              href={pathname.replace(`/${locale}`, '/en')}
              className={locale === 'en' ? 'lang-link active-lang' : 'lang-link'}
              onClick={closeMenu}
            >
              EN
            </Link>
          </div>
        </nav>

        <div className="language-switcher-desktop">
          <Link
            href={pathname.replace(`/${locale}`, '/de')}
            className={locale === 'de' ? 'lang-link active-lang' : 'lang-link'}
          >
            DE
          </Link>
          <span className="lang-divider">|</span>
          <Link
            href={pathname.replace(`/${locale}`, '/en')}
            className={locale === 'en' ? 'lang-link active-lang' : 'lang-link'}
          >
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}