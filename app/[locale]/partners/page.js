import { getTranslations } from '../../../translations';
import './page.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t.partners.title,
    description: t.partners.subtitle,
  };
}

export default async function PartnersPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const p = t.partners;

  return (
    <div className="partners-container">
      <div className="partners-hero">
        <h1 className="partners-title">{p.title}</h1>
        <p className="partners-subtitle">{p.subtitle}</p>
      </div>

      <div className="partners-grid">
        {Object.values(p.categories).map((category, index) => (
          <div key={index} className="partner-card">
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      <div className="partners-cooperation">
        <p>{p.cooperation}</p>
      </div>
    </div>
  );
}