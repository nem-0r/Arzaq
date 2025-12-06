// src/pages/RestaurantDashboard/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import ImageUpload from '../../components/common/ImageUpload/ImageUpload';
import { restaurantService, foodService } from '../../api/services';
import { IoAdd, IoRestaurant, IoTrash } from 'react-icons/io5';
import styles from './RestaurantDashboard.module.css';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const restaurantData = await restaurantService.getMyRestaurant();
      setRestaurant(restaurantData);

      // Only load foods if restaurant is approved
      if (restaurantData && restaurantData.is_approved) {
        const foodsData = await foodService.getMyFoods();
        setFoods(foodsData);
      }
    } catch (err) {
      console.error('Error loading restaurant:', err);

      // Show user-friendly error message
      alert('Failed to load restaurant data. Please ensure you are logged in with a restaurant account.');
    } finally {
      setIsLoading(false);
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
        imageUrl = uploadResult.url;
      }

      // Create food item with image URL
      await foodService.createFood({
        name: foodData.name,
        description: foodData.description,
        price: parseFloat(foodData.price),
        oldPrice: parseFloat(foodData.oldPrice),
        discount: parseInt(foodData.discount),
        quantity: parseInt(foodData.quantity),
        expiresAt: foodData.expiresAt,
        image: imageUrl,
        restaurant_id: restaurant.id
      });

      alert('Food item added successfully!');
      setShowFoodForm(false);
      resetFoodForm();

      // Reload data to show new food item
      await loadRestaurantData();
    } catch (err) {
      console.error('Error adding food item:', err);

      const errorMessage = err.response?.data?.message || 'Failed to add food item. Please try again.';
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

      // Reload data to reflect deletion
      await loadRestaurantData();
    } catch (err) {
      console.error('Error deleting food item:', err);

      const errorMessage = err.response?.data?.message || 'Failed to delete food item. Please try again.';
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
            <p>Loading restaurant data...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.container}>
            <h1>Restaurant Not Found</h1>
            <p className={styles.subtitle}>
              Please register as a restaurant to access this page.
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Check restaurant approval status
  if (!restaurant.is_approved && restaurant.is_active) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.pendingContainer}>
            <IoRestaurant className={styles.pendingIcon} />
            <h2>Application Under Review</h2>
            <p>Your restaurant profile is being reviewed by our admin team.</p>
            <p>You will be notified once approved.</p>
            <div className={styles.restaurantInfo}>
              <p><strong>Restaurant Name:</strong> {restaurant.full_name}</p>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Email:</strong> {restaurant.email}</p>
              {restaurant.phone && <p><strong>Phone:</strong> {restaurant.phone}</p>}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!restaurant.is_active) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.rejectedContainer}>
            <h2>Application Rejected</h2>
            <p>Unfortunately, your restaurant application was not approved.</p>
            <p>Please contact support for more information.</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>{restaurant.name}</h1>
              <p className={styles.address}>{restaurant.address}</p>
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
                    <label>Food Photo *</label>
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
                        onChange={(e) => {
                          setFoodData({ ...foodData, oldPrice: e.target.value });
                        }}
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
                        onChange={(e) => {
                          setFoodData({ ...foodData, price: e.target.value });
                        }}
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
                      {food.oldPrice && (
                        <span className={styles.oldPrice}>₸{food.oldPrice}</span>
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
