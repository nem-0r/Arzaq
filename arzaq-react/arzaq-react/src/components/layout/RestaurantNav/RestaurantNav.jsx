// src/components/layout/RestaurantNav/RestaurantNav.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Icon from '../../common/Icon/Icon';
import styles from './RestaurantNav.module.css';

const RestaurantNav = () => {
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
      path: '/restaurant-dashboard',
      icon: 'home',
      label: 'Dashboard',
      description: 'Manage your menu'
    },
    {
      path: '/profile',
      icon: 'profile',
      label: 'Profile',
      description: 'Restaurant info'
    }
  ];

  const approvalStatus = currentUser?.is_approved ? 'Approved' : 'Pending Approval';
  const isApproved = currentUser?.is_approved;

  return (
    <nav
      className={styles.restaurantNav}
      role="navigation"
      aria-label="Restaurant navigation"
    >
      <div className={styles.navContainer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {currentUser?.full_name?.charAt(0).toUpperCase() || 'R'}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{currentUser?.full_name || 'Restaurant'}</span>
            <span className={`${styles.userRole} ${isApproved ? styles.approved : styles.pending}`}>
              {approvalStatus}
            </span>
          </div>
        </div>

        {!isApproved && (
          <div className={styles.pendingNotice}>
            <Icon name="clock" width={20} height={20} />
            <div className={styles.noticeContent}>
              <strong>Awaiting Approval</strong>
              <p>Your restaurant is under review. You'll be notified once approved.</p>
            </div>
          </div>
        )}

        <div className={styles.navItems}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''} ${!isApproved ? styles.disabled : ''}`
              }
              aria-label={item.label}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
              onClick={(e) => {
                if (!isApproved && item.path === '/restaurant-dashboard') {
                  e.preventDefault();
                }
              }}
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

export default RestaurantNav;
