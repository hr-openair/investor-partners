'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function AdminInvestmentsPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [investments, setInvestments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, userRes] = await Promise.all([
        fetch('/api/admin/investments'),
        fetch('/api/admin/users')
      ]);
      const invData = await invRes.json();
      const userData = await userRes.json();
      setInvestments(invData.investments || []);
      setUsers(userData.users || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.name || user?.email || 'Unbekannt';
  };

  if (loading) return <div className="admin-loading">Lade Investments...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">📊 Investment-Verwaltung</h1>
        <p className="admin-subtitle">Übersicht aller Nutzer-Investments</p>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nutzer</th>
                <th>Investment</th>
                <th>Anteile</th>
                <th>Kaufpreis</th>
                <th>Aktueller Wert</th>
                <th>Gewinn/Verlust</th>
              </tr>
            </thead>
            <tbody>
              {investments.length === 0 ? (
                <tr><td colSpan="6" className="admin-empty">Keine Investments gefunden</td></tr>
              ) : (
                investments.map((inv) => {
                  const currentValue = inv.shares * (inv.current_price || inv.purchase_price);
                  const profit = currentValue - (inv.shares * inv.purchase_price);
                  const profitPercent = ((currentValue / (inv.shares * inv.purchase_price)) - 1) * 100;
                  return (
                    <tr key={inv.id}>
                      <td>{getUserName(inv.user_id)}</td>
                      <td><strong>{inv.name}</strong></td>
                      <td>{inv.shares}</td>
                      <td>{inv.purchase_price.toFixed(2)} €</td>
                      <td>{currentValue.toFixed(2)} €</td>
                      <td>
                        <span className={profit >= 0 ? 'admin-positive' : 'admin-negative'}>
                          {profit >= 0 ? '+' : ''}{profit.toFixed(2)} € ({profitPercent.toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}