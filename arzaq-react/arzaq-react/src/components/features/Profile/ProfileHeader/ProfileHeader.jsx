// src/components/features/Profile/ProfileHeader/ProfileHeader.jsx
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import styles from './ProfileHeader.module.css';

const ProfileHeader = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileAvatar}>👤</div>
      <h2>{user ? user.fullName : t('profile_guest_name')}</h2>
      <p>{user ? user.email : t('profile_guest_email')}</p>
    </div>
  );
};

export default ProfileHeader;