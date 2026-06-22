import { getTranslations } from '../../translations';
import Link from 'next/link';
import './page.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t.home.title,
    description: t.home.subtitle,
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;  // ✅ AWAIT!
  const t = getTranslations(locale);
  const home = t.home;

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">{home.title}</h1>
        <p className="home-subtitle">{home.subtitle}</p>
      </div>

      <div className="home-grid">
        <Link href={`/${locale}/general-atlantic`} className="home-card">
          <div className="home-card-icon">🌍</div>
          <h2 className="home-card-title">{home.gaCard.title}</h2>
          <p className="home-card-desc">{home.gaCard.desc}</p>
          <span className="home-card-cta">{home.gaCard.cta} →</span>
        </Link>

        <Link href={`/${locale}/lotus-investment`} className="home-card">
          <div className="home-card-icon">🌿</div>
          <h2 className="home-card-title">{home.lotusCard.title}</h2>
          <p className="home-card-desc">{home.lotusCard.desc}</p>
          <span className="home-card-cta">{home.lotusCard.cta} →</span>
        </Link>
      </div>
    </div>
  );
}