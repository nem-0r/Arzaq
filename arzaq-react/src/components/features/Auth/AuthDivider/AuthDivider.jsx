import React from 'react';
import styles from './AuthDivider.module.css';

const AuthDivider = ({ text = 'ИЛИ' }) => {
  return (
    <div className={styles.divider}>
      <span className={styles.line}></span>
      <span className={styles.text}>{text}</span>
      <span className={styles.line}></span>
    </div>
  );
};

export default AuthDivider;
