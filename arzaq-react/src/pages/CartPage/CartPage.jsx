// src/pages/CartPage/CartPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
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

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = () => {
    if (!currentUser) {
      // Show login prompt if not authenticated
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = () => {
    // Here you would integrate with payment gateway
    // For now, simulating successful payment
    setOrderPlaced(true);

    setTimeout(() => {
      // Create mock order object
      const mockOrder = {
        id: Math.floor(Math.random() * 10000) + 1,
        pickup_code: `ARZAQ-${Math.floor(Math.random() * 100000)}`,
        status: 'paid',
        total: total,
        subtotal: subtotal,
        created_at: new Date().toISOString(),
        items: cartItems.map(item => ({
          ...item,
          food_name: item.name,
          subtotal: item.price * item.quantity
        }))
      };

      clearCart();
      setShowCheckoutModal(false);
      setOrderPlaced(false);

      // Navigate to Order Confirmation Page with order data
      navigate('/order-confirmation', {
        state: { order: mockOrder }
      });
    }, 2000);
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
              <span className={styles.summaryLabel}>Сумма заказа</span>
              <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.infoNote}>
              ℹ️ Самовывоз - доставка не требуется
            </div>

            <div className={styles.divider}></div>

            <div className={styles.summaryRow}>
              <span className={styles.totalLabel}>Итого к оплате</span>
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

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className={styles.modalOverlay} onClick={() => !orderPlaced && setShowCheckoutModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {!orderPlaced ? (
              <>
                <h3 className={styles.modalTitle}>{t('cart_confirm_order')}</h3>
                <p className={styles.modalText}>{t('cart_confirm_message')}</p>

                <div className={styles.modalTotal}>
                  <span>{t('cart_total')}</span>
                  <span className={styles.modalTotalAmount}>{formatPrice(total)}</span>
                </div>

                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setShowCheckoutModal(false)}
                  >
                    {t('cart_cancel')}
                  </button>
                  <button
                    className={styles.confirmBtn}
                    onClick={handleConfirmOrder}
                  >
                    {t('cart_confirm')}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#22C55E" />
                    <path
                      d="M20 32L28 40L44 24"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className={styles.successTitle}>{t('cart_order_success')}</h3>
                <p className={styles.successText}>{t('cart_order_success_message')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CartPage;
