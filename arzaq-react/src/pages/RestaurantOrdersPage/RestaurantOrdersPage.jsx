// src/pages/RestaurantOrdersPage/RestaurantOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoTimeOutline, IoReceiptOutline } from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import RestaurantNav from '../../components/layout/RestaurantNav/RestaurantNav';
import { formatPrice } from '../../utils/currency';
import styles from './RestaurantOrdersPage.module.css';

// Mock data (in production, fetch from API)
const mockOrders = [
  {
    id: 1234,
    user: { name: 'Иван Иванов', email: 'ivan@example.com' },
    items: [{ food_name: 'Пицца Маргарита', quantity: 2 }],
    total: 4500,
    status: 'paid',
    pickup_code: 'ARZAQ-12345',
    created_at: new Date().toISOString()
  },
  {
    id: 1235,
    user: { name: 'Мария Петрова', email: 'maria@example.com' },
    items: [{ food_name: 'Салат Цезарь', quantity: 1 }],
    total: 2000,
    status: 'paid',
    pickup_code: 'ARZAQ-12346',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production: fetch orders from API
    // For now, use mock data
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const handleMarkAsPickedUp = (orderId) => {
    // In production: API call to update order status
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'completed' }
        : order
    ));
  };

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Заказы</h1>
            <p className={styles.subtitle}>Управление заказами клиентов</p>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка заказов...</div>
          ) : orders.length === 0 ? (
            <div className={styles.emptyState}>
              <IoReceiptOutline size={64} />
              <h3>Нет активных заказов</h3>
              <p>Новые заказы появятся здесь автоматически</p>
            </div>
          ) : (
            <div className={styles.ordersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Клиент</th>
                    <th>Блюда</th>
                    <th>Сумма</th>
                    <th>Время</th>
                    <th>Код</th>
                    <th>Статус</th>
                    <th>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className={order.status === 'completed' ? styles.completedRow : ''}>
                      <td className={styles.orderId}>#{order.id}</td>
                      <td>{order.user.name}</td>
                      <td>
                        {order.items.map((item, i) => (
                          <div key={i}>
                            {item.food_name} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className={styles.total}>{formatPrice(order.total)}</td>
                      <td>
                        <div className={styles.timeCell}>
                          <IoTimeOutline size={16} />
                          {new Date(order.created_at).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className={styles.pickupCode}>{order.pickup_code}</td>
                      <td>
                        {order.status === 'paid' && (
                          <span className={styles.statusPaid}>Оплачен</span>
                        )}
                        {order.status === 'completed' && (
                          <span className={styles.statusCompleted}>✓ Выдан</span>
                        )}
                      </td>
                      <td>
                        {order.status === 'paid' ? (
                          <button
                            className={styles.completeBtn}
                            onClick={() => handleMarkAsPickedUp(order.id)}
                          >
                            <IoCheckmarkCircle size={18} />
                            Выдано
                          </button>
                        ) : (
                          <span className={styles.completedText}>Завершён</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <RestaurantNav />
    </div>
  );
};

export default RestaurantOrdersPage;
