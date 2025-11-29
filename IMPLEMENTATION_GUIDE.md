# 🚀 ARZAQ - ПОШАГОВОЕ РУКОВОДСТВО ПО РЕАЛИЗАЦИИ УЛ

UCHШЕНИЙ

> Детальный план реализации всех UX/UI улучшений из анализа
> Следуйте этому руководству шаг за шагом

---

## 📚 ОГЛАВЛЕНИЕ

### [ФАЗА 1: Критические исправления](#фаза-1) (Неделя 1-2) - ПРИОРИТЕТ 🔴
### [ФАЗА 2: UI Компоненты](#фаза-2) (Неделя 3-4) - ВАЖНО 🟡
### [ФАЗА 3: Улучшение страниц](#фаза-3) (Неделя 5-6) - ВАЖНО 🟡
### [ФАЗА 4: Дополнительные фичи](#фаза-4) (Неделя 7-8) - ЖЕЛАТЕЛЬНО 🟢
### [ФАЗА 5: Полировка и оптимизация](#фаза-5) (Неделя 9-10) - ЖЕЛАТЕЛЬНО 🟢

---

## <a name="фаза-1"></a>📋 ФАЗА 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

**Срок**: Неделя 1-2
**Приоритет**: 🔴 КРИТИЧНО
**Цель**: Исправить accessibility проблемы и design system

### Чеклист Фазы 1
- [ ] Design tokens созданы
- [ ] Все компоненты мигрированы на новые токены
- [ ] ARIA labels добавлены везде
- [ ] Touch targets увеличены до 44px+
- [ ] FoodCard обновлен с критичной информацией
- [ ] Skip Link добавлен
- [ ] Lighthouse Accessibility Score > 90

---

## <a name="фаза-2"></a>🧩 ФАЗА 2: UI КОМПОНЕНТЫ

**Срок**: Неделя 3-4
**Приоритет**: 🟡 ВАЖНО
**Цель**: Создать переиспользуемые UI компоненты

### 2.1 Button Component (Высокий приоритет)

**Файл**: `src/components/ui/Button/Button.jsx`

```jsx
import React from 'react';
import { IoSpinner } from 'react-icons/io5';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ariaLabel,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading && <IoSpinner className={styles.spinner} aria-hidden="true" />}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={styles.icon} aria-hidden="true" />
      )}
      <span className={styles.label}>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
};

export default Button;
```

**Файл**: `src/components/ui/Button/Button.module.css`

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: var(--size-touch-min);
  white-space: nowrap;
  position: relative;
}

.button:focus-visible {
  outline: 3px solid var(--color-border-focus);
  outline-offset: 2px;
}

.button:active:not(:disabled) {
  transform: scale(0.98);
}

.button:disabled {
  opacity: var(--opacity-50);
  cursor: not-allowed;
}

/* Variants */
.primary {
  background: var(--color-primary-600);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.primary:hover:not(:disabled) {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-md);
}

.secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.secondary:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-500);
}

.outline {
  background: transparent;
  color: var(--color-primary-600);
  border: 2px solid var(--color-primary-600);
}

.outline:hover:not(:disabled) {
  background: var(--color-primary-50);
  border-color: var(--color-primary-700);
  color: var(--color-primary-700);
}

.ghost {
  background: transparent;
  color: var(--color-text-primary);
}

.ghost:hover:not(:disabled) {
  background: var(--color-bg-secondary);
}

.danger {
  background: var(--color-error-500);
  color: var(--color-white);
}

.danger:hover:not(:disabled) {
  background: var(--color-error-600);
}

.success {
  background: var(--color-success-500);
  color: var(--color-white);
}

.success:hover:not(:disabled) {
  background: var(--color-success-600);
}

/* Sizes */
.small {
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-4);
  min-height: var(--size-touch-min);
}

.medium {
  font-size: var(--font-size-base);
  padding: var(--space-3) var(--space-6);
}

