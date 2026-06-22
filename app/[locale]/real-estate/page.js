import { getTranslations } from '../../../translations';
import './page.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t.realEstate.title,
    description: t.realEstate.subtitle,
  };
}

export default async function RealEstatePage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const re = t.realEstate;

  return (
    <div className="realestate-container">
      <div className="realestate-hero">
        <h1 className="realestate-title">{re.title}</h1>
        <p className="realestate-subtitle">{re.subtitle}</p>
      </div>

      <div className="realestate-types">
        {Object.values(re.types).map((type, index) => (
          <div key={index} className="realestate-type-card">
            <h3>{type.title}</h3>
            <p>{type.description}</p>
          </div>
        ))}
      </div>

      <div className="realestate-benefits">
        <h2>{re.benefits.title}</h2>
        <ul>
          {re.benefits.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}