// src/components/common/SkipLink/SkipLink.jsx
import React from 'react';
import styles from './SkipLink.module.css';

/**
 * SkipLink Component - Accessibility feature for keyboard navigation
 *
 * Allows keyboard users to skip directly to main content,
 * bypassing navigation and other repeated elements.
 *
 * WCAG 2.1 Success Criterion 2.4.1 (Level A) - Bypass Blocks
 *
 * @param {string} targetId - ID of the main content element to skip to
 * @param {string} label - Text to display in the skip link
 */
const SkipLink = ({ targetId = 'main-content', label = 'Skip to main content' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);

    if (target) {
      // Set focus to the target element
      target.setAttribute('tabindex', '-1');
      target.focus();

      // Scroll to the target
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Remove tabindex after focus (to prevent future tab stops)
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      className={styles.skipLink}
      onClick={handleClick}
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default SkipLink;
