// src/components/features/Community/PostCard/PostCard.jsx
import React, { useState } from 'react';
import {
  IoThumbsUpOutline,
  IoChatbubbleOutline,
  IoPersonCircleOutline,
  IoLocationSharp,
  IoLeafOutline,
  IoTimeOutline
} from 'react-icons/io5';
import ChatModal from '../../Chat/ChatModal';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        <button className={styles.actionBtn}>
          <IoThumbsUpOutline size={18} />
          <span>Like</span>
        </button>
        <button className={styles.actionBtn} onClick={handleOpenChat}>
          <IoChatbubbleOutline size={18} />
          <span>Message</span>
        </button>
      </div>

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
