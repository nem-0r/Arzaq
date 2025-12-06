// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import { restaurantProfileService } from '../../api/services';
import { IoCheckmarkCircle, IoCloseCircle, IoRestaurant } from 'react-icons/io5';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPendingProfiles();
  }, []);

  const loadPendingProfiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await restaurantProfileService.getPendingProfiles();
      setPendingProfiles(data);
    } catch (err) {
      setError('Failed to load pending restaurant profiles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (profileId) => {
    if (!window.confirm('Are you sure you want to approve this restaurant profile?')) {
      return;
    }

    try {
      await restaurantProfileService.approveProfile(profileId);
      alert('Restaurant profile approved successfully!');
      loadPendingProfiles();
    } catch (err) {
      alert('Failed to approve restaurant profile');
      console.error(err);
    }
  };

  const handleReject = async (profileId) => {
    const reason = window.prompt(
      'Please provide a detailed reason for rejection (minimum 10 characters):'
    );

    if (!reason) return;

    if (reason.trim().length < 10) {
      alert('Rejection reason must be at least 10 characters');
      return;
    }

    try {
      await restaurantProfileService.rejectProfile(profileId, reason);
      alert('Restaurant profile rejected');
      loadPendingProfiles();
    } catch (err) {
      alert('Failed to reject restaurant profile');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Review and approve restaurant applications</p>
          </div>

          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading pending applications...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={loadPendingProfiles} className={styles.retryBtn}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && pendingProfiles.length === 0 && (
            <div className={styles.emptyState}>
              <IoRestaurant className={styles.emptyIcon} />
              <h3>No Pending Applications</h3>
              <p>There are no restaurant profiles awaiting approval at this time.</p>
            </div>
          )}

          <div className={styles.profilesList}>
            {pendingProfiles.map((profile) => (
              <div key={profile.id} className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileTitleSection}>
                    <h3 className={styles.profileName}>{profile.name}</h3>
                    <span className={styles.profileBadge}>Pending</span>
                  </div>
                  <div className={styles.profileDate}>
                    Submitted: {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className={styles.profileInfo}>
                  <div className={styles.infoRow}>
                    <strong>Address:</strong>
                    <span>{profile.address}</span>
                  </div>

                  {profile.phone && (
                    <div className={styles.infoRow}>
                      <strong>Phone:</strong>
                      <span>{profile.phone}</span>
                    </div>
                  )}

                  {profile.user_email && (
                    <div className={styles.infoRow}>
                      <strong>Email:</strong>
                      <span>{profile.user_email}</span>
                    </div>
                  )}

                  {profile.user_full_name && (
                    <div className={styles.infoRow}>
                      <strong>Owner:</strong>
                      <span>{profile.user_full_name}</span>
                    </div>
                  )}

                  {profile.description && (
                    <div className={styles.infoRow}>
                      <strong>Description:</strong>
                      <p className={styles.description}>{profile.description}</p>
                    </div>
                  )}

                  {profile.latitude && profile.longitude && (
                    <div className={styles.infoRow}>
                      <strong>Location:</strong>
                      <span>
                        {profile.latitude.toFixed(6)}, {profile.longitude.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(profile.id)}
                  >
                    <IoCheckmarkCircle /> Approve
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(profile.id)}
                  >
                    <IoCloseCircle /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminDashboard;
