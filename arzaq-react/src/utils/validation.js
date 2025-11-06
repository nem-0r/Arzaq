// src/utils/validation.js

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

export const validateFullName = (name) => {
  if (!name || name.trim() === '') {
    return 'error_name_required';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'error_email_required';
  }
  if (!isValidEmail(email)) {
    return 'error_email_invalid';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password === '') {
    return 'error_password_required';
  }
  if (password.length < 6) {
    return 'error_password_length';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword === '') {
    return 'error_password_confirm';
  }
  if (password !== confirmPassword) {
    return 'error_password_mismatch';
  }
  return null;
};