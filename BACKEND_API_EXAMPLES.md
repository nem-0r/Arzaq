# Backend API Examples

Примеры всех API запросов и ответов для тестирования.

---

## 🔐 Authentication

### 1. Register as Client

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Smith",
  "email": "client@example.com",
  "password": "SecurePassword123!",
  "role": "client"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "fullName": "John Smith",
    "email": "client@example.com",
    "role": "client",
    "created_at": "2025-11-29T10:00:00Z"
  }
}
```

**Error Response (400) - Email already exists:**
```json
{
  "message": "A user with this email already exists",
  "error": "USER_EXISTS"
}
```

**Error Response (400) - Invalid data:**
```json
{
  "message": "Password must be at least 8 characters",
  "error": "INVALID_PASSWORD"
}
```

---

### 2. Register as Restaurant

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Restaurant Owner",
  "email": "restaurant@example.com",
  "password": "SecurePassword123!",
  "role": "restaurant"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "fullName": "Restaurant Owner",
    "email": "restaurant@example.com",
    "role": "restaurant",
    "created_at": "2025-11-29T10:05:00Z"
  }
}
```

---

### 3. Register as Admin

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "role": "admin"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 3,
    "fullName": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2025-11-29T10:10:00Z"
  }
}
```

---

### 4. Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "restaurant@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "fullName": "Restaurant Owner",
    "email": "restaurant@example.com",
    "role": "restaurant"
  }
}
```

**Error Response (401) - Invalid credentials:**
```json
{
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS"
}
```

---

### 5. Get Current User

**Request:**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "id": 2,
  "fullName": "Restaurant Owner",
  "email": "restaurant@example.com",
  "role": "restaurant",
  "created_at": "2025-11-29T10:05:00Z"
}
```

**Error Response (401) - Invalid token:**
```json
{
  "message": "Invalid or expired token",
  "error": "UNAUTHORIZED"
}
```

---

## 🍽️ Restaurants

### 6. Create Restaurant Profile

**Request:**
```http
POST /api/restaurants
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Green Garden Bistro",
  "address": "Al-Farabi Avenue 77, Almaty, Kazakhstan",
  "latitude": 43.238949,
  "longitude": 76.889709,
  "phone": "+7 701 234 5678",
  "email": "info@greengarden.com",
  "description": "Fresh organic meals daily prepared with love"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "user_id": 2,
  "name": "Green Garden Bistro",
  "address": "Al-Farabi Avenue 77, Almaty, Kazakhstan",
  "latitude": 43.238949,
  "longitude": 76.889709,
  "phone": "+7 701 234 5678",
  "email": "info@greengarden.com",
  "description": "Fresh organic meals daily prepared with love",
  "status": "pending",
  "created_at": "2025-11-29T10:15:00Z",
  "updated_at": "2025-11-29T10:15:00Z"
}
```

**Error Response (400) - Invalid coordinates:**
```json
{
  "message": "Invalid coordinates. Latitude must be between -90 and 90",
  "error": "INVALID_COORDINATES"
}
```

**Error Response (409) - Restaurant already exists:**
```json
{
  "message": "You already have a restaurant profile",
  "error": "RESTAURANT_EXISTS"
}
```

**Error Response (403) - Not a restaurant user:**
```json
{
  "message": "Only users with role 'restaurant' can create restaurant profiles",
  "error": "FORBIDDEN"
}
```

---

### 7. Get All Restaurants (with filter)

**Request:**
```http
GET /api/restaurants?status=approved
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Green Garden Bistro",
    "address": "Al-Farabi Avenue 77, Almaty, Kazakhstan",
    "latitude": 43.238949,
    "longitude": 76.889709,
    "phone": "+7 701 234 5678",
    "email": "info@greengarden.com",
    "description": "Fresh organic meals daily",
    "status": "approved",
    "created_at": "2025-11-29T10:15:00Z",
    "updated_at": "2025-11-29T10:20:00Z"
  },
  {
    "id": 2,
    "name": "Pizza Palace",
    "address": "Dostyk Avenue 123, Almaty, Kazakhstan",
    "latitude": 43.258949,
    "longitude": 76.919709,
    "phone": "+7 702 345 6789",
    "email": "info@pizzapalace.com",
    "description": "Best pizza in town",
    "status": "approved",
    "created_at": "2025-11-29T09:00:00Z",
    "updated_at": "2025-11-29T09:30:00Z"
  }
]
```

---

### 8. Get Restaurant by ID

**Request:**
```http
GET /api/restaurants/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Green Garden Bistro",
  "address": "Al-Farabi Avenue 77, Almaty, Kazakhstan",
  "latitude": 43.238949,
  "longitude": 76.889709,
  "phone": "+7 701 234 5678",
  "email": "info@greengarden.com",
  "description": "Fresh organic meals daily prepared with love",
  "status": "approved",
  "created_at": "2025-11-29T10:15:00Z",
  "updated_at": "2025-11-29T10:20:00Z"
}
```

**Error Response (404):**
```json
{
  "message": "Restaurant not found",
  "error": "NOT_FOUND"
}
```

---

### 9. Get My Restaurant (restaurant owner)

**Request:**
```http
GET /api/restaurants/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 2,
  "name": "Green Garden Bistro",
  "address": "Al-Farabi Avenue 77, Almaty, Kazakhstan",
  "latitude": 43.238949,
  "longitude": 76.889709,
  "phone": "+7 701 234 5678",
  "email": "info@greengarden.com",
  "description": "Fresh organic meals daily prepared with love",
  "status": "pending",
  "created_at": "2025-11-29T10:15:00Z",
  "updated_at": "2025-11-29T10:15:00Z"
}
```

**Error Response (404) - No restaurant profile:**
```json
{
  "message": "You don't have a restaurant profile yet",
  "error": "NOT_FOUND"
}
```

---

### 10. Get Pending Restaurants (admin only)

**Request:**
```http
GET /api/restaurants/pending
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (admin token)
```

**Success Response (200):**
```json
[
  {
    "id": 3,
    "name": "Sushi Bar",
    "address": "Abay Avenue 45, Almaty, Kazakhstan",
    "latitude": 43.228949,
    "longitude": 76.869709,
    "phone": "+7 703 456 7890",
    "email": "info@sushibar.com",
    "description": "Fresh sushi daily",
    "status": "pending",
    "created_at": "2025-11-29T11:00:00Z",
    "updated_at": "2025-11-29T11:00:00Z"
  }
]
```

**Error Response (403) - Not admin:**
```json
{
  "message": "You don't have permission to perform this action",
  "error": "FORBIDDEN"
}
```

---

### 11. Approve Restaurant (admin only)

**Request:**
```http
POST /api/restaurants/3/approve
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (admin token)
```

**Success Response (200):**
```json
{
  "id": 3,
  "name": "Sushi Bar",
  "address": "Abay Avenue 45, Almaty, Kazakhstan",
  "latitude": 43.228949,
  "longitude": 76.869709,
  "phone": "+7 703 456 7890",
  "email": "info@sushibar.com",
  "description": "Fresh sushi daily",
  "status": "approved",
  "created_at": "2025-11-29T11:00:00Z",
  "updated_at": "2025-11-29T11:30:00Z"
}
```

---

### 12. Reject Restaurant (admin only)

**Request:**
```http
POST /api/restaurants/3/reject
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (admin token)
Content-Type: application/json

