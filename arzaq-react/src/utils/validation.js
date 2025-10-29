// src/utils/validation.js

export const isValidEmail = (email) => {
  if (!email) return false;
  return email.includes('@') && 
         email.includes('.') && 
         email.indexOf('@') < email.lastIndexOf('.');
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