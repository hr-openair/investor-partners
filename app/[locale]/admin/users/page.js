'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function AdminUsersPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Lade Benutzer...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">👤 Benutzerverwaltung</h1>
        <p className="admin-subtitle">Alle registrierten Nutzer der Plattform</p>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="🔍 Suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search"
        />
        <button className="admin-btn admin-btn-primary">+ Neuer Benutzer</button>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>KYC-Status</th>
                <th>Registriert</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="6" className="admin-empty">Keine Benutzer gefunden</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-id">{user.id}</td>
                    <td><strong>{user.name || '—'}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-status ${user.kyc_status === 'verified' ? 'admin-status-completed' : 'admin-status-pending'}`}>
                        {user.kyc_status || 'pending'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-btn-sm admin-btn-edit">✏️</button>
                      <button className="admin-btn-sm admin-btn-delete">🗑️</button>
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