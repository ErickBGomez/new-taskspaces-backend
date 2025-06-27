// utils/datetime.helpers.js

/**
 * Ensures a datetime string is in proper ISO-8601 format
 * @param {string} dateTimeString - The datetime string to normalize
 * @returns {string} - Properly formatted ISO-8601 datetime string
 */
export const normalizeDateTime = (dateTimeString) => {
  if (!dateTimeString) return null;

  // Remove any existing timezone info to avoid conflicts
  let cleanDateTime = dateTimeString.replace(/Z$|[+-]\d{2}:\d{2}$/, '');

  // Add 'Z' for UTC if no timezone is present
  if (
    !cleanDateTime.endsWith('Z') &&
    !cleanDateTime.match(/[+-]\d{2}:\d{2}$/)
  ) {
    cleanDateTime += 'Z';
  }

  return cleanDateTime;
};

/**
 * Converts various datetime inputs to a proper Date object
 * @param {string|Date} dateTime - The datetime to convert
 * @returns {Date|null} - JavaScript Date object or null
 */
export const toDateObject = (dateTime) => {
  if (!dateTime) return null;

  if (dateTime instanceof Date) {
    return dateTime;
  }

  if (typeof dateTime === 'string') {
    const normalizedDateTime = normalizeDateTime(dateTime);
    return new Date(normalizedDateTime);
  }

  return null;
};

/**
 * Validates if a datetime string is in proper format
 * @param {string} dateTimeString - The datetime string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDateTime = (dateTimeString) => {
  if (!dateTimeString) return false;

  try {
    const date = new Date(normalizeDateTime(dateTimeString));
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Formats a Date object to ISO string for database storage
 * @param {Date} date - The Date object to format
 * @returns {string} - ISO string formatted for database
 */
export const formatForDatabase = (date) => {
  if (!date || !(date instanceof Date)) return null;
  return date.toISOString();
};

// Example usage:
// const userInput = "2025-06-26T17:05:00";
// const normalizedDateTime = normalizeDateTime(userInput); // "2025-06-26T17:05:00Z"
// const dateObject = toDateObject(userInput); // Date object
// const isValid = isValidDateTime(userInput); // true
