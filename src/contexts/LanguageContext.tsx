import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';

const STORAGE_KEY = 'sinhala_app_language';

interface LanguageContextType {
  lang: Language;
  setLanguage: (newLang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'si' || saved === 'ta' || saved === 'de' || saved === 'fr')) {
        return saved as Language;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLangState(e.newValue as Language);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
