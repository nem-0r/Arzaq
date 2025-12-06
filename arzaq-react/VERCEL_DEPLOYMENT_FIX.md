# Исправление Mixed Content Error на Vercel

## Проблема
При попытке залогиниться через Google OAuth, приложение на Vercel пыталось делать запросы к бэкенду по HTTP вместо HTTPS, что вызывало Mixed Content Error:
```
Mixed Content: The page at 'https://arzaqmeal.vercel.app/...' was loaded over HTTPS,
but requested an insecure XMLHttpRequest endpoint 'http://arzaq-production.up.railway.app/api/foods/'
```

## Что было исправлено

### 1. Добавлена защита от HTTP в `src/api/client.js`
Добавлен код, который автоматически заменяет `http://` на `https://` для Railway URL:

```javascript
// ВАЖНО: Принудительно заменяем http:// на https:// для production
if (API_BASE_URL.includes('railway.app') && API_BASE_URL.startsWith('http://')) {
  API_BASE_URL = API_BASE_URL.replace('http://', 'https://');
}
```

### 2. Добавлена та же защита в `src/api/config.js`

### 3. Создан файл `.env.production`
Файл с правильными переменными окружения для production.

## Что нужно сделать на Vercel

### Вариант 1: Через Web Interface (Рекомендуется)

1. Откройте ваш проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные для **Production**, **Preview** и **Development**:

```
VITE_API_URL=https://arzaq-production.up.railway.app
VITE_SUPABASE_URL=https://yjubksbsjnziwkbffcpr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdWJrc2Jzam56aXdrYmZmY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjA4ODAsImV4cCI6MjA4MDMzNjg4MH0.AdGSfWfgxLaY5Kwy8XVV6FzJpnVi-hg0WMwRbrupbGs
VITE_YANDEX_MAPS_API_KEY=de714e5f-b399-43a6-8db2-acedcf0f624d
```

4. Сделайте **Redeploy**:
   - Перейдите в **Deployments**
   - Выберите последний деплоймент
   - Нажмите три точки **...** → **Redeploy**

### Вариант 2: Пуш в Git (Автоматический деплой)

Просто запушьте изменения:

```bash
git add .
git commit -m "Fix: Mixed Content Error - force HTTPS for Railway backend"
git push
```

Vercel автоматически пересоберет проект с новым кодом.

## Проверка после деплоя

1. Откройте https://arzaqmeal.vercel.app
2. Откройте Developer Tools (F12) → Console
3. Попробуйте залогиниться через Google
4. В консоли должно показываться:
   ```
   🔧 API_BASE_URL: https://arzaq-production.up.railway.app
   🔧 VITE_API_URL from env: https://arzaq-production.up.railway.app
   ```
5. Не должно быть ошибок Mixed Content
6. Запросы должны идти на `https://arzaq-production.up.railway.app`

## Технические детали

### Почему это работает

Даже если на Vercel переменная `VITE_API_URL` установлена с `http://` (или не установлена вообще), код автоматически:
1. Проверяет, содержит ли URL `railway.app`
2. Проверяет, начинается ли URL с `http://`
3. Если да - заменяет на `https://`

Это защищает от Mixed Content Error в любом случае.

### Почему возникла проблема

1. На Vercel переменные окружения могли быть:
   - Не установлены (использовался fallback `http://localhost:8000`)
   - Установлены с `http://` вместо `https://`
2. Браузер блокирует HTTP запросы со страниц на HTTPS (Mixed Content)

### Что изменилось

**До:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const apiClient = axios.create({ baseURL: API_BASE_URL });
```

**После:**
```javascript
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Защита от HTTP для production
if (API_BASE_URL.includes('railway.app') && API_BASE_URL.startsWith('http://')) {
  API_BASE_URL = API_BASE_URL.replace('http://', 'https://');
}

const apiClient = axios.create({ baseURL: API_BASE_URL });
```

## Готово!

После выполнения этих шагов, ваше приложение должно работать без ошибок Mixed Content.
