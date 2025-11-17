# ⚡ Быстрая справка

## 🌐 URLs

| Что | URL |
|-----|-----|
| **Твой фронтенд (Production)** | https://arzaqmeal.vercel.app |
| **Твой фронтенд (Dev)** | http://localhost:3000 |
| **Бэкенд (Dev)** | http://localhost:8000 |
| **Бэкенд API Docs** | http://localhost:8000/docs |
| **Бэкенд (Production)** | ⏳ Ждем от друга |

---

## 🚀 Команды

### Запуск Development
```bash
# Фронтенд
npm run dev

# Бэкенд (попроси друга)
cd /Users/mac/Downloads/Arzaq-main
uvicorn app.main:app --reload --port 8000
```

### Build & Deploy
```bash
# Build локально
npm run build

# Preview production build
npm run preview

# Deploy на Vercel
git push  # Auto-deploy
```

---

## 📁 Структура API

```javascript
import {
  authService,      // Login, Register, JWT
  placeService,     // Places CRUD
  postService,      // Posts CRUD
  commentService,   // Comments CRUD
  userService       // User management
} from '@/api/services';
```

### Примеры использования:

```javascript
// Регистрация
await authService.register({ fullName, email, password });

// Логин
await authService.login(email, password);

// Получить текущего юзера
const user = await authService.getCurrentUser();

// Создать место
await placeService.create({ name, latitude, longitude });

// Получить все посты
const posts = await postService.getAll();

// Создать комментарий
await commentService.create({ place_id, text });
```

---

## 🔑 Environment Variables

### Development (.env.development)
```env
VITE_API_URL=http://localhost:8000
```

### Production (Vercel Dashboard)
```env
VITE_API_URL=https://твой-бэкенд-url.com
```

---

## ✅ Чеклист запуска

### Локальная разработка:
- [ ] Друг запустил бэкенд на :8000
- [ ] Друг добавил CORS
- [ ] Ты запустил фронтенд на :3000
- [ ] Можешь регистрироваться/входить

### Production:
- [ ] Бэкенд задеплоен
- [ ] CORS содержит https://arzaqmeal.vercel.app
- [ ] URL добавлен в Vercel → Environment Variables
- [ ] Redeploy выполнен
- [ ] Всё работает

---

## 📖 Документация

### Для тебя:
- **START_HERE.md** - Начни отсюда
- **INTEGRATION_SUMMARY.md** - Полное резюме
- **FRONTEND_SETUP.md** - Как использовать API
- **VERCEL_SETUP.md** - Настройка Vercel

### Для друга:
- **FOR_BACKEND_DEVELOPER.txt** - Отправь другу
- **BACKEND_SETUP.md** - Подробная инструкция

---

## 🐛 Типичные проблемы

| Проблема | Решение |
|----------|---------|
| CORS error | Друг забыл добавить CORS |
| Network error | Бэкенд не запущен |
| 401 Unauthorized | Токен невалидный |
| 404 Not Found | Неправильный URL бэкенда |

---

## 📞 Что нужно от друга

1. ✅ Добавить CORS (файл: FOR_BACKEND_DEVELOPER.txt)
2. ⏳ Задеплоить бэкенд
3. ⏳ Отправить тебе production URL

Когда получишь URL → добавь в Vercel → Redeploy → Готово!

---

## 🎯 Следующие шаги

**Сейчас:**
1. Отправь `FOR_BACKEND_DEVELOPER.txt` другу
2. Попроси запустить бэкенд локально
3. Тестируй локально

**Потом:**
1. Получи production URL бэкенда
2. Добавь в Vercel
3. Redeploy
4. 🎉

---

**Фронтенд готов на 100%!** 🚀
