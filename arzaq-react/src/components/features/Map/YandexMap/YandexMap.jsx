// src/components/features/Map/YandexMap/YandexMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { ALMATY_COORDINATES, FOOD_LOCATIONS, YANDEX_MAPS_API_KEY } from '../../../../utils/constants';
import styles from './YandexMap.module.css';

const YandexMap = () => {
  const mapRef = useRef(null);
  const ymapsRef = useRef(null);
  const { t, currentLanguage } = useTranslation();
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if API key exists
    if (!YANDEX_MAPS_API_KEY || YANDEX_MAPS_API_KEY === 'undefined') {
      console.error('❌ Yandex Maps API Key is missing! Add VITE_YANDEX_MAPS_API_KEY to environment variables');
      setMapError('Map API key is missing. Please contact support.');
      setIsLoading(false);
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
        window.ymaps.ready(() => {
          initMap();
          setIsLoading(false);
        });
      };
      script.onerror = () => {
        console.error('❌ Failed to load Yandex Maps API');
        setMapError('Failed to load map. Please refresh the page.');
        setIsLoading(false);
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

      // Add food location markers
      FOOD_LOCATIONS.forEach((location) => {
        const name = t(location.nameKey);
        const desc = t(location.descKey);
        const footer = location.quantity
          ? `${location.quantity} ${t('map_quantity_available')}`
          : t('map_contact_details');

        const placemark = new window.ymaps.Placemark(
          location.coords,
          {
            balloonContentHeader: `${location.icon} ${name}`,
            balloonContentBody: desc,
            balloonContentFooter: footer,
            hintContent: name
          },
          {
            preset: 'islands#icon',
            iconColor: location.quantity ? '#9DB896' : '#E89A6F'
          }
        );

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
        setMapError('Failed to initialize map. Please try again.');
        setIsLoading(false);
      }
    };

    loadYandexMaps();

    return () => {
      if (ymapsRef.current) {
        ymapsRef.current.destroy();
        ymapsRef.current = null;
      }
    };
  }, [t, currentLanguage]);

  if (mapError) {
    return (
      <div className={styles.mapContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🗺️</div>
          <div style={{ fontSize: '16px', color: '#666' }}>{mapError}</div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
            Check browser console (F12) for details
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.mapContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
          <div style={{ fontSize: '16px', color: '#666' }}>Loading map...</div>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};

export default YandexMap;