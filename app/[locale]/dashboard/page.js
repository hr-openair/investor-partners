import { getTranslations } from '../../../translations';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import './page.css';

export default async function DashboardPage({ params }) {
  const { locale } = await params;  // ✅ AWAIT!
  const t = getTranslations(locale);

  const cookieStore = await cookies();  // ✅ AWAIT!
  const token = cookieStore.get('token');

  if (!token) {
    redirect(`/${locale}/login`);
  }

  let user = null;
  try {
    const decoded = Buffer.from(token.value, 'base64').toString();
    user = JSON.parse(decoded);
  } catch {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{t.dashboard.title}</h1>

      <div className="dashboard-welcome">
        <p className="dashboard-greeting">
          {t.dashboard.welcome}, {user?.email || 'Investor'}!
        </p>
        <p className="dashboard-lastlogin">{t.dashboard.lastLogin}: 21.06.2026</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>{t.dashboard.portfolio}</h3>
          <p>Hier sehen Sie Ihre Portfolio-Übersicht.</p>
        </div>
        <div className="dashboard-card">
          <h3>{t.dashboard.documents}</h3>
          <p>Ihre aktuellen Dokumente und Berichte.</p>
        </div>
        <div className="dashboard-card">
          <h3>{t.dashboard.messages}</h3>
          <p>Keine neuen Nachrichten.</p>
        </div>
      </div>
    </div>
  );
}