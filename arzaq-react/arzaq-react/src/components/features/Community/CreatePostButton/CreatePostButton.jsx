// src/components/features/Community/CreatePostButton/CreatePostButton.jsx
import React from 'react';
import styles from './CreatePostButton.module.css';

const CreatePostButton = ({ onClick }) => {
  return (
    <button className={styles.createButton} onClick={onClick}>
      <svg
        className={styles.icon}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19M5 12H19"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.text}>Create Post</span>
    </button>
  );
};

export default CreatePostButton;
