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
    title: 'Fresh Organic Apples',
    text: 'Fresh apples available at Green Market! 5 kg available. Perfect for baking or eating fresh. Slightly bruised but still delicious!',
    location: 'Green Market, Almaty',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop',
    category: 'Surplus Food',
    pickupTime: 'Today 4-6 PM'
  },
  {
    id: 2,
    author: 'Sarah Smith',
    time: '5 hours ago',
    title: 'Fresh Baked Bread',
    text: 'Giving away fresh bread from today\'s baking. We have baguettes and whole wheat loaves. All baked this morning!',
    location: 'Central Bakery, Almaty',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop',
    category: 'Leftovers',
    pickupTime: 'Today 7-8 PM'
  },
  {
    id: 3,
    author: 'Mike Johnson',
    time: '1 day ago',
    title: 'Garden Fresh Broccoli',
    text: 'Fresh broccoli harvest today! Come pick up from our community garden. Organic and pesticide-free.',
    location: 'Community Garden, Almaty',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=400&fit=crop',
    category: 'Home Grown',
    pickupTime: 'Today 5-7 PM'
  },
  {
    id: 4,
    author: 'Emma Wilson',
    time: '3 hours ago',
    title: 'Surplus Pasta & Sauce',
    text: 'Made too much pasta and tomato sauce for dinner. Fresh homemade sauce with basil from my garden!',
    location: 'Downtown, Almaty',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop',
    category: 'Home Cooked',
    pickupTime: 'Today 8-9 PM'
  }
];

// API key is now stored securely in .env file
// IMPORTANT: Never commit .env to git!
export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;