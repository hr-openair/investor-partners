'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function AdminCustomersPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKyc, setFilterKyc] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    if (!confirm(`Kunden ${currentStatus ? 'sperren' : 'aktivieren'}?`)) return;
    try {
      await fetch(`/api/admin/customers/${customerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      fetchCustomers();
    } catch (error) {
      alert('Fehler beim Aktualisieren');
    }
  };

  const handleVerifyKyc = async (customerId) => {
    if (!confirm('KYC-Verifizierung bestätigen?')) return;
    try {
      await fetch(`/api/admin/customers/${customerId}/kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      fetchCustomers();
    } catch (error) {
      alert('Fehler bei KYC-Verifizierung');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKyc = filterKyc === 'all' || customer.kyc_status === filterKyc;
    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'active' && customer.is_active) ||
                          (filterStatus === 'blocked' && !customer.is_active);
    return matchesSearch && matchesKyc && matchesStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.is_active).length,
    blocked: customers.filter(c => !c.is_active).length,
    pendingKyc: customers.filter(c => c.kyc_status === 'pending').length,
    verified: customers.filter(c => c.kyc_status === 'verified').length,
  };

  if (loading) return <div className="admin-loading">Lade Kunden...</div>;

  return (
    <div className="customers-container">
      <div className="customers-header">
        <div>
          <h1 className="customers-title">👤 Kunden & Investoren</h1>
          <p className="customers-subtitle">Verwaltung aller Kunden- und Investor-Konten</p>
        </div>
        <button className="customers-btn customers-btn-primary">
          + Neuer Kunde
        </button>
      </div>

      {/* Stats */}
      <div className="customers-stats">
        <div className="customers-stat-card">
          <span className="customers-stat-label">👥 Gesamt</span>
          <span className="customers-stat-value">{stats.total}</span>
        </div>
        <div className="customers-stat-card">
          <span className="customers-stat-label">🟢 Aktiv</span>
          <span className="customers-stat-value customers-stat-active">{stats.active}</span>
        </div>
        <div className="customers-stat-card">
          <span className="customers-stat-label">🔴 Gesperrt</span>
          <span className="customers-stat-value customers-stat-blocked">{stats.blocked}</span>
        </div>
        <div className="customers-stat-card">
          <span className="customers-stat-label">🟡 KYC ausstehend</span>
          <span className="customers-stat-value customers-stat-pending">{stats.pendingKyc}</span>
        </div>
        <div className="customers-stat-card">
          <span className="customers-stat-label">✅ KYC verifiziert</span>
          <span className="customers-stat-value customers-stat-verified">{stats.verified}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="customers-filters">
        <input
          type="text"
          placeholder="🔍 Suchen (Name, E-Mail)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="customers-search"
        />
        <select
          value={filterKyc}
          onChange={(e) => setFilterKyc(e.target.value)}
          className="customers-select"
        >
          <option value="all">Alle KYC</option>
          <option value="pending">Ausstehend</option>
          <option value="submitted">Eingereicht</option>
          <option value="verified">Verifiziert</option>
          <option value="rejected">Abgelehnt</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="customers-select"
        >
          <option value="all">Alle Status</option>
          <option value="active">Aktiv</option>
          <option value="blocked">Gesperrt</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="customers-section">
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Registriert</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan="7" className="customers-empty">Keine Kunden gefunden</td></tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="customers-id">{customer.id}</td>
                    <td><strong>{customer.full_name || '—'}</strong></td>
                    <td>{customer.email}</td>
                    <td>
                      {customer.kyc_status === 'pending' && (
                        <button
                          className="customers-btn-sm customers-btn-verify"
                          onClick={() => handleVerifyKyc(customer.id)}
                        >
                          ✅ Verifizieren
                        </button>
                      )}
                      <span className={`customers-kyc customers-kyc-${customer.kyc_status}`}>
                        {customer.kyc_status}
                      </span>
                    </td>
                    <td>
                      <span className={`customers-status ${customer.is_active ? 'customers-status-active' : 'customers-status-blocked'}`}>
                        {customer.is_active ? '🟢 Aktiv' : '🔴 Gesperrt'}
                      </span>
                    </td>
                    <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={`customers-btn-sm ${customer.is_active ? 'customers-btn-block' : 'customers-btn-unblock'}`}
                        onClick={() => handleToggleStatus(customer.id, customer.is_active)}
                      >
                        {customer.is_active ? '🔒' : '🔓'}
                      </button>
                      <button className="customers-btn-sm customers-btn-view">👁️</button>
                      <button className="customers-btn-sm customers-btn-edit">✏️</button>
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