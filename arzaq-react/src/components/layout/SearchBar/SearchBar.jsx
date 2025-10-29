// src/components/layout/SearchBar/SearchBar.jsx
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Icon from '../../common/Icon/Icon';
import styles from './SearchBar.module.css';

const SearchBar = ({ showFilter = false }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <Icon name="search" className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('search_placeholder')}
        />
        {showFilter && (
          <button className={styles.filterBtn} aria-label="Filter">
            <Icon name="filter" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;