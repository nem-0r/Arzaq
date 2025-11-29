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

## 🔄 Important Updates

### Automatic Geocoding (Новое!)
**Фронтенд автоматически преобразует адрес в координаты** используя Yandex Geocoder API.

**Что это значит для бэкенда:**
- Ресторан вводит только адрес в форме
- Фронтенд автоматически получает latitude/longitude через Yandex API
- Запрос `POST /api/restaurants` уже содержит координаты
- Бэкенду НЕ нужно делать геокодинг самостоятельно

**Пример данных, которые фронтенд отправит:**
```json
{
  "name": "Green Garden Bistro",
  "address": "Al-Farabi Avenue 77, Almaty, Kazakhstan",
  "latitude": 43.238949,
  "longitude": 76.889709,
  "phone": "+7 701 234 5678",
  "email": "info@restaurant.com",
  "description": "Fresh organic meals daily"
}
```

**Валидация на бэкенде:**
- Проверяйте что latitude/longitude присутствуют
- Проверяйте диапазоны: latitude (-90 to 90), longitude (-180 to 180)
- Если координаты невалидные - вернуть ошибку 400

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
Headers: { Authorization: 'Bearer {token}' }
Body: {
  name: string (required),
  address: string (required),
  phone: string (required),
  email: string (required),
  description: string (optional),
  latitude: number (required, автоматически от фронтенда),
  longitude: number (required, автоматически от фронтенда)
}
Returns: {
  id: number,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  phone: string,
  email: string,
  description: string,
  status: 'pending',
  created_at: timestamp
}

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

## 🔐 CORS Configuration

**Важно!** Настройте CORS для фронтенда:

```python
# Для разработки
ALLOWED_ORIGINS = [
    "http://localhost:3001",  # Vite dev server
    "http://localhost:5173",  # Альтернативный порт Vite
]

# Для продакшена
ALLOWED_ORIGINS = [
    "https://arzaq.vercel.app",  # Или ваш домен
]
```

**Разрешенные методы:** GET, POST, PUT, DELETE, OPTIONS
**Разрешенные заголовки:** Authorization, Content-Type
**Credentials:** True (для cookies/tokens)

---

## ⚠️ Error Response Format

Все ошибки должны возвращаться в формате:

```json
{
  "message": "User-friendly error message",
  "error": "ERROR_CODE",
  "details": {} // optional
}
```

### Типичные коды ошибок:

**400 Bad Request:**
```json
{
  "message": "Invalid coordinates. Latitude must be between -90 and 90",
  "error": "INVALID_COORDINATES"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid or expired token",
  "error": "UNAUTHORIZED"
}
```

**403 Forbidden:**
```json
{
  "message": "You don't have permission to perform this action",
  "error": "FORBIDDEN"
}
```

**404 Not Found:**
```json
{
  "message": "Restaurant not found",
  "error": "NOT_FOUND"
}
```

**409 Conflict:**
```json
{
  "message": "A restaurant with this email already exists",
  "error": "RESTAURANT_EXISTS"
}
```

**500 Internal Server Error:**
```json
{
  "message": "An unexpected error occurred. Please try again later.",
  "error": "INTERNAL_ERROR"
}
```

---

## 🧪 Testing Checklist

Перед запуском в продакшен проверьте:

### Authentication
- [ ] Регистрация с ролью 'client' работает
- [ ] Регистрация с ролью 'restaurant' работает
- [ ] Login возвращает JWT token
- [ ] GET /api/auth/me возвращает данные с role
- [ ] Невалидный token возвращает 401

### Restaurants
- [ ] Restaurant может создать профиль
- [ ] Координаты сохраняются правильно
- [ ] Status по умолчанию 'pending'
- [ ] Admin видит pending рестораны
- [ ] Admin может approve/reject
- [ ] GET /api/restaurants?status=approved возвращает только approved
- [ ] GET /api/restaurants/:id работает

### Foods
- [ ] Restaurant может добавить еду
- [ ] Загрузка изображения работает (multipart/form-data)
- [ ] GET /api/foods?restaurant_id=X возвращает еду ресторана
- [ ] DELETE работает и удаляет еду
- [ ] Цены сохраняются как numbers (не strings)

### CORS
- [ ] Запросы с localhost:3001 проходят
- [ ] Preflight OPTIONS запросы работают
- [ ] Authorization header передается

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
