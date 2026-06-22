'use client';

import * as React from 'react';
import { useState } from 'react';
import { useTranslations } from '../../../translations';
import './page.css';

export default function ContactPage({ params }) {
  // ✅ React.use() für params (Client-Komponente)
  const { locale } = React.use(params);
  const t = useTranslations(locale);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error');
      }

      setStatus({ type: 'success', message: t.contact.success });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: t.contact.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">{t.contact.title}</h1>
        <p className="contact-subtitle">{t.contact.subtitle}</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-group">
            <label htmlFor="name">{t.contact.name}</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="contact-input"
              required
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="email">{t.contact.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="contact-input"
              required
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="subject">{t.contact.subject}</label>
            <input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="contact-input"
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="message">{t.contact.message}</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="contact-textarea"
              required
            />
          </div>

          {status.message && (
            <p className={status.type === 'success' ? 'contact-success' : 'contact-error'}>
              {status.message}
            </p>
          )}

          <button type="submit" disabled={loading} className="contact-button">
            {loading ? '⏳' : t.contact.submit}
          </button>
        </form>
      </div>
    </div>
  );
}