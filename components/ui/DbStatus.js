'use client';

import { useState, useEffect } from 'react';
import './DbStatus.css';

export default function DbStatus() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verbindung prüfen...');
  const [details, setDetails] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 30000); // Alle 30 Sekunden
    return () => clearInterval(interval);
  }, []);

  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/db-test');
      const data = await res.json();

      if (data.success && data.hasDbUrl) {
        setStatus('online');
        setMessage('✅ Datenbank verbunden');
        setDetails({
          tables: data.data?.tableCount || '?',
          version: data.data?.postgresVersion?.substring(0, 20) || '?',
          time: data.data?.currentTime ? new Date(data.data.currentTime).toLocaleString() : '?',
        });
      } else if (data.success && !data.hasDbUrl) {
        setStatus('warning');
        setMessage('⚠️ Keine DB-URL gefunden');
        setDetails(null);
      } else {
        setStatus('error');
        setMessage('❌ Verbindung fehlgeschlagen');
        setDetails({ error: data.error || 'Unbekannter Fehler' });
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Server nicht erreichbar');
      setDetails({ error: error.message });
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case 'online': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '🔄';
    }
  };

  return (
    <div className="db-status" onClick={() => setIsExpanded(!isExpanded)}>
      <span className="db-status-dot">{getStatusDot()}</span>
      <span className="db-status-label">{message}</span>
      {isExpanded && details && (
        <div className="db-status-details">
          {details.tables && (
            <div className="db-status-row">
              <span>📊 Tabellen:</span>
              <span>{details.tables}</span>
            </div>
          )}
          {details.version && (
            <div className="db-status-row">
              <span>📦 Version:</span>
              <span>{details.version}</span>
            </div>
          )}
          {details.time && (
            <div className="db-status-row">
              <span>🕐 Letzte Prüfung:</span>
              <span>{details.time}</span>
            </div>
          )}
          {details.error && (
            <div className="db-status-row db-status-error">
              <span>⚠️ Fehler:</span>
              <span>{details.error}</span>
            </div>
          )}
          <button
            className="db-status-refresh"
            onClick={(e) => { e.stopPropagation(); checkDbStatus(); }}
          >
            🔄 Aktualisieren
          </button>
        </div>
      )}
    </div>
  );
}