// src/components/features/Community/CreatePostModal/CreatePostModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './CreatePostModal.module.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    text: '',
    restaurantId: '',
    restaurantName: '',
    restaurantAddress: ''
  });
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load restaurants on mount
  useEffect(() => {
    loadRestaurants();
  }, []);

  // Search restaurants when query changes
  useEffect(() => {
    if (searchQuery) {
      searchRestaurants(searchQuery);
    } else {
      loadRestaurants();
    }
  }, [searchQuery]);

  const loadRestaurants = async () => {
    try {
      const response = await api.restaurants.search('');
      if (response.success) {
        setRestaurants(response.restaurants);
      }
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  const searchRestaurants = async (query) => {
    try {
      const response = await api.restaurants.search(query);
      if (response.success) {
        setRestaurants(response.restaurants);
      }
    } catch (error) {
      console.error('Failed to search restaurants:', error);
    }
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, text: e.target.value });
    if (errors.text) {
      setErrors({ ...errors, text: null });
    }
  };

  const handleRestaurantSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowRestaurantDropdown(true);
    if (errors.restaurant) {
      setErrors({ ...errors, restaurant: null });
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    setFormData({
      ...formData,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address
    });
    setSearchQuery(restaurant.name);
    setShowRestaurantDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Please write something about your experience';
    } else if (formData.text.trim().length < 10) {
      newErrors.text = 'Post must be at least 10 characters long';
    }

    if (!formData.restaurantId) {
      newErrors.restaurant = 'Please select a restaurant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        text: formData.text.trim(),
        location: `📍 ${formData.restaurantName}`,
        author: currentUser?.fullName || currentUser?.email || 'Anonymous',
        avatar: '👤',
        time: 'Just now',
        restaurantId: formData.restaurantId,
        restaurantName: formData.restaurantName,
        restaurantAddress: formData.restaurantAddress,
        userId: currentUser?.email
      };

      const response = await api.posts.create(postData);

      if (response.success) {
        // Reset form
        setFormData({
          text: '',
          restaurantId: '',
          restaurantName: '',
          restaurantAddress: ''
        });
        setSearchQuery('');
        setErrors({});

        // Notify parent component
        onPostCreated(response.post);

        // Close modal
        onClose();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      setErrors({ submit: error.message || 'Failed to create post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        text: '',
        restaurantId: '',
        restaurantName: '',
        restaurantAddress: ''
      });
      setSearchQuery('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Post</h2>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>👤</div>
            <div className={styles.userName}>
              {currentUser?.fullName || currentUser?.email || 'User'}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="restaurant" className={styles.label}>
              Restaurant or Place <span className={styles.required}>*</span>
            </label>
            <div className={styles.restaurantSelectWrapper}>
              <input
                type="text"
                id="restaurant"
                className={`${styles.input} ${errors.restaurant ? styles.inputError : ''}`}
                placeholder="Search for a restaurant..."
                value={searchQuery}
                onChange={handleRestaurantSearchChange}
                onFocus={() => setShowRestaurantDropdown(true)}
                disabled={isSubmitting}
              />
              {showRestaurantDropdown && restaurants.length > 0 && (
                <div className={styles.dropdown}>
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className={styles.dropdownItem}
                      onClick={() => handleRestaurantSelect(restaurant)}
                    >
                      <div className={styles.restaurantName}>{restaurant.name}</div>
                      <div className={styles.restaurantAddress}>{restaurant.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.restaurant && (
              <span className={styles.error}>{errors.restaurant}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="postText" className={styles.label}>
              Share your experience <span className={styles.required}>*</span>
            </label>
            <textarea
              id="postText"
              className={`${styles.textarea} ${errors.text ? styles.inputError : ''}`}
              placeholder="What would you like to share about this place?"
              value={formData.text}
              onChange={handleTextChange}
              rows={5}
              disabled={isSubmitting}
            />
            <div className={styles.characterCount}>
              {formData.text.length} characters
            </div>
            {errors.text && (
              <span className={styles.error}>{errors.text}</span>
            )}
          </div>

          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
