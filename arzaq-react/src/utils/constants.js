// src/utils/constants.js

export const ALMATY_COORDINATES = [43.238949, 76.889709];

export const FOOD_LOCATIONS = [
  {
    coords: [43.245, 76.895],
    nameKey: 'map_location_apples',
    descKey: 'map_desc_apples',
    icon: 'apple',
    quantity: 5
  },
  {
    coords: [43.235, 76.880],
    nameKey: 'map_location_bread',
    descKey: 'map_desc_bread',
    icon: 'bread',
    quantity: 5
  },
  {
    coords: [43.242, 76.892],
    nameKey: 'map_location_broccoli',
    descKey: 'map_desc_broccoli',
    icon: 'broccoli',
    quantity: 3
  },
  {
    coords: [43.232, 76.888],
    nameKey: 'map_location_milk',
    descKey: 'map_desc_milk',
    icon: 'milk',
    quantity: 0
  },
  {
    coords: [43.248, 76.898],
    nameKey: 'map_location_restaurant',
    descKey: 'map_desc_restaurant',
    icon: 'restaurant',
    quantity: 0
  }
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'John Doe',
    time: '2 hours ago',
    text: 'Fresh apples available at Green Market! 5 kg available',
    location: 'Green Market, Almaty'
  },
  {
    id: 2,
    author: 'Sarah Smith',
    time: '5 hours ago',
    text: 'Giving away fresh bread from today\'s baking',
    location: 'Central Bakery'
  },
  {
    id: 3,
    author: 'Mike Johnson',
    time: '1 day ago',
    text: 'Fresh broccoli harvest today! Come pick up',
    location: 'Community Garden'
  }
];

// API key is now stored securely in .env file
// IMPORTANT: Never commit .env to git!
export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;