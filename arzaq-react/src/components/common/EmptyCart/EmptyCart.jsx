// src/components/common/EmptyCart/EmptyCart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './EmptyCart.module.css';

const EmptyCart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.emptyCart}>
      <div className={styles.iconContainer}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="60" fill="#F3F4F6" />
          <path
            d="M40 45L35 85H85L80 45H40Z"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M45 45V40C45 31.7157 51.7157 25 60 25C68.2843 25 75 31.7157 75 40V45"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="60" r="3" fill="#9CA3AF" />
          <circle cx="70" cy="60" r="3" fill="#9CA3AF" />
          <path
            d="M50 70C50 70 55 75 60 75C65 75 70 70 70 70"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className={styles.title}>{t('cart_empty_title')}</h2>
      <p className={styles.description}>{t('cart_empty_description')}</p>

      <button className={styles.browseBtn} onClick={() => navigate('/')}>
        {t('cart_browse_food')}
      </button>
    </div>
  );
};

export default EmptyCart;
