// src/components/layout/BottomNav/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import Icon from '../../common/Icon/Icon';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: 'home', label: t('nav_home') },
    { path: '/map', icon: 'map', label: t('nav_map') },
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
          <Icon name={item.icon} width={24} height={24} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
