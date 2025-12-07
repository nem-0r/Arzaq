// src/pages/CheckoutPage/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { orderService, paymentService } from '../../api/services';
import { formatPrice } from '../../utils/currency';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import CartItem from '../../components/common/CartItem/CartItem';
import { IoWallet, IoAlertCircle } from 'react-icons/io5';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    cartItems,
    totalItems,
    subtotal,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create order with items
      const orderData = {
        items: cartItems.map(item => ({
          food_id: item.id,
          quantity: item.quantity
        })),
        notes: notes.trim() || undefined
      };

      const order = await orderService.createOrder(orderData);

      // Step 2: Initiate PayBox payment
      const paymentResponse = await paymentService.initiatePayment(order.id);

      // Step 3: Clear cart before redirect
      clearCart();

      // Step 4: Redirect to PayBox payment page
      window.location.href = paymentResponse.payment_url;

    } catch (err) {
      console.error('Payment error:', err);

      let errorMessage = 'Failed to process payment. Please try again.';

      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.status === 400) {
        errorMessage = 'Some items may no longer be available. Please check your cart.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You are not authorized to complete this order.';
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 || !currentUser) {
    return null; // Will redirect
  }

  return (
    <div className="page-container">
      <Header title="Checkout" showBackButton />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          {/* Error Message */}
          {error && (
            <div className={styles.errorBanner}>
              <IoAlertCircle size={24} />
              <div>
                <strong>Payment Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Items ({totalItems})</h2>
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
          </section>

          {/* Order Notes */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Notes (Optional)</h2>
            <textarea
              className={styles.notesInput}
              placeholder="Add any special instructions for the restaurant..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className={styles.charCount}>{notes.length}/500</div>
          </section>

          {/* Order Summary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Delivery Fee</span>
                <span className={styles.summaryValue}>Free (Self-pickup)</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tax</span>
                <span className={styles.summaryValue}>Included</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.summaryRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{formatPrice(total)}</span>
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section className={styles.section}>
            <div className={styles.paymentInfo}>
              <IoWallet size={24} className={styles.paymentIcon} />
              <div>
                <h3 className={styles.paymentTitle}>Secure Payment with PayBox</h3>
                <p className={styles.paymentDesc}>
                  You will be redirected to PayBox to complete your payment securely.
                  Your order will be reserved for 10 minutes.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Payment Button */}
      <div className={styles.paymentFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <span className={styles.footerLabel}>Total Amount</span>
            <span className={styles.footerAmount}>{formatPrice(total)}</span>
          </div>
          <button
            className={styles.payBtn}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className={styles.spinner}></div>
                Processing...
              </>
            ) : (
              <>
                <IoWallet size={20} />
                Pay with PayBox
              </>
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CheckoutPage;
