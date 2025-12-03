// src/utils/currency.js

/**
 * Format price in Kazakhstani Tenge (₸)
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, showSymbol = true) => {
  const formatted = Number(amount).toFixed(0); // No decimals for Tenge
  return showSymbol ? `${formatted} ₸` : formatted;
};

/**
 * Format price with proper spacing for better readability
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price with spaces (e.g., "10 000 ₸")
 */
export const formatPriceWithSpaces = (amount) => {
  const formatted = Number(amount)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ₸`;
};

/**
 * Calculate discount percentage
 * @param {number} oldPrice - Original price
 * @param {number} newPrice - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

/**
 * Calculate savings amount
 * @param {number} oldPrice - Original price
 * @param {number} newPrice - Discounted price
 * @returns {number} Savings amount
 */
export const calculateSavings = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
  return oldPrice - newPrice;
};
