// src/components/features/Community/PostCard/PostCard.jsx
import React from 'react';
import { IoThumbsUpOutline, IoChatbubbleOutline, IoPersonCircleOutline, IoLocationSharp } from 'react-icons/io5';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  return (
    <article className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <IoPersonCircleOutline size={40} />
        </div>
        <div className={styles.postInfo}>
          <h3>{post.author}</h3>
          <span className={styles.postTime}>{post.time}</span>
        </div>
      </div>

      <div className={styles.postBody}>
        <p>{post.text}</p>
        {post.location && (
          <div className={styles.postLocation}>
            <IoLocationSharp size={16} />
            <span>{post.location}</span>
          </div>
        )}
      </div>

      <div className={styles.postActions}>
        <button className={styles.actionBtn}>
          <IoThumbsUpOutline size={18} />
          <span>Like</span>
        </button>
        <button className={styles.actionBtn}>
          <IoChatbubbleOutline size={18} />
          <span>Comment</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;
