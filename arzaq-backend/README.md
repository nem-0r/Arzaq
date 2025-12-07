# 🍕 ARZAQ Food Rescue - Backend API

FastAPI backend для платформы спасения еды ARZAQ.

## 📋 О Проекте

ARZAQ - платформа для борьбы с пищевыми отходами, соединяющая рестораны с клиентами для продажи излишков еды по сниженным ценам.

**Архитектура:**
- **Frontend**: React + Vite (Vercel)
- **Backend**: FastAPI + PostgreSQL (Railway) ← Этот репозиторий
- **OAuth**: Supabase (только для Google Auth)
- **Payment**: PayBox Kazakhstan

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.109.0
- **Database**: PostgreSQL + SQLAlchemy 2.0
- **Authentication**: JWT + Supabase OAuth
- **Payment**: PayBox Kazakhstan
- **QR Codes**: qrcode + Pillow
- **Deployment**: Railway

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Pip/Poetry

### 2. Installation

```bash
# Clone repository
cd arzaq-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb arzaq_db

# Run migrations (optional, tables auto-create on first run)
alembic upgrade head
```

### 4. Run Server

```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API will be available at:
# - http://localhost:8000
# - Docs: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
```

## 📁 Project Structure

```
arzaq-backend/
├── app/
│   ├── core/              # Config, database, security
│   │   ├── config.py      # Settings
│   │   ├── database.py    # SQLAlchemy setup
│   │   └── security.py    # JWT, password hashing
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py        # User & Restaurant
│   │   ├── food.py        # Food items
│   │   ├── order.py       # Orders & OrderItems
│   │   ├── reservation.py # 10-min inventory hold
│   │   └── payment.py     # PayBox payments
│   ├── schemas/           # Pydantic schemas
│   │   ├── user.py
│   │   ├── food.py
│   │   ├── order.py
│   │   └── payment.py
│   ├── routers/           # API endpoints
│   │   ├── auth.py        # Registration, login, OAuth
│   │   ├── foods.py       # CRUD for foods
│   │   ├── restaurants.py # Restaurant management
│   │   ├── orders.py      # Order creation, QR codes
│   │   └── payments.py    # PayBox integration
│   └── utils/             # Helpers
├── alembic/               # Database migrations
├── uploads/               # File uploads (images, QR codes)
├── main.py                # FastAPI app entry point
├── requirements.txt       # Python dependencies
├── Dockerfile             # Railway deployment
└── .env.example           # Environment variables template
```

## 🔐 Environment Variables

See `.env.example` for all required variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/arzaq_db

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Supabase (for OAuth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_SERVICE_KEY=your-service-key

# Frontend (CORS)
FRONTEND_URL=https://arzaqmeal.vercel.app

# PayBox Kazakhstan
PAYBOX_MERCHANT_ID=your_merchant_id
PAYBOX_SECRET_KEY=your_secret_key
```

## 📚 API Documentation

After running the server, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/supabase` - Supabase OAuth
- `GET /api/auth/me` - Get current user

**Foods:**
- `GET /api/foods` - List all available foods
- `POST /api/foods` - Create food (restaurant only)
- `PUT /api/foods/{id}` - Update food
- `DELETE /api/foods/{id}` - Delete food

**Restaurants:**
- `GET /api/restaurants` - List approved restaurants
- `GET /api/restaurants/pending` - Pending approval (admin)
- `PUT /api/restaurants/{id}/approve` - Approve restaurant (admin)

**Orders:**
- `POST /api/orders` - Create order (reserves inventory for 10 min)
- `GET /api/orders` - Get user's orders
- `POST /api/orders/{id}/confirm` - Confirm after payment
- `GET /api/orders/{id}/qr` - Get QR code for pickup

**Payments:**
- `POST /api/payments/initiate` - Start PayBox payment
- `POST /api/payments/callback` - PayBox webhook
- `GET /api/payments/{order_id}` - Get payment status

## 🎯 Key Features

### 1. 10-Minute Inventory Reservation

When user creates order, items are reserved for 10 minutes:

```python
# Creates reservation
reservation = Reservation(
    user_id=user_id,
    food_id=food_id,
    quantity=quantity,
    expires_at=datetime.utcnow() + timedelta(minutes=10)
)
```

After payment confirmation, reservation converts to confirmed and quantity deducted.

### 2. QR Code Generation

After successful payment:

```python
pickup_code = f"ARZAQ-{order.id}-{uuid.uuid4().hex[:8].upper()}"
qr_code_path = generate_qr_code(pickup_code)
```

User shows QR code at restaurant for pickup.

### 3. Split Payment (90/10)

- **90%** goes to restaurant
- **10%** platform fee

```python
restaurant_amount = item_subtotal * 0.9
platform_amount = item_subtotal * 0.1
```

### 4. Supabase OAuth Integration

Frontend authenticates via Supabase, backend verifies token:

```python
# Verify Supabase JWT
payload = verify_supabase_token(supabase_token)
# Create/update user in our DB
# Return our own JWT for API calls
```

## 🚂 Railway Deployment

See `RAILWAY_DEPLOYMENT.md` for detailed deployment guide.

**Quick steps:**
1. Create Railway project
2. Add PostgreSQL service
3. Set environment variables
4. Deploy from GitHub
5. Set root directory to `arzaq-backend`

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest

# Check code style
black app/
flake8 app/
```

## 📝 Database Models

### User (Client, Restaurant, Admin)
- Email, password (hashed), full name
- Role: client, restaurant, admin
- Restaurant fields: address, phone, lat/lng
- Approval status for restaurants

### Food
- Name, description, image
- Price, old_price, discount
- Quantity (total), available_quantity (after reservations)
- Restaurant ID (foreign key)
- Expiration time

### Order
- User ID, status (pending, paid, completed)
- Items (OrderItem relationship)
- Total, platform fee
- QR code, pickup code

### Reservation
- Holds inventory for 10 minutes
- Links user, food, quantity
- Expires automatically

### Payment
- PayBox integration
- Order ID, amount, status
- Transaction tracking

## 🔒 Security

- **Passwords**: Bcrypt hashing
- **JWT**: HS256 algorithm, 30-day expiration
- **CORS**: Restricted to frontend domain
- **SQL Injection**: Protected by SQLAlchemy ORM
- **File Upload**: Size & type validation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

ARZAQ Development Team

## 🙏 Acknowledgments

- FastAPI documentation
- Railway platform
- Supabase for OAuth
- PayBox Kazakhstan for payments