.large {
  font-size: var(--font-size-lg);
  padding: var(--space-4) var(--space-8);
  min-height: var(--size-touch-comfortable);
}

/* Modifiers */
.fullWidth {
  width: 100%;
}

.loading {
  pointer-events: none;
}

/* Icons */
.icon {
  width: var(--size-icon-sm);
  height: var(--size-icon-sm);
  flex-shrink: 0;
}

.spinner {
  width: var(--size-icon-sm);
  height: var(--size-icon-sm);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Использование**:
```jsx
// Примеры использования
<Button variant="primary" size="medium">
  Rescue Food
</Button>

<Button variant="outline" icon={IoHeart} iconPosition="left">
  Add to Favorites
</Button>

<Button variant="primary" loading={true}>
  Processing...
</Button>

<Button variant="danger" size="small">
  Delete
</Button>

<Button variant="ghost" fullWidth>
  Cancel
</Button>
```

---

### 2.2 Input Component

**Файл**: `src/components/ui/Input/Input.jsx`

```jsx
import React, { forwardRef } from 'react';
import { IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';
import styles from './Input.module.css';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      success,
      helperText,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div
          className={`${styles.inputContainer} ${hasError ? styles.error : ''} ${
            hasSuccess ? styles.success : ''
          } ${disabled ? styles.disabled : ''}`}
        >
          {Icon && iconPosition === 'left' && (
            <Icon className={`${styles.icon} ${styles.iconLeft}`} aria-hidden="true" />
          )}

          <input
            ref={ref}
            type={type}
            className={styles.input}
            disabled={disabled}
            aria-invalid={hasError}
            aria-required={required}
            aria-describedby={
              hasError ? 'error-message' : helperText ? 'helper-text' : undefined
            }
            {...props}
          />

          {hasError && (
            <IoAlertCircle
              className={`${styles.icon} ${styles.iconRight} ${styles.errorIcon}`}
              aria-hidden="true"
            />
          )}

          {hasSuccess && !hasError && (
            <IoCheckmarkCircle
              className={`${styles.icon} ${styles.iconRight} ${styles.successIcon}`}
              aria-hidden="true"
            />
          )}

          {Icon && iconPosition === 'right' && !hasError && !hasSuccess && (
            <Icon className={`${styles.icon} ${styles.iconRight}`} aria-hidden="true" />
          )}
        </div>

        {hasError && (
          <p id="error-message" className={styles.errorMessage} role="alert">
            <IoAlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}

        {helperText && !hasError && (
          <p id="helper-text" className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

**Файл**: `src/components/ui/Input/Input.module.css`

```css
.inputWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.fullWidth {
  width: 100%;
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: block;
}

.required {
  color: var(--color-error-500);
  margin-left: var(--space-1);
}

.inputContainer {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.inputContainer:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(97, 130, 89, 0.1);
}

.inputContainer.error {
  border-color: var(--color-error-500);
}

.inputContainer.error:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.inputContainer.success {
  border-color: var(--color-success-500);
}

.inputContainer.disabled {
  background: var(--color-bg-secondary);
  cursor: not-allowed;
  opacity: var(--opacity-60);
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  outline: none;
  min-height: var(--size-touch-min);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:disabled {
  cursor: not-allowed;
}

.icon {
  flex-shrink: 0;
  width: var(--size-icon-base);
  height: var(--size-icon-base);
  color: var(--color-text-tertiary);
}

.iconLeft {
  margin-left: var(--space-3);
}

.iconRight {
  margin-right: var(--space-3);
}

.errorIcon {
  color: var(--color-error-500);
}

.successIcon {
  color: var(--color-success-500);
}

.errorMessage {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
  margin: 0;
}

.helperText {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Input variants */
.input[type='search'] {
  padding-right: var(--space-12);
}

.input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  height: var(--size-icon-base);
  width: var(--size-icon-base);
  background: var(--color-gray-300);
  border-radius: 50%;
  cursor: pointer;
}
```

**Использование**:
```jsx
import Input from '@/components/ui/Input/Input';
import { IoMail, IoSearch, IoLockClosed } from 'react-icons/io5';

// Email Input
<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  icon={IoMail}
  iconPosition="left"
  required
  fullWidth
/>

// Search Input
<Input
  type="search"
  placeholder="Search food..."
  icon={IoSearch}
  iconPosition="left"
/>

// Password with Error
<Input
  label="Password"
  type="password"
  icon={IoLockClosed}
  error="Password must be at least 8 characters"
  required
  fullWidth
/>

// Success State
<Input
  label="Username"
  success={true}
  helperText="Username is available"
  fullWidth
/>
```

---

### 2.3 Badge Component

**Файл**: `src/components/ui/Badge/Badge.jsx`

```jsx
import React from 'react';
import styles from './Badge.module.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  icon: Icon,
  dot = false,
  ...props
}) => {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[size]}`}
      role="status"
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {Icon && <Icon className={styles.icon} aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
```

