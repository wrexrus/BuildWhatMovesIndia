import React, { createContext, useContext, useState, useEffect } from 'react';
import { SITE_TRANSLATIONS, SUPPORTED_SITE_LANGUAGES } from '../config/siteTranslations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'EN';
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key) => {
    const langDict = SITE_TRANSLATIONS[language] || SITE_TRANSLATIONS.EN;
    return langDict[key] || SITE_TRANSLATIONS.EN[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_SITE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
