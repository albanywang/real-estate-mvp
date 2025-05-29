/**
 * Date formatting utilities for Japanese real estate application
 */

/**
 * Formats a date to Japanese format: YYYY年M月D日
 * @param {string|Date|number} dateInput - Date input (ISO string, Date object, or timestamp)
 * @param {Object} options - Formatting options
 * @param {boolean} options.showTime - Whether to include time (HH:MM format)
 * @param {boolean} options.useKanji - Whether to use Japanese kanji (年月日) or numbers only
 * @param {string} options.fallback - Fallback text for invalid dates
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput, options = {}) => {
  const {
    showTime = false,
    useKanji = true,
    fallback = '－'
  } = options;

  // Handle null, undefined, or empty string
  if (!dateInput) {
    return fallback;
  }

  try {
    let date;
    
    // Handle different input types
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      // Handle various string formats
      if (dateInput.trim() === '') {
        return fallback;
      }
      
      // Try to parse ISO date strings, Japanese dates, or other formats
      date = new Date(dateInput);
      
      // If parsing failed, try manual parsing for Japanese format
      if (isNaN(date.getTime())) {
        const japaneseMatch = dateInput.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (japaneseMatch) {
          const [, year, month, day] = japaneseMatch;
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          return fallback;
        }
      }
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    } else {
      return fallback;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();

    let formatted;
    
    if (useKanji) {
      formatted = `${year}年${month}月${day}日`;
    } else {
      // Alternative format without kanji: YYYY/MM/DD
      formatted = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    }

    // Add time if requested
    if (showTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      formatted += ` ${hours}:${minutes}`;
    }

    return formatted;

  } catch (error) {
    console.warn('Error formatting date:', error);
    return fallback;
  }
};

/**
 * Formats a date to a more compact Japanese format for lists: M/D
 * @param {string|Date|number} dateInput - Date input
 * @param {string} fallback - Fallback text for invalid dates
 * @returns {string} Compact formatted date
 */
export const formatDateCompact = (dateInput, fallback = '－') => {
  if (!dateInput) return fallback;

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return fallback;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${month}/${day}`;
  } catch (error) {
    return fallback;
  }
};

/**
 * Formats a date to show relative time in Japanese context
 * @param {string|Date|number} dateInput - Date input
 * @param {string} fallback - Fallback text for invalid dates
 * @returns {string} Relative time string
 */
export const formatDateRelative = (dateInput, fallback = '－') => {
  if (!dateInput) return fallback;

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return fallback;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今日';
    } else if (diffDays === 1) {
      return '昨日';
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}週間前`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}ヶ月前`;
    } else {
      // For older dates, show the full Japanese format
      return formatDate(dateInput);
    }
  } catch (error) {
    return fallback;
  }
};

/**
 * Formats a date range in Japanese format
 * @param {string|Date|number} startDate - Start date
 * @param {string|Date|number} endDate - End date
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate, options = {}) => {
  const { separator = ' 〜 ', fallback = '－' } = options;
  
  const start = formatDate(startDate, { ...options, fallback: null });
  const end = formatDate(endDate, { ...options, fallback: null });
  
  if (!start && !end) return fallback;
  if (!start) return `〜${end}`;
  if (!end) return `${start}〜`;
  
  return `${start}${separator}${end}`;
};

/**
 * Parse Japanese date string back to Date object
 * @param {string} japaneseDate - Japanese formatted date string (YYYY年M月D日)
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export const parseJapaneseDate = (japaneseDate) => {
  if (!japaneseDate || typeof japaneseDate !== 'string') {
    return null;
  }

  try {
    const match = japaneseDate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

/**
 * Check if a date string is in Japanese format
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if Japanese format
 */
export const isJapaneseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  return /^\d{4}年\d{1,2}月\d{1,2}日/.test(dateString);
};

// Default export
export default formatDate;

// Usage examples:
/*
import { formatDate, formatDateCompact, formatDateRelative } from './formatDate';

// Basic usage
formatDate('2024-09-02') // "2024年9月2日"
formatDate(new Date(2024, 8, 2)) // "2024年9月2日"
formatDate('2024-09-02T10:30:00') // "2024年9月2日"

// With time
formatDate('2024-09-02T10:30:00', { showTime: true }) // "2024年9月2日 10:30"

// Without kanji
formatDate('2024-09-02', { useKanji: false }) // "2024/09/02"

// Compact format
formatDateCompact('2024-09-02') // "9/2"

// Relative format
formatDateRelative('2024-09-01') // "1日前" (if today is Sept 2)

// Handle invalid dates
formatDate(null) // "－"
formatDate('invalid') // "－"
formatDate('', { fallback: 'No date' }) // "No date"
*/