**Файл**: `src/components/ui/Badge/Badge.module.css`

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* Variants */
.default {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.primary {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success-700);
}

.warning {
  background: rgba(251, 191, 36, 0.1);
  color: var(--color-warning-700);
}

.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error-700);
}

.info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info-600);
}

/* Sizes */
.small {
  font-size: var(--font-size-xs);
  padding: var(--space-1) var(--space-2);
}

.medium {
  font-size: var(--font-size-sm);
  padding: var(--space-1) var(--space-3);
}

.large {
  font-size: var(--font-size-base);
  padding: var(--space-2) var(--space-4);
}

/* Dot */
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Icon */
.icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
```

**Использование**:
```jsx
<Badge variant="success">Pickup Today</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="error" icon={IoFlame}>Only 2 left!</Badge>
<Badge variant="primary" dot>New</Badge>
```

---

### 2.4 Skeleton Component

**Файл**: `src/components/ui/Skeleton/Skeleton.jsx`

```jsx
import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, circle = false, className = '' }) => {
  const style = {
    width: width,
    height: height || (circle ? width : undefined),
  };

  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Preset skeletons
export const SkeletonText = ({ lines = 1, width = '100%' }) => (
  <div className={styles.skeletonText}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        width={index === lines - 1 ? '80%' : width}
        height="16px"
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <Skeleton width="100%" height="180px" />
    <div className={styles.skeletonCardContent}>
      <Skeleton width="60%" height="24px" />
      <Skeleton width="100%" height="16px" />
      <Skeleton width="80%" height="16px" />
      <div className={styles.skeletonCardFooter}>
        <Skeleton width="80px" height="32px" />
        <Skeleton width="100px" height="40px" />
      </div>
    </div>
  </div>
);

export default Skeleton;
```

**Файл**: `src/components/ui/Skeleton/Skeleton.module.css`

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0px,
    var(--color-gray-300) 40px,
    var(--color-gray-200) 80px
  );
  background-size: 800px;
  animation: shimmer 2s infinite;
  border-radius: var(--radius-md);
}

.circle {
  border-radius: 50%;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.skeletonText {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skeletonCard {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-primary);
  width: 280px;
}

.skeletonCardContent {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeletonCardFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-2);
}
```

**Использование**:
```jsx
// Loading Cards
{isLoading ? (
  <>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </>
) : (
  foods.map(food => <FoodCard key={food.id} {...food} />)
)}

// Loading Text
{isLoading ? (
  <SkeletonText lines={3} />
) : (
  <p>{description}</p>
)}

// Custom Skeleton
<Skeleton width="100%" height="200px" />
<Skeleton width="40px" height="40px" circle />
```

---

### 2.5 Avatar Component

**Файл**: `src/components/ui/Avatar/Avatar.jsx`

```jsx
import React, { useState } from 'react';
import { IoPersonCircle } from 'react-icons/io5';
import styles from './Avatar.module.css';

const Avatar = ({
  src,
  alt,
  name,
  size = 'medium',
  status,
  badge,
  fallback = 'icon',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const showFallback = !src || imageError;

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      role="img"
      aria-label={alt || name}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt || name}
          className={styles.image}
          onError={() => setImageError(true)}
        />
      ) : fallback === 'initials' && name ? (
        <div className={styles.initials}>{getInitials(name)}</div>
      ) : (
        <IoPersonCircle className={styles.icon} aria-hidden="true" />
      )}

      {status && (
        <span
          className={`${styles.status} ${styles[`status-${status}`]}`}
          role="status"
          aria-label={`Status: ${status}`}
        />
      )}

      {badge && (
        <span className={styles.badge} role="status">
          {badge}
        </span>
      )}
    </div>
  );
};

export default Avatar;
```

**Файл**: `src/components/ui/Avatar/Avatar.module.css`

```css
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  overflow: hidden;
  flex-shrink: 0;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-weight: var(--font-weight-semibold);
  user-select: none;
}

.icon {
  width: 100%;
  height: 100%;
  color: var(--color-primary-500);
}

/* Sizes */
.small {
  width: var(--size-avatar-sm);
  height: var(--size-avatar-sm);
  font-size: var(--font-size-xs);
}

.medium {
  width: var(--size-avatar-base);
  height: var(--size-avatar-base);
  font-size: var(--font-size-sm);
}

.large {
  width: var(--size-avatar-lg);
  height: var(--size-avatar-lg);
  font-size: var(--font-size-lg);
}

.xlarge {
  width: var(--size-avatar-xl);
  height: var(--size-avatar-xl);
  font-size: var(--font-size-2xl);
}

/* Status Indicator */
.status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  border: 2px solid var(--color-white);
}

.status-online {
  background: var(--color-success-500);
}

.status-offline {
  background: var(--color-gray-400);
}

.status-busy {
  background: var(--color-error-500);
}

.status-away {
  background: var(--color-warning-500);
}

/* Badge (notification count) */
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-error-500);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-white);
}
```

**Использование**:
```jsx
// Image Avatar
<Avatar
  src="/user-avatar.jpg"
  alt="John Doe"
  size="medium"
/>

// Initials Fallback
<Avatar
  name="John Doe"
  fallback="initials"
  size="large"
/>

// With Status
<Avatar
  src="/avatar.jpg"
  status="online"
  size="medium"
/>

// With Badge (notification count)
<Avatar
  src="/avatar.jpg"
  badge={5}
  size="medium"
/>

// Icon Fallback
<Avatar size="small" />
```

---

### 2.6 Modal Component

**Файл**: `src/components/ui/Modal/Modal.jsx`

```jsx
import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './Modal.module.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnBackdrop = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousActiveElement.current = document.activeElement;

      // Focus modal
      modalRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Handle ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEsc);

      return () => {
        // Restore scroll
        document.body.style.overflow = '';

        // Restore focus
        previousActiveElement.current?.focus();

        // Remove listener
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  // Trap focus inside modal
  const handleTab = (e) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onKeyDown={handleTab}
      >
        {/* Header */}
        <div className={styles.header}>
          {title && (
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <IoClose size={24} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
```

**Файл**: `src/components/ui/Modal/Modal.module.css`

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(var(--blur-sm));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  padding: var(--space-4);
  animation: fadeIn var(--transition-fast);
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp var(--transition-normal) var(--ease-out);
  position: relative;
  z-index: var(--z-modal);
}

