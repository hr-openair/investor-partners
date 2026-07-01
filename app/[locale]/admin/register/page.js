'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from '../../../../translations';
import './page.css';

export default function RegisterPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validierung
    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Bitte akzeptieren Sie die AGB');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone,
          role: 'user', // Standard: Kunde
          kyc_status: 'pending',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registrierung fehlgeschlagen');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-success">
            <span className="register-success-icon">✅</span>
            <h2>Registrierung erfolgreich!</h2>
            <p>Sie werden zur Anmeldung weitergeleitet...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">🔐 Konto erstellen</h1>
          <p className="register-subtitle">Registrieren Sie sich als Investor</p>
        </div>

        {error && (
          <div className="register-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-group">
            <label htmlFor="full_name">Vollständiger Name *</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="z.B. Max Mustermann"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="email">E-Mail-Adresse *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="max@example.com"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="phone">Telefonnummer (optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+49 123 456789"
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Passwort *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mindestens 6 Zeichen"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Passwort bestätigen *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Passwort wiederholen"
              required
            />
          </div>

          <div className="register-form-group register-checkbox">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms">
              Ich akzeptiere die <Link href={`/${locale}/terms`}>AGB</Link> und
              <Link href={`/${locale}/privacy`}> Datenschutzerklärung</Link> *
            </label>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? '⏳ Wird registriert...' : '🚀 Jetzt registrieren'}
          </button>

          <p className="register-login-link">
            Bereits ein Konto? <Link href={`/${locale}/login`}>Hier anmelden</Link>
          </p>
        </form>
      </div>
    </div>
  );
}