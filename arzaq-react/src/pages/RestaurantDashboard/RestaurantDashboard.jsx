// src/pages/RestaurantDashboard/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import ImageUpload from '../../components/common/ImageUpload/ImageUpload';
import { restaurantService, foodService } from '../../api/services';
import { IoAdd, IoRestaurant, IoPencil, IoTrash } from 'react-icons/io5';
import styles from './RestaurantDashboard.module.css';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurant Form State
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    latitude: '',
    longitude: ''
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
      const restaurantData = await restaurantService.getMyRestaurant();
      setRestaurant(restaurantData);

      if (restaurantData) {
        const foodsData = await foodService.getMyFoods();
        setFoods(foodsData);
      }
    } catch (err) {
      console.error('Error loading restaurant:', err);
      if (err.response?.status === 404) {
        setShowRestaurantForm(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRestaurant = await restaurantService.createRestaurant(restaurantData);
      setRestaurant(newRestaurant);
      setShowRestaurantForm(false);
      alert('Restaurant profile created! Waiting for admin approval.');
    } catch (err) {
      alert('Error creating restaurant profile');
      console.error(err);
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;

      // Upload image if provided
      if (foodData.image) {
        const uploadResult = await foodService.uploadImage(foodData.image);
        imageUrl = uploadResult.url;
      }

      await foodService.createFood({
        ...foodData,
        image: imageUrl,
        restaurant_id: restaurant.id
      });

      alert('Food item added successfully!');
      setShowFoodForm(false);
      resetFoodForm();
      loadRestaurantData();
    } catch (err) {
      alert('Error adding food item');
      console.error(err);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await foodService.deleteFood(foodId);
      alert('Food item deleted');
      loadRestaurantData();
    } catch (err) {
      alert('Error deleting food item');
      console.error(err);
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
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!restaurant) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.container}>
            <h1>Create Restaurant Profile</h1>
            <p className={styles.subtitle}>
              Fill in your restaurant details. Your profile will be reviewed by our admin team.
            </p>

            <form onSubmit={handleRestaurantSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  value={restaurantData.name}
                  onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address *</label>
                <input
                  type="text"
                  value={restaurantData.address}
                  onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={restaurantData.latitude}
                    onChange={(e) => setRestaurantData({ ...restaurantData, latitude: e.target.value })}
                    placeholder="43.238949"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={restaurantData.longitude}
                    onChange={(e) => setRestaurantData({ ...restaurantData, longitude: e.target.value })}
                    placeholder="76.889709"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={restaurantData.phone}
                    onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={restaurantData.email}
                    onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={restaurantData.description}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your restaurant..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Create Restaurant Profile
              </button>
            </form>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (restaurant.status === 'pending') {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.pendingContainer}>
            <IoRestaurant className={styles.pendingIcon} />
            <h2>Application Under Review</h2>
            <p>Your restaurant profile is being reviewed by our admin team.</p>
            <p>You will be notified once approved.</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (restaurant.status === 'rejected') {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.rejectedContainer}>
            <h2>Application Rejected</h2>
            <p>Unfortunately, your restaurant application was not approved.</p>
            {restaurant.rejection_reason && (
              <p className={styles.rejectionReason}>Reason: {restaurant.rejection_reason}</p>
            )}
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
                    <button type="button" onClick={() => setShowFoodForm(false)} className={styles.cancelBtn}>
                      Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn}>
                      Add Food Item
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
