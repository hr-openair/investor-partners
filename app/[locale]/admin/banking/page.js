'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function AdminBankingPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/banking');
      const data = await res.json();
      setDeposits(data.deposits || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Einzahlung bestätigen?')) return;
    try {
      await fetch(`/api/admin/banking/${id}/approve`, { method: 'POST' });
      fetchDeposits();
    } catch (error) {
      alert('Fehler beim Bestätigen');
    }
  };

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const totalPending = pendingDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) return <div className="admin-loading">Lade Banking-Daten...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">🏦 Banking & Einzahlungen</h1>
        <p className="admin-subtitle">
          Offene Einzahlungen: <strong>{pendingDeposits.length}</strong> ·
          Gesamtvolumen: <strong>{totalPending.toLocaleString()} €</strong>
        </p>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Benutzer</th>
                <th>Betrag</th>
                <th>Methode</th>
                <th>Status</th>
                <th>Datum</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {deposits.length === 0 ? (
                <tr><td colSpan="7" className="admin-empty">Keine Banking-Transaktionen</td></tr>
              ) : (
                deposits.map((dep) => (
                  <tr key={dep.id}>
                    <td className="admin-id">{dep.id}</td>
                    <td>{dep.user_email}</td>
                    <td><strong>{dep.amount.toLocaleString()} €</strong></td>
                    <td>{dep.method || 'Banküberweisung'}</td>
                    <td>
                      <span className={`admin-status admin-status-${dep.status}`}>
                        {dep.status}
                      </span>
                    </td>
                    <td>{new Date(dep.created_at).toLocaleDateString()}</td>
                    <td>
                      {dep.status === 'pending' && (
                        <button
                          className="admin-btn-sm admin-btn-approve"
                          onClick={() => handleApprove(dep.id)}
                        >
                          ✅ Bestätigen
                        </button>
                      )}
                    </td>
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