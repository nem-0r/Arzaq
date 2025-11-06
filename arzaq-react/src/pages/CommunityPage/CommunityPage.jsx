// src/pages/CommunityPage/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { IoDocumentTextOutline } from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import PostCard from '../../components/features/Community/PostCard/PostCard';
import CreatePostButton from '../../components/features/Community/CreatePostButton/CreatePostButton';
import CreatePostModal from '../../components/features/Community/CreatePostModal/CreatePostModal';
import LoginPrompt from '../../components/common/LoginPrompt/LoginPrompt';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { COMMUNITY_POSTS } from '../../utils/constants';
import styles from './CommunityPage.module.css';

const CommunityPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      // Load posts from API
      const response = await api.posts.getAll();

      if (response.success && response.posts.length > 0) {
        // Use posts from localStorage/API
        setPosts(response.posts);
      } else {
        // Fallback to default posts if no posts exist
        setPosts(COMMUNITY_POSTS);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to default posts on error
      setPosts(COMMUNITY_POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePostClick = () => {
    if (isAuthenticated) {
      setIsCreateModalOpen(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handlePostCreated = (newPost) => {
    // Add new post to the top of the feed
    setPosts([newPost, ...posts]);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <h2 className={styles.title}>Community Feed</h2>

        {/* Create Post Button */}
        <CreatePostButton onClick={handleCreatePostClick} />

        {/* Posts Feed */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <IoDocumentTextOutline className={styles.emptyIcon} size={64} />
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        )}
      </main>

      <BottomNav />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onPostCreated={handlePostCreated}
      />

      {showLoginPrompt && (
        <LoginPrompt
          message="You need to be logged in to create a post. Join our community today!"
          onClose={handleCloseLoginPrompt}
        />
      )}
    </div>
  );
};

export default CommunityPage;
