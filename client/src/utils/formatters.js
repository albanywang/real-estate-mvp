// Format price with currency symbol and commas
export const formatPrice = (price, currency = '$') => {
    if (!price && price !== 0) return '';
    return `${currency}${price.toLocaleString()}`;
  };
  
  // Format price with short notation (e.g., $1.2M)
  export const formatPriceShort = (price, currency = '$') => {
    if (!price && price !== 0) return '';
    
    if (price >= 1000000) {
      return `${currency}${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${currency}${(price / 1000).toFixed(0)}K`;
    } else {
      return `${currency}${price}`;
    }
  };
  
  // Format date to locale string
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format area with unit
  export const formatArea = (area, unit = 'sq ft') => {
    if (!area && area !== 0) return '';
    return `${area.toLocaleString()} ${unit}`;
  };
  
  // Format phone number (e.g., (123) 456-7890)
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
  };
  
  // Format property type for display
  export const formatPropertyType = (type) => {
    if (!type) return '';
    
    // Capitalize first letter of each word
    return type
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Format listing type (For Sale/For Rent)
  export const formatListingType = (type) => {
    if (!type) return '';
    
    switch (type) {
      case 'sale':
        return 'For Sale';
      case 'rent':
        return 'For Rent';
      default:
        return type;
    }
  };
  
  // Format bedroom count (with proper plural)
  export const formatBedrooms = (count) => {
    if (count === null || count === undefined) return '';
    
    if (count === 0) {
      return 'Studio';
    } else if (count === 1) {
      return '1 Bedroom';
    } else {
      return `${count} Bedrooms`;
    }
  };
  
  // Format bathroom count (with proper plural)
  export const formatBathrooms = (count) => {
    if (count === null || count === undefined) return '';
    
    if (count === 1) {
      return '1 Bathroom';
    } else if (count % 1 === 0) {
      return `${count} Bathrooms`;
    } else {
      // Handle half bathrooms (e.g., 1.5)
      return `${count} Bathrooms`;
    }
  };