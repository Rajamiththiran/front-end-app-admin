// src/utils/formatters.js

/**
 * Format date to display in a user-friendly format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format style ('short', 'medium', 'long', 'full')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "medium") => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const options = {
    short: { year: "numeric", month: "numeric", day: "numeric" },
    medium: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    full: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return dateObj.toLocaleDateString("en-US", options[format] || options.medium);
};

/**
 * Format time ago (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatTimeAgo = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);
  const now = new Date();

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const seconds = Math.floor((now - dateObj) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} ${years === 1 ? "year" : "years"} ago`;
  if (months > 0) return `${months} ${months === 1 ? "month" : "months"} ago`;
  if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (minutes > 0)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  return "Just now";
};

/**
 * Format a number as a currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number with commas as thousands separators
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return "";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format a phone number in a standardized format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  // For international numbers or other formats, just add a + if needed
  if (cleaned.length > 10 && !phoneNumber.startsWith("+")) {
    return `+${cleaned}`;
  }

  return phoneNumber;
};

/**
 * Format file size in a human-readable format
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  if (!bytes || isNaN(bytes)) return "";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format a user's full name
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} Formatted full name
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return "";
  if (!firstName) return lastName;
  if (!lastName) return firstName;

  return `${firstName} ${lastName}`;
};

/**
 * Format a status string to a more readable format
 * @param {string} status - The status string (e.g., 'PENDING', 'IN_PROGRESS')
 * @returns {string} Formatted status string
 */
export const formatStatus = (status) => {
  if (!status) return "";

  // Convert from SNAKE_CASE or lowercase to Title Case
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Truncate long text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength)}...`;
};
