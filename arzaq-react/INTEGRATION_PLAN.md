# 🎯 SENIOR-LEVEL INTEGRATION PLAN: Frontend ↔️ Backend

**Дата:** 2025-12-06
**Статус:** Ready for Implementation
**Приоритет:** CRITICAL

---

## 📊 ТЕКУЩАЯ СИТУАЦИЯ

### ✅ Что РАБОТАЕТ (НЕ ТРОГАЕМ!)

#### Authentication & Google OAuth
- ✅ `/api/auth/register` - Регистрация пользователей
- ✅ `/api/auth/login` - OAuth2 логин (form-data)
- ✅ `/api/auth/me` - Получение текущего пользователя
- ✅ `/api/auth/supabase` - Supabase OAuth (Google)
- ✅ Google OAuth flow через Supabase

#### Core Food & Restaurant APIs
- ✅ `/api/foods` - CRUD операции с продуктами
- ✅ `/api/foods/me` - Продукты ресторана
- ✅ `/api/foods/upload-image` - Загрузка изображений
- ✅ `/api/restaurants` - Список ресторанов
- ✅ `/api/restaurants/{id}` - Детали ресторана
- ✅ `/api/restaurants/pending` - Ожидающие одобрения
- ✅ `/api/restaurants/{id}/approve` - Одобрение
- ✅ `/api/restaurants/{id}/reject` - Отклонение
- ✅ `/api/orders` - Система заказов
- ✅ `/api/payments` - PayBox интеграция

---

## ❌ ЧТО ОТСУТСТВУЕТ

### Critical Missing Features (используются на фронтенде)

#### 1. Community System (CommunityPage)
```
❌ POST   /api/posts                    - Создать пост
❌ GET    /api/posts                    - Получить посты (pagination)
❌ GET    /api/posts/{id}               - Получить пост по ID
❌ PUT    /api/posts/{id}               - Обновить пост
❌ DELETE /api/posts/{id}               - Удалить пост
❌ POST   /api/posts/{id}/like          - Лайк/анлайк
❌ GET    /api/posts/{id}/likes         - Список лайков
❌ GET    /api/posts/{id}/comments      - Комментарии поста
❌ POST   /api/posts/{id}/comments      - Создать комментарий
❌ DELETE /api/comments/{id}            - Удалить комментарий
```

#### 2. Notifications System (NotificationsPage)
```
❌ GET    /api/users/me/notifications               - Мои уведомления
❌ GET    /api/users/me/notifications/unread-count  - Количество непрочитанных
❌ PUT    /api/users/me/notifications/{id}/read     - Отметить как прочитанное
❌ PUT    /api/users/me/notifications/mark-all-read - Отметить все
❌ DELETE /api/users/me/notifications/{id}          - Удалить
❌ DELETE /api/users/me/notifications/clear-all     - Удалить все
```

#### 3. User Impact/Statistics (ProfilePage)
```
❌ GET    /api/users/me/impact        - Моя статистика (meals saved, CO2 etc)
❌ PUT    /api/users/me/impact/goals  - Обновить цели
❌ GET    /api/users/{id}/impact      - Статистика пользователя
```

#### 4. General Upload
```
❌ POST   /api/upload/image   - Общая загрузка изображений (для постов)
❌ DELETE /api/upload/image   - Удаление изображений
```

#### 5. Users API
```
❌ GET    /api/users/{id}     - Получить пользователя по ID
```

#### 6. Places API (MapPage - если используется)
```
❌ GET    /api/places         - Список мест
❌ POST   /api/places         - Создать место
❌ GET    /api/places/{id}    - Детали места
❌ PUT    /api/places/{id}    - Обновить место
❌ DELETE /api/places/{id}    - Удалить место
```

---

## 🔧 НЕСООТВЕТСТВИЯ (требуют фикса)

### 1. Frontend → Backend Naming
| Frontend Service | Frontend Endpoint | Backend Endpoint | Action |
|------------------|-------------------|------------------|---------|
| `restaurantService.approveRestaurant()` | `POST /api/restaurants/{id}/approve` | `PUT /api/restaurants/{id}/approve` | ✅ Frontend correct, Backend uses PUT |
| `restaurantService.rejectRestaurant()` | `POST /api/restaurants/{id}/reject` | `PUT /api/restaurants/{id}/reject` | ✅ Frontend correct, Backend uses PUT |
| `authService.googleLogin()` | `POST /api/auth/google/login` | `POST /api/auth/supabase` | 🔄 Нужен endpoint или redirect |
| `authService.googleRegister()` | `POST /api/auth/google/register` | `POST /api/auth/supabase` | 🔄 Нужен endpoint или redirect |

### 2. Missing Backend Endpoints для Restaurant
```
❌ POST /api/restaurants      - Создание ресторана (есть только в authService?)
❌ PUT  /api/restaurants/{id} - Обновление ресторана
❌ GET  /api/restaurants/me   - Мой ресторан
```

### 3. Query Parameters
Backend должен поддерживать фильтрацию:
```
GET /api/restaurants?status=approved&search=query
GET /api/foods?restaurant_id=X&available_only=true&limit=20
```

---

## 📋 ПЛАН ДЕЙСТВИЙ

### PHASE 1: Исправить Frontend Services (адаптировать под существующий Backend)

#### 1.1 Auth Service ✅ НЕ ТРОГАЕМ
- Login/Register/Supabase работают
- Google OAuth через Supabase работает

#### 1.2 Food Service
```diff
- GET /api/foods/search         → Не реализовано в backend (удалить или оставить)
+ Все остальные endpoints работают
```

