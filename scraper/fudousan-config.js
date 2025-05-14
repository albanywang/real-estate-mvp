/**
 * Configuration for the Fudousan.or.jp Property Scraper
 * 
 * This file contains all configurable settings for the property scraper.
 * Modify these values to customize the scraper's behavior.
 */

const config = {
  // Base website URL
  baseUrl: 'https://www.fudousan.or.jp',
  
  // Search parameters
  search: {
    type: 'buy',        // Options: 'buy', 'rent'
    propertyType: 'mansion', // Options: 'mansion' (apartment), 'house', 'land', 'business'
    location: '東京都',  // Location in Japanese (e.g., Tokyo)
    resultsPerPage: 30,
    maxPages: 5,        // Maximum number of pages to scrape
  },
  
  // Output settings
  output: {
    format: 'json',     // Options: 'json', 'csv'
    path: './output',   // Output directory
  },
  
  // Detail scraper settings
  detailScraper: {
    concurrentScrapes: 5, // Number of detail pages to scrape simultaneously
    extractImages: true,  // Whether to extract image URLs
    extractNearbyFacilities: true, // Whether to extract nearby facilities
    extractAgentInfo: true, // Whether to extract real estate agent information
  },
  
  // Technical settings
  technical: {
    timeout: 30000,     // Navigation timeout in milliseconds (30 seconds)
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    headless: true,     // Run browser in headless mode
  },
  
  // Language settings (some websites have multiple language options)
  language: 'ja',       // Options: 'ja' (Japanese), 'en' (English, if available)
  
  // Additional search filters
  filters: {
    priceMin: null,     // Minimum price in JPY
    priceMax: null,     // Maximum price in JPY
    sizeMin: null,      // Minimum size in square meters
    sizeMax: null,      // Maximum size in square meters
    roomsMin: null,     // Minimum number of rooms
    yearBuiltMin: null, // Minimum year built
    distanceFromStation: null, // Maximum distance from station (in minutes)
    features: [],       // Array of desired features (e.g., ['駐車場', 'ペット可'])
  },
  
  // Define Japanese selectors for various property types
  selectors: {
    navigation: {
      buyLink: 'a[href*="buy"], a[href*="買う"], a.nav-link[href*="buy"]',
      rentLink: 'a[href*="rent"], a[href*="借りる"], a.nav-link[href*="rent"]'
    },
    buy: {
      mansion: 'input[value*="マンション"], input[name*="mansion"], a[href*="mansion"], a[href*="マンション"]',
      house: 'input[value*="一戸建て"], input[name*="house"], a[href*="house"], a[href*="一戸建て"]',
      land: 'input[value*="土地"], input[name*="land"], a[href*="land"], a[href*="土地"]',
      business: 'input[value*="事業用"], input[name*="business"], a[href*="business"], a[href*="事業用"]',
    },
    rent: {
      mansion: 'input[value*="マンション"], input[name*="mansion"], a[href*="mansion"], a[href*="マンション"]',
      house: 'input[value*="一戸建て"], input[name*="house"], a[href*="house"], a[href*="一戸建て"]',
      land: 'input[value*="土地"], input[name*="land"], a[href*="land"], a[href*="土地"]',
      business: 'input[value*="事業用"], input[name*="business"], a[href*="business"], a[href*="事業用"]',
    },
    propertyList: '.property-list, .bukken-list, .search-results, .result-list',
    propertyItem: '.property-item, .bukken-item, .search-result, .result-item',
    nextPage: '.next, .next-page, [aria-label="Next"], .pagination a[rel="next"]',
    locationInput: 'input[placeholder*="地域"], input[name*="area"], input[name*="location"], input[id*="address"], input[name*="address"]',
    submitButton: 'button[type="submit"], input[type="submit"], .search-button, .btn-search',
    searchForm: 'form[action*="search"], form[id*="search"]',
  }
};

// Define preset configurations for common use cases
const presets = {
  // Apartments for sale in Tokyo
  tokyoApartments: {
    search: {
      type: 'buy',
      propertyType: 'mansion',
      location: '東京都',
    }
  },
  
  // Houses for rent in Osaka
  osakaHouseRentals: {
    search: {
      type: 'rent',
      propertyType: 'house',
      location: '大阪府',
    }
  },
  
  // Commercial properties for sale in Yokohama
  yokohamaCommercial: {
    search: {
      type: 'buy',
      propertyType: 'business',
      location: '横浜市',
    }
  },
  
  // Land for sale in Kyoto
  kyotoLand: {
    search: {
      type: 'buy',
      propertyType: 'land',
      location: '京都府',
    }
  },
  
  // High-end apartments for rent in Tokyo
  tokyoLuxuryApartments: {
    search: {
      type: 'rent',
      propertyType: 'mansion',
      location: '東京都',
    },
    filters: {
      priceMin: 300000, // 300,000 JPY per month
      sizeMin: 80,      // 80 square meters
      roomsMin: 3,      // At least 3 rooms
      distanceFromStation: 5, // Within 5 minutes of a station
      features: ['ペット可', '駐車場', 'オートロック'], // Pet-friendly, parking, auto-lock
    }
  }
};

/**
 * Apply a preset configuration
 * @param {string} presetName - Name of the preset to apply
 * @returns {object} - New configuration with preset values applied
 */
function applyPreset(presetName) {
  if (!presets[presetName]) {
    throw new Error(`Preset '${presetName}' not found`);
  }
  
  // Deep clone the default config
  const newConfig = JSON.parse(JSON.stringify(config));
  
  // Apply preset values, handling nested objects
  const preset = presets[presetName];
  
  for (const [key, value] of Object.entries(preset)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Merge objects recursively
      newConfig[key] = { ...newConfig[key], ...value };
    } else {
      // Directly assign non-object values
      newConfig[key] = value;
    }
  }
  
  return newConfig;
}

/**
 * Merge user-provided config with default config
 * @param {object} userConfig - User-provided configuration
 * @returns {object} - New configuration with user values applied
 */
function mergeConfig(userConfig) {
  if (!userConfig) return config;
  
  // Deep clone the default config
  const newConfig = JSON.parse(JSON.stringify(config));
  
  // Recursively merge user config into default config
  function deepMerge(target, source) {
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
  
  deepMerge(newConfig, userConfig);
  return newConfig;
}

module.exports = {
  config,
  presets,
  applyPreset,
  mergeConfig
};