// src/components/features/Community/PostCard/PostCard.jsx
import React from 'react';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  return (
    <article className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>{post.avatar}</div>
        <div className={styles.postInfo}>
          <h3>{post.author}</h3>
          <span className={styles.postTime}>{post.time}</span>
        </div>
      </div>

      <div className={styles.postBody}>
        <p>{post.text}</p>
        <div className={styles.postLocation}>{post.location}</div>
      </div>

      <div className={styles.postActions}>
        <button className={styles.actionBtn}>👍 Like</button>
        <button className={styles.actionBtn}>💬 Comment</button>
      </div>
    </article>
  );
};

export default PostCard;
