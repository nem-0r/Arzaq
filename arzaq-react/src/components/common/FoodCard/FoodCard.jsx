// src/components/common/FoodCard/FoodCard.jsx
import React from 'react';
import styles from './FoodCard.module.css';

const FoodCard = ({
  image,
  title,
  restaurant,
  price,
  oldPrice,
  discount,
  onAddClick
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
        {discount && (
          <span className={styles.discountBadge}>{discount}% OFF</span>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.restaurant}>{restaurant}</p>
        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>${price}</span>
            {oldPrice && (
              <span className={styles.oldPrice}>${oldPrice}</span>
            )}
          </div>
          <button
            className={styles.addBtn}
            onClick={() => onAddClick && onAddClick()}
            aria-label={`Add ${title} to cart`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 5V15M5 10H15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
