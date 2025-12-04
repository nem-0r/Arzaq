// src/pages/MapPage/MapPage.jsx
import React from 'react';
import Header from '../../components/layout/Header/Header';
import SearchBar from '../../components/layout/SearchBar/SearchBar';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import YandexMap from '../../components/features/Map/YandexMap/YandexMap';
import styles from './MapPage.module.css';

const MapPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header showLanguageSwitcher={true} />
      <SearchBar showFilter={true} />
      <main id="main-content" className={styles.mapContent}>
        <YandexMap />
      </main>
      <BottomNav />
    </div>
  );
};

export default MapPage;
