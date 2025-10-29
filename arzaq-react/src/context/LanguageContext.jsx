import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const AVAILABLE_LANGUAGES = ['en', 'ru', 'kz'];
const DEFAULT_LANGUAGE = 'en';

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations from JSON file
  const loadTranslations = useCallback(async (lang) => {
    if (!AVAILABLE_LANGUAGES.includes(lang)) {
      console.error('Invalid language code:', lang);
      lang = DEFAULT_LANGUAGE;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/locales/${lang}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTranslations(data);
      setCurrentLanguage(lang);
      localStorage.setItem('selectedLanguage', lang);
      
    } catch (error) {
      console.error('Error loading translations:', error);
      
      // Fallback to English if error and not already English
      if (lang !== DEFAULT_LANGUAGE) {
        loadTranslations(DEFAULT_LANGUAGE);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || DEFAULT_LANGUAGE;
    loadTranslations(savedLang);
  }, [loadTranslations]);

  // Translation function
  const t = useCallback((key) => {
    return translations[key] || key;
  }, [translations]);

  // Change language
  const changeLanguage = useCallback((lang) => {
    if (AVAILABLE_LANGUAGES.includes(lang)) {
      loadTranslations(lang);
    }
  }, [loadTranslations]);

  const value = {
    currentLanguage,
    translations,
    t,
    changeLanguage,
    isLoading,
    availableLanguages: AVAILABLE_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};