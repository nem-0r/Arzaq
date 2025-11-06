// src/components/features/Auth/LoginForm/LoginForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  // Submit handler
  const onSubmit = async (formValues) => {
    try {
      await login(formValues.email, formValues.password);
      alert(t('alert_login_success'));
      navigate('/');
    } catch (error) {
      if (error.message === 'error_email_notfound') {
        setFieldError('email', t('error_email_notfound'));
      } else if (error.message === 'error_password_incorrect') {
        setFieldError('password', t('error_password_incorrect'));
      } else {
        alert(t('error_network') || 'An error occurred');
      }
    }
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
    </form>
  );
};

export default LoginForm;