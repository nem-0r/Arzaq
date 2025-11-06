// src/utils/validators.js
// Professional form validation utilities

/**
 * Email validation using RFC 5322 compliant regex with TLD validation
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  // RFC 5322 compliant email regex with proper TLD validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional check: domain must have valid TLD (at least 2 characters)
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1];
  const domainParts = domain.split('.');

  // Must have at least domain and TLD (e.g., gmail.com)
  if (domainParts.length < 2) return false;

  // TLD must be at least 2 characters and only letters
  const tld = domainParts[domainParts.length - 1];
  const tldRegex = /^[a-zA-Z]{2,}$/;

  return tldRegex.test(tld);
};

/**
 * Password strength validation
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, strength: string, errors: array }
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Determine strength
  if (errors.length === 0) {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (password.length >= 12 && hasSpecialChar) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'medium';
    } else {
      strength = 'fair';
    }
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors
  };
};

/**
 * Required field validation
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty, false otherwise
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Minimum length validation
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if meets minimum, false otherwise
 */
export const minLength = (value, minLength) => {
  return value.length >= minLength;
};

/**
 * Maximum length validation
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} - True if under maximum, false otherwise
 */
export const maxLength = (value, maxLength) => {
  return value.length <= maxLength;
};

/**
 * Match validation (for password confirmation)
 * @param {string} value1 - First value
 * @param {string} value2 - Second value
 * @returns {boolean} - True if values match, false otherwise
 */
export const matches = (value1, value2) => {
  return value1 === value2;
};

/**
 * Phone number validation (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
};

/**
 * Comprehensive form field validator
 * @param {string} fieldName - Name of the field
 * @param {string} value - Value to validate
 * @param {object} rules - Validation rules object
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateField = (fieldName, value, rules) => {
  // Required validation
  if (rules.required && !isRequired(value)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  // Skip other validations if field is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, error: '' };
  }

  // Email validation
  if (rules.email && !isValidEmail(value)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  // Password validation
  if (rules.password) {
    const passwordValidation = validatePassword(value);
    if (!passwordValidation.isValid) {
      return {
        isValid: false,
        error: passwordValidation.errors[0]
      };
    }
  }

  // Min length validation
  if (rules.minLength && !minLength(value, rules.minLength)) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${rules.minLength} characters`
    };
  }

  // Max length validation
  if (rules.maxLength && !maxLength(value, rules.maxLength)) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${rules.maxLength} characters`
    };
  }

  // Match validation
  if (rules.matches && !matches(value, rules.matches.value)) {
    return {
      isValid: false,
      error: rules.matches.message || `${fieldName} does not match`
    };
  }

  // Phone validation
  if (rules.phone && !isValidPhone(value)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number'
    };
  }

  return { isValid: true, error: '' };
};
