// src/components/features/Profile/ProfileMenu/ProfileMenu.jsx
import React from 'react';
import Icon from '../../../common/Icon/Icon';
import styles from './ProfileMenu.module.css';

const ProfileMenu = ({ title, items }) => {
  return (
    <div className={styles.profileSection}>
      <h3>{title}</h3>
      <div className={styles.profileMenu}>
        {items.map((item, index) => (
          <button
            key={index}
            className={styles.profileMenuItem}
            onClick={item.onClick}
          >
            <span>{item.label}</span>
            <Icon name={item.icon} width={20} height={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileMenu;