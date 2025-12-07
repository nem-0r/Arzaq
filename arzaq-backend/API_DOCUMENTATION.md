# 📚 ARZAQ API Documentation

Base URL: `https://your-backend.railway.app`

All endpoints return JSON. Authentication uses JWT Bearer tokens.

---

## 🔐 Authentication Endpoints

### 1. Register New User
**POST** `/api/auth/register`

Register a new client or restaurant account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "role": "client"  // "client" or "restaurant"
}
```

**For Restaurant Registration (additional fields required):**
```json
{
  "email": "restaurant@example.com",
  "password": "securepassword123",
  "full_name": "Best Restaurant",
  "role": "restaurant",
  "address": "123 Main Street, Almaty",
  "phone": "+77001234567",
  "description": "We serve the best food in town"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "client",
  "is_active": true,
  "is_approved": true,
  "created_at": "2024-12-07T10:00:00Z"
}
```

**Notes:**
- Clients are auto-approved
- Restaurants require admin approval (is_approved = false initially)

---

### 2. Login
**POST** `/api/auth/login`

Login with email and password.

**Request Body (form-data):**
```
username: user@example.com
password: securepassword123
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Usage:**
Include token in all authenticated requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3. Google OAuth (Supabase)
**POST** `/api/auth/supabase`

Authenticate using Google OAuth via Supabase.

**Request Body:**
```json
{
  "email": "user@gmail.com",
  "full_name": "John Doe",
  "google_id": "google-user-id-123",
  "supabase_token": "supabase-jwt-token",
  "role": "client"  // or "restaurant"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "full_name": "John Doe",
    "role": "client",
    "is_active": true,
    "is_approved": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 4. Get Current User
**GET** `/api/auth/me`

Get authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "client",
  "is_active": true,
  "is_approved": true,
  "phone": null,
  "address": null,
  "created_at": "2024-12-07T10:00:00Z"
}
```

---

## 🍔 Food Endpoints

### 1. Get All Foods
**GET** `/api/foods/`

Get all available food items.

**Query Parameters:**
- `restaurant_id` (optional): Filter by restaurant ID
- `available_only` (default: true): Show only available items
- `skip` (default: 0): Pagination offset
- `limit` (default: 100): Number of items

**Example:**
```
GET /api/foods/?restaurant_id=5&available_only=true&skip=0&limit=20
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "Fresh tomatoes and mozzarella",
    "image": "/uploads/abc123.jpg",
    "price": 2500,
    "old_price": 3500,
    "discount": 28,
    "quantity": 10,
    "is_available": true,
    "expires_at": "2024-12-07T20:00:00Z",
    "restaurant_id": 5,
    "restaurant_name": "Best Pizza",
    "created_at": "2024-12-07T10:00:00Z"
  }
]
```

---

### 2. Create Food Item (Restaurant Only)
**POST** `/api/foods/`

Create a new food item. Requires approved restaurant role.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Request Body:**
```json
{
  "name": "Pizza Margherita",
  "description": "Fresh tomatoes and mozzarella",
  "image": "/uploads/abc123.jpg",
  "price": 2500,
  "old_price": 3500,
  "quantity": 10,
  "expires_at": "2024-12-07T20:00:00"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Pizza Margherita",
  "description": "Fresh tomatoes and mozzarella",
  "image": "/uploads/abc123.jpg",
  "price": 2500,
  "old_price": 3500,
  "discount": 28,
  "quantity": 10,
  "is_available": true,
  "expires_at": "2024-12-07T20:00:00Z",
  "restaurant_id": 5,
  "restaurant_name": "Best Pizza",
  "created_at": "2024-12-07T10:00:00Z"
}
```

---

### 3. Upload Food Image (Restaurant Only)
**POST** `/api/foods/upload-image`

Upload image for food item.

**Headers:**
```
Authorization: Bearer <restaurant-token>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: <image-file>  // Max 5MB, formats: jpg, jpeg, png, webp
```

**Response (200):**
```json
{
  "image_url": "/uploads/uuid-generated-filename.jpg"
}
```

---

### 4. Get My Foods (Restaurant Only)
**GET** `/api/foods/me`