{
  "reason": "Incomplete documentation provided"
}
```

**Success Response (200):**
```json
{
  "id": 3,
  "name": "Sushi Bar",
  "status": "rejected",
  "rejection_reason": "Incomplete documentation provided",
  "updated_at": "2025-11-29T11:35:00Z"
}
```

---

## 🍕 Foods

### 13. Add Food Item (restaurant only)

**Request:**
```http
POST /api/foods
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (restaurant token)
Content-Type: application/json

{
  "name": "Organic Caesar Salad",
  "description": "Fresh lettuce with organic dressing",
  "price": 1200,
  "oldPrice": 1500,
  "discount": 20,
  "quantity": 10,
  "image": "https://cloudinary.com/images/salad123.jpg",
  "expiresAt": "2025-11-30T23:59:59Z",
  "restaurant_id": 1
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "restaurant_id": 1,
  "name": "Organic Caesar Salad",
  "description": "Fresh lettuce with organic dressing",
  "price": 1200,
  "oldPrice": 1500,
  "discount": 20,
  "quantity": 10,
  "image": "https://cloudinary.com/images/salad123.jpg",
  "expiresAt": "2025-11-30T23:59:59Z",
  "created_at": "2025-11-29T12:00:00Z",
  "updated_at": "2025-11-29T12:00:00Z"
}
```

**Error Response (400) - Invalid price:**
```json
{
  "message": "Price must be a positive number",
  "error": "INVALID_PRICE"
}
```

**Error Response (403) - Restaurant not approved:**
```json
{
  "message": "Your restaurant must be approved before adding food items",
  "error": "RESTAURANT_NOT_APPROVED"
}
```

---

### 14. Upload Food Image (restaurant only)

**Request:**
```http
POST /api/foods/upload-image
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

