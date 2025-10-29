// src/components/features/Auth/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from '../../../../hooks/useTranslation';
import { validateEmail, validatePassword } from '../../../../utils/validation';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      alert(t('alert_login_success'));
      navigate('/');
    } catch (error) {
      if (error.message === 'error_email_notfound') {
        setErrors({ email: t('error_email_notfound') });
      } else if (error.message === 'error_password_incorrect') {
        setErrors({ password: t('error_password_incorrect') });
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
        <label htmlFor="email">{t('login_email_label')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('login_email_placeholder')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{t(errors.email)}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">{t('login_password_label')}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t('login_password_placeholder')}
          disabled={isSubmitting}
        />
        {errors.password && (
          <span className={styles.errorMessage}>{t(errors.password)}</span>
        )}
      </div>

      <div className={styles.formOptions}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <span>{t('login_remember')}</span>
        </label>
        <a href="#" className={styles.forgotLink}>
          {t('login_forgot')}
        </a>
      </div>

      <button
        type="submit"
        className={styles.btnPrimary}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading...' : t('login_button')}
      </button>
    </form>
  );
};

export default LoginForm;