// src/pages/RestaurantDashboard/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import ImageUpload from '../../components/common/ImageUpload/ImageUpload';
import { restaurantService, foodService } from '../../api/services';
import { geocodeAddress, validateAddressForGeocoding } from '../../utils/geocoding';
import { IoAdd, IoRestaurant, IoPencil, IoTrash, IoCheckmarkCircle, IoLocationSharp } from 'react-icons/io5';
import styles from './RestaurantDashboard.module.css';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);
  const [geocodedCoordinates, setGeocodedCoordinates] = useState(null);

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

      // If no restaurant found (404), show create form
      if (err.response?.status === 404) {
        setShowRestaurantForm(true);
      } else {
        // For other errors, show user-friendly message
        alert('Failed to load restaurant data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAddress = async () => {
    setIsGeocoding(true);
    setAddressVerified(false);
    setGeocodedCoordinates(null);

    try {
      // Validate address format first
      const validation = validateAddressForGeocoding(restaurantData.address);
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      // Geocode address
      const coordinates = await geocodeAddress(restaurantData.address);
      setGeocodedCoordinates(coordinates);
      setAddressVerified(true);

      // Update state with coordinates for preview
      setRestaurantData({
        ...restaurantData,
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString()
      });

      alert(`Address verified successfully!\nCoordinates: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`);
    } catch (err) {
      console.error('Geocoding error:', err);
      alert(err.message || 'Failed to verify address. Please try again.');
      setAddressVerified(false);
      setGeocodedCoordinates(null);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let coordinates = geocodedCoordinates;

      // If address wasn't verified yet, geocode it now
      if (!coordinates) {
        setIsGeocoding(true);

        // Validate address format
        const validation = validateAddressForGeocoding(restaurantData.address);
        if (!validation.isValid) {
          alert(validation.message);
          setIsSubmitting(false);
          setIsGeocoding(false);
          return;
        }

        // Geocode address
        coordinates = await geocodeAddress(restaurantData.address);
        setIsGeocoding(false);
      }

      // Prepare data with geocoded coordinates
      const dataToSend = {
        name: restaurantData.name,
        address: restaurantData.address,
        phone: restaurantData.phone,
        email: restaurantData.email,
        description: restaurantData.description,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };

      // Create restaurant
      const newRestaurant = await restaurantService.createRestaurant(dataToSend);
      setRestaurant(newRestaurant);
      setShowRestaurantForm(false);
      alert('Restaurant profile created successfully! Your application is now pending admin approval.');
    } catch (err) {
      console.error('Error creating restaurant:', err);

      // Show user-friendly error message
      const errorMessage = err.message || err.response?.data?.message || 'Failed to create restaurant profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsGeocoding(false);
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
                <label>
                  Full Address *
                  <span className={styles.hint}>
                    <IoLocationSharp /> Enter complete address including street number, city, and country
                  </span>
                </label>
                <input
                  type="text"
                  value={restaurantData.address}
                  onChange={(e) => {
                    setRestaurantData({ ...restaurantData, address: e.target.value });
                    // Reset verification when address changes
                    setAddressVerified(false);
                    setGeocodedCoordinates(null);
                  }}
                  placeholder="e.g., Al-Farabi Avenue 77, Almaty, Kazakhstan"
                  required
                />

                {/* Address verification button */}
                <button
                  type="button"
                  onClick={handleVerifyAddress}
                  disabled={!restaurantData.address || isGeocoding}
                  className={`${styles.verifyBtn} ${addressVerified ? styles.verified : ''}`}
                >
                  {isGeocoding ? (
                    'Verifying address...'
                  ) : addressVerified ? (
                    <>
                      <IoCheckmarkCircle /> Address Verified
                    </>
                  ) : (
                    <>
                      <IoLocationSharp /> Verify Address
                    </>
                  )}
                </button>

                {/* Show coordinates preview when verified */}
                {addressVerified && geocodedCoordinates && (
                  <div className={styles.coordinatesPreview}>
                    <small>
                      Coordinates: {geocodedCoordinates.latitude.toFixed(6)}, {geocodedCoordinates.longitude.toFixed(6)}
                    </small>
                  </div>
                )}
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

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting || isGeocoding}>
                {isGeocoding ? 'Converting address to coordinates...' : isSubmitting ? 'Creating restaurant...' : 'Create Restaurant Profile'}
              </button>

              {!addressVerified && (
                <p className={styles.verifyHint}>
                  Tip: Click "Verify Address" to ensure your address is correct before submitting
                </p>
              )}
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
