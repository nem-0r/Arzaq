# ⚡ ARZAQ Backend - Quick Start Guide

## 🎯 Что Было Сделано

### ✅ ЛОГИН И АУТЕНТИФИКАЦИЯ - НЕ ТРОНУТЫ!
Ваша работающая система аутентификации (Google OAuth + обычный логин) **полностью сохранена** и работает как раньше.

### ✨ Что Добавлено

**1. Исправлены баги:**
- `app/core/security.py:161,185` - исправлена проверка ролей (использование enum вместо строк)

**2. Добавлены endpoints для ресторанов:**
- `GET /api/orders/restaurant/orders` - просмотр заказов ресторана
- `PUT /api/orders/{id}/restaurant-update` - обновление статуса заказа
- `POST /api/orders/verify-pickup` - сканирование QR и подтверждение выдачи

**3. Production готовность:**
- Оптимизирован Dockerfile
- Создана database migration
- Написана полная документация

---

## 🚀 Как Задеплоить на Railway

### 1️⃣ Подготовка (5 минут)

```bash
# Создайте аккаунт на Railway
https://railway.app

# Создайте новый проект
# Добавьте PostgreSQL сервис
```

### 2️⃣ Настройка Environment Variables

В Railway Settings → Variables добавьте:

```bash
# Скопируйте все из .env.example
# Замените значения на реальные:

SECRET_KEY=<сгенерируйте: openssl rand -hex 32>
DATABASE_URL=${{Postgres.DATABASE_URL}}
FRONTEND_URL=https://your-app.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=<из Supabase dashboard>
# ... и другие переменные
```

### 3️⃣ Deploy

```bash
# Вариант A: Из GitHub (рекомендуется)
# Push код в GitHub
# В Railway: New Project → Deploy from GitHub

# Вариант B: Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

### 4️⃣ Миграция БД

```bash
# После деплоя, запустите:
railway run alembic upgrade head
```

### 5️⃣ Создайте Админа

Подключитесь к PostgreSQL в Railway и выполните:

```sql
-- Сначала сгенерируйте хеш пароля в Python:
-- from passlib.context import CryptContext
-- pwd_context = CryptContext(schemes=["bcrypt"])
-- print(pwd_context.hash("ваш-пароль"))

INSERT INTO users (
    email, hashed_password, full_name,
    role, is_active, is_approved
) VALUES (
    'admin@arzaq.kz',
    '$2b$12$YOUR_HASHED_PASSWORD',
    'Admin User',
    'admin',
    true,
    true
);
```

### 6️⃣ Тест

```bash
# Проверьте здоровье:
curl https://your-app.railway.app/health

# Откройте Swagger UI:
https://your-app.railway.app/docs
```

---

## 🏪 Complete User Flows

### Клиент (покупатель):
1. **Регистрация**: `POST /api/auth/register` с `role: "client"`
2. **Авто-approve**: Клиенты сразу активны
3. **Просмотр еды**: `GET /api/foods/`
4. **Создание заказа**: `POST /api/orders/` → получает ID заказа
5. **Оплата**: Через PayBox (интеграция на фронтенде)
6. **Подтверждение**: `POST /api/orders/{id}/confirm` → получает QR код
7. **Получение QR**: `GET /api/orders/{id}/qr`
8. **Pickup**: Показать QR ресторану

### Ресторан:
1. **Регистрация**: `POST /api/auth/register` с `role: "restaurant"` + адрес
2. **Ожидание**: is_approved = false (нужен админ)
3. **После approve**:
   - Создать товары: `POST /api/foods/`
   - Загрузить фото: `POST /api/foods/upload-image`
4. **Мониторинг**: `GET /api/orders/restaurant/orders?status_filter=paid`
5. **Подтвердить**: `PUT /api/orders/{id}/restaurant-update?new_status=confirmed`
6. **Готов**: `PUT /api/orders/{id}/restaurant-update?new_status=ready`
7. **Сканировать QR**: `POST /api/orders/verify-pickup?pickup_code=ARZAQ-...`

### Админ:
1. **Pending рестораны**: `GET /api/restaurants/pending`
2. **Approve**: `PUT /api/restaurants/{id}/approve`

---

## 📱 Интеграция с Фронтендом

### Axios Setup (React/Vue/Next.js):

```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'https://your-app.railway.app/api'
});

// Автоматически добавлять токен
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Примеры использования:

```javascript
// Логин
const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const { data } = await api.post('/auth/login', formData);
  localStorage.setItem('token', data.access_token);
  return data;
};

// Получить товары
const getFoods = async () => {
  const { data } = await api.get('/foods/');
  return data;
};

// Создать заказ
const createOrder = async (items) => {
  const { data } = await api.post('/orders/', { items });
  return data;
};

// Для ресторанов: получить заказы
const getRestaurantOrders = async (status) => {
  const { data } = await api.get('/orders/restaurant/orders', {
    params: { status_filter: status }
  });
  return data;
};
```

---

## 🔍 Debugging

### Проверить логи:
```bash
railway logs
```

### Проверить БД:
```bash
railway connect
# Затем: \dt для списка таблиц
```

### Тестировать API:
Откройте: `https://your-app.railway.app/docs`

---

## 📚 Документация

- **DEPLOYMENT.md** - Полное руководство по деплою
- **API_DOCUMENTATION.md** - Все endpoints с примерами
- **IMPLEMENTATION_SUMMARY.md** - Детальный список изменений
- **.env.example** - Шаблон environment variables

---

## ✅ Чеклист Перед Продакшеном

- [ ] Environment variables настроены
- [ ] PostgreSQL подключен
- [ ] Миграции запущены: `alembic upgrade head`
- [ ] Админ пользователь создан
- [ ] Health check работает: `/health`
- [ ] CORS настроен правильно (FRONTEND_URL)
- [ ] Supabase OAuth настроен
- [ ] PayBox credentials добавлены
- [ ] Тестирование через `/docs`
- [ ] Frontend подключен к Railway URL

---

## 🆘 Нужна Помощь?

1. **Проверьте логи**: `railway logs`
2. **Проверьте переменные**: Railway Settings → Variables
3. **Тестируйте через Swagger**: `/docs`
4. **Читайте документацию**: API_DOCUMENTATION.md

---

## 🎉 Готово!

Ваш бэкенд полностью готов к продакшену!

**ВАЖНО:** Логин и аутентификация НЕ ТРОНУТЫ и работают как раньше! ✅