#### 1.3 Restaurant Service
```javascript
// Нужно добавить в backend:
- POST /api/restaurants        - Create restaurant
- PUT  /api/restaurants/{id}   - Update restaurant
- GET  /api/restaurants/me     - Get my restaurant
- DELETE /api/restaurants/{id} - Delete restaurant
```

### PHASE 2: Добавить Backend Endpoints для новой функциональности

#### 2.1 Community System (НОВЫЙ РОУТЕР)
Создать: `app/routers/posts.py`
```python
- POST   /api/posts
- GET    /api/posts
- GET    /api/posts/{id}
- PUT    /api/posts/{id}
- DELETE /api/posts/{id}
- POST   /api/posts/{id}/like
- GET    /api/posts/{id}/likes
- GET    /api/posts/{id}/comments
- POST   /api/posts/{id}/comments
```

Создать: `app/routers/comments.py`
```python
- DELETE /api/comments/{id}
- PUT    /api/comments/{id}
```

#### 2.2 Notifications System (НОВЫЙ РОУТЕР)
Создать: `app/routers/notifications.py`
```python
- GET    /api/users/me/notifications
- GET    /api/users/me/notifications/unread-count
- PUT    /api/users/me/notifications/{id}/read
- PUT    /api/users/me/notifications/mark-all-read
- DELETE /api/users/me/notifications/{id}
- DELETE /api/users/me/notifications/clear-all
```

#### 2.3 User Impact (ДОБАВИТЬ В users.py)
```python
- GET /api/users/{id}
- GET /api/users/me/impact
- PUT /api/users/me/impact/goals
- GET /api/users/{id}/impact
```

#### 2.4 Upload Service (ОБНОВИТЬ foods.py)
```python
- POST   /api/upload/image   (generic upload)
- DELETE /api/upload/image
```

---

## 🏗️ СТРУКТУРА ИЗМЕНЕНИЙ

### Backend Changes

```
app/routers/
├── auth.py           ✅ НЕ ТРОГАЕМ
├── foods.py          🔄 Добавить /api/upload/image
├── restaurants.py    ➕ Добавить POST, PUT, DELETE, /me
├── orders.py         ✅ НЕ ТРОГАЕМ
├── payments.py       ✅ НЕ ТРОГАЕМ
├── posts.py          ➕ СОЗДАТЬ НОВЫЙ
├── comments.py       ➕ СОЗДАТЬ НОВЫЙ
├── notifications.py  ➕ СОЗДАТЬ НОВЫЙ
└── users.py          ➕ СОЗДАТЬ НОВЫЙ

app/models/
├── user.py          ✅ НЕ ТРОГАЕМ
├── food.py          ✅ НЕ ТРОГАЕМ
├── order.py         ✅ НЕ ТРОГАЕМ
├── payment.py       ✅ НЕ ТРОГАЕМ
├── post.py          ➕ СОЗДАТЬ
├── comment.py       ➕ СОЗДАТЬ
├── notification.py  ➕ СОЗДАТЬ
├── like.py          ➕ СОЗДАТЬ
└── user_impact.py   ➕ СОЗДАТЬ

app/schemas/
├── user.py          ✅ НЕ ТРОГАЕМ
├── food.py          ✅ НЕ ТРОГАЕМ
├── order.py         ✅ НЕ ТРОГАЕМ
├── payment.py       ✅ НЕ ТРОГАЕМ
├── post.py          ➕ СОЗДАТЬ
├── comment.py       ➕ СОЗДАТЬ
├── notification.py  ➕ СОЗДАТЬ
└── user_impact.py   ➕ СОЗДАТЬ
```

### Frontend Changes

```
src/api/services/
├── auth.service.js         ✅ НЕ ТРОГАЕМ
├── food.service.js         🔄 Проверить endpoints
├── restaurant.service.js   🔄 Обновить endpoints
├── post.service.js         🔄 Проверить endpoints
├── comment.service.js      🔄 Проверить endpoints
├── notification.service.js 🔄 Проверить endpoints
├── like.service.js         🔄 Проверить endpoints
├── impact.service.js       🔄 Проверить endpoints
├── upload.service.js       🔄 Проверить endpoints
└── user.service.js         🔄 Проверить endpoints
```

---

## 🎯 ПРИОРИТЕТЫ

### 🔴 КРИТИЧНО (блокирует функциональность)
1. **Restaurants endpoints** - без них не работает RestaurantDashboard
2. **Posts/Comments system** - без них не работает CommunityPage
3. **Upload service** - без него нельзя загружать изображения к постам

### 🟡 ВАЖНО (желательно)
4. **Notifications system** - без него не работает NotificationsPage
5. **User Impact stats** - без них неполный ProfilePage

### 🟢 ОПЦИОНАЛЬНО
6. **Places API** - если нужен для MapPage

---

## ✅ КРИТЕРИИ УСПЕХА

1. **Все страницы загружаются без ошибок 404/500**
2. **Google OAuth работает** (auth не трогаем!)
3. **RestaurantDashboard полностью функционален**
4. **CommunityPage может создавать/читать посты**
5. **NotificationsPage показывает уведомления**
6. **HomePage показывает доступные продукты**
7. **Нет Mixed Content Errors**
8. **Все API вызовы используют HTTPS в production**

---

## 🚀 NEXT STEPS

1. ✅ **Создать модели** для Posts, Comments, Notifications, UserImpact
2. ✅ **Создать schemas** для валидации данных
3. ✅ **Создать роутеры** с endpoints
4. ✅ **Обновить main.py** - подключить новые роутеры
5. ✅ **Обновить frontend services** - проверить endpoints
6. ✅ **Протестировать интеграцию** - каждый endpoint
7. ✅ **Деплой на Railway** - проверка в production

---

**Документ создан:** Senior Developer Analysis
**Готов к реализации:** YES ✅
