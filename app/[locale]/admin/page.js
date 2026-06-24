'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '../../../translations';
import './page.css';

export default function AdminDashboardPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalVolume: 0,
    pendingDeposits: 0,
    activeInvestments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats || {});
      setRecentTransactions(data.recentTransactions || []);
    } catch (error) {
      console.error('Fehler beim Laden:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { label: '👥 Gesamt-User', value: stats.totalUsers, link: '/admin/users' },
    { label: '💰 Transaktionen', value: stats.totalTransactions, link: '/admin/transactions' },
    { label: '📊 Volumen', value: `${(stats.totalVolume || 0).toLocaleString()} €`, link: '/admin/transactions' },
    { label: '⏳ Offene Einzahlungen', value: stats.pendingDeposits, link: '/admin/banking' },
    { label: '📈 Aktive Investments', value: stats.activeInvestments, link: '/admin/investments' },
  ];

  if (loading) {
    return <div className="admin-loading">Lade Dashboard...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">🏛️ Admin Dashboard</h1>
        <p className="admin-subtitle">Übersicht über alle Plattform-Aktivitäten</p>
      </header>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {statsCards.map((stat, index) => (
          <Link key={index} href={`/${locale}${stat.link}`} className="admin-stat-card">
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
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
                    <td>{tx.user_email}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${tx.type}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.amount.toLocaleString()} €</td>
                    <td>
                      <span className={`admin-status admin-status-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav-grid">
        <Link href={`/${locale}/admin/users`} className="admin-nav-card">
          <span className="admin-nav-icon">👤</span>
          <span>Benutzer verwalten</span>
        </Link>
        <Link href={`/${locale}/admin/transactions`} className="admin-nav-card">
          <span className="admin-nav-icon">💳</span>
          <span>Transaktionen</span>
        </Link>
        <Link href={`/${locale}/admin/investments`} className="admin-nav-card">
          <span className="admin-nav-icon">📊</span>
          <span>Investments</span>
        </Link>
        <Link href={`/${locale}/admin/banking`} className="admin-nav-card">
          <span className="admin-nav-icon">🏦</span>
          <span>Banking & Einzahlungen</span>
        </Link>
      </div>
    </div>
  );
}