# 🚀 RAILWAY DEPLOYMENT GUIDE - ARZAQ BACKEND

Пошаговая инструкция по развертыванию FastAPI backend + PostgreSQL на Railway.

---

## 📋 ЧТО ТАКОЕ RAILWAY?

Railway - это Platform as a Service (PaaS) для развертывания приложений:
- ✅ **Бесплатный тариф**: $5 кредитов в месяц (достаточно для MVP)
- ✅ **PostgreSQL included**: Бесплатная база данных PostgreSQL
- ✅ **No sleep mode**: В отличие от Render, сервисы не засыпают
- ✅ **Automatic HTTPS**: SSL сертификаты автоматически
- ✅ **Environment variables**: Удобное управление переменными

---

## 🔧 ШАГ 1: ПОДГОТОВКА К DEPLOY

### 1.1 Проверить файлы проекта

Убедитесь что в папке `arzaq-backend/` есть:

```
arzaq-backend/
├── app/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── ...
├── alembic/
├── uploads/
├── main.py
├── requirements.txt
├── Dockerfile
├── Procfile
├── railway.json
├── .env.example
└── .gitignore
```

### 1.2 Создать .env файл (локально для тестирования)

Скопируйте `.env.example` в `.env` и заполните:

```bash
cp .env.example .env
```

**НЕ КОММИТЬТЕ .env В GIT!** (он в .gitignore)

---

## 🚂 ШАГ 2: СОЗДАНИЕ ПРОЕКТА НА RAILWAY

### 2.1 Регистрация

1. Откройте https://railway.app
2. Нажмите "Login" или "Start a New Project"
3. Войдите через GitHub (рекомендуется)

### 2.2 Создать новый проект

1. Нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите репозиторий `Arzaq-project` (или как называется ваш)
4. Railway автоматически обнаружит проект

### 2.3 Настроить Root Directory (ВАЖНО!)

Railway по умолчанию ищет файлы в корне репозитория, но наш backend в папке `arzaq-backend/`:

1. В настройках проекта найдите **"Root Directory"**
2. Установите: `arzaq-backend`
3. Сохраните

---

## 🗄️ ШАГ 3: ДОБАВИТЬ POSTGRESQL

### 3.1 Создать PostgreSQL сервис

1. В проекте нажмите "New Service"
2. Выберите "Database" → "Add PostgreSQL"
3. Railway автоматически создаст базу данных
4. Подождите 1-2 минуты

### 3.2 Получить DATABASE_URL

1. Откройте созданную PostgreSQL базу
2. Перейдите на вкладку "Connect"
3. Скопируйте **"Postgres Connection URL"**

Формат будет примерно такой:
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

**Сохраните этот URL!** Он понадобится для environment variables.

---

## ⚙️ ШАГ 4: НАСТРОИТЬ ENVIRONMENT VARIABLES

### 4.1 Перейти в Variables

1. Откройте ваш backend service (не PostgreSQL)
2. Перейдите на вкладку "Variables"
3. Нажмите "New Variable"

### 4.2 Добавить все переменные

Добавьте следующие переменные:

```env
# Database (скопируйте из PostgreSQL service)
DATABASE_URL=postgresql://postgres:password@...

# JWT Configuration
SECRET_KEY=your-super-secret-key-CHANGE-THIS-TO-RANDOM-STRING
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Supabase (из вашего Supabase проекта)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Frontend (для CORS)
FRONTEND_URL=https://arzaqmeal.vercel.app
FRONTEND_DEV_URL=http://localhost:5173

# PayBox Kazakhstan (получите от PayBox)
PAYBOX_MERCHANT_ID=your_merchant_id
PAYBOX_SECRET_KEY=your_secret_key
PAYBOX_PAYMENT_URL=https://api.paybox.money/payment.php
PAYBOX_SUCCESS_URL=https://arzaqmeal.vercel.app/payment/success
PAYBOX_FAILURE_URL=https://arzaqmeal.vercel.app/payment/failure
PAYBOX_RESULT_URL=https://your-backend-url.railway.app/api/payments/callback

# Platform Fee
PLATFORM_FEE_PERCENTAGE=10

# File Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,webp

# QR Codes
QR_CODE_DIR=./uploads/qr_codes

# Reservation
RESERVATION_TIMEOUT_MINUTES=10

# Environment
ENVIRONMENT=production
```

**ВАЖНО:** После deployment получите URL вашего backend и обновите `PAYBOX_RESULT_URL`.

---

## 🚀 ШАГ 5: DEPLOY!

### 5.1 Запустить deploy

1. Railway автоматически начнет deploy после добавления переменных
2. Или нажмите "Deploy" вручную
3. Следите за логами в разделе "Deployments"

### 5.2 Проверить build

Railway будет:
1. Клонировать репозиторий
2. Установить зависимости из `requirements.txt`
3. Запустить `uvicorn main:app`

Если есть ошибки - проверьте logs.

### 5.3 Получить URL

1. После успешного deploy перейдите в "Settings"
2. В разделе "Networking" найдите "Public URL"
3. Нажмите "Generate Domain"
4. Скопируйте URL (например: `https://arzaq-backend-production.up.railway.app`)

---

## 🗃️ ШАГ 6: СОЗДАТЬ ТАБЛИЦЫ В БД

### 6.1 Подключиться к базе данных

Railway автоматически создает таблицы через `Base.metadata.create_all()` в `main.py`.

Но если нужно создать миграции через Alembic:

1. Установите Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Логин:
   ```bash
   railway login
   ```

3. Подключитесь к проекту:
   ```bash
   railway link
   ```

