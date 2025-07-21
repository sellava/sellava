'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

const supportedLanguages: Language[] = [
  'ar', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'tr', 'hi', 'id', 'ko', 'nl', 'pl'
];

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('sellava_language') as Language;
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      setDocumentDirection(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const foundLang = supportedLanguages.find(l => l === browserLang);
      if (foundLang) {
        setLanguageState(foundLang);
        setDocumentDirection(foundLang);
        localStorage.setItem('sellava_language', foundLang);
      } else {
        setLanguageState('en');
        setDocumentDirection('en');
        localStorage.setItem('sellava_language', 'en');
      }
    }
  }, []);

  const setDocumentDirection = (lang: Language) => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sellava_language', lang);
    setDocumentDirection(lang);
  };

  const translate = (key: string): string => {
    return t(key, language);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 