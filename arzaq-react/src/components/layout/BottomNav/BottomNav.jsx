// src/components/layout/BottomNav/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useCart } from '../../../context/CartContext';
import Icon from '../../common/Icon/Icon';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const { t } = useTranslation();
  const { totalItems } = useCart();

  const navItems = [
    { path: '/', icon: 'home', label: t('nav_home') },
    { path: '/map', icon: 'map', label: t('nav_map') },
    { path: '/cart', icon: 'cart', label: t('nav_cart'), badge: totalItems },
    { path: '/community', icon: 'community', label: t('nav_community') },
    { path: '/profile', icon: 'profile', label: t('nav_profile') }
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <div className={styles.iconWrapper}>
            <Icon name={item.icon} width={24} height={24} />
            {item.badge > 0 && (
              <span className={styles.badge}>{item.badge > 99 ? '99+' : item.badge}</span>
            )}
          </div>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