Get all food items for current restaurant.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Pizza Margherita",
    "price": 2500,
    "quantity": 10,
    "is_available": true,
    "created_at": "2024-12-07T10:00:00Z"
  }
]
```

---

### 5. Update Food Item (Restaurant Only)
**PUT** `/api/foods/{food_id}`

Update food item. Can only update own items.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Request Body:**
```json
{
  "price": 2000,
  "quantity": 15,
  "is_available": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Pizza Margherita",
  "price": 2000,
  "quantity": 15,
  "is_available": true,
  "updated_at": "2024-12-07T12:00:00Z"
}
```

---

### 6. Delete Food Item (Restaurant Only)
**DELETE** `/api/foods/{food_id}`

Delete food item. Can only delete own items.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Response (204):**
No content

---

## 🏪 Restaurant Endpoints

### 1. Get All Restaurants
**GET** `/api/restaurants/`

Get all restaurants.

**Query Parameters:**
- `approved_only` (default: true): Show only approved restaurants
- `skip` (default: 0): Pagination offset
- `limit` (default: 100): Number of items

**Response (200):**
```json
[
  {
    "id": 5,
    "email": "restaurant@example.com",
    "full_name": "Best Restaurant",
    "role": "restaurant",
    "is_active": true,
    "is_approved": true,
    "phone": "+77001234567",
    "address": "123 Main Street, Almaty",
    "description": "We serve the best food",
    "latitude": 43.2220,
    "longitude": 76.8512,
    "rating": 4.5,
    "created_at": "2024-12-07T10:00:00Z"
  }
]
```

---

### 2. Get Pending Restaurants (Admin Only)
**GET** `/api/restaurants/pending`

Get restaurants awaiting approval.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
[
  {
    "id": 6,
    "full_name": "New Restaurant",
    "is_approved": false,
    "created_at": "2024-12-07T11:00:00Z"
  }
]
```

---

### 3. Approve Restaurant (Admin Only)
**PUT** `/api/restaurants/{restaurant_id}/approve`

Approve a restaurant.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "id": 6,
  "full_name": "New Restaurant",
  "is_approved": true
}
```

---

### 4. Reject Restaurant (Admin Only)
**PUT** `/api/restaurants/{restaurant_id}/reject`

Reject a restaurant application.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "id": 6,
  "full_name": "New Restaurant",
  "is_approved": false,
  "is_active": false
}
```

---

## 📦 Order Endpoints

### 1. Create Order (Client)
**POST** `/api/orders/`

Create a new order. This creates reservations and pending order.

**Headers:**
```
Authorization: Bearer <client-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "food_id": 1,
      "quantity": 2
    },
    {
      "food_id": 3,
      "quantity": 1
    }
  ],
  "notes": "Please prepare by 6pm"
}
```

**Response (201):**
```json
{
  "id": 10,
  "user_id": 1,
  "status": "pending",
  "subtotal": 7500,
  "platform_fee": 750,
  "total": 8250,
  "pickup_code": null,
  "qr_code_path": null,
  "notes": "Please prepare by 6pm",
  "created_at": "2024-12-07T12:00:00Z",
  "items": [
    {
      "id": 1,
      "food_id": 1,
      "food_name": "Pizza Margherita",
      "quantity": 2,
      "price": 2500,
      "subtotal": 5000,
      "restaurant_amount": 4500,
      "platform_amount": 500
    },
    {
      "id": 2,
      "food_id": 3,
      "food_name": "Pasta Carbonara",
      "quantity": 1,
      "price": 2500,
      "subtotal": 2500,
      "restaurant_amount": 2250,
      "platform_amount": 250
    }
  ]
}
```

**Notes:**
- Items are reserved for 10 minutes
- Proceed to payment within 10 minutes
- After payment, call `/orders/{order_id}/confirm`

---

### 2. Get My Orders (Client)
**GET** `/api/orders/`

Get all orders for authenticated user.

**Headers:**
```
Authorization: Bearer <client-token>
```

**Response (200):**
```json
[
  {
    "id": 10,
    "status": "paid",
    "total": 8250,
    "pickup_code": "ARZAQ-10-ABC123",
    "created_at": "2024-12-07T12:00:00Z",
    "items": [...]
  }
]
```

---

### 3. Get Order by ID
**GET** `/api/orders/{order_id}`

