import { getTranslations } from '../../../translations';
import './page.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t.lotusInvestment.title,
    description: t.lotusInvestment.subtitle,
  };
}

export default async function LotusInvestmentPage({ params }) {
  const { locale } = await params;  // ✅ AWAIT!
  const t = getTranslations(locale);
  const lotus = t.lotusInvestment;

  return (
    <div className="lotus-container">
      <div className="lotus-hero">
        <h1 className="lotus-title">{lotus.title}</h1>
        <p className="lotus-subtitle">{lotus.subtitle}</p>
      </div>

      <p className="lotus-approach">{lotus.approach}</p>

      <div className="lotus-values">
        <div className="lotus-value-card">
          <h3 className="lotus-value-title">{lotus.values.trust}</h3>
          <p className="lotus-value-desc">{lotus.values.trustDesc}</p>
        </div>
        <div className="lotus-value-card">
          <h3 className="lotus-value-title">{lotus.values.sustainability}</h3>
          <p className="lotus-value-desc">{lotus.values.sustainabilityDesc}</p>
        </div>
        <div className="lotus-value-card">
          <h3 className="lotus-value-title">{lotus.values.expertise}</h3>
          <p className="lotus-value-desc">{lotus.values.expertiseDesc}</p>
        </div>
      </div>
    </div>
  );
}