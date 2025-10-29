// src/pages/HomePage/HomePage.jsx
import React from 'react';
import Header from '../../components/layout/Header/Header';
import SearchBar from '../../components/layout/SearchBar/SearchBar';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '🗺️',
      titleKey: 'home_feature1_title',
      descKey: 'home_feature1_desc'
    },
    {
      icon: '👥',
      titleKey: 'home_feature2_title',
      descKey: 'home_feature2_desc'
    },
    {
      icon: '📍',
      titleKey: 'home_feature3_title',
      descKey: 'home_feature3_desc'
    }
  ];

  return (
    <div className="page-container">
      <Header showLanguageSwitcher={true} />
      <SearchBar />
      
      <main className="main-content">
        <section className={styles.welcomeSection}>
          <h2>{t('home_welcome_title')}</h2>
          <p>{t('home_welcome_subtitle')}</p>
        </section>

        <section className={styles.featureCards}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descKey)}</p>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;