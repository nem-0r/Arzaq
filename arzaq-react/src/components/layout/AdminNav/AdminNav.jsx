// src/components/layout/AdminNav/AdminNav.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Icon from '../../common/Icon/Icon';
import styles from './AdminNav.module.css';

const AdminNav = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      path: '/admin',
      icon: 'home',
      label: 'Dashboard',
      description: 'Manage restaurants'
    },
    {
      path: '/profile',
      icon: 'profile',
      label: 'Profile',
      description: 'Your account'
    }
  ];

  return (
    <nav
      className={styles.adminNav}
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className={styles.navContainer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {currentUser?.full_name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{currentUser?.full_name || 'Admin'}</span>
            <span className={styles.userRole}>Administrator</span>
          </div>
        </div>

        <div className={styles.navItems}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              aria-label={item.label}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              <div className={styles.iconWrapper}>
                <Icon name={item.icon} width={24} height={24} aria-hidden="true" />
              </div>
              <div className={styles.itemContent}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemDescription}>{item.description}</span>
              </div>
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          aria-label="Logout"
        >
          <Icon name="logout" width={24} height={24} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;
