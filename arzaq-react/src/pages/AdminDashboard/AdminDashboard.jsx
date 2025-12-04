// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import AdminNav from '../../components/layout/AdminNav/AdminNav';
import { restaurantService } from '../../api/services';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load pending restaurants
  useEffect(() => {
    loadPendingRestaurants();
  }, []);

  const loadPendingRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await restaurantService.getPendingRestaurants();
      setPendingRestaurants(data);
    } catch (err) {
      setError('Failed to load pending restaurants');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to approve this restaurant?')) {
      return;
    }

    try {
      await restaurantService.approveRestaurant(restaurantId);
      alert('Restaurant approved successfully!');
      loadPendingRestaurants();
    } catch (err) {
      alert('Failed to approve restaurant');
      console.error(err);
    }
  };

  const handleReject = async (restaurantId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await restaurantService.rejectRestaurant(restaurantId, reason);
      alert('Restaurant rejected');
      loadPendingRestaurants();
    } catch (err) {
      alert('Failed to reject restaurant');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <AdminNav />

      <main id="main-content" className={`${styles.mainContent} main-content`}>
        <div className={styles.dashboardContainer}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Review and approve restaurant applications</p>

          {isLoading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {!isLoading && pendingRestaurants.length === 0 && (
            <div className={styles.emptyState}>
              <p>No pending restaurants to review</p>
            </div>
          )}

          <div className={styles.restaurantsList}>
            {pendingRestaurants.map((restaurant) => (
              <div key={restaurant.id} className={styles.restaurantCard}>
                <div className={styles.restaurantInfo}>
                  <h3 className={styles.restaurantName}>{restaurant.full_name}</h3>
                  <p className={styles.restaurantAddress}>{restaurant.address}</p>
                  <p className={styles.restaurantPhone}>
                    <strong>Phone:</strong> {restaurant.phone || 'Not provided'}
                  </p>
                  <p className={styles.restaurantEmail}>
                    <strong>Email:</strong> {restaurant.email}
                  </p>
                  {restaurant.description && (
                    <p className={styles.restaurantDescription}>
                      {restaurant.description}
                    </p>
                  )}
                  <p className={styles.submittedAt}>
                    <strong>Submitted:</strong> {new Date(restaurant.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(restaurant.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(restaurant.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
