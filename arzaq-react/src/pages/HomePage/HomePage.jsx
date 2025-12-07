// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLocationSharp, IoLeafOutline, IoHeartOutline, IoPeopleOutline } from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import HorizontalScrollSection from '../../components/common/HorizontalScrollSection/HorizontalScrollSection';
import FoodCard from '../../components/common/FoodCard/FoodCard';
import UserImpact from '../../components/features/Profile/UserImpact/UserImpact';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { foodService } from '../../api/services';
import { getFoodImageUrl } from '../../utils/imageUrl';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State management
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load foods from API
  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all available foods
      const foodsData = await foodService.getAllFoods({ limit: 20 });
      setFoods(foodsData);
    } catch (err) {
      console.error('Error loading foods:', err);
      setError('Failed to load available food items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    addToCart({
      ...food,
      title: food.name,
      restaurant: food.restaurant_name
    });
    setToastMessage(`${food.name} rescued!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFindFood = () => {
    navigate('/map');
  };

  const handleCardClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="page-container">
      <Header showLanguageSwitcher={true} />

      <main id="main-content" className="main-content">
        {/* Hero Section - Mission Statement */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <IoLeafOutline className={styles.heroIcon} />
            <h1 className={styles.heroTitle}>Save Food, Save Planet</h1>
            <p className={styles.heroSubtitle}>
              Join the fight against food waste. Every meal rescued makes a difference.
            </p>
            <button className={styles.ctaButton} onClick={handleFindFood}>
              <IoLocationSharp size={24} />
              <span>Find Food Near You</span>
            </button>
          </div>

          {/* Mission Stats */}
          <div className={styles.missionStats}>
            <div className={styles.statItem}>
              <IoHeartOutline className={styles.statIcon} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>1000+</div>
                <div className={styles.statLabel}>Meals Saved</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <IoPeopleOutline className={styles.statIcon} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>500+</div>
                <div className={styles.statLabel}>Active Heroes</div>
              </div>
            </div>
          </div>
        </section>

        {/* User Impact - Only show if authenticated */}
        {isAuthenticated && (
          <section className={styles.impactSection}>
            <UserImpact />
          </section>
        )}

        {/* Available Food Near You */}
        <HorizontalScrollSection
          title="Available Food Near You"
          subtitle="Rescue surplus food before it goes to waste"
        >
          {isLoading ? (
            <div className={styles.loadingSection}>
              <div className={styles.spinner}></div>
              <p>Loading delicious food...</p>
            </div>
          ) : error ? (
            <div className={styles.errorSection}>
              <p>{error}</p>
              <button onClick={loadFoods} className={styles.retryBtn}>
                Try Again
              </button>
            </div>
          ) : foods.length === 0 ? (
            <div className={styles.emptySection}>
              <IoLeafOutline size={48} className={styles.emptyIcon} />
              <p>No food items available at the moment</p>
              <p className={styles.emptySubtext}>Check back soon for new rescue opportunities!</p>
            </div>
          ) : (
            foods.map((food) => (
              <FoodCard
                key={food.id}
                image={getFoodImageUrl(food)}
                title={food.name}
                restaurant={food.restaurant_name}
                restaurantId={food.restaurant_id}
                price={food.price}
                oldPrice={food.old_price}
                discount={food.discount}
                portions={food.quantity}
                isAvailable={food.is_available !== undefined ? food.is_available : true}
                pickupTime={food.expires_at ? new Date(food.expires_at).toLocaleString() : null}
                status="pickup_today"
                onAddClick={() => handleAddToCart(food)}
                onCardClick={handleCardClick}
              />
            ))
          )}
        </HorizontalScrollSection>

        {/* How It Works */}
        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How ARZAQ Works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Find Food</h3>
              <p>Browse surplus meals from local restaurants and stores</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Reserve</h3>
              <p>Pick your meal and reserve it instantly</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Pickup</h3>
              <p>Collect during pickup time and save the planet</p>
            </div>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
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

export default HomePage;