# User Impact Feature - Documentation

## Overview
The User Impact feature tracks and displays the environmental impact of users' food rescue activities on the Profile page. It shows metrics like meals rescued, CO2 saved, and earned achievement badges.

## Components

### UserImpact Component
**Location:** `src/components/features/Profile/UserImpact/UserImpact.jsx`

**Purpose:** Displays user's environmental impact statistics with visual progress bars and badges.

**Props:**
```javascript
{
  stats: {
    mealsRescued: number,     // Total meals saved this month
    co2Saved: number,          // CO2 saved in kg this month
    mealsGoal: number,         // Monthly goal for meals (default: 30)
    co2Goal: number,           // Monthly goal for CO2 in kg (default: 10)
    badges: Array              // Array of earned badges
  }
}
```

**Usage Example:**
```jsx
import UserImpact from '../../components/features/Profile/UserImpact/UserImpact';

// With custom stats
const customStats = {
  mealsRescued: 45,
  co2Saved: 8.1,
  mealsGoal: 50,
  co2Goal: 15,
  badges: [...]
};

<UserImpact stats={customStats} />

// Or use default demo data
<UserImpact />
```

## API Integration

### Available Endpoints
All endpoints are ready for backend integration in `src/services/api.js`:

#### 1. Get User Stats
```javascript
import api from './services/api';

// Get user's impact statistics
const response = await api.impact.getStats('month');
// Returns: { success: true, stats: {...} }
```

#### 2. Update Stats (After Order)
```javascript
// Call this after a user completes an order
const orderData = {
  itemsCount: 2  // Number of meals in the order
};
const response = await api.impact.updateStats(orderData);
// Automatically calculates CO2 saved and checks for new badges
```

#### 3. Get All Badges
```javascript
// Get all available badges and their requirements
const response = await api.impact.getBadges();
```

## Integration with Backend

### Step 1: Update API Base URL
In `src/services/api.js`, update the base URL:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Step 2: Uncomment Backend Calls
Replace the mock implementations with actual API calls. Each method has commented backend code ready to use.

**Example for `getStats`:**
```javascript
// Current (Mock)
const savedStats = localStorage.getItem('user_impact_stats');
// ...

// Change to (Backend)
const response = await fetch(`${API_BASE_URL}/impact/stats?period=${period}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  }
});
return handleResponse(response);
```

### Step 3: Backend Requirements

Your backend should implement these endpoints:

#### GET `/api/impact/stats`
**Query Parameters:**
- `period` (string): 'month', 'week', 'all-time'

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "stats": {
    "mealsRescued": 23,
    "co2Saved": 4.2,
    "mealsGoal": 30,
    "co2Goal": 10,
    "badges": [...],
    "period": "month",
    "updatedAt": "2025-11-05T..."
  }
}
```

#### POST `/api/impact/update`
**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Body:**
```json
{
  "itemsCount": 2
}
```

**Response:**
```json
{
  "success": true,
  "stats": {...}
}
```

#### GET `/api/impact/badges`
**Response:**
```json
{
  "success": true,
  "badges": [
    {
      "id": 1,
      "name": "Eco Warrior Badge",
      "description": "Earned for saving 20+ meals",
      "icon": "🏆",
      "requirement": 20
    }
  ]
}
```

## Badge System

### Default Badges
1. **Eco Warrior Badge** (🏆) - 20+ meals
2. **Planet Hero** (🌟) - 50+ meals
3. **Green Champion** (🌍) - 100+ meals

### Adding New Badges
Update the `getBadges` endpoint in `api.impact.getBadges()` with new badge definitions.

## CO2 Calculation
Current formula: **0.18kg CO2 per meal**

This is based on average food waste environmental impact. You can adjust this in:
```javascript
// src/services/api.js - updateStats method
const co2PerMeal = 0.18; // Modify this value
```

## Demo Data
The component uses demo data by default:
- 23 meals rescued
- 4.2kg CO2 saved
- 30 meals monthly goal
- 10kg CO2 monthly goal
- 1 earned badge (Eco Warrior)

## Testing

### Manual Testing
1. Navigate to Profile page
2. Component should display with demo data
3. Test responsive design on mobile (< 480px)

### Testing with Custom Data
```javascript
// In ProfilePage.jsx
const testStats = {
  mealsRescued: 25,
  co2Saved: 4.5,
  mealsGoal: 30,
  co2Goal: 10,
  badges: [...]
};

<UserImpact stats={testStats} />
```

### Testing API Integration (When Backend is Ready)
```javascript
// In ProfilePage.jsx
const [impactStats, setImpactStats] = useState(null);

useEffect(() => {
  const loadStats = async () => {
    const response = await api.impact.getStats('month');
    if (response.success) {
      setImpactStats(response.stats);
    }
  };
  loadStats();
}, []);

<UserImpact stats={impactStats} />
```

## Styling
Styles follow the site's design system:
- Primary green: `var(--primary-green)`
- Accent orange: `var(--accent-orange)`
- Card radius: `var(--radius-lg)`
- Spacing: `var(--spacing-*)`

All styles are in `UserImpact.module.css` and use CSS variables from `src/styles/variables.css`.

## Future Enhancements
1. Add period selector (week/month/all-time)
2. Add sharing functionality for achievements
3. Add leaderboard integration
4. Add custom goals setting
5. Add more badge types
6. Add animations for badge unlocks
7. Add chart/graph visualization
8. Add comparison with other users

## Questions?
Refer to the component code comments for detailed prop and method documentation.
