// src/components/features/Auth/RegisterForm/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import GoogleAuthButton from '../GoogleAuthButton/GoogleAuthButton';
import AuthDivider from '../AuthDivider/AuthDivider';
import styles from '../LoginForm/LoginForm.module.css'; // Reuse same styles

const RegisterForm = () => {
  const { register, registerWithGoogle } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState(null);

  // Validation rules
  const validationRules = {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      password: true // Uses strong password validation
    },
    confirmPassword: {
      required: true,
      matches: {
        value: '', // Will be set dynamically
        message: 'Passwords do not match'
      }
    },
    role: {
      required: true
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
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'client' // Default role
    },
    validationRules
  );

  // Update confirm password validation rule dynamically
  validationRules.confirmPassword.matches.value = values.password;

  // Submit handler
  const onSubmit = async (formValues) => {
    try {
      await register({
        fullName: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role
      });
      alert(t('alert_register_success'));
      navigate('/login');
    } catch (error) {
      // Обрабатываем ошибки от бэкенда
      if (error.message === 'error_email_exists') {
        setFieldError('email', t('error_email_exists') || 'User with this email already exists');
      } else if (error.status === 0) {
        // Сетевая ошибка
        alert(t('error_network') || 'Network error. Please check your connection.');
      } else {
        // Другие ошибки
        alert(error.message || t('error_network') || 'An error occurred');
      }
    }
  };

  // Google register handler
  const handleGoogleSuccess = async (googleToken) => {
    setGoogleError(null);
    try {
      // Use the selected role from the form
      await registerWithGoogle(googleToken, values.role || 'client');

      alert('Успешная регистрация через Google!');
      navigate('/');
    } catch (error) {
      if (error.message === 'error_google_user_exists') {
        setGoogleError('Этот аккаунт Google уже зарегистрирован. Попробуйте войти.');
      } else {
        setGoogleError('Ошибка регистрации через Google. Попробуйте снова.');
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
        <label htmlFor="role">{'I am a'}</label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          className={touched.role && errors.role ? styles.inputError : ''}
        >
          <option value="client">{t('Client') || 'Client - I want to rescue food'}</option>
          <option value="restaurant">{t('Restaurant') || 'Restaurant - I want to reduce food waste'}</option>
        </select>
        {touched.role && errors.role && (
          <span className={styles.errorMessage}>{errors.role}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fullName">{t('register_fullname_label')}</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('register_fullname_placeholder')}
          disabled={isSubmitting}
          className={touched.fullName && errors.fullName ? styles.inputError : ''}
        />
        {touched.fullName && errors.fullName && (
          <span className={styles.errorMessage}>{errors.fullName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">{t('register_email_label')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('register_email_placeholder')}
          disabled={isSubmitting}
          className={touched.email && errors.email ? styles.inputError : ''}
        />
        {touched.email && errors.email && (
          <span className={styles.errorMessage}>{errors.email}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">{t('register_password_label')}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('register_password_placeholder')}
          disabled={isSubmitting}
          className={touched.password && errors.password ? styles.inputError : ''}
        />
        {touched.password && errors.password && (
          <span className={styles.errorMessage}>{errors.password}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">{t('register_confirm_label')}</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('register_confirm_placeholder')}
          disabled={isSubmitting}
          className={touched.confirmPassword && errors.confirmPassword ? styles.inputError : ''}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className={styles.errorMessage}>{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className={styles.btnPrimary}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading...' : t('register_button')}
      </button>

      <AuthDivider />

      <GoogleAuthButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        buttonText="Зарегистрироваться через Google"
        mode="register"
      />

      {googleError && (
        <div className={styles.errorMessage} style={{ textAlign: 'center', marginTop: '10px' }}>
          {googleError}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;