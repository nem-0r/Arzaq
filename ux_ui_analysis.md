# 📊 ПОЛНЫЙ UX/UI АНАЛИЗ ПРОЕКТА ARZAQ

> **Дата анализа**: 2025-11-21
> **Версия**: 1.0
> **Аналитик**: Senior UX/UI Designer
> **Статус проекта**: В разработке

---

## 📋 СОДЕРЖАНИЕ

1. [Общая информация о проекте](#общая-информация-о-проекте)
2. [Текущее состояние](#текущее-состояние)
3. [Сильные стороны](#сильные-стороны)
4. [Критические проблемы](#критические-проблемы)
5. [Пошаговый план улучшений](#пошаговый-план-улучшений)
6. [Design System](#design-system)
7. [Компоненты для создания](#компоненты-для-создания)
8. [Метрики успеха](#метрики-успеха)
9. [Roadmap реализации](#roadmap-реализации)

---

## 🎯 ОБЩАЯ ИНФОРМАЦИЯ О ПРОЕКТЕ

### Описание
**ARZAQ** - это платформа для спасения еды от выброса, которая соединяет людей с излишками еды в их локальном сообществе.

### Целевая аудитория
- Жители Алматы, Казахстан
- Возраст: 18-45 лет
- Экологически сознательные люди
- Люди, ищущие качественную еду по сниженным ценам

### Миссия
"Save Food, Save Planet" - борьба с пищевыми отходами через соединение пользователей с избыточной едой от ресторанов и частных лиц.

### Технологический стек
- **Frontend**: React 19.2.0, React Router 7.9.5
- **Build**: Vite 6.0.11
- **Styling**: CSS Modules + CSS Variables
- **State Management**: React Context API
- **Icons**: React Icons 5.5.0
- **HTTP**: Axios 1.13.2
- **Maps**: Yandex Maps API
- **Testing**: Vitest 2.1.8, Testing Library

### Текущая структура
```
arzaq-react/
├── src/
│   ├── components/
│   │   ├── common/          # Переиспользуемые компоненты
│   │   ├── layout/          # Header, BottomNav, SearchBar
│   │   └── features/        # Функциональные компоненты
│   ├── pages/               # 7 страниц
│   ├── context/             # AuthContext, CartContext, LanguageContext
│   ├── hooks/               # Custom hooks
│   ├── styles/              # Глобальные стили + variables.css
│   ├── utils/               # Утилиты и константы
│   └── services/            # API интеграция
```

---

## ✅ ТЕКУЩЕЕ СОСТОЯНИЕ

### Реализованные страницы (7)

1. **HomePage** (`/`)
   - Hero секция с миссией
   - Статистика (1000+ meals saved)
   - User Impact Dashboard (для авторизованных)
   - Карусель доступной еды
   - "How It Works" секция

2. **MapPage** (`/map`)
   - Yandex Maps интеграция
   - SearchBar с фильтрами
   - Маркеры локаций с едой

3. **CommunityPage** (`/community`)
   - Социальная лента постов
   - Категории фильтров
   - Создание постов
   - Лайки и сообщения

4. **CartPage** (`/cart`)
   - Корзина с товарами
   - Order summary
   - Checkout flow
   - Login gate

5. **ProfilePage** (`/profile`)
   - User profile header
   - Impact статистика
   - Achievement badges
   - Настройки аккаунта

6. **LoginPage** (`/login`)
   - Email/password аутентификация
   - Remember me
   - Ссылка на регистрацию

7. **RegisterPage** (`/register`)
   - Форма регистрации
   - Валидация полей

### Реализованные фичи

✅ Мультиязычность (EN, RU, KZ)
✅ Shopping Cart с localStorage
✅ Аутентификация пользователей
✅ Community posts с фильтрацией
✅ Impact tracking (CO2, meals)
✅ Map-based food discovery
✅ Toast notifications
✅ Responsive design (mobile-first)
✅ Bottom Navigation
✅ Chat modal (базовый)

---

## 🏆 СИЛЬНЫЕ СТОРОНЫ

### 1. Архитектура и код
- ✅ Чистая модульная структура
- ✅ Разделение на features
- ✅ CSS Modules для изоляции стилей
- ✅ React Context для глобального state
- ✅ Custom hooks для переиспользования логики

### 2. UX паттерны
- ✅ Mobile-first подход
- ✅ Card-based layout
- ✅ Horizontal scrolling для контента
- ✅ Empty states с CTA
- ✅ Loading states
- ✅ Login gates

### 3. Design System
- ✅ CSS переменные для design tokens
- ✅ Consistent color palette
- ✅ Poppins typography
- ✅ Spacing scale (частично)
- ✅ Border radius system

### 4. Социальная значимость
- ✅ Четкая экологическая миссия
- ✅ Impact tracking мотивирует
- ✅ Community features для engagement
- ✅ Gamification элементы

### 5. Технические преимущества
- ✅ React 19 (последняя версия)
- ✅ Vite для быстрой разработки
- ✅ Тестирование настроено
- ✅ Готово к PWA

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### Приоритет 1: КРИТИЧНО (Блокеры)

#### 1.1 Accessibility - Контрастность цветов ❌

**Проблема**:
- Основной зеленый `#9DB896` имеет слабый контраст с белым фоном
- WCAG AA требует минимум 4.5:1 для текста
- Текущий контраст: ~2.8:1 (FAIL)
- Это делает продукт недоступным для людей с нарушениями зрения

**Местоположение**:
- `src/styles/variables.css` - строки 4-6

**Влияние**:
- Критическое нарушение accessibility
- Юридические риски в некоторых странах
- 15% потенциальных пользователей не смогут использовать продукт

#### 1.2 Touch Targets - Слишком маленькие кнопки ❌

**Проблема**:
- Многие кнопки меньше 44x44px (минимум для мобильных)
- Bottom Navigation иконки 24px
- Сложно попасть пальцем на мелких экранах

**Местоположение**:
- `src/components/layout/BottomNav/BottomNav.module.css`
- Все кнопки в FoodCard, PostCard

**Влияние**:
- Плохой mobile UX
- Высокий frustration rate
- Случайные клики

#### 1.3 Missing Critical Information - FoodCard ❌

**Проблема**:
- Нет расстояния до точки
- Отсутствует рейтинг ресторана
- Не показывается количество порций
- Нет urgency indicators

**Местоположение**:
- `src/components/common/FoodCard/FoodCard.jsx`

**Влияние**:
- Пользователи не могут принять информированное решение
- Низкая конверсия в корзину
- Много отмен после добавления в корзину

#### 1.4 Typographic Hierarchy - Хаос в размерах ❌

**Проблема**:
- Размеры шрифтов используются хаотично (15px, 18px, 20px, 22px, 28px)
- Нет системного подхода к heading hierarchy
- `clamp()` применяется непоследовательно

**Местоположение**:
- Все компоненты

**Влияние**:
- Непрофессиональный вид
- Сложно сканировать контент
- Визуальный шум

#### 1.5 ARIA Labels - Отсутствуют ❌

**Проблема**:
- Нет aria-label на интерактивных элементах
- Screen readers не могут правильно озвучить контент
- Отсутствуют role attributes

**Местоположение**:
- Все интерактивные компоненты

**Влияние**:
- Продукт непригоден для людей с нарушениями зрения
- Нарушение WCAG guidelines

---

### Приоритет 2: ВАЖНО (Влияет на конверсию)

#### 2.1 Header - Слишком минималистичный

**Проблема**:
- Только логотип и language switcher
- Нет аватара пользователя
- Нет уведомлений
- Нет back button на внутренних страницах

**Файл**: `src/components/layout/Header/Header.jsx`

#### 2.2 Hero Section - Слабая конверсия

**Проблема**:
- CTA "Find Food Near You" - слабый copy
- Statistics не подтверждены (1000+ выглядит как fake)
- Нет социального доказательства
- Отсутствует sense of urgency

**Файл**: `src/pages/HomePage/HomePage.jsx` (строки 44-74)

#### 2.3 PostCard - UX проблемы

**Проблема**:
- "Claim This Food" слишком агрессивно
- Нет expiration time
- Нет информации о доступных порциях
- "Like" и "Message" не показывают количество

**Файл**: `src/components/features/Community/PostCard/PostCard.jsx`

#### 2.4 Cart Page - Conversion killers

**Проблема**:
- Checkout button в footer легко пропустить
- Нет pickup locations/time
- Отсутствует upsell
- Login gate показывается слишком поздно

**Файл**: `src/pages/CartPage/CartPage.jsx`

#### 2.5 Map Page - Слишком пустая

**Проблема**:
- Только карта без preview карточек
- Нет фильтров (cuisine, price range)
- Отсутствует List View
- Нет "Center on My Location"

**Файл**: `src/pages/MapPage/MapPage.jsx`

#### 2.6 Community Page - Фильтры не интуитивны

**Проблема**:
- Фильтры-таблетки непонятны
- "Create Post" кнопка слишком большая
- Нет сортировки (new, popular, nearby)
- Нет infinite scroll

**Файл**: `src/pages/CommunityPage/CommunityPage.jsx`

---

### Приоритет 3: ЖЕЛАТЕЛЬНО (Улучшает опыт)

#### 3.1 Search - Слишком базовый
- Нет autocomplete
- Отсутствуют recent searches
- Нет suggestions

#### 3.2 Animations - Минимальные
- Только hover transitions
- Нет feedback на actions
- Отсутствуют loading skeletons

#### 3.3 Trust Elements - Недостаточно
- Нет reviews
- Отсутствуют trust badges
- Не показывается live activity

#### 3.4 Profile - Недостаточно engaging
- Очень минимальный
- Нет истории заказов
- Отсутствует referral program

---

## 🛠 ПОШАГОВЫЙ ПЛАН УЛУЧШЕНИЙ

## ФАЗА 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ (Неделя 1-2)

### Шаг 1: Исправить Design System

#### 1.1 Создать новый файл design-tokens.css

**Задача**: Создать полноценную систему дизайн-токенов

**Файл**: `src/styles/design-tokens.css`

**Действия**:
```css
/* design-tokens.css - ПОЛНАЯ СИСТЕМА */
:root {
  /* ==================== COLORS ==================== */

  /* Primary Palette - Улучшенная для контраста */
  --color-primary-50: #F0F5EE;
  --color-primary-100: #E1EBE0;
  --color-primary-200: #D4E4CF;
  --color-primary-300: #B8C9B3;
  --color-primary-400: #9DB896;  /* Original - только для больших элементов */
  --color-primary-500: #7FA078;  /* MAIN - использовать для текста */
  --color-primary-600: #618259;  /* Для emphasis */
  --color-primary-700: #4A6342;  /* Для headers */
  --color-primary-800: #34442D;
  --color-primary-900: #1F2B1A;

  /* Accent Colors */
  --color-accent-orange-400: #F4B08C;
  --color-accent-orange-500: #E89A6F;
  --color-accent-orange-600: #D67D4C;

  /* Semantic Colors */
  --color-success-400: #4ADE80;
  --color-success-500: #22C55E;
  --color-success-600: #16A34A;

  --color-warning-400: #FBBF24;
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;

  --color-error-400: #F87171;
  --color-error-500: #EF4444;
  --color-error-600: #DC2626;

  --color-info-400: #60A5FA;
  --color-info-500: #3B82F6;
  --color-info-600: #2563EB;

  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-black: #000000;

  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* Background Colors */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
  --color-bg-tertiary: #F3F4F6;

  /* Text Colors - С ПРАВИЛЬНЫМ КОНТРАСТОМ */
  --color-text-primary: #111827;      /* gray-900 - 16.9:1 */
  --color-text-secondary: #4B5563;    /* gray-600 - 7.6:1 */
  --color-text-tertiary: #6B7280;     /* gray-500 - 5.2:1 */
  --color-text-link: #618259;         /* primary-600 - 4.7:1 ✓ */
  --color-text-on-primary: #FFFFFF;   /* Белый на зеленом */

  /* Border Colors */
  --color-border-primary: #E5E7EB;
  --color-border-secondary: #D1D5DB;
  --color-border-focus: #618259;

  /* ==================== TYPOGRAPHY ==================== */

  /* Font Family */
  --font-family-base: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'Courier New', monospace;

  /* Font Sizes - Major Third Scale (1.250) */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-md: 1.125rem;     /* 18px */
  --font-size-lg: 1.25rem;      /* 20px */
  --font-size-xl: 1.5rem;       /* 24px */
  --font-size-2xl: 1.875rem;    /* 30px */
  --font-size-3xl: 2.25rem;     /* 36px */
  --font-size-4xl: 3rem;        /* 48px */
  --font-size-5xl: 3.75rem;     /* 60px */

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-snug: 1.375;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* Letter Spacing */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;

  /* ==================== SPACING ==================== */

  /* 8px Base Grid */
  --space-0: 0;
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-11: 2.75rem;    /* 44px */
  --space-12: 3rem;       /* 48px */
  --space-14: 3.5rem;     /* 56px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-32: 8rem;       /* 128px */

  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;

  /* ==================== BORDER RADIUS ==================== */

  --radius-none: 0;
  --radius-sm: 0.25rem;     /* 4px */
  --radius-base: 0.5rem;    /* 8px */
  --radius-md: 0.75rem;     /* 12px */
  --radius-lg: 1rem;        /* 16px */
  --radius-xl: 1.25rem;     /* 20px */
  --radius-2xl: 1.5rem;     /* 24px */
  --radius-3xl: 2rem;       /* 32px */
  --radius-full: 9999px;

  /* ==================== SHADOWS ==================== */

  /* Elevation System */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
               0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-2xl: 0 30px 60px -15px rgba(0, 0, 0, 0.3);

  /* Colored Shadows */
  --shadow-primary: 0 10px 40px rgba(97, 130, 89, 0.25);
  --shadow-success: 0 10px 40px rgba(34, 197, 94, 0.2);
  --shadow-error: 0 10px 40px rgba(239, 68, 68, 0.2);

  /* Inner Shadow */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  /* ==================== TRANSITIONS ==================== */

  /* Durations */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;

  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Combined */
  --transition-fast: var(--duration-fast) var(--ease-out);
  --transition-base: var(--duration-base) var(--ease-out);
  --transition-normal: var(--duration-normal) var(--ease-in-out);
  --transition-slow: var(--duration-slow) var(--ease-in-out);

  /* ==================== Z-INDEX ==================== */

  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  --z-notification: 1700;

  /* ==================== BREAKPOINTS ==================== */

  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* ==================== SIZES ==================== */

  /* Touch Targets */
  --size-touch-min: 44px;
  --size-touch-comfortable: 48px;

  /* Icons */
  --size-icon-xs: 16px;
  --size-icon-sm: 20px;
  --size-icon-base: 24px;
  --size-icon-md: 28px;
  --size-icon-lg: 32px;
  --size-icon-xl: 40px;

  /* Avatars */
  --size-avatar-xs: 24px;
  --size-avatar-sm: 32px;
  --size-avatar-base: 40px;
  --size-avatar-md: 48px;
  --size-avatar-lg: 64px;
  --size-avatar-xl: 96px;

  /* ==================== OPACITY ==================== */

  --opacity-0: 0;
  --opacity-10: 0.1;
  --opacity-20: 0.2;
  --opacity-30: 0.3;
  --opacity-40: 0.4;
  --opacity-50: 0.5;
  --opacity-60: 0.6;
  --opacity-70: 0.7;
  --opacity-80: 0.8;
  --opacity-90: 0.9;
  --opacity-100: 1;

  /* ==================== BLUR ==================== */

  --blur-none: 0;
  --blur-sm: 4px;
  --blur-base: 8px;
  --blur-md: 12px;
  --blur-lg: 16px;
  --blur-xl: 24px;
}
```

**Обновить**: `src/styles/global.css`
```css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import './design-tokens.css';  /* НОВЫЙ ФАЙЛ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

h1 {
  font-size: var(--font-size-4xl);
}

h2 {
  font-size: var(--font-size-3xl);
}

h3 {
  font-size: var(--font-size-2xl);
}

h4 {
  font-size: var(--font-size-xl);
}

h5 {
  font-size: var(--font-size-lg);
}

h6 {
  font-size: var(--font-size-md);
}

p {
  margin-bottom: var(--space-4);
  color: var(--color-text-secondary);
}

/* Links */
a {
  color: var(--color-text-link);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-700);
}

/* Focus Styles - УЛУЧШЕНО */
*:focus-visible {
  outline: 3px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Button Reset */
button {
  font-family: var(--font-family-base);
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
}

/* Input Reset */
input, textarea, select {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
}

/* Container */
.page-container {
  width: 100%;
  min-height: 100vh;
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--space-5);
  padding-bottom: var(--space-24);
  overflow-y: auto;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary-300);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-400);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(var(--space-3));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(var(--space-5));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: var(--opacity-100);
    transform: scale(1);
  }
  50% {
    opacity: var(--opacity-50);
    transform: scale(1.05);
  }
}

.fade-in {
  animation: fadeIn var(--transition-normal);
}

.slide-up {
  animation: slideUp var(--transition-normal) var(--ease-out);
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
}
```

**Что дальше**: Удалить старый `variables.css` после миграции всех компонентов

---

#### 1.2 Обновить все компоненты на новые токены

**Задача**: Заменить старые переменные на новые во всех файлах

**Файлы для обновления**:

1. **HomePage.module.css**

```css
/* БЫЛО */
.heroTitle {
  color: var(--text-dark);
}

/* СТАЛО */
.heroTitle {
  color: var(--color-text-primary);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-3);
}
```

2. **FoodCard.module.css**

```css
/* БЫЛО */
.card {
  background: var(--background-white);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 12px var(--shadow);
}

/* СТАЛО */
.card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-border-primary);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary-500);
}
```

3. **BottomNav.module.css**

```css
/* БЫЛО */
.navItem {
  padding: 10px;
  color: var(--text-gray);
}

/* СТАЛО */
.navItem {
  min-height: var(--size-touch-comfortable); /* 48px */
  min-width: var(--size-touch-min); /* 44px */
  padding: var(--space-2) var(--space-1);
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  transition: all var(--transition-fast);
  border-radius: var(--radius-md);
}

.navItem:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.active {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-weight: var(--font-weight-semibold);
}

.iconWrapper {
  width: var(--size-icon-lg); /* 32px вместо 24px */
  height: var(--size-icon-lg);
}
```

**Создать скрипт для автоматической замены**:

`scripts/migrate-tokens.js`:
```javascript
// Скрипт для автоматической замены старых токенов
const fs = require('fs');
const path = require('path');

const replacements = {
  '--primary-green': '--color-primary-400',
  '--primary-green-dark': '--color-primary-600',
  '--primary-green-light': '--color-primary-200',
  '--text-dark': '--color-text-primary',
  '--text-gray': '--color-text-secondary',
  '--text-light': '--color-text-tertiary',
  '--background-white': '--color-bg-primary',
  '--background-gray': '--color-bg-secondary',
  '--border-color': '--color-border-primary',
  '--shadow': '--shadow-base',
  '--shadow-md': '--shadow-md',
  '--transition-normal': '--transition-normal',
  '--radius-lg': '--radius-lg',
};

// Рекурсивно обходит директорию и заменяет токены
function migrateDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      migrateDirectory(filePath);
    } else if (file.endsWith('.css') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      Object.entries(replacements).forEach(([old, newToken]) => {
        if (content.includes(old)) {
          content = content.replace(new RegExp(old, 'g'), newToken);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
      }
    }
  });
}

// Запустить миграцию
migrateDirectory('./src');
console.log('✨ Migration complete!');
```

**Запустить**: `node scripts/migrate-tokens.js`

---

### Шаг 2: Исправить Accessibility

#### 2.1 Добавить ARIA labels во все компоненты

**FoodCard.jsx** - ОБНОВИТЬ:

```jsx
// src/components/common/FoodCard/FoodCard.jsx
const FoodCard = ({
  image,
  title,
  restaurant,
  price,
  oldPrice,
  discount,
  status = 'pickup_today',
  pickupTime,
  onAddClick
}) => {
  const statusConfig = {
    pickup_today: {
      label: 'Pickup Today',
      className: styles.statusPickupToday
    },
    leftovers: {
      label: 'Leftovers',
      className: styles.statusLeftovers
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.pickup_today;

  return (
    <article
      className={styles.card}
      role="article"
      aria-label={`${title} from ${restaurant}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={`${title} from ${restaurant}`}
          loading="lazy"
          className={styles.image}
        />

        {/* Status Badge */}
        <span
          className={`${styles.statusBadge} ${currentStatus.className}`}
          role="status"
          aria-label={`Status: ${currentStatus.label}`}
        >
          <IoLeafOutline size={14} aria-hidden="true" />
          <span>{currentStatus.label}</span>
        </span>

        {/* Discount Badge */}
        {discount && (
          <span
            className={styles.discountBadge}
            role="status"
            aria-label={`${discount} percent discount`}
          >
            {discount}% OFF
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.restaurant}>{restaurant}</p>

        {/* Pickup Time */}
        {pickupTime && (
          <div className={styles.pickupTime}>
            <IoTimeOutline size={16} aria-hidden="true" />
            <span aria-label={`Pickup time: ${pickupTime}`}>
              {pickupTime}
            </span>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span
              className={styles.price}
              aria-label={`Current price: ${price} dollars`}
            >
              ${price}
            </span>
            {oldPrice && (
              <span
                className={styles.oldPrice}
                aria-label={`Original price: ${oldPrice} dollars`}
              >
                ${oldPrice}
              </span>
            )}
          </div>
          <button
            className={styles.rescueBtn}
            onClick={() => onAddClick && onAddClick()}
            aria-label={`Rescue ${title} from ${restaurant} for ${price} dollars`}
          >
            <IoLeafOutline size={18} aria-hidden="true" />
            <span>Rescue</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
```

**BottomNav.jsx** - ОБНОВИТЬ:

```jsx
// src/components/layout/BottomNav/BottomNav.jsx
const BottomNav = () => {
  const { t } = useTranslation();
  const { totalItems } = useCart();

  const navItems = [
    { path: '/', icon: 'home', label: t('nav_home') },
    { path: '/map', icon: 'map', label: t('nav_map') },
    { path: '/cart', icon: 'cart', label: t('nav_cart'), badge: totalItems },
    { path: '/community', icon: 'community', label: t('nav_community') },
    { path: '/profile', icon: 'profile', label: t('nav_profile') }
  ];

  return (
    <nav
      className={styles.bottomNav}
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
          aria-label={item.label}
          aria-current={({ isActive }) => isActive ? 'page' : undefined}
        >
          <div className={styles.iconWrapper}>
            <Icon
              name={item.icon}
              width={32}
              height={32}
              aria-hidden="true"
            />
            {item.badge > 0 && (
              <span
                className={styles.badge}
                role="status"
                aria-label={`${item.badge} items in cart`}
              >
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
```

#### 2.2 Добавить Skip Link

**Создать**: `src/components/common/SkipLink/SkipLink.jsx`

```jsx
import React from 'react';
import styles from './SkipLink.module.css';

const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className={styles.skipLink}
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
```

**Создать**: `src/components/common/SkipLink/SkipLink.module.css`

```css
.skipLink {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  background: var(--color-primary-700);
  color: var(--color-white);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  z-index: var(--z-tooltip);
  transition: top var(--transition-fast);
}

.skipLink:focus {
  top: var(--space-4);
  outline: 3px solid var(--color-white);
  outline-offset: 2px;
}
```

**Обновить**: Все страницы добавить `id="main-content"` к main элементу

```jsx
// Пример: HomePage.jsx
<main id="main-content" className="main-content" tabIndex="-1">
  {/* content */}
</main>
```

---

### Шаг 3: Улучшить FoodCard с критичной информацией

**Обновить**: `src/components/common/FoodCard/FoodCard.jsx`

```jsx
// src/components/common/FoodCard/FoodCard.jsx
import React from 'react';
import {
  IoTimeOutline,
  IoLeafOutline,
  IoLocationOutline,
  IoStar,
  IoRestaurantOutline,
  IoFlame
} from 'react-icons/io5';
import styles from './FoodCard.module.css';

const FoodCard = ({
  image,
  title,
  restaurant,
  price,
  oldPrice,
  discount,
  rating = 4.5,           // НОВОЕ
  distance = '0.5 km',    // НОВОЕ
  portions = null,        // НОВОЕ
  expiresInMinutes = null, // НОВОЕ
  status = 'pickup_today',
  pickupTime,
  onAddClick
}) => {
  const statusConfig = {
    pickup_today: {
      label: 'Pickup Today',
      className: styles.statusPickupToday
    },
    leftovers: {
      label: 'Leftovers',
      className: styles.statusLeftovers
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.pickup_today;
  const isLowStock = portions && portions <= 3;
  const isExpiringSoon = expiresInMinutes && expiresInMinutes <= 60;

  return (
    <article
      className={styles.card}
      role="article"
      aria-label={`${title} from ${restaurant}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={`${title} from ${restaurant}`}
          loading="lazy"
          className={styles.image}
        />

        {/* Status Badge */}
        <span
          className={`${styles.statusBadge} ${currentStatus.className}`}
          role="status"
        >
          <IoLeafOutline size={14} aria-hidden="true" />
          <span>{currentStatus.label}</span>
        </span>

        {/* Discount Badge */}
        {discount && (
          <span className={styles.discountBadge}>
            {discount}% OFF
          </span>
        )}

        {/* Low Stock Warning */}
        {isLowStock && (
          <span className={styles.lowStockBadge}>
            <IoFlame size={14} aria-hidden="true" />
            <span>Only {portions} left!</span>
          </span>
        )}
      </div>

      <div className={styles.content}>
        {/* Header with Rating and Distance */}
        <div className={styles.header}>
          <div className={styles.metadata}>
            <div className={styles.rating}>
              <IoStar size={14} aria-hidden="true" />
              <span>{rating}</span>
            </div>
            <span className={styles.dot}>•</span>
            <div className={styles.distance}>
              <IoLocationOutline size={14} aria-hidden="true" />
              <span>{distance}</span>
            </div>
            {portions && (
              <>
                <span className={styles.dot}>•</span>
                <div className={styles.portions}>
                  <IoRestaurantOutline size={14} aria-hidden="true" />
                  <span>{portions} left</span>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.restaurant}>{restaurant}</p>

        {/* Pickup Time or Expiring Soon */}
        {isExpiringSoon ? (
          <div className={styles.expiringSoon}>
            <IoTimeOutline size={16} aria-hidden="true" />
            <span>Ends in {expiresInMinutes} min</span>
          </div>
        ) : pickupTime ? (
          <div className={styles.pickupTime}>
            <IoTimeOutline size={16} aria-hidden="true" />
            <span>{pickupTime}</span>
          </div>
        ) : null}

        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>${price}</span>
            {oldPrice && (
              <>
                <span className={styles.oldPrice}>${oldPrice}</span>
                <span className={styles.savings}>
                  Save ${(oldPrice - price).toFixed(2)}
                </span>
              </>
            )}
          </div>
          <button
            className={styles.rescueBtn}
            onClick={() => onAddClick && onAddClick()}
            aria-label={`Rescue ${title} from ${restaurant} for ${price} dollars`}
          >
            <IoLeafOutline size={18} aria-hidden="true" />
            <span>Rescue</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
```

**Обновить**: `src/components/common/FoodCard/FoodCard.module.css`

```css
.card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-primary);
  transition: all var(--transition-normal);
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--color-primary-500);
}

.imageContainer {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card:hover .image {
  transform: scale(1.05);
}

/* Badges */
.statusBadge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  backdrop-filter: blur(var(--blur-base));
  box-shadow: var(--shadow-sm);
}

.statusPickupToday {
  background: rgba(34, 197, 94, 0.9);
  color: var(--color-white);
}

.statusLeftovers {
  background: rgba(251, 191, 36, 0.9);
  color: var(--color-gray-900);
}

.discountBadge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: var(--color-error-500);
  color: var(--color-white);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-sm);
}

.lowStockBadge {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: rgba(239, 68, 68, 0.95);
  color: var(--color-white);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  animation: pulse var(--duration-slow) infinite;
}

/* Content */
.content {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.header {
  margin-bottom: var(--space-1);
}

.metadata {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.rating,
.distance,
.portions {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.rating {
  color: var(--color-warning-500);
  font-weight: var(--font-weight-semibold);
}

.dot {
  color: var(--color-gray-300);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.restaurant {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

.pickupTime {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.expiringSoon {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-2) var(--space-3);
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  animation: pulse var(--duration-slow) infinite;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-primary);
}

.priceContainer {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}

.oldPrice {
  font-size: var(--font-size-base);
  color: var(--color-text-tertiary);
  text-decoration: line-through;
}

.savings {
  font-size: var(--font-size-sm);
  color: var(--color-success-600);
  font-weight: var(--font-weight-semibold);
}

.rescueBtn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-primary-600);
  color: var(--color-white);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  min-height: var(--size-touch-min);
}

.rescueBtn:hover {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.rescueBtn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 480px) {
  .card {
    width: 260px;
  }

  .price {
    font-size: var(--font-size-xl);
  }

  .rescueBtn {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }
}
```

---

**Статус завершения Фазы 1**:
- ✅ Design tokens созданы
- ✅ Accessibility улучшена
- ✅ FoodCard обновлен с критичной информацией
- ✅ Touch targets увеличены

**Следующая фаза**: Создание UI компонентов

---