{
  "image": (binary file data)
}
```

**Success Response (200):**
```json
{
  "url": "https://cloudinary.com/images/food-abc123.jpg"
}
```

**Error Response (400) - No file uploaded:**
```json
{
  "message": "No image file provided",
  "error": "NO_FILE"
}
```

**Error Response (400) - Invalid file type:**
```json
{
  "message": "Only JPG, PNG, and WebP images are allowed",
  "error": "INVALID_FILE_TYPE"
}
```

**Error Response (400) - File too large:**
```json
{
  "message": "File size must not exceed 5MB",
  "error": "FILE_TOO_LARGE"
}
```

---

### 15. Get All Foods (with filter)

**Request:**
```http
GET /api/foods?restaurant_id=1
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "restaurant_id": 1,
    "name": "Organic Caesar Salad",
    "description": "Fresh lettuce with organic dressing",
    "price": 1200,
    "oldPrice": 1500,
    "discount": 20,
    "quantity": 10,
    "image": "https://cloudinary.com/images/salad123.jpg",
    "expiresAt": "2025-11-30T23:59:59Z",
    "created_at": "2025-11-29T12:00:00Z",
    "updated_at": "2025-11-29T12:00:00Z"
  },
  {
    "id": 2,
    "restaurant_id": 1,
    "name": "Grilled Chicken Bowl",
    "description": "Healthy protein bowl with veggies",
    "price": 1800,
    "oldPrice": 2200,
    "discount": 18,
    "quantity": 5,
    "image": "https://cloudinary.com/images/chicken456.jpg",
    "expiresAt": "2025-11-30T23:59:59Z",
    "created_at": "2025-11-29T12:10:00Z",
    "updated_at": "2025-11-29T12:10:00Z"
  }
]
```

---

### 16. Get My Foods (restaurant owner)

**Request:**
```http
GET /api/foods/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (restaurant token)
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "restaurant_id": 1,
    "name": "Organic Caesar Salad",
    "description": "Fresh lettuce with organic dressing",
    "price": 1200,
    "oldPrice": 1500,
    "discount": 20,
    "quantity": 10,
    "image": "https://cloudinary.com/images/salad123.jpg",
    "expiresAt": "2025-11-30T23:59:59Z",
    "created_at": "2025-11-29T12:00:00Z",
    "updated_at": "2025-11-29T12:00:00Z"
  }
]
```

---

### 17. Update Food Item (restaurant only)

**Request:**
```http
PUT /api/foods/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (restaurant token)
Content-Type: application/json

{
  "name": "Organic Caesar Salad (Large)",
  "price": 1400,
  "quantity": 15
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "restaurant_id": 1,
  "name": "Organic Caesar Salad (Large)",
  "description": "Fresh lettuce with organic dressing",
  "price": 1400,
  "oldPrice": 1500,
  "discount": 7,
  "quantity": 15,
  "image": "https://cloudinary.com/images/salad123.jpg",
  "expiresAt": "2025-11-30T23:59:59Z",
  "created_at": "2025-11-29T12:00:00Z",
  "updated_at": "2025-11-29T13:00:00Z"
}
```

**Error Response (403) - Not owner:**
```json
{
  "message": "You can only update your own food items",
  "error": "FORBIDDEN"
}
```

---

### 18. Delete Food Item (restaurant only)

**Request:**
```http
DELETE /api/foods/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (restaurant token)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Food item deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Food item not found",
  "error": "NOT_FOUND"
}
```

**Error Response (403) - Not owner:**
```json
{
  "message": "You can only delete your own food items",
  "error": "FORBIDDEN"
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"Password123!","role":"restaurant"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

### Create Restaurant
```bash
curl -X POST http://localhost:8000/api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Restaurant",
    "address":"Test Address, Almaty",
    "latitude":43.238949,
    "longitude":76.889709,
    "phone":"+77012345678",
    "email":"info@test.com",
    "description":"Test description"
  }'
```

### Get Restaurants
```bash
curl -X GET "http://localhost:8000/api/restaurants?status=approved"
```

### Upload Image
```bash
curl -X POST http://localhost:8000/api/foods/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/image.jpg"
```

---

## 📝 Important Notes

### Data Types
- **latitude/longitude:** Numbers (not strings), with proper decimal precision
- **price/oldPrice:** Numbers (not strings), can be integers or decimals
- **discount:** Integer (percentage, 0-100)
- **quantity:** Integer (positive number)
- **expiresAt:** ISO 8601 timestamp string

### Automatic Fields
- Frontend automatically calculates `discount` from `price` and `oldPrice`
- Frontend automatically geocodes address to get `latitude` and `longitude`
- Backend should auto-generate `created_at` and `updated_at` timestamps

### Validation Rules
- **Email:** Must be valid email format and unique
- **Password:** Minimum 8 characters
- **Phone:** Valid phone format (recommend E.164 format)
- **Latitude:** -90 to 90
- **Longitude:** -180 to 180
- **Discount:** 0 to 100
- **Quantity:** Positive integer
- **Price:** Positive number

---

**Happy Testing!** 🚀
