'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function AdminTransactionsPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(tx => tx.type === filter);

  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  if (loading) return <div className="admin-loading">Lade Transaktionen...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">💳 Transaktionen</h1>
        <p className="admin-subtitle">
          Alle Transaktionen · Volumen: <strong>{totalVolume.toLocaleString()} €</strong>
        </p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-filter-group">
          <button
            className={`admin-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Alle
          </button>
          <button
            className={`admin-filter-btn ${filter === 'buy' ? 'active' : ''}`}
            onClick={() => setFilter('buy')}
          >
            Käufe
          </button>
          <button
            className={`admin-filter-btn ${filter === 'sell' ? 'active' : ''}`}
            onClick={() => setFilter('sell')}
          >
            Verkäufe
          </button>
          <button
            className={`admin-filter-btn ${filter === 'deposit' ? 'active' : ''}`}
            onClick={() => setFilter('deposit')}
          >
            Einzahlungen
          </button>
          <button
            className={`admin-filter-btn ${filter === 'withdraw' ? 'active' : ''}`}
            onClick={() => setFilter('withdraw')}
          >
            Auszahlungen
          </button>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Benutzer</th>
                <th>Typ</th>
                <th>Betrag</th>
                <th>Status</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr><td colSpan="6" className="admin-empty">Keine Transaktionen gefunden</td></tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="admin-id">{tx.id}</td>
                    <td>{tx.user_email}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${tx.type}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <span className={tx.type === 'buy' || tx.type === 'deposit' ? 'admin-positive' : 'admin-negative'}>
                        {tx.amount.toLocaleString()} €
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status admin-status-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.created_at).toLocaleString()}</td>
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