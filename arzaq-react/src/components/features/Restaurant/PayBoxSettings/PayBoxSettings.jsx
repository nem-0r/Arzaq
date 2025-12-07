// src/components/features/Restaurant/PayBoxSettings/PayBoxSettings.jsx
import React, { useState } from 'react';
import { restaurantProfileService } from '../../../../api/services';
import { IoWallet, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle } from 'react-icons/io5';
import styles from './PayBoxSettings.module.css';

const PayBoxSettings = ({ currentProfile, onUpdate }) => {
  const [formData, setFormData] = useState({
    paybox_merchant_id: currentProfile?.paybox_merchant_id || '',
    paybox_secret_key: currentProfile?.paybox_secret_key || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const hasCustomCredentials = currentProfile?.paybox_merchant_id && currentProfile?.paybox_secret_key;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSend = {};

      // Only send if values are non-empty
      if (formData.paybox_merchant_id.trim()) {
        dataToSend.paybox_merchant_id = formData.paybox_merchant_id.trim();
      }
      if (formData.paybox_secret_key.trim()) {
        dataToSend.paybox_secret_key = formData.paybox_secret_key.trim();
      }

      const updatedProfile = await restaurantProfileService.updateMyProfile(dataToSend);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (onUpdate) {
        onUpdate(updatedProfile);
      }
    } catch (err) {
      console.error('Failed to update PayBox settings:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to update PayBox settings. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to remove your custom PayBox credentials? You will use the default test credentials.')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedProfile = await restaurantProfileService.updateMyProfile({
        paybox_merchant_id: null,
        paybox_secret_key: null
      });

      setFormData({
        paybox_merchant_id: '',
        paybox_secret_key: ''
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (onUpdate) {
        onUpdate(updatedProfile);
      }
    } catch (err) {
      console.error('Failed to clear PayBox settings:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to clear PayBox settings.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <IoWallet size={28} />
        </div>
        <div>
          <h2 className={styles.title}>PayBox Payment Settings</h2>
          <p className={styles.subtitle}>
            Configure your PayBox merchant credentials to receive payments directly
          </p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className={styles.successBanner}>
          <IoCheckmarkCircle size={24} />
          <span>PayBox settings updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorBanner}>
          <IoAlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Current Status */}
      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <IoInformationCircle size={20} />
          <span>Current Status</span>
        </div>
        <div className={styles.statusContent}>
          {hasCustomCredentials ? (
            <>
              <div className={styles.statusBadge} style={{ background: '#dcfce7', color: '#166534' }}>
                <IoCheckmarkCircle size={16} />
                <span>Using Custom Credentials</span>
              </div>
              <p className={styles.statusText}>
                Payments from your customers will be sent directly to your PayBox merchant account.
              </p>
            </>
          ) : (
            <>
              <div className={styles.statusBadge} style={{ background: '#fef3c7', color: '#78350f' }}>
                <IoInformationCircle size={16} />
                <span>Using Default Test Credentials</span>
              </div>
              <p className={styles.statusText}>
                You are currently using the platform's default test PayBox credentials.
                Add your own credentials to receive payments directly.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <h3>How to get PayBox credentials:</h3>
        <ol>
          <li>Register at <a href="https://paybox.money" target="_blank" rel="noopener noreferrer">paybox.money</a></li>
          <li>Complete merchant verification</li>
          <li>Get your Merchant ID and Secret Key from PayBox dashboard</li>
          <li>Enter them below to start receiving payments</li>
        </ol>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            PayBox Merchant ID
            <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your PayBox Merchant ID"
            value={formData.paybox_merchant_id}
            onChange={(e) => setFormData({ ...formData, paybox_merchant_id: e.target.value })}
            disabled={isSubmitting}
          />
          <p className={styles.hint}>
            Your unique merchant identifier from PayBox
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            PayBox Secret Key
            <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="password"
            className={styles.input}
            placeholder="Enter your PayBox Secret Key"
            value={formData.paybox_secret_key}
            onChange={(e) => setFormData({ ...formData, paybox_secret_key: e.target.value })}
            disabled={isSubmitting}
          />
          <p className={styles.hint}>
            Your secret key for payment verification (keep this secure!)
          </p>
        </div>

        <div className={styles.actions}>
          {hasCustomCredentials && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              disabled={isSubmitting}
            >
              Remove Custom Credentials
            </button>
          )}
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={isSubmitting || (!formData.paybox_merchant_id.trim() && !formData.paybox_secret_key.trim())}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Saving...
              </>
            ) : (
              <>
                <IoCheckmarkCircle size={20} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className={styles.securityNotice}>
        <IoAlertCircle size={20} />
        <div>
          <strong>Security Notice:</strong> Your PayBox credentials are encrypted and stored securely.
          Never share your secret key with anyone.
        </div>
      </div>
    </div>
  );
};

export default PayBoxSettings;
