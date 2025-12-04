// src/pages/RestaurantDetailsPage/RestaurantDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import FoodCard from '../../components/common/FoodCard/FoodCard';
import { restaurantService, foodService } from '../../api/services';
import { useCart } from '../../context/CartContext';
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoStar, IoArrowBack } from 'react-icons/io5';
import styles from './RestaurantDetailsPage.module.css';

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [restaurantData, foodsData] = await Promise.all([
        restaurantService.getRestaurantById(id),
        foodService.getFoodsByRestaurant(id)
      ]);

      setRestaurant(restaurantData);
      setFoods(foodsData);
    } catch (err) {
      console.error('Error loading restaurant data:', err);

      if (err.response?.status === 404) {
        setError('Restaurant not found');
      } else {
        setError('Failed to load restaurant details. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    addToCart({
      ...food,
      restaurant: restaurant.name
    });
    setToastMessage(`${food.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading restaurant details...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <div className={styles.error}>
            <p>{error || 'Restaurant not found'}</p>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>
              Go Back
            </button>
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
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <IoArrowBack /> Back
          </button>

          <div className={styles.restaurantHeader}>
            <div className={styles.restaurantInfo}>
              <h1 className={styles.restaurantName}>{restaurant.name}</h1>

              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <IoLocationOutline />
                  <span>{restaurant.address}</span>
                </div>
                {restaurant.phone && (
                  <div className={styles.infoItem}>
                    <IoCallOutline />
                    <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
                  </div>
                )}
                {restaurant.email && (
                  <div className={styles.infoItem}>
                    <IoMailOutline />
                    <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
                  </div>
                )}
              </div>

              {restaurant.rating && (
                <div className={styles.rating}>
                  <IoStar />
                  <span>{restaurant.rating}/5</span>
                </div>
              )}

              {restaurant.description && (
                <p className={styles.description}>{restaurant.description}</p>
              )}
            </div>
          </div>

          <div className={styles.foodsSection}>
            <h2 className={styles.sectionTitle}>
              Available Food Items
              {foods.length > 0 && <span className={styles.count}> ({foods.length})</span>}
            </h2>

            {foods.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No food items available at the moment</p>
                <p className={styles.checkBack}>Check back later for new items!</p>
              </div>
            ) : (
              <div className={styles.foodsGrid}>
                {foods.map((food) => (
                  <FoodCard
                    key={food.id}
                    image={food.image}
                    title={food.name}
                    restaurant={restaurant.name}
                    price={food.price}
                    oldPrice={food.oldPrice}
                    discount={food.discount}
                    portions={food.quantity}
                    isAvailable={food.is_available !== undefined ? food.is_available : true}
                    pickupTime={food.expiresAt ? new Date(food.expiresAt).toLocaleString() : null}
                    onAddClick={() => handleAddToCart(food)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showToast && (
        <div className={styles.toast}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="white" />
            <path
              d="M6 10L9 13L14 7"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default RestaurantDetailsPage;
