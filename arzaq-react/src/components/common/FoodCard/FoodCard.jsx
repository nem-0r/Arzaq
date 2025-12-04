// src/components/common/FoodCard/FoodCard.jsx
import React from 'react';
import {
  IoTimeOutline,
  IoLeafOutline,
  IoLocationOutline,
  IoStar,
  IoRestaurantOutline,
  IoFlame
} from 'react-icons/io5';
import { formatPrice, calculateSavings } from '../../../utils/currency';
import styles from './FoodCard.module.css';

const FoodCard = ({
  image,
  title,
  restaurant,
  restaurantId = null,        // Restaurant ID for navigation
  price,
  oldPrice,
  discount,
  rating = null,              // NEW: Restaurant rating (0-5)
  distance = null,            // NEW: Distance to location (e.g., "0.5 km")
  portions = null,            // NEW: Number of portions left
  expiresInMinutes = null,    // NEW: Minutes until expiration
  status = 'pickup_today',
  pickupTime,
  onAddClick,
  onCardClick = null,          // Optional click handler for card navigation
  isAvailable = true           // NEW: Availability status
}) => {
  // Status badge configuration
  const statusConfig = {
    pickup_today: {
      label: 'Pickup Today',
      className: styles.statusPickupToday
    },
    leftovers: {
      label: 'Leftovers',
      className: styles.statusLeftovers
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.pickup_today;
  const isLowStock = portions && portions <= 3;
  const isExpiringSoon = expiresInMinutes && expiresInMinutes <= 60;
  const isOutOfStock = portions !== null && portions <= 0;

  const handleCardClick = () => {
    if (onCardClick && restaurantId) {
      onCardClick(restaurantId);
    }
  };

  const handleRescueClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking rescue button
    if (onAddClick) {
      onAddClick();
    }
  };

  return (
    <article
      className={`${styles.card} ${(isOutOfStock || !isAvailable) ? styles.cardUnavailable : ''}`}
      onClick={handleCardClick}
      style={{ cursor: onCardClick && restaurantId ? 'pointer' : 'default' }}
      role="article"
      aria-label={`${title} from ${restaurant}${isOutOfStock || !isAvailable ? ' - Out of stock' : ''}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={`${title} from ${restaurant}`}
          loading="lazy"
          className={styles.image}
        />

        {/* Unavailable Badge */}
        {(isOutOfStock || !isAvailable) && (
          <div className={styles.unavailableBadge}>
            Нет в наличии
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`${styles.statusBadge} ${currentStatus.className}`}
          role="status"
          aria-label={`Status: ${currentStatus.label}`}
        >
          <IoLeafOutline size={14} aria-hidden="true" />
          <span>{currentStatus.label}</span>
        </span>

        {/* Discount Badge */}
        {discount && (
          <span
            className={styles.discountBadge}
            role="status"
            aria-label={`${discount} percent discount`}
          >
            {discount}% OFF
          </span>
        )}

        {/* Low Stock Warning */}
        {isLowStock && (
          <span className={styles.lowStockBadge} role="status">
            <IoFlame size={14} aria-hidden="true" />
            <span>Only {portions} left!</span>
          </span>
        )}
      </div>

      <div className={styles.content}>
        {/* Metadata Header */}
        {(rating || distance || portions) && (
          <div className={styles.metadata}>
            {rating && (
              <div className={styles.rating}>
                <IoStar size={14} aria-hidden="true" />
                <span>{rating}</span>
              </div>
            )}
            {rating && (distance || portions) && (
              <span className={styles.dot} aria-hidden="true">•</span>
            )}
            {distance && (
              <div className={styles.distance}>
                <IoLocationOutline size={14} aria-hidden="true" />
                <span>{distance}</span>
              </div>
            )}
            {distance && portions && (
              <span className={styles.dot} aria-hidden="true">•</span>
            )}
            {portions && !isLowStock && (
              <div className={styles.portions}>
                <IoRestaurantOutline size={14} aria-hidden="true" />
                <span>{portions} left</span>
              </div>
            )}
          </div>
        )}

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.restaurant}>{restaurant}</p>

        {/* Expiring Soon or Pickup Time */}
        {isExpiringSoon ? (
          <div className={styles.expiringSoon} role="alert">
            <IoTimeOutline size={16} aria-hidden="true" />
            <span>Ends in {expiresInMinutes} min!</span>
          </div>
        ) : pickupTime ? (
          <div className={styles.pickupTime}>
            <IoTimeOutline size={16} aria-hidden="true" />
            <span>{pickupTime}</span>
          </div>
        ) : null}

        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span
              className={styles.price}
              aria-label={`Current price: ${price} tenge`}
            >
              {formatPrice(price)}
            </span>
            {oldPrice && (
              <>
                <span
                  className={styles.oldPrice}
                  aria-label={`Original price: ${oldPrice} tenge`}
                >
                  {formatPrice(oldPrice)}
                </span>
                <span className={styles.savings}>
                  Save {formatPrice(calculateSavings(oldPrice, price))}
                </span>
              </>
            )}
          </div>
          <button
            className={styles.rescueBtn}
            onClick={handleRescueClick}
            disabled={isOutOfStock || !isAvailable}
            aria-label={`Rescue ${title} from ${restaurant} for ${price} tenge`}
          >
            <IoLeafOutline size={18} aria-hidden="true" />
            <span>{isOutOfStock || !isAvailable ? 'Unavailable' : 'Rescue'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
