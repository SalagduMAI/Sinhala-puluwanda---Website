import { useLanguage } from '../contexts/LanguageContext';
import { Language, TRANSLATIONS } from './translations';

export { type Language, TRANSLATIONS };

export function useTranslation() {
  try {
    return useLanguage();
  } catch {
    // Fallback if rendered outside LanguageProvider (e.g. in standalone unit tests)
    const lang: Language = 'en';
    const setLanguage = () => {};
    const t = (key: string, fallback?: string): string => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || fallback || key;
    };
    return { lang, setLanguage, t };
  }
}
