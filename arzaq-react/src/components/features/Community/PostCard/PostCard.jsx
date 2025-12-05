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
import ChatModal from '../../Chat/ChatModal';
import { useAuth } from '../../../../hooks/useAuth';
import { likeService, commentService } from '../../../../api/services';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  const { currentUser } = useAuth();
  const [isClaimed, setIsClaimed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
      const likesData = await likeService.getPostLikes(post.id);
      // Backend returns array of like objects: [{user_id, username, created_at}, ...]
      setLikesCount(likesData.length);
      // Check if current user liked the post
      const userId = currentUser?.id;
      setIsLiked(likesData.some(like => like.user_id === userId));
    } catch (error) {
      console.error('Failed to load likes:', error);
      setLikesCount(0);
      setIsLiked(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await commentService.getPostComments(post.id);
      // Backend returns array of comments directly
      setComments(commentsData || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      console.warn('User must be logged in to like posts');
      return;
    }

    try {
      // Toggle like on backend
      await likeService.toggleLike(post.id);
      // Reload likes to get updated state
      await loadLikes();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleClaim = () => {
    setIsClaimed(true);
    // TODO: Integrate with backend API
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async (commentText) => {
    if (!currentUser) {
      console.warn('User must be logged in to comment');
      return;
    }

    try {
      const commentData = {
        text: commentText
      };

      const newComment = await commentService.create(post.id, commentData);
      // Add the new comment to the list
      setComments([...comments, newComment]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.delete(commentId);
      // Remove the comment from the list
      setComments(comments.filter(c => c.id !== commentId));
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
                      <span className={styles.commentAuthor}>
                        {comment.username || comment.full_name || 'Anonymous'}
                      </span>
                      <span className={styles.commentTime}>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    {(currentUser?.id === comment.user_id) && (
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

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        recipientName={post.author}
        postTitle={post.title || 'Food item'}
      />
    </article>
  );
};

export default PostCard;
