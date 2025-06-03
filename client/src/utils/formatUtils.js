/**
 * Formats a price in Japanese yen with commas and optional unit
 * @param {number} price - The price in yen
 * @param {string} unit - The unit to append ('万', '億', etc.), default is empty
 * @param {boolean} showCurrency - Whether to include the ¥ symbol
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, unit = '円', showCurrency = false) => {
    if (price === null || price === undefined) return '-';
    
    const formattedPrice = price.toLocaleString();
    const currencySymbol = showCurrency ? '¥' : '';
    
    return `${currencySymbol}${formattedPrice}${unit}`;
  };
  
  /**
   * Formats a price in Japanese yen in 万 (10,000s) with commas
   * @param {number} price - The price in yen
   * @param {boolean} showCurrency - Whether to include the ¥ symbol
   * @returns {string} Formatted price string
   */
  export const formatPriceInMan = (price, showCurrency = false) => {
    if (price === null || price === undefined) return '-';
    
    const priceInMan = Math.round(price / 10000);
    return formatPrice(priceInMan, '万円', showCurrency);
  };
  
/**
 * Formats a price in Japanese yen with traditional 億/万 notation
 * @param {number} price - The price in yen
 * @returns {string} Formatted price string with 億/万 units
 */
export const formatTraditionalPrice = (price) => {
  if (price === null || price === undefined) return '-';
 
  if (price >= 100000000) {
    const okuValue = price / 100000000;
    return `${okuValue.toFixed(2)}億円`;
  } else {
    const man = Math.floor(price / 10000);
    return `${man.toLocaleString()}万`;
  }
};
  
  /**
   * Formats a price per square meter
   * @param {number} price - The total price
   * @param {number} area - The area in square meters
   * @param {boolean} showCurrency - Whether to include the ¥ symbol
   * @returns {string} Formatted price per square meter
   */
  export const formatPricePerSquareMeter = (price, area, showCurrency = true) => {
    if (!price || !area) return '-';
    
    const pricePerSqm = Math.round(price / area);
    return formatPrice(pricePerSqm, '', showCurrency);
  };
  
  // Utility function for area formatting
  export const formatArea = (area) => {
    return `${area}㎡`;
  };

  // Utility function for balcony formatting
  export const formatBalcony = (balcony) => {
    return `${balcony}㎡`;
  };


  // Utility function for management fee formatting
  export const formatManagementFee = (fee) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(fee);
  };  

  export default {
    formatManagementFee,
    formatBalcony,
    formatArea,
    formatPrice,
    formatPriceInMan,
    formatTraditionalPrice,
    formatPricePerSquareMeter
  };