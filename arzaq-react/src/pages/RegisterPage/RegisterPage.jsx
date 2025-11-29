// src/pages/RegisterPage/RegisterPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import RegisterForm from '../../components/features/Auth/RegisterForm/RegisterForm';
import { useTranslation } from '../../hooks/useTranslation';
import styles from '../LoginPage/LoginPage.module.css'; // Reuse same styles

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.authContainer}>
      <Header />

      <main id="main-content" className={styles.authContent}>
        <div className={styles.authBox}>
          <h2>{t('register_title')}</h2>
          <p className={styles.authSubtitle}>{t('register_subtitle')}</p>

          <RegisterForm />

          <div className={styles.authFooter}>
            <p>
              {t('register_footer_text')}{' '}
              <Link to="/login">{t('register_footer_link')}</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;