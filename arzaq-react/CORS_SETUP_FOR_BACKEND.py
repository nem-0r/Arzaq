# ========================================
# ГОТОВЫЙ КОД ДЛЯ БЭКЕНДА
# Файл: app/main.py
# ========================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- ДОБАВИТЬ ЭТОТ ИМПОРТ
from app.database import engine, Base
from app.routers import user, place, comment, post, auth
from app import models

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Arzaq API")

# ========================================
# CORS MIDDLEWARE - ОБЯЗАТЕЛЬНО ДОБАВИТЬ!
# ========================================
# Это позволяет фронтенду (https://arzaqmeal.vercel.app) обращаться к API
origins = [
    "http://localhost:3000",           # Локальная разработка
    "http://127.0.0.1:3000",           # Альтернативный localhost
    "https://arzaqmeal.vercel.app",    # Production фронтенд на Vercel
    "https://*.vercel.app",            # Preview деплои Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Разрешенные источники
    allow_credentials=True,             # Разрешить отправку cookies/токенов
    allow_methods=["*"],                # Разрешить все HTTP методы (GET, POST, PUT, DELETE)
    allow_headers=["*"],                # Разрешить все заголовки
)
# ========================================

# Включаем роутеры
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(place.router)
app.include_router(comment.router)
app.include_router(post.router)

@app.get("/")
def root():
    return {"message": "Arzaq API is running! Check /docs"}


# ========================================
# ВАЖНЫЕ ЗАМЕТКИ ДЛЯ БЭКЕНД РАЗРАБОТЧИКА:
# ========================================
#
# 1. Этот код должен быть ПЕРЕД app.include_router()
#
# 2. Без CORS фронтенд получит ошибку:
#    "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
#
# 3. После добавления CORS:
#    - Перезапусти бэкенд: uvicorn app.main:app --reload
#    - Протестируй в Swagger UI: http://localhost:8000/docs
#    - Проверь что фронтенд может делать запросы
#
# 4. Для production деплоя:
#    - Используй HTTPS (обязательно!)
#    - Смени SECRET_KEY в .env на случайный и безопасный
#    - Рассмотри использование PostgreSQL вместо SQLite
#    - Добавь rate limiting для защиты от спама
#
# ========================================
