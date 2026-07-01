'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../translations';
import './page.css';

export default function AdminDashboardPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    pendingKyc: 0,
    verifiedKyc: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalVolume: 0,
    staffCount: 0,
    activeInvestments: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats || {});
      setRecentTransactions(data.recentTransactions || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { label: '👥 Benutzer', value: stats.totalUsers, sub: `${stats.activeUsers} aktiv · ${stats.blockedUsers} gesperrt` },
    { label: '📋 KYC ausstehend', value: stats.pendingKyc, sub: `${stats.verifiedKyc} verifiziert` },
    { label: '💳 Transaktionen', value: stats.totalTransactions, sub: `${stats.pendingTransactions} ausstehend` },
    { label: '👤 Mitarbeiter', value: stats.staffCount, sub: 'mit Zugriff' },
    { label: '📊 Volumen', value: `${(stats.totalVolume || 0).toLocaleString()} €`, sub: 'gesamt' },
  ];

  if (loading) {
    return <div className="admin-loading">Lade Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="admin-stat-card">
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">📋 Letzte Transaktionen</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Typ</th>
                <th>Betrag</th>
                <th>Status</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr><td colSpan="5" className="admin-empty">Keine Transaktionen</td></tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.user_email || 'Unbekannt'}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${tx.transaction_type}`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td>{tx.amount?.toLocaleString() || '0'} €</td>
                    <td>
                      <span className={`admin-status admin-status-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}