// src/components/layout/Header/Header.jsx
import React from 'react';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './Header.module.css';

const Header = ({ showLanguageSwitcher = false }) => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>{t('app_name')}</h1>
      {showLanguageSwitcher && <LanguageSwitcher />}
    </header>
  );
};

export default Header;