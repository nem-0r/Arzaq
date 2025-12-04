// src/components/layout/Header/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './Header.module.css';

const Header = ({ showLanguageSwitcher = false }) => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <h1 className={styles.logo}>{t('app_name')}</h1>
      </Link>
      {showLanguageSwitcher && <LanguageSwitcher />}
    </header>
  );
};

export default Header;