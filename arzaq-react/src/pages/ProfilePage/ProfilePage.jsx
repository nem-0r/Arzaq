// src/pages/ProfilePage/ProfilePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import ProfileHeader from '../../components/features/Profile/ProfileHeader/ProfileHeader';
import UserImpact from '../../components/features/Profile/UserImpact/UserImpact';
import ProfileMenu from '../../components/features/Profile/ProfileMenu/ProfileMenu';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm(t('alert_logout_confirm'))) {
      logout();
      navigate('/');
    }
  };

  // Role-specific dashboard items
  const getDashboardItems = () => {
    if (!isAuthenticated) return [];

    const items = [];

    if (currentUser?.role === 'admin') {
      items.push({
        label: 'Admin Dashboard',
        icon: 'chevronRight',
        onClick: () => navigate('/admin')
      });
    }

    if (currentUser?.role === 'restaurant') {
      items.push({
        label: 'Restaurant Dashboard',
        icon: 'chevronRight',
        onClick: () => navigate('/restaurant-dashboard')
      });
    }

    return items;
  };

  const accountItems = isAuthenticated
    ? [
        ...getDashboardItems(),
        {
          label: t('profile_logout'),
          icon: 'logout',
          onClick: handleLogout
        }
      ]
    : [
        {
          label: t('profile_login_register'),
          icon: 'chevronRight',
          onClick: () => navigate('/login')
        }
      ];

  const settingsItems = [
    { label: t('profile_notifications'), icon: 'chevronRight' },
    { label: t('profile_privacy'), icon: 'chevronRight' },
    { label: t('profile_language'), icon: 'chevronRight' }
  ];

  const aboutItems = [
    { label: t('profile_help'), icon: 'chevronRight' },
    { label: t('profile_terms'), icon: 'chevronRight' }
  ];

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className={`main-content ${styles.profileContent}`}>
        <ProfileHeader user={currentUser} />

        {/* User Impact Stats - Demo Version */}
        <UserImpact />

        <ProfileMenu
          title={t('profile_section_account')}
          items={accountItems}
        />

        <ProfileMenu
          title={t('profile_section_settings')}
          items={settingsItems}
        />

        <ProfileMenu
          title={t('profile_section_about')}
          items={aboutItems}
        />
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