4. Создайте миграцию:
   ```bash
   railway run alembic revision --autogenerate -m "Initial migration"
   ```

5. Примените миграцию:
   ```bash
   railway run alembic upgrade head
   ```

### 6.2 Альтернатива: Автоматическое создание таблиц

Таблицы создаются автоматически при первом запуске благодаря:

```python
# main.py
Base.metadata.create_all(bind=engine)
```

---

## 👤 ШАГ 7: СОЗДАТЬ ADMIN ПОЛЬЗОВАТЕЛЯ

### 7.1 Подключиться к PostgreSQL

Используйте Railway CLI или pgAdmin:

```bash
railway connect postgres
```

### 7.2 Создать admin пользователя

```sql
INSERT INTO users (
  email,
  hashed_password,
  full_name,
  role,
  is_active,
  is_approved,
  created_at
) VALUES (
  'admin@arzaq.kz',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVJEkqNxW6',  -- password: admin123
  'ARZAQ Admin',
  'admin',
  true,
  true,
  NOW()
);
```

**ВАЖНО:** Смените пароль после первого входа!

Или создайте через API endpoint:

```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arzaq.kz",
    "password": "admin123",
    "full_name": "ARZAQ Admin",
    "role": "admin"
  }'
```

Затем вручную в БД установите `role='admin'` и `is_approved=true`.

---

## ✅ ШАГ 8: ПРОВЕРИТЬ DEPLOYMENT

### 8.1 Проверить health endpoint

```bash
curl https://your-backend.railway.app/health
```

Ответ должен быть:
```json
{"status": "healthy"}
```

### 8.2 Проверить API docs

Откройте в браузере:
```
https://your-backend.railway.app/docs
```

Вы должны увидеть Swagger UI с всеми endpoints.

### 8.3 Проверить CORS

Попробуйте вызвать API с вашего frontend (Vercel):

```javascript
fetch('https://your-backend.railway.app/api/foods')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🔗 ШАГ 9: ПОДКЛЮЧИТЬ FRONTEND

### 9.1 Обновить Frontend Environment Variables

В Vercel dashboard для `arzaq-react`:

```env
VITE_API_BASE_URL=https://your-backend.railway.app
```

### 9.2 Redeploy Frontend

1. Vercel автоматически redeploy при изменении env vars
2. Или сделайте git push для redeploy

---

## 🎯 ШАГ 10: НАСТРОИТЬ PAYBOX CALLBACK

### 10.1 В PayBox Dashboard

1. Войдите в PayBox merchant dashboard
2. Найдите "Callback URL" или "Result URL"
3. Установите:
   ```
   https://your-backend.railway.app/api/payments/callback
   ```

### 10.2 Обновить environment variable

Обновите `PAYBOX_RESULT_URL` в Railway:

```env
PAYBOX_RESULT_URL=https://your-backend.railway.app/api/payments/callback
```

---

## 📊 MONITORING & LOGS

### Просмотр логов

В Railway dashboard:
1. Откройте backend service
2. Перейдите на вкладку "Deployments"
3. Нажмите "View Logs"

### Метрики

Railway показывает:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🔒 SECURITY CHECKLIST

Перед production:

- [ ] SECRET_KEY установлен на случайную строку (не дефолтную!)
- [ ] .env не закоммичен в git
- [ ] CORS настроен только на ваш frontend домен
- [ ] Admin пароль изменен с дефолтного
- [ ] Database backup настроен (Railway Pro plan)
- [ ] PayBox credentials проверены
- [ ] Supabase JWT secret корректный

---

## 🐛 TROUBLESHOOTING

### Проблема: "Application failed to respond"

**Решение:**
1. Проверьте что PORT environment variable НЕ установлена (Railway устанавливает автоматически)
2. Проверьте логи на ошибки
3. Убедитесь что `main.py` использует `0.0.0.0` как host

### Проблема: "Database connection failed"

**Решение:**
1. Проверьте DATABASE_URL в environment variables
2. Убедитесь что PostgreSQL service запущен
3. Проверьте что DATABASE_URL содержит правильный пароль

### Проблема: "CORS error"

**Решение:**
1. Проверьте FRONTEND_URL в environment variables
2. Убедитесь что URL точно совпадает (без trailing slash)
3. Проверьте что CORS middleware настроен в main.py

### Проблема: "File upload failed"

**Решение:**
Railway использует ephemeral storage - файлы удаляются при redeploy.

Для production рекомендуется:
1. Использовать S3-compatible storage (AWS S3, Digital Ocean Spaces)
2. Или Cloudinary для изображений
3. Обновить код для загрузки в cloud storage

---

## 💰 СТОИМОСТЬ

### Free Tier

Railway дает $5 кредитов в месяц бесплатно:
- Backend (FastAPI): ~$3/месяц
- PostgreSQL: ~$1/месяц
- **Total**: ~$4/месяц (в пределах free tier!)

### Если нужно больше

- **Developer Plan**: $5/месяц + usage
- **Team Plan**: $20/месяц + usage

---

## ✅ DEPLOYMENT COMPLETE!

После выполнения всех шагов у вас будет:

✅ **Backend API** работает на Railway
✅ **PostgreSQL** база данных
✅ **CORS** настроен для frontend
✅ **PayBox** интеграция готова
✅ **Supabase OAuth** подключен
✅ **QR codes** генерируются
✅ **Auto HTTPS** включен

**Ваш MVP готов к использованию! 🚀**

---

## 📞 SUPPORT

Если возникли проблемы:
1. Проверьте Railway logs
2. Проверьте документацию: https://docs.railway.app
3. Railway Discord: https://discord.gg/railway
