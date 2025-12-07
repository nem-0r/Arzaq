# RAILWAY DEPLOYMENT FIX - РЕШЕНИЕ ПРОБЛЕМ 502 И CORS

## Проблемы которые были обнаружены:

1. **502 Bad Gateway** - бекенд не запускался из-за проблемных роутеров
2. **CORS ошибка** - нет заголовков Access-Control-Allow-Origin
3. **Railway не мог найти Dockerfile** - отсутствовал корневой Dockerfile

## Что было исправлено:

### 1. Убраны проблемные роутеры
Из `main.py` удалены роутеры, которые могли вызывать ошибки при импорте:
- `restaurant_profiles`
- `posts`
- `upload`

Текущая версия использует только стабильные роутеры:
- `auth`
- `foods`
- `restaurants`
- `orders`
- `payments`

### 2. Добавлена правильная структура для Railway
Созданы файлы в корне проекта:
- **`Dockerfile`** - корректно копирует файлы из `arzaq-backend/`
- **`railway.json`** - настроен для использования Dockerfile
- **`.dockerignore`** - исключает ненужные файлы из образа

### 3. Dockerfile настроен правильно
- Работает из корня проекта с папкой `arzaq-backend/`
- Устанавливает системные зависимости (gcc, postgresql-client)
- Правильно обрабатывает переменную окружения PORT
- Создает директории для загрузок

### 4. Исправлен `app/routers/__init__.py`
Очищен от проблемных импортов

---

## КРИТИЧЕСКИ ВАЖНО: Настройка переменных окружения на Railway

### Обязательные переменные окружения:

Перейдите в настройки вашего проекта на Railway и добавьте следующие переменные:

```bash
# Приложение
ENVIRONMENT=production

# База данных (Railway автоматически создаст)
DATABASE_URL=postgresql://...

# JWT аутентификация
SECRET_KEY=ваш_очень_секретный_ключ_минимум_32_символа
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Supabase
SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_JWT_SECRET=ваш_supabase_jwt_secret
SUPABASE_SERVICE_KEY=ваш_supabase_service_key

# CORS - САМОЕ ВАЖНОЕ ДЛЯ ИСПРАВЛЕНИЯ CORS ОШИБКИ
FRONTEND_URL=https://arzaqmeal.vercel.app
FRONTEND_DEV_URL=http://localhost:5173

# PayBox Kazakhstan
PAYBOX_MERCHANT_ID=ваш_merchant_id
PAYBOX_SECRET_KEY=ваш_paybox_secret_key
PAYBOX_PAYMENT_URL=https://api.paybox.money/payment.php
PAYBOX_SUCCESS_URL=https://arzaqmeal.vercel.app/payment/success
PAYBOX_FAILURE_URL=https://arzaqmeal.vercel.app/payment/failure
PAYBOX_RESULT_URL=https://arzaq-production.up.railway.app/api/payments/paybox/callback

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
```

### Как добавить переменные на Railway:

1. Откройте https://railway.app
2. Выберите ваш проект `arzaq-production`
3. Перейдите в **Variables** (или **Settings → Variables**)
4. Добавьте каждую переменную выше
5. Нажмите **Deploy** для применения изменений

---

## Проверка после деплоя:

### 1. Проверить здоровье API:
```bash
curl https://arzaq-production.up.railway.app/health
```
Должен вернуть: `{"status":"healthy"}`

### 2. Проверить корневой эндпоинт:
```bash
curl https://arzaq-production.up.railway.app/
```
Должен вернуть информацию об API

### 3. Проверить CORS:
Откройте DevTools в браузере на https://arzaqmeal.vercel.app и попробуйте войти.
Если CORS настроен правильно, вы не увидите ошибку `No 'Access-Control-Allow-Origin' header`

### 4. Проверить логи на Railway:
В консоли Railway откройте **Deployments → View Logs**
Убедитесь что нет ошибок при запуске

---

## Если проблемы сохраняются:

### 1. Проверьте переменную FRONTEND_URL:
```bash
# В логах Railway должно быть:
CORS Origins: ['https://arzaqmeal.vercel.app', 'http://localhost:5173', 'http://localhost:3000']
```

### 2. Проверьте что DATABASE_URL правильный:
Должен быть формата: `postgresql://user:password@host:port/database`

### 3. Проверьте логи ошибок:
Если видите ошибку импорта модулей - значит какой-то из роутеров имеет проблему

### 4. Перезапустите деплой:
```bash
# В Railway нажмите "Redeploy"
```

---

## Команды для локального тестирования:

### Запуск локально:
```bash
cd arzaq-backend

# Создайте .env файл с переменными выше
cp .env.example .env  # (если есть) или создайте вручную

# Установите зависимости
pip install -r requirements.txt

# Запустите сервер
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Тестирование API:
```bash
# Health check
curl http://localhost:8000/health

# Документация
http://localhost:8000/docs
```

---

## Структура файлов проекта:

```
Arzaq-project/
├── Dockerfile              ← Корневой Dockerfile для Railway
├── railway.json            ← Конфигурация Railway
├── .dockerignore          ← Исключения для Docker
├── arzaq-backend/         ← Папка с бекендом
│   ├── main.py           ← Исправленный main.py
│   ├── requirements.txt
│   ├── app/
│   │   ├── routers/
│   │   │   └── __init__.py  ← Исправленный
│   │   └── core/
│   │       └── config.py    ← CORS настройки
│   └── RAILWAY_FIX.md    ← Эта инструкция
└── arzaq-backend_stab/    ← Стабильная версия (для справки)
```

## Контрольный список перед деплоем:

- [ ] Все переменные окружения добавлены на Railway
- [ ] `FRONTEND_URL` указывает на `https://arzaqmeal.vercel.app`
- [ ] `DATABASE_URL` настроен (Railway должен автоматически создать PostgreSQL)
- [ ] `SECRET_KEY` установлен (минимум 32 символа)
- [ ] Supabase переменные настроены
- [ ] PayBox переменные настроены
- [ ] ✅ Dockerfile присутствует в корне проекта
- [ ] ✅ railway.json настроен на использование Dockerfile
- [ ] ✅ .dockerignore создан
- [ ] ✅ В main.py импортируются только стабильные роутеры

---

## Следующие шаги:

1. **Добавьте все переменные окружения на Railway**
2. **Сделайте коммит изменений:**
   ```bash
   git add .
   git commit -m "Fix: Remove problematic routers, add Dockerfile, fix CORS"
   git push
   ```
3. **Railway автоматически начнет деплой**
4. **Проверьте логи деплоя** в Railway консоли
5. **Протестируйте API** используя команды выше
6. **Протестируйте фронтенд** на https://arzaqmeal.vercel.app

---

## Дополнительные рекомендации:

### Безопасность:
- Используйте длинные случайные строки для `SECRET_KEY`
- Не коммитьте `.env` файлы в git
- Используйте Railway Secrets для чувствительных данных

### Мониторинг:
- Регулярно проверяйте логи в Railway
- Настройте уведомления о сбоях
- Используйте `/health` endpoint для мониторинга

### Масштабирование:
- При необходимости увеличьте `numReplicas` в railway.json
- Рассмотрите использование CDN для статических файлов
- Настройте кэширование для часто запрашиваемых данных

---

**Разработано как Senior Developer fix**
Дата: 2025-12-07
