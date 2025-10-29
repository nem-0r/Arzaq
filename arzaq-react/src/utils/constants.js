// src/utils/constants.js

export const ALMATY_COORDINATES = [43.238949, 76.889709];

export const FOOD_LOCATIONS = [
  {
    coords: [43.245, 76.895],
    nameKey: 'map_location_apples',
    descKey: 'map_desc_apples',
    icon: '🍎',
    quantity: 5
  },
  {
    coords: [43.235, 76.880],
    nameKey: 'map_location_bread',
    descKey: 'map_desc_bread',
    icon: '🍞',
    quantity: 5
  },
  {
    coords: [43.242, 76.892],
    nameKey: 'map_location_broccoli',
    descKey: 'map_desc_broccoli',
    icon: '🥦',
    quantity: 3
  },
  {
    coords: [43.232, 76.888],
    nameKey: 'map_location_milk',
    descKey: 'map_desc_milk',
    icon: '🥛',
    quantity: 0
  },
  {
    coords: [43.248, 76.898],
    nameKey: 'map_location_restaurant',
    descKey: 'map_desc_restaurant',
    icon: '🍽️',
    quantity: 0
  }
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    avatar: '👤',
    author: 'John Doe',
    time: '2 hours ago',
    text: 'Fresh apples available at Green Market! 5 kg available 🍎',
    location: '📍 Green Market, Almaty'
  },
  {
    id: 2,
    avatar: '👤',
    author: 'Sarah Smith',
    time: '5 hours ago',
    text: 'Giving away fresh bread from today\'s baking 🍞',
    location: '📍 Central Bakery'
  },
  {
    id: 3,
    avatar: '👤',
    author: 'Mike Johnson',
    time: '1 day ago',
    text: 'Fresh broccoli harvest today! Come pick up 🥦',
    location: '📍 Community Garden'
  }
];

export const YANDEX_MAPS_API_KEY = 'de714e5f-b399-43a6-8db2-acedcf0f624d';