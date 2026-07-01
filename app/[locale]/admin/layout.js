'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from '../../../translations';
import './layout.css';

export default function AdminLayout({ children, params }) {
  const { locale } = React.use(params);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations(locale);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/login`);
  };

  const navItems = [
    { href: `/${locale}/admin`, label: '📊 Dashboard', icon: '📊' },
    { href: `/${locale}/admin/customers`, label: '👤 Kunden', icon: '👤' },
    { href: `/${locale}/admin/staff`, label: '👥 Mitarbeiter', icon: '👥' },
    { href: `/${locale}/admin/transactions`, label: '💳 Transaktionen', icon: '💳' },
    { href: `/${locale}/admin/investments`, label: '📈 Investments', icon: '📈' },
    { href: `/${locale}/admin/banking`, label: '🏦 Banking', icon: '🏦' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">🏛️ Admin</h2>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="admin-sidebar-icon">{item.icon}</span>
                <span className="admin-sidebar-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            🚪 Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-main-header">
          <h1 className="admin-main-title">{t.nav.admin || 'Admin'}</h1>
          <div className="admin-main-actions">
            <span className="admin-main-user">👤 Admin</span>
          </div>
        </div>
        <div className="admin-main-content">
          {children}
        </div>
      </main>
    </div>
  );
}