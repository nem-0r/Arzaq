// src/components/layout/BottomNav/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../hooks/useAuth';
import Icon from '../../common/Icon/Icon';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const { currentUser } = useAuth();

  // Show BottomNav for all users (client, restaurant, admin)
  // Each role has the same navigation but different functionality in Profile page
  const navItems = [
    { path: '/', icon: 'home', label: t('nav_home') },
    { path: '/map', icon: 'map', label: t('nav_map') },
    { path: '/cart', icon: 'cart', label: t('nav_cart'), badge: totalItems },
    { path: '/community', icon: 'community', label: t('nav_community') },
    { path: '/profile', icon: 'profile', label: t('nav_profile') }
  ];

  return (
    <nav
      className={styles.bottomNav}
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
          aria-label={
            item.badge > 0
              ? `${item.label} (${item.badge > 99 ? '99+' : item.badge} items)`
              : item.label
          }
          aria-current={({ isActive }) => isActive ? 'page' : undefined}
        >
          <div className={styles.iconWrapper}>
            <Icon name={item.icon} width={32} height={32} aria-hidden="true" />
            {item.badge > 0 && (
              <span
                className={styles.badge}
                aria-label={`${item.badge > 99 ? 'More than 99' : item.badge} items in cart`}
                role="status"
              >
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>
          <span aria-hidden="true">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
