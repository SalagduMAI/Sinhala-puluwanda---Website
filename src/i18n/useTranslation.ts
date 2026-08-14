import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Language, TRANSLATIONS } from './translations';

export { type Language, TRANSLATIONS };

const fallbackContext = {
  lang: 'en' as Language,
  setLanguage: () => {},
  t: (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS.en;
    return dict[key] || fallback || key;
  }
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  return context || fallbackContext;
}
