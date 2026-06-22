import de from './de.js';
import en from './en.js';

const translations = { de, en };

export function getTranslations(locale = 'de') {
  // Fallback: Wenn locale nicht existiert, Deutsch verwenden
  const selected = translations[locale];
  if (!selected) {
    console.warn(`Locale "${locale}" not found, falling back to "de"`);
    return translations.de;
  }
  return selected;
}

export function useTranslations(locale) {
  return getTranslations(locale);
}

export default translations;