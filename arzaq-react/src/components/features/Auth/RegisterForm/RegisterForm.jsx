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
    },
    address: {
      required: false, // Only required for restaurant role, checked manually
      minLength: 5,
      maxLength: 255
    },
    phone: {
      required: false,
      minLength: 10
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
      role: 'client', // Default role
      address: '',
      phone: ''
    },
    validationRules
  );

  // Update confirm password validation rule dynamically
  validationRules.confirmPassword.matches.value = values.password;

  // Submit handler
  const onSubmit = async (formValues) => {
    // Validate address for restaurant role
    if (formValues.role === 'restaurant' && !formValues.address.trim()) {
      setFieldError('address', 'Address is required for restaurants');
      return;
    }

    try {
      const registrationData = {
        fullName: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role
      };

      // Add restaurant-specific fields
      if (formValues.role === 'restaurant') {
        registrationData.address = formValues.address.trim();
        if (formValues.phone.trim()) {
          registrationData.phone = formValues.phone.trim();
        }
      }

      await register(registrationData);
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
  const handleGoogleClick = () => {
    // Store the selected role before Google OAuth redirect
    // This will be used after Supabase redirects back
    const { setRegistrationRole } = useAuth();
    setRegistrationRole(values.role || 'client');

    // For restaurant role, also store address if provided
    if (values.role === 'restaurant' && values.address) {
      localStorage.setItem('pending_restaurant_address', values.address);
      if (values.phone) {
        localStorage.setItem('pending_restaurant_phone', values.phone);
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

      {/* Restaurant-specific fields */}
      {values.role === 'restaurant' && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="address">Restaurant Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your restaurant address"
              disabled={isSubmitting}
              className={touched.address && errors.address ? styles.inputError : ''}
            />
            {touched.address && errors.address && (
              <span className={styles.errorMessage}>{errors.address}</span>
            )}
            <small style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
              This will be used to show your restaurant on the map
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+7 (XXX) XXX-XX-XX"
              disabled={isSubmitting}
              className={touched.phone && errors.phone ? styles.inputError : ''}
            />
            {touched.phone && errors.phone && (
              <span className={styles.errorMessage}>{errors.phone}</span>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        className={styles.btnPrimary}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading...' : t('register_button')}
      </button>

      {/* Google OAuth - only for clients */}
      {values.role === 'client' && (
        <>
          <AuthDivider />
          <GoogleAuthButton
            onBeforeAuth={handleGoogleClick}
            onError={handleGoogleError}
            buttonText="Зарегистрироваться через Google"
            mode="register"
            role="client"
          />
        </>
      )}

      {/* Restaurant info message */}
      {values.role === 'restaurant' && (
        <div className={styles.infoBox} style={{
          marginTop: '20px',
          padding: '12px 16px',
          backgroundColor: '#FFF3CD',
          border: '1px solid #FFC107',
          borderRadius: '8px',
          color: '#856404',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <strong>ℹ️ Для ресторанов:</strong> Регистрация через Google недоступна.
          Пожалуйста, зарегистрируйтесь через email с указанием юридической информации о вашем ресторане.
        </div>
      )}

      {googleError && (
        <div className={styles.errorMessage} style={{ textAlign: 'center', marginTop: '10px' }}>
          {googleError}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;