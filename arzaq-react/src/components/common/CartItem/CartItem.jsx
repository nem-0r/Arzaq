// src/components/common/CartItem/CartItem.jsx
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './CartItem.module.css';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { t } = useTranslation();
  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        <img src={item.image} alt={item.title} className={styles.image} />
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.restaurant}>{item.restaurant}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>${item.price}</span>
          {item.oldPrice && (
            <span className={styles.oldPrice}>${item.oldPrice}</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityBtn}
            onClick={() => onDecrease(item.id)}
            aria-label={t('cart_decrease')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <span className={styles.quantity}>{item.quantity}</span>

          <button
            className={styles.quantityBtn}
            onClick={() => onIncrease(item.id)}
            aria-label={t('cart_increase')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.totalPrice}>${itemTotal}</div>

        <button
          className={styles.removeBtn}
          onClick={() => onRemove(item.id)}
          aria-label={t('cart_remove')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
