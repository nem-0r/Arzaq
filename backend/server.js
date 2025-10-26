// Импортируем Express
const express = require('express');
const app = express();

// Указываем порт для сервера
const PORT = 3001;

// Middleware (чтобы сервер понимал JSON)
app.use(express.json());

// Базовый маршрут для проверки
app.get('/api/health', (req, res) => {
  res.send('OK');
});

// Пример данных (вместо базы данных)
const foodSpots = [
  { id: 1, latitude: 43.24, longitude: 76.89, food_type: 'bread' },
  { id: 2, latitude: 43.25, longitude: 76.88, food_type: 'fruits' },
  { id: 3, latitude: 43.23, longitude: 76.87, food_type: 'vegetables' }
];

// Основной API endpoint
app.get('/api/v1/spots/nearby', (req, res) => {
  res.json(foodSpots);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
