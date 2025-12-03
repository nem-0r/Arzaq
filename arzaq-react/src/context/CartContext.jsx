// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('arzaq_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('arzaq_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Add item to cart or increase quantity if exists
  const addToCart = useCallback((item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        // Item exists, increase quantity
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // New item, add with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  // Remove item completely from cart
  const removeFromCart = useCallback((itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Increase quantity by 1
  const increaseQuantity = useCallback((itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Decrease quantity by 1
  const decreaseQuantity = useCallback((itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Get item quantity
  const getItemQuantity = useCallback((itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Check if item is in cart
  const isInCart = useCallback((itemId) => {
    return cartItems.some((item) => item.id === itemId);
  }, [cartItems]);

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Self-pickup: no delivery fee
  const deliveryFee = 0;
  // Tax (НДС) is already included in prices in Kazakhstan
  const tax = 0;
  const total = subtotal;

  // Group items by restaurant
  const itemsByRestaurant = cartItems.reduce((acc, item) => {
    const restaurant = item.restaurant || 'Other';
    if (!acc[restaurant]) {
      acc[restaurant] = [];
    }
    acc[restaurant].push(item);
    return acc;
  }, {});

  const value = {
    cartItems,
    totalItems,
    subtotal,
    deliveryFee,
    tax,
    total,
    itemsByRestaurant,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
