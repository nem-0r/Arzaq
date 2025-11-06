// src/pages/HomePage/HomePage.jsx
import React from 'react';
import Header from '../../components/layout/Header/Header';
import SearchBar from '../../components/layout/SearchBar/SearchBar';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import HorizontalScrollSection from '../../components/common/HorizontalScrollSection/HorizontalScrollSection';
import FoodCard from '../../components/common/FoodCard/FoodCard';
import RestaurantCard from '../../components/common/RestaurantCard/RestaurantCard';
import CategoryCard from '../../components/common/CategoryCard/CategoryCard';
import { useTranslation } from '../../hooks/useTranslation';
import {
  recommendedFoods,
  nearbyRestaurants,
  popularCategories,
  featuredDeals
} from '../../utils/mockData';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();

  const handleAddToCart = (food) => {
    console.log('Added to cart:', food);
    // TODO: Implement cart functionality
  };

  const handleRestaurantView = (restaurant) => {
    console.log('View restaurant:', restaurant);
    // TODO: Navigate to restaurant page
  };

  const handleCategoryClick = (category) => {
    console.log('Category selected:', category);
    // TODO: Navigate to category page
  };

  return (
    <div className="page-container">
      <Header showLanguageSwitcher={true} />
      <SearchBar />

      <main className="main-content">
        <section className={styles.welcomeSection}>
          <h2>{t('home_welcome_title')}</h2>
          <p>{t('home_welcome_subtitle')}</p>
        </section>

        {/* Popular Categories */}
        <HorizontalScrollSection title="Popular Categories">
          {popularCategories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              name={category.name}
              color={category.color}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </HorizontalScrollSection>

        {/* Recommended For You */}
        <HorizontalScrollSection title="Recommended For You" showViewAll>
          {recommendedFoods.map((food) => (
            <FoodCard
              key={food.id}
              image={food.image}
              title={food.title}
              restaurant={food.restaurant}
              price={food.price}
              onAddClick={() => handleAddToCart(food)}
            />
          ))}
        </HorizontalScrollSection>

        {/* Nearby Restaurants */}
        <HorizontalScrollSection title="Nearby Restaurants" showViewAll>
          {nearbyRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              image={restaurant.image}
              name={restaurant.name}
              rating={restaurant.rating}
              distance={restaurant.distance}
              cuisine={restaurant.cuisine}
              specialty={restaurant.specialty}
              mealsAvailable={restaurant.mealsAvailable}
              discount={restaurant.discount}
              onViewClick={() => handleRestaurantView(restaurant)}
            />
          ))}
        </HorizontalScrollSection>

        {/* Featured Deals */}
        <HorizontalScrollSection title="Featured Deals" showViewAll>
          {featuredDeals.map((deal) => (
            <FoodCard
              key={deal.id}
              image={deal.image}
              title={deal.title}
              restaurant={deal.restaurant}
              price={deal.price}
              oldPrice={deal.oldPrice}
              discount={deal.discount}
              onAddClick={() => handleAddToCart(deal)}
            />
          ))}
        </HorizontalScrollSection>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;