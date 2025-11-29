# Restaurant System Implementation Guide

## ✅ Completed Features

### 1. Role-Based System
- ✅ Added role selection in registration form (Client/Restaurant/Admin)
- ✅ Created RoleGuard component for route protection
- ✅ Updated AuthContext to support user roles

### 2. API Services
- ✅ Created RestaurantService for managing restaurants
- ✅ Created FoodService for managing food items
- ✅ Added image upload functionality

### 3. Admin Panel
- ✅ AdminDashboard page (`/admin`)
- ✅ View pending restaurant applications
- ✅ Approve/Reject restaurants
- ✅ Protected route (admin-only)

### 4. Restaurant Dashboard
- ✅ RestaurantDashboard page (`/restaurant-dashboard`)
- ✅ Create restaurant profile form (name, address, phone, coordinates)
- ✅ Add food items with photos
- ✅ ImageUpload component with drag & drop
- ✅ Manage food items (view, delete)
- ✅ Automatic discount calculation
- ✅ Protected route (restaurant-only)

### 5. Restaurant Details Page
- ✅ RestaurantDetailsPage (`/restaurant/:id`)
- ✅ Display restaurant information
- ✅ Show all available food items
- ✅ Add to cart functionality

### 6. Map Integration
- ✅ Updated MapPage to show real restaurants from API
- ✅ Click on marker → navigate to restaurant details
- ✅ Only shows approved restaurants
- ✅ Restaurant markers with coordinates

### 7. Profile Page Updates
- ✅ Admin users see "Admin Dashboard" button
- ✅ Restaurant users see "Restaurant Dashboard" button

---

## 🔧 Backend Requirements

Your backend needs to implement these endpoints:

### Authentication
```
POST /api/auth/register
Body: { fullName, email, password, role: 'client' | 'restaurant' | 'admin' }

POST /api/auth/login
Body: { email, password }
Returns: { token }

GET /api/auth/me
Headers: { Authorization: 'Bearer {token}' }
Returns: { id, fullName, email, role }
```

### Restaurants
```
GET /api/restaurants
Query: { status: 'pending' | 'approved' | 'rejected' }
Returns: [{ id, name, address, latitude, longitude, status, ... }]

GET /api/restaurants/:id
Returns: { id, name, address, phone, email, description, latitude, longitude, ... }

POST /api/restaurants (restaurant only)
Body: { name, address, phone, email, description, latitude, longitude }
Returns: { id, ..., status: 'pending' }

GET /api/restaurants/me (restaurant only)
Returns: { id, ..., status }

GET /api/restaurants/pending (admin only)
Returns: [{ id, name, status: 'pending', ... }]

POST /api/restaurants/:id/approve (admin only)
Returns: { id, ..., status: 'approved' }

POST /api/restaurants/:id/reject (admin only)
Body: { reason }
Returns: { id, ..., status: 'rejected' }
```

### Foods
```
GET /api/foods
Query: { restaurant_id }
Returns: [{ id, name, price, oldPrice, discount, quantity, image, ... }]

GET /api/foods/me (restaurant only)
Returns: [{ id, ..., restaurant_id }]

POST /api/foods (restaurant only)
Body: { name, description, price, oldPrice, discount, quantity, expiresAt, image, restaurant_id }
Returns: { id, ... }

PUT /api/foods/:id (restaurant only)
Body: { name, price, ... }
Returns: { id, ... }

DELETE /api/foods/:id (restaurant only)
Returns: { success: true }

POST /api/foods/upload-image (restaurant only)
Body: FormData with 'image' field
Returns: { url: 'https://...' }
```

---

## 📋 Database Schema

### users table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client', -- 'client', 'restaurant', 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### restaurants table
```sql
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  email VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### foods table
```sql
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  discount INTEGER,
  quantity INTEGER NOT NULL,
  image TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 How to Use

### For Restaurants:
1. Register with role "Restaurant"
2. Login
3. Go to Profile → "Restaurant Dashboard"
4. Create restaurant profile (name, address, coordinates, phone)
5. Wait for admin approval
6. Once approved, add food items with photos

### For Admins:
1. Register with role "Admin" (or create manually in DB)
2. Login
3. Go to Profile → "Admin Dashboard"
4. Review pending restaurants
5. Approve or reject applications

### For Clients:
1. Register with role "Client"
2. Login
3. Browse food on Home page or Map
4. Click on map markers to view restaurant details
5. Add food to cart

---

## 🗺️ Map Setup

### Adding Restaurants to Map:
1. When creating a restaurant, provide latitude and longitude
2. Example coordinates for Almaty:
   - Latitude: 43.238949
   - Longitude: 76.889709

### Getting Coordinates:
- Use Google Maps: Right-click → "What's here?"
- Use Yandex Maps
- Use geocoding API

---

## 🎨 UI Components

All components are styled with CSS modules and follow the project's design system:
- Green theme (#22c55e)
- Responsive design
- Accessible (ARIA labels, keyboard navigation)

---

## 📝 Next Steps

1. **Backend Implementation**
   - Create the API endpoints listed above
   - Set up JWT authentication
   - Implement role-based access control
   - Set up image upload (use cloud storage like S3, Cloudinary)

2. **Testing**
   - Test registration with different roles
   - Test restaurant creation flow
   - Test admin approval/rejection
   - Test food item creation with images

3. **Optional Enhancements**
   - Email notifications (restaurant approval, new orders)
   - Order management system
   - Payment integration
   - Rating and reviews
   - Restaurant analytics dashboard
   - Push notifications

---

## 🐛 Troubleshooting

### Role Guard not working:
- Check that backend returns `role` in `/api/auth/me` response
- Check localStorage for `currentUser` object

### Map not showing restaurants:
- Check backend returns `latitude` and `longitude` as numbers
- Check console for errors
- Verify Yandex Maps API key is set

### Image upload failing:
- Check backend accepts `multipart/form-data`
- Verify file size limits
- Check CORS settings

---

## 📞 Support

For questions or issues:
1. Check console for errors
2. Verify API responses match expected format
3. Test with Postman/Thunder Client first

---

**Happy Coding!** 🍔🍕🥗