/* Sizes */
.small {
  width: 100%;
  max-width: 400px;
}

.medium {
  width: 100%;
  max-width: 600px;
}

.large {
  width: 100%;
  max-width: 900px;
}

.fullscreen {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  border-radius: 0;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-primary);
  flex-shrink: 0;
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.closeButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.closeButton:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.closeButton:focus-visible {
  outline: 3px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Body */
.body {
  padding: var(--space-6);
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.footer {
  padding: var(--space-6);
  border-top: 1px solid var(--color-border-primary);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  flex-shrink: 0;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(var(--space-8)) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .overlay {
    padding: 0;
  }

  .modal {
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    max-height: 95vh;
    width: 100%;
    align-self: flex-end;
  }

  .header,
  .body,
  .footer {
    padding: var(--space-4);
  }
}
```

**Использование**:
```jsx
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Order"
  size="medium"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to complete this order?</p>
</Modal>
```

---

## Чеклист Фазы 2

- [ ] Button component создан и протестирован
- [ ] Input component создан с валидацией
- [ ] Badge component для status indicators
- [ ] Skeleton component для loading states
- [ ] Avatar component с fallbacks
- [ ] Modal component с accessibility
- [ ] Все UI компоненты задокументированы
- [ ] Storybook/примеры для каждого компонента

---

## <a name="фаза-3"></a>📄 ФАЗА 3: УЛУЧШЕНИЕ СТРАНИЦ

**Срок**: Неделя 5-6
**Приоритет**: 🟡 ВАЖНО
**Цель**: Улучшить конверсию и UX основных страниц

### 3.1 Улучшить Header

**Задача**: Добавить контекстные элементы в Header

**Файл**: `src/components/layout/Header/Header.jsx`

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoChevronBack, IoNotificationsOutline } from 'react-icons/io5';
import Avatar from '../../ui/Avatar/Avatar';
import Badge from '../../ui/Badge/Badge';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Header.module.css';

const Header = ({
  title,
  showBackButton = false,
  showLanguageSwitcher = false,
  showNotifications = false,
  showUserMenu = true,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <header className={styles.header}>
      {/* Left Section */}
      <div className={styles.left}>
        {showBackButton ? (
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <IoChevronBack size={24} />
          </button>
        ) : isHomePage ? (
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logo}>{t('app_name')}</h1>
          </Link>
        ) : (
          <h1 className={styles.pageTitle}>{title || t('app_name')}</h1>
        )}
      </div>

      {/* Right Section */}
      <div className={styles.right}>
        {showLanguageSwitcher && <LanguageSwitcher />}

        {showNotifications && isAuthenticated && (
          <button
            className={styles.iconButton}
            aria-label="Notifications"
          >
            <IoNotificationsOutline size={24} />
            {/* Badge for unread notifications */}
            <span className={styles.notificationBadge}>3</span>
          </button>
        )}

        {showUserMenu && isAuthenticated && (
          <Link
            to="/profile"
            className={styles.avatarLink}
            aria-label="Go to profile"
          >
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              fallback="initials"
              size="medium"
              status={currentUser?.status}
            />
          </Link>
        )}

        {showUserMenu && !isAuthenticated && (
          <Link to="/login" className={styles.loginLink}>
            {t('header_login')}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
```

**Обновить**: `src/components/layout/Header/Header.module.css`

```css
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border-primary);
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  backdrop-filter: blur(var(--blur-base));
}

.left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.backButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.backButton:hover {
  background: var(--color-bg-secondary);
}

.logoLink {
  text-decoration: none;
}

.logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  margin: 0;
}

.pageTitle {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.iconButton {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.iconButton:hover {
  background: var(--color-bg-secondary);
}

.notificationBadge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-error-500);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
}

.avatarLink {
  display: block;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.avatarLink:hover {
  transform: scale(1.05);
}

.loginLink {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.loginLink:hover {
  background: var(--color-primary-50);
}

/* Mobile */
@media (max-width: 640px) {
  .header {
    padding: var(--space-3) var(--space-4);
  }

  .logo {
    font-size: var(--font-size-lg);
  }

  .pageTitle {
    font-size: var(--font-size-base);
  }
}
```

**Как использовать в страницах**:

```jsx
// HomePage
<Header showLanguageSwitcher showNotifications showUserMenu />

// MapPage
<Header title="Find Food" showNotifications showUserMenu />

// CartPage
<Header title="My Cart" showBackButton showUserMenu />

// ProfilePage
<Header title="Profile" showNotifications showUserMenu />
```

---

### 3.2 Улучшить PostCard

**Файл**: `src/components/features/Community/PostCard/PostCard.jsx`

[Полный обновленный код компонента с urgency indicators, metadata, и улучшенным UX]

---

## Чеклист Фазы 3

- [ ] Header улучшен (notifications, avatar, back button)
- [ ] PostCard обновлен (urgency, metadata, actions)
- [ ] Hero Section оптимизирована для конверсии
- [ ] Cart Page добавлены pickup time selector, trust badges
- [ ] Map Page добавлен Bottom Sheet с preview
- [ ] Community Page улучшены фильтры и сортировка

---

## <a name="метрики"></a>📊 МЕТРИКИ УСПЕХА

### Lighthouse Scores (Цели)

**До улучшений**:
- Performance: ~75
- Accessibility: ~70
- Best Practices: ~85
- SEO: ~80

**После улучшений**:
- Performance: > 90 🎯
- Accessibility: > 95 🎯
- Best Practices: > 95 🎯
- SEO: > 95 🎯

### Business Metrics

**Conversion Funnel**:
- Homepage → Map: +20%
- Map → Cart: +25%
- Cart → Checkout: +30%
- Overall Conversion: +35%

**User Engagement**:
- Time on Site: +40%
- Pages per Session: +50%
- Bounce Rate: -30%

**Retention**:
- D1 Retention: 50% → 65%
- D7 Retention: 25% → 40%
- D30 Retention: 10% → 20%

---

## 🎯 ПРИОРИТЕЗАЦИЯ

### Что делать СНАЧАЛА (Неделя 1-2):
1. ✅ Design tokens (Фаза 1)
2. ✅ Accessibility (ARIA, contrast, touch targets)
3. ✅ FoodCard improvements (rating, distance, urgency)

### Что делать ПОТОМ (Неделя 3-4):
4. ⏳ UI Components (Button, Input, Badge, etc)
5. ⏳ Header improvements
6. ⏳ PostCard improvements

### Что делать В ПОСЛЕДНЮЮ ОЧЕРЕДЬ (Неделя 5-8):
7. ⏭ Advanced animations
8. ⏭ Gamification enhancements
9. ⏭ PWA improvements
10. ⏭ Performance optimization

---

## 📝 CHECKLIST ДЛЯ КАЖДОГО КОМПОНЕНТА

Перед тем как считать компонент "готовым", проверьте:

```markdown
### Accessibility ♿
- [ ] Все интерактивные элементы имеют aria-label
- [ ] role attributes правильно установлены
- [ ] Keyboard navigation работает
- [ ] Focus states видимы
- [ ] Контраст цветов WCAG AA compliant (4.5:1 минимум)
- [ ] Screen reader тестирование пройдено

### UX 🎨
- [ ] Touch targets минимум 44x44px
- [ ] Loading states реализованы
- [ ] Error states обработаны
- [ ] Empty states с CTA
- [ ] Feedback на все действия пользователя
- [ ] Transitions плавные (200-300ms)

### Performance ⚡
- [ ] Images lazy loaded
- [ ] No layout shift (CLS < 0.1)
- [ ] Component code-split если > 50KB
- [ ] Debounce/throttle для expensive operations

### Mobile 📱
- [ ] Responsive на всех breakpoints
- [ ] Touch gestures работают
- [ ] No horizontal scroll
- [ ] Buttons удобно нажимать
- [ ] Text readable (min 14px)

### Code Quality 💻
- [ ] PropTypes / TypeScript типы
- [ ] Error boundaries
- [ ] Console errors = 0
- [ ] ESLint warnings = 0
- [ ] Code commented где нужно

### Testing 🧪
- [ ] Unit tests написаны
- [ ] Integration tests для flows
- [ ] E2E tests для critical paths
- [ ] Manual testing на реальных устройствах
```

---

## 🚀 НАЧАЛО РАБОТЫ

### 1. Установка зависимостей (если нужно)

```bash
# Если нужны дополнительные пакеты
npm install framer-motion  # Для advanced animations
npm install react-intersection-observer  # Для lazy loading
npm install react-hot-toast  # Для notifications
```

### 2. Создать ветку для работы

```bash
git checkout -b feature/ux-improvements
```

### 3. Начать с Фазы 1

Откройте `ux_ui_analysis.md` и следуйте Шагу 1.

### 4. Commit convention

```bash
# Features
git commit -m "feat(ui): add Button component"
git commit -m "feat(a11y): add ARIA labels to FoodCard"

# Improvements
git commit -m "improve(design): migrate to new design tokens"
git commit -m "improve(ux): increase touch targets in BottomNav"

# Fixes
git commit -m "fix(a11y): improve color contrast for text"

# Docs
git commit -m "docs: add Button component usage examples"
```

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

### Design System References
- [Material Design 3](https://m3.material.io/)
- [Ant Design](https://ant.design/)
- [Chakra UI](https://chakra-ui.com/)
- [Radix UI](https://www.radix-ui.com/) - Отличный пример accessibility

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### UX Patterns
- [UI Patterns](https://ui-patterns.com/)
- [Refactoring UI](https://www.refactoringui.com/)
- [Laws of UX](https://lawsofux.com/)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## ❓ FAQ

**Q: Нужно ли делать все сразу?**
A: Нет! Следуйте приоритизации. Фаза 1 критична, остальное можно делать поэтапно.

**Q: Можно ли использовать UI библиотеку вместо создания компонентов?**
A: Да, но убедитесь что она:
- Поддерживает accessibility
- Кастомизируется под ваш design system
- Не слишком большая (bundle size)

**Q: Как тестировать accessibility?**
A: Используйте:
- Chrome Lighthouse
- axe DevTools extension
- NVDA/JAWS screen readers
- Keyboard-only navigation

**Q: Что делать если что-то сломалось?**
A:
1. Откатите на предыдущий commit
2. Изолируйте проблему
3. Создайте issue с описанием
4. Попросите помощи у команды

---

## ✅ ИТОГОВЫЙ CHECKLIST ВСЕГО ПРОЕКТА

### Фаза 1: Критические исправления
- [ ] Design tokens созданы и документированы
- [ ] Все компоненты мигрированы
- [ ] ARIA labels добавлены везде
- [ ] Touch targets увеличены
- [ ] FoodCard улучшен
- [ ] Skip Link добавлен
- [ ] Lighthouse Accessibility > 90

### Фаза 2: UI Компоненты
- [ ] Button component
- [ ] Input component
- [ ] Badge component
- [ ] Skeleton component
- [ ] Avatar component
- [ ] Modal component
- [ ] Все компоненты задокументированы

### Фаза 3: Улучшение страниц
- [ ] Header улучшен
- [ ] Hero Section оптимизирована
- [ ] PostCard обновлен
- [ ] Cart Page улучшена
- [ ] Map Page с Bottom Sheet
- [ ] Community фильтры улучшены

### Фаза 4: Дополнительные фичи
- [ ] Search с autocomplete
- [ ] Animations добавлены
- [ ] Trust elements (reviews, badges)
- [ ] Achievement system
- [ ] Referral program
- [ ] Push notifications setup

### Фаза 5: Полировка
- [ ] Image optimization
- [ ] Code splitting
- [ ] Bundle size оптимизация
- [ ] PWA features улучшены
- [ ] Analytics интегрирована
- [ ] Error tracking (Sentry)

---

🎉 **Удачи с реализацией!**

Следуйте этому руководству шаг за шагом, и ваш продукт станет значительно лучше!

