// src/pages/OrderSuccessPage/OrderSuccessPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../api/services';
import { formatPrice } from '../../utils/currency';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import {
  IoCheckmarkCircle,
  IoTime,
  IoReceipt,
  IoQrCode,
  IoLocationOutline,
  IoAlertCircle
} from 'react-icons/io5';
import styles from './OrderSuccessPage.module.css';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: 'Pending Payment',
        color: '#f59e0b',
        icon: IoTime,
        message: 'Waiting for payment confirmation...'
      },
      PAID: {
        label: 'Payment Confirmed',
        color: '#22c55e',
        icon: IoCheckmarkCircle,
        message: 'Your payment has been confirmed. Restaurant will prepare your order.'
      },
      CONFIRMED: {
        label: 'Order Confirmed',
        color: '#3b82f6',
        icon: IoCheckmarkCircle,
        message: 'Restaurant has confirmed your order and is preparing it.'
      },
      READY: {
        label: 'Ready for Pickup',
        color: '#22c55e',
        icon: IoCheckmarkCircle,
        message: 'Your order is ready! Please show the QR code at pickup.'
      },
      COMPLETED: {
        label: 'Completed',
        color: '#6b7280',
        icon: IoCheckmarkCircle,
        message: 'Order has been completed. Thank you!'
      },
      CANCELLED: {
        label: 'Cancelled',
        color: '#ef4444',
        icon: IoAlertCircle,
        message: 'This order has been cancelled.'
      }
    };

    return configs[status] || configs.PENDING;
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <Header title="Order Details" showBackButton />
        <main id="main-content" className="main-content">
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading order details...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container">
        <Header title="Order Details" showBackButton />
        <main id="main-content" className="main-content">
          <div className={styles.error}>
            <IoAlertCircle size={64} />
            <h2>Error Loading Order</h2>
            <p>{error || 'Order not found'}</p>
            <button className={styles.homeBtn} onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="page-container">
      <Header title="Order Confirmation" showBackButton />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          {/* Success Header */}
          <div className={styles.successHeader}>
            <div
              className={styles.successIcon}
              style={{ background: `linear-gradient(135deg, ${statusConfig.color} 0%, ${statusConfig.color}dd 100%)` }}
            >
              <StatusIcon size={48} color="#ffffff" />
            </div>
            <h1 className={styles.successTitle}>Order Confirmed!</h1>
            <p className={styles.successMessage}>{statusConfig.message}</p>
          </div>

          {/* Order Status */}
          <section className={styles.section}>
            <div className={styles.statusBadge} style={{ background: `${statusConfig.color}15`, color: statusConfig.color }}>
              <StatusIcon size={20} />
              <span>{statusConfig.label}</span>
            </div>
          </section>

          {/* QR Code Section (if available) */}
          {order.qr_code_path && (
            <section className={styles.section}>
              <div className={styles.qrCard}>
                <div className={styles.qrHeader}>
                  <IoQrCode size={24} />
                  <h2>Pickup QR Code</h2>
                </div>
                <div className={styles.qrCodeContainer}>
                  <img
                    src={order.qr_code_path}
                    alt="Pickup QR Code"
                    className={styles.qrCode}
                  />
                </div>
                <p className={styles.qrNote}>
                  Show this QR code at the restaurant to collect your order
                </p>
                {order.pickup_code && (
                  <div className={styles.pickupCode}>
                    <span>Pickup Code:</span>
                    <strong>{order.pickup_code}</strong>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Order Details */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <IoReceipt size={20} />
              Order Details
            </h2>
            <div className={styles.detailsCard}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Order ID</span>
                <span className={styles.detailValue}>#{order.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Order Date</span>
                <span className={styles.detailValue}>
                  {new Date(order.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {order.paid_at && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Date</span>
                  <span className={styles.detailValue}>
                    {new Date(order.paid_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Total Amount</span>
                <span className={styles.detailValueHighlight}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Items</h2>
            <div className={styles.itemsList}>
              {order.items && order.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.food?.name || 'Item'}</h3>
                    <p className={styles.itemQty}>Quantity: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Restaurant Info */}
          {order.items && order.items[0]?.food?.restaurant && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <IoLocationOutline size={20} />
                Pickup Location
              </h2>
              <div className={styles.restaurantCard}>
                <h3>{order.items[0].food.restaurant.full_name}</h3>
                {order.items[0].food.restaurant.address && (
                  <p className={styles.restaurantAddress}>
                    {order.items[0].food.restaurant.address}
                  </p>
                )}
                {order.items[0].food.restaurant.phone && (
                  <p className={styles.restaurantPhone}>
                    Phone: {order.items[0].food.restaurant.phone}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Notes */}
          {order.notes && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Notes</h2>
              <div className={styles.notesCard}>
                <p>{order.notes}</p>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button className={styles.homeBtn} onClick={() => navigate('/')}>
              Back to Home
            </button>
            <button className={styles.ordersBtn} onClick={() => navigate('/profile')}>
              View All Orders
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default OrderSuccessPage;
