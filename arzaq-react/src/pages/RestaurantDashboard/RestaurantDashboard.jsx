// src/pages/RestaurantDashboard/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import ImageUpload from '../../components/common/ImageUpload/ImageUpload';
import { restaurantProfileService, foodService } from '../../api/services';
import { IoAdd, IoRestaurant, IoTrash, IoCheckmarkCircle, IoCloseCircle, IoTime } from 'react-icons/io5';
import styles from './RestaurantDashboard.module.css';

const RestaurantDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [foods, setFoods] = useState([]);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    latitude: null,
    longitude: null
  });

  // Food Form State
  const [foodData, setFoodData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    discount: '',
    quantity: '',
    expiresAt: '',
    image: null
  });

  useEffect(() => {
    loadRestaurantData();
  }, []);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);

      // Get current user (which IS the restaurant profile)
      const { authService } = await import('../../api/services');
      const userData = await authService.getCurrentUser();

      setProfile(userData);
      setProfileExists(true);

      // Only load foods if profile is approved
      if (userData.is_approved) {
        const foodsData = await foodService.getMyFoods();
        setFoods(foodsData);
      }
    } catch (err) {
      console.error('Error loading restaurant data:', err);
      alert('Failed to load restaurant data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedProfile = await restaurantProfileService.updateMyProfile(profileData);
      setProfile(updatedProfile);
      setProfileExists(true);
      setShowProfileForm(false);
      alert('Restaurant profile updated! Waiting for admin approval.');
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (foodData.image) {
        const uploadResult = await foodService.uploadImage(foodData.image);
        imageUrl = uploadResult.image_url;
      }

      // Create food item
      await foodService.createFood({
        name: foodData.name,
        description: foodData.description,
        price: parseFloat(foodData.price),
        old_price: parseFloat(foodData.oldPrice),
        discount: parseInt(foodData.discount) || null,
        quantity: parseInt(foodData.quantity),
        expires_at: foodData.expiresAt,
        image: imageUrl
      });

      alert('Food item added successfully!');
      setShowFoodForm(false);
      resetFoodForm();
      await loadRestaurantData();
    } catch (err) {
      console.error('Error adding food item:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to add food item. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await foodService.deleteFood(foodId);
      alert('Food item deleted successfully!');
      await loadRestaurantData();
    } catch (err) {
      console.error('Error deleting food item:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to delete food item.';
      alert(errorMessage);
    }
  };

  const resetFoodForm = () => {
    setFoodData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      discount: '',
      quantity: '',
      expiresAt: '',
      image: null
    });
  };

  const calculateDiscount = () => {
    const oldPrice = parseFloat(foodData.oldPrice);
    const newPrice = parseFloat(foodData.price);
    if (oldPrice && newPrice && oldPrice > newPrice) {
      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
      setFoodData(prev => ({ ...prev, discount: discount.toString() }));
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Pending Approval Status
  if (!profile.is_approved) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.statusContainer}>
            <IoTime className={`${styles.statusIcon} ${styles.pending}`} />
            <h2>Application Under Review</h2>
            <p>Your restaurant profile is being reviewed by our admin team.</p>
            <p>You will be notified once approved.</p>

            <div className={styles.profileInfo}>
              <h3>Submitted Information:</h3>
              <p><strong>Restaurant Name:</strong> {profile.full_name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Address:</strong> {profile.address || 'Not provided'}</p>
              {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
              {profile.description && <p><strong>Description:</strong> {profile.description}</p>}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Approved - Main Dashboard
  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.approvedBadge}>
                <IoCheckmarkCircle /> Approved
              </div>
              <h1>{profile.full_name}</h1>
              <p className={styles.address}>{profile.address || 'No address set'}</p>
            </div>
            <button
              className={styles.addBtn}
              onClick={() => setShowFoodForm(true)}
            >
              <IoAdd /> Add Food
            </button>
          </div>

          {showFoodForm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Add New Food Item</h2>

                <form onSubmit={handleFoodSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Food Photo</label>
                    <ImageUpload
                      onImageSelect={(file) => setFoodData({ ...foodData, image: file })}
                      onImageRemove={() => setFoodData({ ...foodData, image: null })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Food Name *</label>
                    <input
                      type="text"
                      value={foodData.name}
                      onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={foodData.description}
                      onChange={(e) => setFoodData({ ...foodData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Original Price (₸) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={foodData.oldPrice}
                        onChange={(e) => setFoodData({ ...foodData, oldPrice: e.target.value })}
                        onBlur={calculateDiscount}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Discounted Price (₸) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={foodData.price}
                        onChange={(e) => setFoodData({ ...foodData, price: e.target.value })}
                        onBlur={calculateDiscount}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Discount (%)</label>
                      <input
                        type="number"
                        value={foodData.discount}
                        readOnly
                        className={styles.readOnly}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Quantity Available *</label>
                      <input
                        type="number"
                        value={foodData.quantity}
                        onChange={(e) => setFoodData({ ...foodData, quantity: e.target.value })}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Expires At *</label>
                      <input
                        type="datetime-local"
                        value={foodData.expiresAt}
                        onChange={(e) => setFoodData({ ...foodData, expiresAt: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setShowFoodForm(false)}
                      className={styles.cancelBtn}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Food Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className={styles.foodsGrid}>
            {foods.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No food items yet. Click "Add Food" to create your first listing!</p>
              </div>
            ) : (
              foods.map((food) => (
                <div key={food.id} className={styles.foodCard}>
                  {food.image && (
                    <img src={food.image} alt={food.name} className={styles.foodImage} />
                  )}
                  <div className={styles.foodInfo}>
                    <h3>{food.name}</h3>
                    <p className={styles.foodDesc}>{food.description}</p>
                    <div className={styles.foodPrice}>
                      <span className={styles.newPrice}>₸{food.price}</span>
                      {food.old_price && (
                        <span className={styles.oldPrice}>₸{food.old_price}</span>
                      )}
                      {food.discount && (
                        <span className={styles.discount}>{food.discount}% OFF</span>
                      )}
                    </div>
                    <p className={styles.foodQty}>Quantity: {food.quantity}</p>
                  </div>
                  <div className={styles.foodActions}>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteFood(food.id)}>
                      <IoTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default RestaurantDashboard;
