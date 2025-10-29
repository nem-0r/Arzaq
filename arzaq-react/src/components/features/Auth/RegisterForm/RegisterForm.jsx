// src/components/features/Auth/RegisterForm/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from '../../../../utils/validation';
import styles from '../LoginForm/LoginForm.module.css'; // Reuse same styles

const RegisterForm = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate all fields
    const nameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        fullName: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      alert(t('alert_register_success'));
      navigate('/login');
    } catch (error) {
      if (error.message === 'error_email_exists') {
        setErrors({ email: t('error_email_exists') });
      } else {
        alert(t('error_network') || 'An error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <div className={styles.formGroup}>
        <label htmlFor="fullName">{t('register_fullname_label')}</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder={t('register_fullname_placeholder')}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <span className={styles.errorMessage}>{t(errors.fullName)}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">{t('register_email_label')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('register_email_placeholder')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{t(errors.email)}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">{t('register_password_label')}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t('register_password_placeholder')}
          disabled={isSubmitting}
        />
        {errors.password && (
          <span className={styles.errorMessage}>{t(errors.password)}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">{t('register_confirm_label')}</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={t('register_confirm_placeholder')}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <span className={styles.errorMessage}>
            {t(errors.confirmPassword)}
          </span>
        )}
      </div>

      <button
        type="submit"
        className={styles.btnPrimary}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading...' : t('register_button')}
      </button>
    </form>
  );
};

export default RegisterForm;

// src/pages/RegisterPage/RegisterPage.module.css can be empty 
// (it reuses LoginPage styles)