// src/components/common/HorizontalScrollSection/HorizontalScrollSection.jsx
import React from 'react';
import styles from './HorizontalScrollSection.module.css';

const HorizontalScrollSection = ({ title, children, showViewAll = false, onViewAll }) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {showViewAll && (
          <button className={styles.viewAllBtn} onClick={onViewAll}>
            View All
          </button>
        )}
      </div>
      <div className={styles.scrollContainer}>
        <div className={styles.scrollContent}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollSection;
