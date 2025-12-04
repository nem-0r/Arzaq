// src/components/common/CategoryCard/CategoryCard.jsx
import React from 'react';
import Icon from '../Icon/Icon';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ icon, name, color, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.iconContainer}
        style={{ backgroundColor: color || 'var(--background-gray)' }}
      >
        <Icon name={icon} width={32} height={32} className={styles.icon} />
      </div>
      <p className={styles.name}>{name}</p>
    </div>
  );
};

export default CategoryCard;
