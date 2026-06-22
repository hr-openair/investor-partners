import { getTranslations } from '../../../translations';
import './page.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t.services.title,
    description: t.services.subtitle,
  };
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const s = t.services;

  return (
    <div className="services-container">
      <div className="services-hero">
        <h1 className="services-title">{s.title}</h1>
        <p className="services-subtitle">{s.subtitle}</p>
      </div>

      <div className="services-grid">
        {/* Wertpapierhandel */}
        <div className="service-card">
          <h2 className="service-card-title">{s.categories.securities.title}</h2>
          <ul className="service-list">
            {s.categories.securities.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Derivate */}
        <div className="service-card">
          <h2 className="service-card-title">{s.categories.derivatives.title}</h2>
          <ul className="service-list">
            {s.categories.derivatives.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Digitale Assets */}
        <div className="service-card">
          <h2 className="service-card-title">{s.categories.digitalAssets.title}</h2>
          <ul className="service-list">
            {s.categories.digitalAssets.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Vermögensverwaltung */}
        <div className="service-card">
          <h2 className="service-card-title">{s.categories.wealthManagement.title}</h2>
          <ul className="service-list">
            {s.categories.wealthManagement.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="services-approach">
        <p>{s.approach}</p>
      </div>
    </div>
  );
}
