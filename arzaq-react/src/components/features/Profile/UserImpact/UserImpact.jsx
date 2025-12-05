// src/components/features/Profile/UserImpact/UserImpact.jsx
import React, { useEffect, useState } from 'react';
import { IoEarth, IoTrophy, IoInformationCircleOutline } from 'react-icons/io5';
import { impactService } from '../../../../api/services';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './UserImpact.module.css';

/**
 * UserImpact Component
 *
 * Displays user's environmental impact statistics including:
 * - Meals rescued (saved from waste)
 * - CO2 saved through food rescue
 * - Achievement badges based on milestones
 *
 * @param {Object} props
 * @param {Object} props.stats - User impact statistics
 * @param {number} props.stats.mealsRescued - Total meals saved this month
 * @param {number} props.stats.co2Saved - CO2 saved in kg this month
 * @param {number} props.stats.mealsGoal - Monthly goal for meals (default: 30)
 * @param {number} props.stats.co2Goal - Monthly goal for CO2 in kg (default: 10)
 * @param {Array} props.stats.badges - Array of earned badges
 */
const UserImpact = ({ stats }) => {
  const { isAuthenticated } = useAuth();
  const [impactData, setImpactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load impact data from API
  useEffect(() => {
    const loadImpactData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await impactService.getMyImpact();

        // Transform API data to component format
        const transformedData = {
          mealsRescued: data.meals_rescued || 0,
          co2Saved: data.co2_saved || 0,
          mealsGoal: data.meals_goal || 30,
          co2Goal: data.co2_goal || 10,
          badges: [], // TODO: Add badges logic later
        };

        setImpactData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to load impact data:', err);
        setError('Failed to load your impact statistics');

        // Fallback to default data on error
        setImpactData({
          mealsRescued: 0,
          co2Saved: 0,
          mealsGoal: 30,
          co2Goal: 10,
          badges: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadImpactData();
  }, [isAuthenticated]);

  // Use prop stats if provided, otherwise use loaded data
  const finalImpactData = stats || impactData;

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.impactContainer}>
        <div className={styles.loading}>Loading your impact...</div>
      </div>
    );
  }

  // If not authenticated, show default message
  if (!isAuthenticated) {
    return (
      <div className={styles.impactContainer}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <IoEarth className={styles.icon} size={48} />
          </div>
          <h2 className={styles.title}>Your Impact</h2>
          <p className={styles.subtitle}>Log in to see your environmental impact</p>
        </div>
      </div>
    );
  }

  // If no data loaded, don't render
  if (!finalImpactData) {
    return null;
  }

  // Calculate progress percentages
  const mealsProgress = Math.min((finalImpactData.mealsRescued / finalImpactData.mealsGoal) * 100, 100);
  const co2Progress = Math.min((finalImpactData.co2Saved / finalImpactData.co2Goal) * 100, 100);

  // Get earned badges
  const earnedBadges = finalImpactData.badges?.filter(badge => badge.earned) || [];

  return (
    <div className={styles.impactContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <IoEarth className={styles.icon} size={48} />
        </div>
        <h2 className={styles.title}>Your Impact This Month</h2>
        <p className={styles.subtitle}>Every meal saved makes a difference</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Meals Rescued */}
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--primary-green-dark)' }}>
            {finalImpactData.mealsRescued}
          </div>
          <div className={styles.statLabel}>Meals Rescued</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${mealsProgress}%`,
                backgroundColor: 'var(--primary-green)'
              }}
            />
          </div>
          <div className={styles.goalText}>
            Goal: {finalImpactData.mealsGoal} meals
          </div>
        </div>

        {/* CO2 Saved */}
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--accent-orange)' }}>
            {finalImpactData.co2Saved.toFixed(1)}kg
          </div>
          <div className={styles.statLabel}>CO2 Saved</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${co2Progress}%`,
                backgroundColor: 'var(--accent-orange)'
              }}
            />
          </div>
          <div className={styles.goalText}>
            Goal: {finalImpactData.co2Goal}kg
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <div className={styles.badgesSection}>
          {earnedBadges.map((badge) => (
            <div key={badge.id} className={styles.badgeCard}>
              <IoTrophy className={styles.badgeIcon} size={32} />
              <div className={styles.badgeInfo}>
                <div className={styles.badgeName}>{badge.name}</div>
                <div className={styles.badgeDescription}>{badge.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Footer */}
      <div className={styles.infoFooter}>
        <IoInformationCircleOutline className={styles.infoIcon} size={20} />
        <span className={styles.infoText}>
          Statistics are updated based on your completed orders
        </span>
      </div>
    </div>
  );
};

export default UserImpact;
