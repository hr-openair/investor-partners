'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../translations';
import './page.css';

export default function AdminUsersPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    kyc_status: 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, staffRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/staff')
      ]);
      const usersData = await usersRes.json();
      const staffData = await staffRes.json();
      setUsers(usersData.users || []);
      setStaff(staffData.staff || []);
    } catch (error) {
      console.error('Fehler beim Laden:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ email: '', password: '', full_name: '', role: 'user', kyc_status: 'pending' });
        fetchData();
      }
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      fetchData();
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
    }
  };

  if (loading) return <div className="admin-loading">Lade Benutzer...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">👤 Benutzerverwaltung</h1>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowAddModal(true)}>
            + Neuer Benutzer
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => setShowStaffModal(true)}>
            👥 Mitarbeiter verwalten
          </button>
        </div>
      </div>

      {/* Benutzer-Tabelle */}
      <div className="admin-section">
        <h2 className="admin-section-title">📋 Alle Benutzer</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="7" className="admin-empty">Keine Benutzer gefunden</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-id">{user.id}</td>
                    <td><strong>{user.full_name || '—'}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-role admin-role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status admin-status-${user.kyc_status}`}>
                        {user.kyc_status}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status ${user.is_active ? 'admin-status-completed' : 'admin-status-failed'}`}>
                        {user.is_active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-btn-sm admin-btn-edit"
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                      >
                        {user.is_active ? '🔒' : '🔓'}
                      </button>
                      <button className="admin-btn-sm admin-btn-edit">✏️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Neuer Benutzer */}
      {showAddModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h2>Neuen Benutzer anlegen</h2>
            <form onSubmit={handleCreateUser}>
              <div className="admin-form-group">
                <label>E-Mail</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Passwort</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Vollständiger Name</label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                />
              </div>
              <div className="admin-form-group">
                <label>Rolle</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">Benutzer</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Abbrechen
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Benutzer erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}