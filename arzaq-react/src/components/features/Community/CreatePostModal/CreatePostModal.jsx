// src/components/features/Community/CreatePostModal/CreatePostModal.jsx
import React, { useState, useEffect } from 'react';
import { postService, restaurantService, uploadService } from '../../../../api/services';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './CreatePostModal.module.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    text: '',
    restaurantId: '',
    restaurantName: '',
    restaurantAddress: '',
    image: null,
    imagePreview: null
  });
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      const restaurantsData = await restaurantService.getAllRestaurants({ status: 'approved' });
      setRestaurants(restaurantsData || []);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
      setRestaurants([]);
    }
  };

  const searchRestaurants = async (query) => {
    try {
      const restaurantsData = await restaurantService.getAllRestaurants({
        status: 'approved',
        search: query
      });
      setRestaurants(restaurantsData || []);
    } catch (error) {
      console.error('Failed to search restaurants:', error);
      setRestaurants([]);
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
      restaurantName: restaurant.restaurant_name || restaurant.full_name,
      restaurantAddress: restaurant.address
    });
    setSearchQuery(restaurant.restaurant_name || restaurant.full_name);
    setShowRestaurantDropdown(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, image: 'Please select a valid image file (JPG, PNG, GIF, or WebP)' });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors({ ...errors, image: 'Image size must be less than 5MB' });
      return;
    }

    // Clear any previous image errors
    if (errors.image) {
      setErrors({ ...errors, image: null });
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: file,
        imagePreview: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null
    });
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
      let imageUrl = null;

      // Upload image first if one is selected
      if (formData.image) {
        setIsUploadingImage(true);
        try {
          const uploadResponse = await uploadService.uploadImage(formData.image);
          imageUrl = uploadResponse.url;
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          setErrors({ submit: 'Failed to upload image. Please try again.' });
          setIsUploadingImage(false);
          setIsSubmitting(false);
          return;
        }
        setIsUploadingImage(false);
      }

      const postData = {
        text: formData.text.trim(),
        restaurant_id: formData.restaurantId,
        location: formData.restaurantAddress,
        image_url: imageUrl
      };

      const newPost = await postService.create(postData);

      // Reset form
      setFormData({
        text: '',
        restaurantId: '',
        restaurantName: '',
        restaurantAddress: '',
        image: null,
        imagePreview: null
      });
      setSearchQuery('');
      setErrors({});

      // Notify parent component
      onPostCreated(newPost);

      // Close modal
      onClose();
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
        restaurantAddress: '',
        image: null,
        imagePreview: null
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
                      <div className={styles.restaurantName}>
                        {restaurant.restaurant_name || restaurant.full_name}
                      </div>
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

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Add Photo (Optional)
            </label>

            {!formData.imagePreview ? (
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className={styles.imageInput}
                  disabled={isSubmitting}
                />
                <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Click to upload image</span>
                  <span className={styles.imageHint}>JPG, PNG, GIF or WebP (Max 5MB)</span>
                </label>
              </div>
            ) : (
              <div className={styles.imagePreview}>
                <img src={formData.imagePreview} alt="Preview" />
                <button
                  type="button"
                  className={styles.removeImageBtn}
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                >
                  Remove Image
                </button>
              </div>
            )}

            {errors.image && (
              <span className={styles.error}>{errors.image}</span>
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
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? 'Uploading image...' : isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
