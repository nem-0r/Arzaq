// src/pages/OrderConfirmationPage/OrderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'react-qr-code';
import { IoCheckmarkCircle, IoReceipt, IoQrCode, IoArrowForward, IoDownload } from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import { formatPrice } from '../../utils/currency';
import styles from './OrderConfirmationPage.module.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order data from location state
    const orderData = location.state?.order;

    if (!orderData) {
      // Redirect to home if no order data
      navigate('/');
      return;
    }

    setOrder(orderData);
  }, [location, navigate]);

  const handleDownloadQR = () => {
    // Get QR code SVG element
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    // Convert SVG to canvas
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Download as PNG
      const link = document.createElement('a');
      link.download = `arzaq-order-${order.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!order) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className={styles.loading}>Загрузка...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          {/* Success Icon */}
          <div className={styles.successIcon}>
            <IoCheckmarkCircle size={80} />
          </div>

          <h1 className={styles.title}>Заказ подтверждён!</h1>
          <p className={styles.subtitle}>
            Ваш заказ успешно оплачен. Покажите QR-код или код получения в ресторане.
          </p>

          {/* QR Code Section */}
          <div className={styles.qrSection}>
            <div className={styles.qrCodeWrapper}>
              <QRCodeSVG
                id="qr-code-svg"
                value={order.pickup_code || order.id.toString()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <button className={styles.downloadBtn} onClick={handleDownloadQR}>
              <IoDownload size={20} />
              <span>Скачать QR-код</span>
            </button>
          </div>

          {/* Pickup Code */}
          <div className={styles.pickupCodeSection}>
            <div className={styles.pickupCodeHeader}>
              <IoQrCode size={24} />
              <h3>Код получения</h3>
            </div>
            <div className={styles.pickupCode}>{order.pickup_code || `ORDER-${order.id}`}</div>
            <p className={styles.pickupCodeNote}>
              Или назовите этот код сотруднику ресторана
            </p>
          </div>

          {/* Order Details */}
          <div className={styles.orderDetails}>
            <div className={styles.orderDetailsHeader}>
              <IoReceipt size={24} />
              <h3>Детали заказа</h3>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Номер заказа:</span>
              <span className={styles.detailValue}>#{order.id}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Статус:</span>
              <span className={styles.statusBadge}>Оплачен</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Дата:</span>
              <span className={styles.detailValue}>
                {new Date(order.created_at || Date.now()).toLocaleString('ru-RU')}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Итого:</span>
              <span className={styles.totalValue}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className={styles.orderItems}>
              <h4>Ваш заказ:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index} className={styles.orderItem}>
                    <span className={styles.itemName}>
                      {item.food_name || item.name} x{item.quantity}
                    </span>
                    <span className={styles.itemPrice}>{formatPrice(item.subtotal || item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Box */}
          <div className={styles.infoBox}>
            <p>
              <strong>ℹ️ Важно:</strong> Пожалуйста, заберите заказ в течение указанного времени.
              Покажите QR-код или назовите код получения сотруднику ресторана.
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate('/')}
            >
              <span>На главную</span>
              <IoArrowForward size={20} />
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => navigate('/orders')}
            >
              Мои заказы
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;
