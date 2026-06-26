'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function AdminStaffPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    user_id: '',
    role: 'admin',
    permissions: { users: true, transactions: true, investments: true, banking: true, staff: false },
    can_create: true,
    can_read: true,
    can_update: true,
    can_delete: false
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchStaff();
      }
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  if (loading) return <div className="admin-loading">Lade Mitarbeiter...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">👥 Mitarbeiter-Administration</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowAddModal(true)}>
          + Mitarbeiter hinzufügen
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Rolle</th>
                <th>Berechtigungen</th>
                <th>Lesen</th>
                <th>Schreiben</th>
                <th>Löschen</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr><td colSpan="8" className="admin-empty">Keine Mitarbeiter gefunden</td></tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id}>
                    <td>{member.user_email}</td>
                    <td>
                      <span className={`admin-role admin-role-${member.role}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="admin-permissions">
                      {Object.entries(member.permissions || {}).filter(([k, v]) => v).map(([key]) => (
                        <span key={key} className="admin-permission-badge">{key}</span>
                      ))}
                    </td>
                    <td>{member.can_read ? '✅' : '❌'}</td>
                    <td>{member.can_update ? '✅' : '❌'}</td>
                    <td>{member.can_delete ? '✅' : '❌'}</td>
                    <td>
                      <span className={`admin-status ${member.is_active ? 'admin-status-completed' : 'admin-status-failed'}`}>
                        {member.is_active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
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

      {/* Modal: Neuer Mitarbeiter */}
      {showAddModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h2>Mitarbeiter hinzufügen</h2>
            <form onSubmit={handleAddStaff}>
              <div className="admin-form-group">
                <label>Benutzer-ID</label>
                <input
                  type="number"
                  value={newStaff.user_id}
                  onChange={(e) => setNewStaff({...newStaff, user_id: e.target.value})}
                  placeholder="z.B. 1"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Rolle</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Abbrechen
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Mitarbeiter hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}