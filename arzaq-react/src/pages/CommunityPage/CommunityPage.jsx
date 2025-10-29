// src/pages/CommunityPage/CommunityPage.jsx
import React from 'react';
import Header from '../../components/layout/Header/Header';
import SearchBar from '../../components/layout/SearchBar/SearchBar';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import PostCard from '../../components/features/Community/PostCard/PostCard';
import { COMMUNITY_POSTS } from '../../utils/constants';
import styles from './CommunityPage.module.css';

const CommunityPage = () => {
  return (
    <div className="page-container">
      <Header />
      <SearchBar />

      <main className="main-content">
        <h2 className={styles.title}>Community Feed</h2>

        <div className={styles.postsContainer}>
          {COMMUNITY_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CommunityPage;
