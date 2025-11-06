// src/components/common/LoginPrompt/LoginPrompt.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPrompt.module.css';

const LoginPrompt = ({ message, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
  };

  const handleRegister = () => {
    navigate('/register', { state: { from: window.location.pathname } });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className={styles.icon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9.243 2 7 4.243 7 7V10C6.447 10 6 10.447 6 11V19C6 20.103 6.897 21 8 21H16C17.103 21 18 20.103 18 19V11C18 10.447 17.553 10 17 10V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7Z" fill="var(--primary-green)"/>
          </svg>
        </div>

        <h2 className={styles.title}>Authentication Required</h2>
        <p className={styles.message}>
          {message || 'You need to be logged in to create a post. Please login or create an account to continue.'}
        </p>

        <div className={styles.actions}>
          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>
          <button className={styles.registerBtn} onClick={handleRegister}>
            Create Account
          </button>
        </div>

        <button className={styles.cancelBtn} onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
