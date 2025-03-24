// src/utils/validators.js

/**
 * Check if a string is empty or contains only whitespace
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is empty or whitespace
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  return value.toString().trim() === "";
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email format is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum password length (default: 8)
 * @param {boolean} options.requireUppercase - Require at least one uppercase letter (default: true)
 * @param {boolean} options.requireLowercase - Require at least one lowercase letter (default: true)
 * @param {boolean} options.requireNumbers - Require at least one number (default: true)
 * @param {boolean} options.requireSpecialChars - Require at least one special character (default: true)
 * @returns {Object} Validation result with isValid and message properties
 */
export const validatePassword = (password, options = {}) => {
  const config = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    ...options,
  };

  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < config.minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${config.minLength} characters long`,
    };
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (config.requireNumbers && !/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (
    config.requireSpecialChars &&
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  ) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { isValid: true, message: "Password is valid" };
};

/**
 * Validate a phone number
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} True if the phone number is valid
 */
export const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;

  // Remove all non-digit characters for consistent validation
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Check for minimum length (different countries have different formats)
  // This is a simple validation that can be expanded based on requirements
  return cleaned.length >= 10;
};

/**
 * Validate a URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if the URL format is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate if the value is a number
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a number
 */
export const isNumber = (value) => {
  if (value === null || value === undefined || value === "") return false;
  return !isNaN(Number(value));
};

/**
 * Validate NIC number (Sri Lankan National Identity Card)
 * @param {string} nic - The NIC number to validate
 * @returns {boolean} True if the NIC format is valid
 */
export const isValidNIC = (nic) => {
  if (!nic) return false;

  // Old NIC format: 9 digits followed by V or X
  const oldNICRegex = /^[0-9]{9}[vVxX]$/;

  // New NIC format: 12 digits
  const newNICRegex = /^[0-9]{12}$/;

  return oldNICRegex.test(nic) || newNICRegex.test(nic);
};

/**
 * Validate a date is in the past
 * @param {string|Date} date - The date to validate
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;

  const dateObj = new Date(date);
  const now = new Date();

  if (isNaN(dateObj.getTime())) {
    return false;
  }

  return dateObj < now;
};

/**
 * Validate form fields
 * @param {Object} values - Form values to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Object with errors
 */
export const validateForm = (values, schema) => {
  const errors = {};

  Object.entries(schema).forEach(([fieldName, validators]) => {
    const value = values[fieldName];

    validators.forEach((validator) => {
      const {
        isValid,
        message,
        condition = () => true,
      } = validator(value, values);

      if (condition(values) && !isValid && !errors[fieldName]) {
        errors[fieldName] = message;
      }
    });
  });

  return errors;
};

/**
 * Create required field validator
 * @param {string} fieldName - Name of the field
 * @returns {Function} Validator function
 */
export const required = (fieldName) => (value) => ({
  isValid: !isEmpty(value),
  message: `${fieldName} is required`,
});

/**
 * Create minimum length validator
 * @param {string} fieldName - Name of the field
 * @param {number} minLength - Minimum length required
 * @returns {Function} Validator function
 */
export const minLength = (fieldName, minLength) => (value) => ({
  isValid: value && value.length >= minLength,
  message: `${fieldName} must be at least ${minLength} characters`,
});

/**
 * Create maximum length validator
 * @param {string} fieldName - Name of the field
 * @param {number} maxLength - Maximum length allowed
 * @returns {Function} Validator function
 */
export const maxLength = (fieldName, maxLength) => (value) => ({
  isValid: !value || value.length <= maxLength,
  message: `${fieldName} must be less than ${maxLength} characters`,
});
