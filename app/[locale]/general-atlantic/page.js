import { getTranslations } from '../../../translations';
import './page.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  // Sicherheitsfallback, falls t.generalAtlantic nicht existiert
  const ga = t.generalAtlantic || { title: 'General Atlantic', subtitle: '' };

  return {
    title: ga.title,
    description: ga.subtitle,
  };
}

export default async function GeneralAtlanticPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  // Sicherheitsfallback
  const ga = t.generalAtlantic || {
    title: 'General Atlantic',
    subtitle: 'Powering Visionary Growth.',
    stats: { aum: '$126B', aumLabel: 'AUM', invested: '$121B', investedLabel: 'Invested', locations: '23', locationsLabel: 'Locations' },
    strategies: { growth: 'Growth', growthDesc: '', solutions: 'Solutions', solutionsDesc: '', climate: 'Climate', climateDesc: '' },
    partnership: ''
  };

  return (
    <div className="ga-container">
      <div className="ga-hero">
        <h1 className="ga-title">{ga.title}</h1>
        <p className="ga-subtitle">{ga.subtitle}</p>
      </div>

      <div className="ga-stats">
        <div className="ga-stat-card">
          <div className="ga-stat-number">{ga.stats.aum}</div>
          <div className="ga-stat-label">{ga.stats.aumLabel}</div>
        </div>
        <div className="ga-stat-card">
          <div className="ga-stat-number">{ga.stats.invested}</div>
          <div className="ga-stat-label">{ga.stats.investedLabel}</div>
        </div>
        <div className="ga-stat-card">
          <div className="ga-stat-number">{ga.stats.locations}</div>
          <div className="ga-stat-label">{ga.stats.locationsLabel}</div>
        </div>
      </div>

      <p className="ga-partnership">{ga.partnership}</p>

      <div className="ga-strategies">
        <div className="ga-strategy-card">
          <h3 className="ga-strategy-title">{ga.strategies.growth}</h3>
          <p className="ga-strategy-desc">{ga.strategies.growthDesc}</p>
        </div>
        <div className="ga-strategy-card">
          <h3 className="ga-strategy-title">{ga.strategies.solutions}</h3>
          <p className="ga-strategy-desc">{ga.strategies.solutionsDesc}</p>
        </div>
        <div className="ga-strategy-card">
          <h3 className="ga-strategy-title">{ga.strategies.climate}</h3>
          <p className="ga-strategy-desc">{ga.strategies.climateDesc}</p>
        </div>
      </div>
    </div>
  );
}