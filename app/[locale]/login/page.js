'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '../../../translations';
import './page.css';

export default function LoginPage({ params }) {
  // ✅ React.use() für params (Client-Komponente)
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, locale }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t.login.error);
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{t.login.title}</h1>
        <p className="login-subtitle">{t.login.subtitle}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email">{t.login.email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">{t.login.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? '⏳' : t.login.button}
          </button>

          <a href={`/${locale}/forgot-password`} className="login-forgot">
            {t.login.forgot}
          </a>
        </form>
      </div>
    </div>
  );
}