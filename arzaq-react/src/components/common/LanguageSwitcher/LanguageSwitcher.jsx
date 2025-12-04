// src/components/common/LanguageSwitcher/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useTranslation();

  return (
    <div className={styles.languageSwitcher}>
      {availableLanguages.map((lang) => (
        <button
          key={lang}
          className={`${styles.langBtn} ${currentLanguage === lang ? styles.active : ''}`}
          onClick={() => changeLanguage(lang)}
          aria-label={`Switch to ${lang.toUpperCase()}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;