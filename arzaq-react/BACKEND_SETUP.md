# 🔧 Инструкция для бэкенд-разработчика

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Настройка CORS

Для того чтобы фронтенд мог общаться с бэкендом, твой друг должен добавить CORS middleware в бэкенд.

### Шаг 1: Открыть файл `app/main.py`

### Шаг 2: Добавить импорт CORS middleware
```python
from fastapi.middleware.cors import CORSMiddleware
```

### Шаг 3: Добавить CORS настройки ПЕРЕД роутерами

Добавь этот код после создания `app = FastAPI(...)` и ПЕРЕД `app.include_router(...)`:

```python
# CORS Configuration - ВАЖНО для работы с фронтендом
origins = [
    "http://localhost:3000",              # Development (React local)
    "http://127.0.0.1:3000",              # Development alternative
    "https://arzaqmeal.vercel.app",       # Production (Vercel)
    "https://*.vercel.app",               # Все preview деплои Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Итоговый файл `app/main.py` должен выглядеть так:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- ДОБАВИТЬ
from app.database import engine, Base
from app.routers import user, place, comment, post, auth
from app import models

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Arzaq API")

# ===== CORS MIDDLEWARE - ДОБАВИТЬ ЭТО =====
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://arzaqmeal.vercel.app",  # Production Vercel URL
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================================

# Включаем роутеры
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(place.router)
app.include_router(comment.router)
app.include_router(post.router)

@app.get("/")
def root():
    return {"message": "Arzaq API is running! Check /docs"}
```

---

## 📡 Деплой бэкенда

Рекомендуемые платформы для деплоя FastAPI:

1. **Railway** (самый простой) - https://railway.app
   - Бесплатный тариф: $5 в месяц credits
   - Автоматический деплой из GitHub
   - Поддержка Python/FastAPI из коробки

2. **Render** - https://render.com
   - Бесплатный тариф доступен
   - Простая настройка

3. **Fly.io** - https://fly.io
   - Бесплатный тариф
   - Хорошая производительность

### После деплоя бэкенда:

1. Получи URL бэкенда (например: `https://your-backend.railway.app`)

2. Передай мне этот URL, чтобы я обновил `.env.production` файл

3. Добавь этот URL в CORS `origins` в бэкенде

---

## 🔒 Безопасность

### Важно проверить:

1. ✅ SECRET_KEY в production должен быть случайным и секретным
2. ✅ Не коммить `.env` файл в git
3. ✅ В production использовать PostgreSQL вместо SQLite
4. ✅ HTTPS обязателен для production

---

## 🧪 Тестирование локально

1. Запусти бэкенд:
```bash
cd /Users/mac/Downloads/Arzaq-main
uvicorn app.main:app --reload --port 8000
```

2. Запусти фронтенд:
```bash
cd /Users/mac/Downloads/Arzaq-project/arzaq-react
npm run dev
```

3. Фронтенд будет на `http://localhost:3000`
4. Бэкенд будет на `http://localhost:8000`
5. API документация: `http://localhost:8000/docs`

---

## 📋 Проверка работы API

После добавления CORS, протестируй эндпоинты:

1. **Регистрация**: POST `/api/auth/register`
2. **Логин**: POST `/api/auth/login` (form-data!)
3. **Текущий юзер**: GET `/api/auth/me` (требует токен)

Swagger UI доступен по адресу: `http://localhost:8000/docs`

---

## ❓ Частые проблемы

### Проблема: "CORS policy" ошибка в браузере
**Решение**: Убедись что CORS middleware добавлен правильно

### Проблема: 401 Unauthorized
**Решение**: Проверь что JWT токен корректно генерируется и отправляется

### Проблема: Бэкенд не запускается
**Решение**: Установи зависимости `pip install -r requirements.txt`
