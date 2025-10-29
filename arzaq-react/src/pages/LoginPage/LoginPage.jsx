// src/pages/LoginPage/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import LoginForm from '../../components/features/Auth/LoginForm/LoginForm';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.authContainer}>
      <Header />

      <main className={styles.authContent}>
        <div className={styles.authBox}>
          <h2>{t('login_title')}</h2>
          <p className={styles.authSubtitle}>{t('login_subtitle')}</p>

          <LoginForm />

          <div className={styles.authFooter}>
            <p>
              {t('login_footer_text')}{' '}
              <Link to="/register">{t('login_footer_link')}</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
