// Helper utility functions

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format address
  export const formatAddress = (property) => {
    if (!property) return '';
    const { address, city, state, zip_code } = property;
    return `${address}, ${city}, ${state} ${zip_code}`;
  };
  
  // Format bedroom count
  export const formatBedrooms = (count) => {
    if (count === 0) return 'Studio';
    return `${count} ${count === 1 ? 'Bed' : 'Beds'}`;
  };
  
  // Format bathroom count
  export const formatBathrooms = (count) => {
    return `${count} ${count === 1 ? 'Bath' : 'Baths'}`;
  };
  
  // Format square footage
  export const formatArea = (area) => {
    return `${area.toLocaleString()} sq ft`;
  };
  
  // Format listing type
  export const formatListingType = (type) => {
    if (type === 'sale') return 'For Sale';
    if (type === 'rent') return 'For Rent';
    return type;
  };
  
  // Format property type
  export const formatPropertyType = (type) => {
    if (!type) return '';
    
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    return formattedType;
  };
  
  // Format price for display in map markers
  export const formatPriceShort = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price}`;
    }
  };
  
  // Get viewport dimensions
  export const getViewportDimensions = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
  
  // Format phone number
  export const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = ('' + phone).replace(/\D/g, '');
    
    // Check if the input is of correct length
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    
    return phone;
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Format distance
  export const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };
  
  // Get user initials
  export const getUserInitials = (user) => {
    if (!user) return '';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Parse URL query parameters
  export const parseQueryParams = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  };
  
  // Build URL query string from object
  export const buildQueryString = (params) => {
    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.append(key, value);
      }
    });
    
    return urlParams.toString();
  };