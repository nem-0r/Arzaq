// src/components/common/Icon/Icon.jsx
import React from 'react';
import {
  IoSearch,
  IoFilterSharp,
  IoHome,
  IoLocationSharp,
  IoChatbubblesSharp,
  IoPerson,
  IoChevronForward,
  IoLogOutOutline,
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoShareSocialOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoAddCircle,
  IoImageOutline,
  IoSend,
  IoRestaurantOutline,
  IoLeafOutline,
  IoStatsChartOutline,
  IoStarOutline,
  IoStar,
  IoClose,
  IoPizza,
  IoFastFood,
  IoIceCream,
  IoCafe,
  IoNutrition,
  IoEarth,
  IoTrophy,
  IoInformationCircle,
  IoApps
} from 'react-icons/io5';
import { GiNoodles, GiTacos } from 'react-icons/gi';
import { TbApple, TbBread, TbMilk } from 'react-icons/tb';
import { LuSalad } from 'react-icons/lu';

const Icon = ({ name, className = '', width = 20, height = 20, ...props }) => {
  const size = width || height || 20;

  const icons = {
    search: IoSearch,
    filter: IoFilterSharp,
    home: IoHome,
    map: IoLocationSharp,
    community: IoChatbubblesSharp,
    profile: IoPerson,
    chevronRight: IoChevronForward,
    logout: IoLogOutOutline,
    heartOutline: IoHeartOutline,
    heart: IoHeart,
    chatOutline: IoChatbubbleOutline,
    shareOutline: IoShareSocialOutline,
    bookmarkOutline: IoBookmarkOutline,
    bookmark: IoBookmark,
    addCircle: IoAddCircle,
    imageOutline: IoImageOutline,
    send: IoSend,
    restaurant: IoRestaurantOutline,
    leaf: IoLeafOutline,
    stats: IoStatsChartOutline,
    starOutline: IoStarOutline,
    star: IoStar,
    close: IoClose,
    // Food category icons
    pizza: IoPizza,
    burger: IoFastFood,
    dessert: IoIceCream,
    coffee: IoCafe,
    healthy: IoNutrition,
    asian: GiNoodles,
    mexican: GiTacos,
    // Food items for map
    apple: TbApple,
    bread: TbBread,
    broccoli: LuSalad,
    milk: TbMilk,
    // Other icons
    earth: IoEarth,
    trophy: IoTrophy,
    info: IoInformationCircle,
    apps: IoApps
  };

  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} size={size} {...props} />;
};

export default Icon;