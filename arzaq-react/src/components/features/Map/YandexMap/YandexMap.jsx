// src/components/features/Map/YandexMap/YandexMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import { ALMATY_COORDINATES, YANDEX_MAPS_API_KEY } from '../../../../utils/constants';
import { restaurantService } from '../../../../api/services';
import styles from './YandexMap.module.css';

const YandexMap = () => {
  const mapRef = useRef(null);
  const ymapsRef = useRef(null);
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);

  // Load restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants({ status: 'approved' });
        setRestaurants(data);
      } catch (err) {
        console.error('Error loading restaurants:', err);
        // Fallback to empty array on error
        setRestaurants([]);
      }
    };
    loadRestaurants();
  }, []);

  useEffect(() => {
    // Check if API key exists
    if (!YANDEX_MAPS_API_KEY || YANDEX_MAPS_API_KEY === 'undefined') {
      console.error('❌ Yandex Maps API Key is missing! Add VITE_YANDEX_MAPS_API_KEY to environment variables');
      return;
    }

    // Load Yandex Maps API
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=en_US`;
      script.async = true;
      script.onload = () => {
        console.log('✅ Yandex Maps API loaded successfully');
        window.ymaps.ready(initMap);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Yandex Maps API');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;

      try {
        const map = new window.ymaps.Map(mapRef.current, {
          center: ALMATY_COORDINATES,
          zoom: 13,
          controls: ['zoomControl', 'geolocationControl']
        });

        ymapsRef.current = map;
        console.log('✅ Yandex Map initialized successfully');

        // Add restaurant markers
        restaurants.forEach((restaurant) => {
          // Check if restaurant has valid coordinates
          if (!restaurant.latitude || !restaurant.longitude) {
            console.warn(`Restaurant ${restaurant.name} has no coordinates`);
            return;
          }

          const coords = [parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)];

          const placemark = new window.ymaps.Placemark(
            coords,
            {
              balloonContentHeader: `<strong>${restaurant.name}</strong>`,
              balloonContentBody: `
                <p>${restaurant.address}</p>
                ${restaurant.description ? `<p style="margin-top: 8px; color: #6b7280;">${restaurant.description}</p>` : ''}
              `,
              balloonContentFooter: `
                <a href="/restaurant/${restaurant.id}"
                   style="display: inline-block; margin-top: 8px; padding: 8px 16px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;"
                   onclick="event.preventDefault(); window.location.href='/restaurant/${restaurant.id}'">
                  View Details
                </a>
              `,
              hintContent: restaurant.name
            },
            {
              preset: 'islands#restaurantIcon',
              iconColor: '#22c55e'
            }
          );

          // Add click event to navigate to restaurant details
          placemark.events.add('click', () => {
            navigate(`/restaurant/${restaurant.id}`);
          });

          map.geoObjects.add(placemark);
        });

        // Add user location marker
        const userLocation = new window.ymaps.Placemark(
          ALMATY_COORDINATES,
          {
            hintContent: t('map_your_location')
          },
          {
            preset: 'islands#circleDotIcon',
            iconColor: '#4A9FD8'
          }
        );

        map.geoObjects.add(userLocation);
      } catch (error) {
        console.error('❌ Error initializing Yandex Map:', error);
      }
    };

    loadYandexMaps();

    return () => {
      if (ymapsRef.current) {
        ymapsRef.current.destroy();
        ymapsRef.current = null;
      }
    };
  }, [t, currentLanguage, restaurants, navigate]);

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};

export default YandexMap;
