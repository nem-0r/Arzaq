// src/components/features/Restaurant/RestaurantOrders/RestaurantOrders.jsx
import React, { useState, useEffect } from 'react';
import { orderService } from '../../../../api/services';
import { formatPrice } from '../../../../utils/currency';
import {
  IoReceipt,
  IoCheckmarkCircle,
  IoTime,
  IoQrCode,
  IoAlertCircle,
  IoRefresh,
  IoClose
} from 'react-icons/io5';
import styles from './RestaurantOrders.module.css';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, activeFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getRestaurantOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status.toLowerCase() === activeFilter));
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to update order status.';
      alert(errorMessage);
    }
  };

  const handleVerifyQR = async () => {
    if (!qrCodeInput.trim()) {
      alert('Please enter a pickup code');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await orderService.verifyPickupCode(qrCodeInput);
      alert(`Order #${result.order_id} verified successfully! Status: ${result.status}`);
      setQrCodeInput('');
      setQrScannerOpen(false);
      await loadOrders();
    } catch (err) {
      console.error('QR verification failed:', err);
      const errorMessage = err.response?.data?.detail || 'Invalid pickup code.';
      alert(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { label: 'Pending', color: '#f59e0b', icon: IoTime },
      PAID: { label: 'Paid', color: '#22c55e', icon: IoCheckmarkCircle },
      CONFIRMED: { label: 'Confirmed', color: '#3b82f6', icon: IoCheckmarkCircle },
      READY: { label: 'Ready', color: '#22c55e', icon: IoCheckmarkCircle },
      COMPLETED: { label: 'Completed', color: '#6b7280', icon: IoCheckmarkCircle },
      CANCELLED: { label: 'Cancelled', color: '#ef4444', icon: IoAlertCircle }
    };
    return configs[status] || configs.PENDING;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      PENDING: { label: 'Pending', color: '#f59e0b' },
      SUCCESS: { label: 'Success', color: '#22c55e' },
      FAILED: { label: 'Failed', color: '#ef4444' }
    };
    return configs[status] || configs.PENDING;
  };

  const canConfirm = (order) => order.status === 'PAID';
  const canMarkReady = (order) => order.status === 'CONFIRMED';
  const canComplete = (order) => order.status === 'READY';

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <IoAlertCircle size={48} />
        <p>{error}</p>
        <button className={styles.retryBtn} onClick={loadOrders}>
          <IoRefresh size={20} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <IoReceipt size={28} />
          <div>
            <h2>Restaurant Orders</h2>
            <p>{orders.length} total orders</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={loadOrders}>
            <IoRefresh size={20} />
            Refresh
          </button>
          <button className={styles.qrBtn} onClick={() => setQrScannerOpen(true)}>
            <IoQrCode size={20} />
            Scan QR
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({orders.length})
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === 'paid' ? styles.active : ''}`}
          onClick={() => setActiveFilter('paid')}
        >
          Paid ({orders.filter(o => o.status === 'PAID').length})
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === 'confirmed' ? styles.active : ''}`}
          onClick={() => setActiveFilter('confirmed')}
        >
          Confirmed ({orders.filter(o => o.status === 'CONFIRMED').length})
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === 'ready' ? styles.active : ''}`}
          onClick={() => setActiveFilter('ready')}
        >
          Ready ({orders.filter(o => o.status === 'READY').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className={styles.empty}>
          <IoReceipt size={64} />
          <h3>No Orders Found</h3>
          <p>
            {activeFilter === 'all'
              ? 'You have no orders yet.'
              : `No orders with status: ${activeFilter}`}
          </p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const paymentConfig = getPaymentStatusConfig(order.payment_status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={order.id} className={styles.orderCard}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3>Order #{order.id}</h3>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={styles.orderTotal}>{formatPrice(order.total)}</div>
                </div>

                {/* Customer Info */}
                <div className={styles.customerInfo}>
                  <strong>Customer:</strong> {order.user?.full_name || order.user?.email || 'Unknown'}
                </div>

                {/* Order Items */}
                <div className={styles.orderItems}>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className={styles.orderItem}>
                      <span>{item.quantity}x {item.food?.name || 'Item'}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className={styles.orderNotes}>
                    <strong>Notes:</strong> {order.notes}
                  </div>
                )}

                {/* Status Badges */}
                <div className={styles.statusBadges}>
                  <div
                    className={styles.statusBadge}
                    style={{ background: `${statusConfig.color}15`, color: statusConfig.color }}
                  >
                    <StatusIcon size={16} />
                    <span>{statusConfig.label}</span>
                  </div>
                  <div
                    className={styles.statusBadge}
                    style={{ background: `${paymentConfig.color}15`, color: paymentConfig.color }}
                  >
                    <span>Payment: {paymentConfig.label}</span>
                  </div>
                </div>

                {/* Pickup Code */}
                {order.pickup_code && (
                  <div className={styles.pickupCode}>
                    <strong>Pickup Code:</strong> <code>{order.pickup_code}</code>
                  </div>
                )}

                {/* Actions */}
                <div className={styles.orderActions}>
                  {canConfirm(order) && (
                    <button
                      className={`${styles.actionBtn} ${styles.confirmBtn}`}
                      onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                    >
                      <IoCheckmarkCircle size={18} />
                      Confirm Order
                    </button>
                  )}
                  {canMarkReady(order) && (
                    <button
                      className={`${styles.actionBtn} ${styles.readyBtn}`}
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                    >
                      <IoCheckmarkCircle size={18} />
                      Mark Ready
                    </button>
                  )}
                  {canComplete(order) && (
                    <button
                      className={`${styles.actionBtn} ${styles.completeBtn}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <IoQrCode size={18} />
                      Complete (QR)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Scanner Modal */}
      {qrScannerOpen && (
        <div className={styles.modalOverlay} onClick={() => !isVerifying && setQrScannerOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                <IoQrCode size={24} />
                Scan Pickup QR Code
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setQrScannerOpen(false)}
                disabled={isVerifying}
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Enter the pickup code from the customer's QR code:</p>
              <input
                type="text"
                className={styles.qrInput}
                placeholder="ARZAQ-123-ABCD1234"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                disabled={isVerifying}
                autoFocus
              />
              <button
                className={styles.verifyBtn}
                onClick={handleVerifyQR}
                disabled={isVerifying || !qrCodeInput.trim()}
              >
                {isVerifying ? (
                  <>
                    <div className={styles.spinner}></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircle size={20} />
                    Verify & Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Order #{selectedOrder.id} - QR Code</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                <IoClose size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {selectedOrder.qr_code_path ? (
                <>
                  <img
                    src={selectedOrder.qr_code_path}
                    alt="Order QR Code"
                    className={styles.qrImage}
                  />
                  <p className={styles.qrNote}>
                    Ask customer to show this QR code for verification
                  </p>
                </>
              ) : (
                <p>QR code not available for this order</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
