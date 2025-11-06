// src/components/features/Auth/RegisterForm/RegisterForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import styles from '../LoginForm/LoginForm.module.css'; // Reuse same styles

const RegisterForm = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      confirmPassword: ''
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
        password: formValues.password
      });
      alert(t('alert_register_success'));
      navigate('/login');
    } catch (error) {
      if (error.message === 'error_email_exists') {
        setFieldError('email', t('error_email_exists'));
      } else {
        alert(t('error_network') || 'An error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
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
    </form>
  );
};

export default RegisterForm;

// src/pages/RegisterPage/RegisterPage.module.css can be empty 
// (it reuses LoginPage styles)