// src/components/features/Map/YandexMap/YandexMap.jsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { ALMATY_COORDINATES, FOOD_LOCATIONS, YANDEX_MAPS_API_KEY } from '../../../../utils/constants';
import styles from './YandexMap.module.css';

const YandexMap = () => {
  const mapRef = useRef(null);
  const ymapsRef = useRef(null);
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
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
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: ALMATY_COORDINATES,
        zoom: 13,
        controls: ['zoomControl', 'geolocationControl']
      });

      ymapsRef.current = map;

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
    };

    loadYandexMaps();

    return () => {
      if (ymapsRef.current) {
        ymapsRef.current.destroy();
        ymapsRef.current = null;
      }
    };
  }, [t, currentLanguage]);

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};

export default YandexMap;