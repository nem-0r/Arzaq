# 🚀 Фронтенд - Инструкция по настройке

## 📁 Структура API Layer

Твой фронтенд теперь имеет чистую архитектуру для работы с бэкендом:

```
src/
├── api/
│   ├── client.js                   # Axios клиент с interceptors
│   ├── config.js                   # API endpoints
│   └── services/
│       ├── index.js               # Экспорт всех сервисов
│       ├── auth.service.js        # Аутентификация
│       ├── user.service.js        # Пользователи
│       ├── place.service.js       # Места
│       ├── post.service.js        # Посты
│       └── comment.service.js     # Комментарии
├── context/
│   └── AuthContext.jsx            # ✅ Обновлен для работы с JWT
```

---

## 🔧 Environment Variables

### Development (.env.development)
```env
VITE_API_URL=http://localhost:8000
```

### Production (.env.production)
```env
VITE_API_URL=https://your-backend-url.com
```

**⚠️ ВАЖНО**: После того как друг задеплоит бэкенд, обновить `VITE_API_URL` в `.env.production`

---

## 🎯 Что изменилось

### 1. AuthContext теперь использует реальный API
- ✅ JWT токены вместо localStorage mock
- ✅ Автоматическая загрузка данных пользователя при старте
- ✅ Автоматический logout при 401 ошибке

### 2. API Client с Interceptors
- ✅ Автоматически добавляет `Authorization: Bearer <token>` к запросам
- ✅ Обрабатывает ошибки глобально
- ✅ Перенаправляет на `/login` при истечении токена

### 3. Формы Login/Register
- ✅ Обновлены для работы с новым API
- ✅ Правильная обработка ошибок от бэкенда
- ✅ Поддержка сетевых ошибок

---

## 🏃 Запуск проекта

### Development
```bash
npm run dev
```
Откроется на `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📡 Использование API сервисов

### Пример: Получить все места
```javascript
import { placeService } from '@/api/services';

const places = await placeService.getAll();
```

### Пример: Создать новый пост
```javascript
import { postService } from '@/api/services';

const newPost = await postService.create({
  title: 'My Post',
  content: 'Post content'
});
```

### Пример: Получить комментарии для места
```javascript
import { commentService } from '@/api/services';

const comments = await commentService.getAll(placeId);
```

---

## 🔐 Аутентификация

### Регистрация
```javascript
import { useAuth } from '@/hooks/useAuth';

const { register } = useAuth();

await register({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});
```

### Логин
```javascript
const { login } = useAuth();

await login('john@example.com', 'password123');
```

### Получить текущего пользователя
```javascript
const { currentUser, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log(currentUser.full_name);
}
```

### Выход
```javascript
const { logout } = useAuth();

logout();
```

---

## 🐛 Обработка ошибок

API сервисы выбрасывают ошибки с полезной информацией:

```javascript
try {
  await placeService.create(placeData);
} catch (error) {
  if (error.status === 403) {
    console.log('Нет прав доступа');
  } else if (error.status === 0) {
    console.log('Сетевая ошибка');
  } else {
    console.log(error.message);
  }
}
```

---

## 🚀 Деплой на Vercel

### 1. Пуш код на GitHub
```bash
git add .
git commit -m "Add backend integration"
git push
```

### 2. Настрой Environment Variables в Vercel

В Vercel Dashboard → Settings → Environment Variables добавь:

```
VITE_API_URL = https://your-backend-url.com
```

### 3. Деплой
Vercel автоматически задеплоит при пуше в main

---

## ✅ Чеклист перед продакшеном

- [ ] Бэкенд задеплоен и работает
- [ ] CORS настроен на бэкенде
- [ ] `.env.production` содержит правильный URL бэкенда
- [ ] Environment variables добавлены в Vercel
- [ ] Протестирована регистрация/логин
- [ ] HTTPS используется для бэкенда

---

## 📝 Важные заметки

### Бэкенд использует OAuth2PasswordRequestForm
Для логина отправляется **FormData**, а не JSON:
```javascript
const formData = new FormData();
formData.append('username', email);  // OAuth2 использует "username"
formData.append('password', password);
```

### Поля пользователя
Бэкенд использует `full_name` (с подчеркиванием), а фронтенд `fullName` (camelCase).
API сервис автоматически конвертирует.

### JWT токен
Токен сохраняется в localStorage как `authToken` и автоматически добавляется ко всем запросам.

---

## 🆘 Помощь

Если что-то не работает:

1. Проверь консоль браузера (F12)
2. Проверь Network tab - видны ли запросы к API
3. Убедись что бэкенд запущен
4. Проверь что CORS настроен на бэкенде
5. Проверь `.env.development` содержит правильный URL
