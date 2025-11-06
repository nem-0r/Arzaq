// src/components/common/RestaurantCard/RestaurantCard.jsx
import React from 'react';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({
  image,
  name,
  rating,
  distance,
  cuisine,
  specialty,
  mealsAvailable,
  discount,
  onViewClick
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
        <div className={styles.ratingBadge}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#FFD700"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span>{rating}</span>
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.info}>
          {distance} • {cuisine} • {specialty}
        </p>
        {mealsAvailable && (
          <div className={styles.availability}>
            <span className={styles.mealsCount}>{mealsAvailable} meals available</span>
            {discount && <span className={styles.discount}>Up to {discount}% off</span>}
          </div>
        )}
        {onViewClick && (
          <button className={styles.viewBtn} onClick={onViewClick}>
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
