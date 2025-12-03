// src/components/features/Auth/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import GoogleAuthButton from '../GoogleAuthButton/GoogleAuthButton';
import AuthDivider from '../AuthDivider/AuthDivider';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const { login, loginWithGoogle, currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState(null);

  // Validation rules
  const validationRules = {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 6
    }
  };

  // Form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError
  } = useFormValidation(
    {
      email: '',
      password: '',
      remember: false
    },
    validationRules
  );

  // Custom handler for checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    handleChange({ target: { name, value: checked } });
  };

  // Helper function for role-based redirection
  const redirectByRole = (userData) => {
    const userRole = userData?.role || 'client';

    switch (userRole) {
      case 'restaurant':
        navigate('/restaurant-dashboard');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'client':
      default:
        navigate('/');
        break;
    }
  };

  // Submit handler with role-based redirection
  const onSubmit = async (formValues) => {
    try {
      await login(formValues.email, formValues.password);

      // Wait a moment for currentUser to be updated in context
      setTimeout(() => {
        // Get user data from localStorage (it's set in AuthContext after login)
        const userData = JSON.parse(localStorage.getItem('currentUser'));

        alert(t('alert_login_success'));

        redirectByRole(userData);
      }, 100);

    } catch (error) {
      // Обрабатываем ошибки от бэкенда
      if (error.message === 'error_login_failed') {
        // Бэкенд возвращает общую ошибку для безопасности
        setFieldError('password', t('error_password_incorrect') || 'Incorrect email or password');
      } else if (error.status === 0) {
        // Сетевая ошибка
        alert(t('error_network') || 'Network error. Please check your connection.');
      } else {
        // Другие ошибки
        alert(error.message || t('error_network') || 'An error occurred');
      }
    }
  };

  // Google login handler
  const handleGoogleSuccess = async (googleToken) => {
    setGoogleError(null);
    try {
      await loginWithGoogle(googleToken);

      // Wait a moment for currentUser to be updated
      setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        alert('Успешный вход через Google!');
        redirectByRole(userData);
      }, 100);
    } catch (error) {
      if (error.message === 'error_google_user_not_found') {
        setGoogleError('Аккаунт не найден. Пожалуйста, зарегистрируйтесь.');
      } else {
        setGoogleError('Ошибка входа через Google. Попробуйте снова.');
      }
    }
  };

  // Google error handler
  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
    setGoogleError('Ошибка подключения к Google. Попробуйте снова.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <div className={styles.formGroup}>
        <label htmlFor="email">{t('login_email_label')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('login_email_placeholder')}
          disabled={isSubmitting}
          autoComplete="email"
          className={touched.email && errors.email ? styles.inputError : ''}
        />
        {touched.email && errors.email && (
          <span className={styles.errorMessage}>{errors.email}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">{t('login_password_label')}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('login_password_placeholder')}
          disabled={isSubmitting}
          autoComplete="current-password"
          className={touched.password && errors.password ? styles.inputError : ''}
        />
        {touched.password && errors.password && (
          <span className={styles.errorMessage}>{errors.password}</span>
        )}
      </div>

      <div className={styles.formOptions}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="remember"
            checked={values.remember}
            onChange={handleCheckboxChange}
            disabled={isSubmitting}
          />
          <span>{t('login_remember')}</span>
        </label>
        <button
          type="button"
          className={styles.forgotLink}
          onClick={() => alert('Password reset feature coming soon!')}
        >
          {t('login_forgot')}
        </button>
      </div>

      <button
        type="submit"
        className={styles.btnPrimary}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading...' : t('login_button')}
      </button>

      <AuthDivider />

      <GoogleAuthButton
        onError={handleGoogleError}
        buttonText="Войти через Google"
        mode="login"
      />

      {googleError && (
        <div className={styles.errorMessage} style={{ textAlign: 'center', marginTop: '10px' }}>
          {googleError}
        </div>
      )}
    </form>
  );
};

export default LoginForm;