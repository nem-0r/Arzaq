// src/components/common/Loading/Loading.jsx
import React from 'react';
import styles from './Loading.module.css';

const Loading = ({ fullscreen = false }) => {
  return (
    <div className={`${styles.loadingContainer} ${fullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loading;