Get specific order details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 10,
  "status": "paid",
  "total": 8250,
  "pickup_code": "ARZAQ-10-ABC123",
  "qr_code_path": "/uploads/qr_codes/ARZAQ-10-ABC123.png",
  "items": [...]
}
```

---

### 4. Confirm Payment
**POST** `/api/orders/{order_id}/confirm`

Confirm order after successful payment. Usually called by PayBox webhook.

**Headers:**
```
Authorization: Bearer <client-token>
```

**Response (200):**
```json
{
  "id": 10,
  "status": "paid",
  "paid_at": "2024-12-07T12:10:00Z",
  "pickup_code": "ARZAQ-10-ABC123",
  "qr_code_path": "/uploads/qr_codes/ARZAQ-10-ABC123.png",
  "items": [...]
}
```

**This endpoint:**
- Updates order status to PAID
- Generates pickup code and QR code
- Confirms reservations
- Deducts inventory

---

### 5. Get QR Code
**GET** `/api/orders/{order_id}/qr`

Get QR code for pickup.

**Headers:**
```
Authorization: Bearer <client-token>
```

**Response (200):**
```json
{
  "pickup_code": "ARZAQ-10-ABC123",
  "qr_code_url": "/uploads/qr_codes/ARZAQ-10-ABC123.png"
}
```

---

## 🏪 Restaurant Order Management

### 1. Get Restaurant Orders
**GET** `/api/orders/restaurant/orders`

Get all orders containing current restaurant's food items.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Query Parameters:**
- `status_filter` (optional): Filter by status (pending, paid, confirmed, ready, completed, cancelled)

**Example:**
```
GET /api/orders/restaurant/orders?status_filter=paid
```

**Response (200):**
```json
[
  {
    "id": 10,
    "user_id": 1,
    "status": "paid",
    "total": 8250,
    "pickup_code": "ARZAQ-10-ABC123",
    "created_at": "2024-12-07T12:00:00Z",
    "items": [
      {
        "id": 1,
        "food_id": 1,
        "food_name": "Pizza Margherita",
        "quantity": 2,
        "price": 2500
      }
    ]
  }
]
```

---

### 2. Update Order Status (Restaurant)
**PUT** `/api/orders/{order_id}/restaurant-update`

Update order status to confirmed or ready.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Query Parameters:**
- `new_status`: "confirmed" or "ready"

**Example:**
```
PUT /api/orders/10/restaurant-update?new_status=ready
```

**Response (200):**
```json
{
  "id": 10,
  "status": "ready",
  "total": 8250,
  "items": [...]
}
```

**Status Transitions:**
- PAID → CONFIRMED (restaurant confirms order)
- CONFIRMED → READY (food is ready for pickup)

---

### 3. Verify Pickup (Restaurant QR Scanner)
**POST** `/api/orders/verify-pickup`

Scan customer's QR code and mark order as completed.

**Headers:**
```
Authorization: Bearer <restaurant-token>
```

**Query Parameters:**
- `pickup_code`: The pickup code from QR code

**Example:**
```
POST /api/orders/verify-pickup?pickup_code=ARZAQ-10-ABC123
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order picked up successfully",
  "order_id": 10,
  "customer_name": "John Doe",
  "completed_at": "2024-12-07T14:00:00Z"
}
```

---

## 🔄 Complete Order Flow

### For Clients:
1. Browse foods: `GET /api/foods/`
2. Create order: `POST /api/orders/`
3. **Complete payment via PayBox** (external)
4. Confirm payment: `POST /api/orders/{id}/confirm`
5. Get QR code: `GET /api/orders/{id}/qr`
6. Show QR at restaurant for pickup

### For Restaurants:
1. Register: `POST /api/auth/register` (role: restaurant)
2. **Wait for admin approval**
3. Create food items: `POST /api/foods/`
4. Monitor orders: `GET /api/orders/restaurant/orders?status_filter=paid`
5. Confirm order: `PUT /api/orders/{id}/restaurant-update?new_status=confirmed`
6. Prepare food
7. Mark ready: `PUT /api/orders/{id}/restaurant-update?new_status=ready`
8. Scan customer QR: `POST /api/orders/verify-pickup?pickup_code=...`

### For Admins:
1. View pending restaurants: `GET /api/restaurants/pending`
2. Approve: `PUT /api/restaurants/{id}/approve`
3. Or reject: `PUT /api/restaurants/{id}/reject`

---

## ⚡ Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🔒 Authentication

All protected endpoints require JWT token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.railway.app/api/orders/
```

---

## 🧪 Testing

Interactive API docs available at:
- Swagger UI: `https://your-backend.railway.app/docs`
- ReDoc: `https://your-backend.railway.app/redoc`

---

## 📱 Frontend Integration

### Setting up Axios interceptor:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend.railway.app/api'
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example usage:

```javascript
// Login
const { data } = await api.post('/auth/login', {
  username: 'user@example.com',
  password: 'password123'
});
localStorage.setItem('token', data.access_token);

// Get foods
const foods = await api.get('/foods/');

// Create order
const order = await api.post('/orders/', {
  items: [
    { food_id: 1, quantity: 2 }
  ]
});
```
