// src/components/features/Profile/UserImpact/UserImpact.jsx
import React from 'react';
import { IoEarth, IoTrophy, IoInformationCircleOutline } from 'react-icons/io5';
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
  // Default demo data - ready for backend integration
  const defaultStats = {
    mealsRescued: 23,
    co2Saved: 4.2,
    mealsGoal: 30,
    co2Goal: 10,
    badges: [
      {
        id: 1,
        name: 'Eco Warrior Badge',
        description: 'Earned for saving 20+ meals',
        earned: true
      }
    ]
  };

  const impactData = stats || defaultStats;

  // Calculate progress percentages
  const mealsProgress = Math.min((impactData.mealsRescued / impactData.mealsGoal) * 100, 100);
  const co2Progress = Math.min((impactData.co2Saved / impactData.co2Goal) * 100, 100);

  // Get earned badges
  const earnedBadges = impactData.badges?.filter(badge => badge.earned) || [];

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
            {impactData.mealsRescued}
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
            Goal: {impactData.mealsGoal} meals
          </div>
        </div>

        {/* CO2 Saved */}
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--accent-orange)' }}>
            {impactData.co2Saved}kg
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
            Goal: {impactData.co2Goal}kg
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
