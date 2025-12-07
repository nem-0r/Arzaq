// src/pages/CartPage/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { formatPrice } from '../../utils/currency';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import CartItem from '../../components/common/CartItem/CartItem';
import EmptyCart from '../../components/common/EmptyCart/EmptyCart';
import LoginPrompt from '../../components/common/LoginPrompt/LoginPrompt';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    cartItems,
    totalItems,
    subtotal,
    deliveryFee,
    tax,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    if (!currentUser) {
      // Redirect to login
      navigate('/login');
      return;
    }
    // Navigate to checkout page
    navigate('/checkout');
  };

  // Show empty cart if no items
  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <Header title={t('nav_cart')} showBackButton={false} />
        <main id="main-content" className="main-content">
          <EmptyCart />
        </main>
        <BottomNav />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="page-container">
        <Header title={t('nav_cart')} showBackButton={false} />
        <main id="main-content" className="main-content">
          <div className={styles.container}>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <LoginPrompt
              title={t('cart_login_required')}
              message={t('cart_login_message')}
            />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title={t('nav_cart')} showBackButton={false} />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          {/* Cart Header */}
          <div className={styles.cartHeader}>
            <h2 className={styles.itemCount}>
              {totalItems} {t('cart_items')}
            </h2>
            <button className={styles.clearBtn} onClick={clearCart}>
              {t('cart_clear_all')}
            </button>
          </div>

          {/* Cart Items */}
          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>{t('cart_order_summary')}</h3>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('cart_subtotal')}</span>
              <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('cart_delivery_fee')}</span>
              <span className={styles.summaryValue}>{formatPrice(deliveryFee)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('cart_tax')}</span>
              <span className={styles.summaryValue}>{formatPrice(tax)}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.summaryRow}>
              <span className={styles.totalLabel}>{t('cart_total')}</span>
              <span className={styles.totalValue}>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Checkout Button */}
      <div className={styles.checkoutFooter}>
        <button className={styles.checkoutBtn} onClick={handleCheckout}>
          {t('cart_checkout')} • {formatPrice(total)}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default CartPage;
