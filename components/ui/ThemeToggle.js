'use client';

import { useTheme } from '../ThemeProvider';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Theme umschalten"
      title={theme === 'light' ? 'Dark Mode aktivieren' : 'Light Mode aktivieren'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}