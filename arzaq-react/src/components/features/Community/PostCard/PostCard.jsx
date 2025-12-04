// src/components/features/Community/PostCard/PostCard.jsx
import React, { useState, useEffect } from 'react';
import {
  IoThumbsUpOutline,
  IoThumbsUp,
  IoChatbubbleOutline,
  IoPersonCircleOutline,
  IoLocationSharp,
  IoLeafOutline,
  IoTimeOutline
} from 'react-icons/io5';
import { useAuth } from '../../../../hooks/useAuth';
import api from '../../../../services/api';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  const { currentUser } = useAuth();
  const [isClaimed, setIsClaimed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  // Load likes and comments on mount
  useEffect(() => {
    loadLikes();
    loadComments();
  }, [post.id]);

  const loadLikes = async () => {
    try {
      const response = await api.likes.getLikes(post.id);
      if (response.success) {
        setLikesCount(response.likesCount);
        // Check if current user liked the post
        const userId = currentUser?.email || 'guest';
        setIsLiked(response.likes.includes(userId));
      }
    } catch (error) {
      console.error('Failed to load likes:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await api.comments.getComments(post.id);
      if (response.success) {
        setComments(response.comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const userId = currentUser?.email || 'guest';
      const response = await api.likes.toggleLike(post.id, userId);

      if (response.success) {
        setIsLiked(response.isLiked);
        setLikesCount(response.likesCount);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleClaim = () => {
    setIsClaimed(true);
    // TODO: Integrate with backend API
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async (commentText) => {
    try {
      const commentData = {
        text: commentText,
        author: currentUser?.fullName || currentUser?.email || 'Anonymous',
        userId: currentUser?.email || 'guest'
      };

      const response = await api.comments.create(post.id, commentData);

      if (response.success) {
        setComments([...comments, response.comment]);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.comments.delete(post.id, commentId);

      if (response.success) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <article className={styles.postCard}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <IoPersonCircleOutline size={40} />
        </div>
        <div className={styles.postInfo}>
          <h3>{post.author}</h3>
          <span className={styles.postTime}>{post.time}</span>
        </div>
      </div>

      {/* Food Image (if available) */}
      {post.image && (
        <div className={styles.postImage}>
          <img src={post.image} alt={post.title || 'Food item'} />
          {post.category && (
            <span className={styles.categoryBadge}>
              <IoLeafOutline size={14} />
              <span>{post.category}</span>
            </span>
          )}
        </div>
      )}

      {/* Post Content */}
      <div className={styles.postBody}>
        {post.title && <h4 className={styles.postTitle}>{post.title}</h4>}
        <p className={styles.postText}>{post.text}</p>

        {/* Pickup Details */}
        {post.pickupTime && (
          <div className={styles.pickupInfo}>
            <IoTimeOutline size={16} />
            <span>Pickup: {post.pickupTime}</span>
          </div>
        )}

        {post.location && (
          <div className={styles.postLocation}>
            <IoLocationSharp size={16} />
            <span>{post.location}</span>
          </div>
        )}
      </div>

      {/* Claim Button - Main CTA */}
      {!isClaimed ? (
        <button className={styles.claimBtn} onClick={handleClaim}>
          <IoLeafOutline size={20} />
          <span>Claim This Food</span>
        </button>
      ) : (
        <div className={styles.claimedBadge}>
          <IoLeafOutline size={20} />
          <span>Claimed! Check your messages</span>
        </div>
      )}

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Post Actions */}
      <div className={styles.postActions}>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          {isLiked ? <IoThumbsUp size={18} /> : <IoThumbsUpOutline size={18} />}
          <span>{likesCount > 0 ? `${likesCount} Like${likesCount > 1 ? 's' : ''}` : 'Like'}</span>
        </button>
        <button className={styles.actionBtn} onClick={handleToggleComments}>
          <IoChatbubbleOutline size={18} />
          <span>{comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'Comment'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <h4>Comments ({comments.length})</h4>
          </div>

          <div className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAvatar}>
                      <IoPersonCircleOutline size={32} />
                    </div>
                    <div className={styles.commentInfo}>
                      <span className={styles.commentAuthor}>{comment.author}</span>
                      <span className={styles.commentTime}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {(currentUser?.email === comment.userId) && (
                      <button
                        className={styles.deleteCommentBtn}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
            )}
          </div>

          <div className={styles.addCommentForm}>
            <input
              type="text"
              placeholder="Write a comment..."
              className={styles.commentInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleAddComment(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
