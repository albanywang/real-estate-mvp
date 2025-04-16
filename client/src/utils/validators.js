// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Password validation (at least 8 characters, with at least one number)
  export const isValidPassword = (password) => {
    if (!password || password.length < 8) return false;
    
    const hasNumber = /\d/.test(password);
    return hasNumber;
  };
  
  // Phone number validation
  export const isValidPhone = (phone) => {
    // Accept various formats including (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return !phone || phoneRegex.test(phone);
  };
  
  // US Zip code validation
  export const isValidZipCode = (zipCode) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };
  
  // Price validation (positive number)
  export const isValidPrice = (price) => {
    return !isNaN(price) && price >= 0;
  };
  
  // Area validation (positive number)
  export const isValidArea = (area) => {
    return !isNaN(area) && area >= 0;
  };
  
  // Required field validation
  export const isRequired = (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  };
  
  // URL validation
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Name validation (letters, spaces, apostrophes, hyphens)
  export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
  };
  
  // Latitude validation (-90 to 90)
  export const isValidLatitude = (lat) => {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  };
  
  // Longitude validation (-180 to 180)
  export const isValidLongitude = (lng) => {
    return !isNaN(lng) && lng >= -180 && lng <= 180;
  };
  
  // Date validation (past date)
  export const isPastDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate < today;
  };
  
  // Date validation (future date)
  export const isFutureDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate > today;
  };
  
  // Integer validation
  export const isInteger = (value) => {
    return Number.isInteger(Number(value));
  };
  
  // Float validation
  export const isFloat = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  
  // Property form validation (returns errors object)
  export const validatePropertyForm = (property) => {
    const errors = {};
    
    if (!isRequired(property.title)) {
      errors.title = 'Title is required';
    }
    
    if (!isRequired(property.address)) {
      errors.address = 'Address is required';
    }
    
    if (!isRequired(property.city)) {
      errors.city = 'City is required';
    }
    
    if (!isRequired(property.state)) {
      errors.state = 'State is required';
    }
    
    if (!isValidZipCode(property.zip_code)) {
      errors.zip_code = 'Valid ZIP code is required';
    }
    
    if (!isValidPrice(property.price)) {
      errors.price = 'Valid price is required';
    }
    
    if (!isValidArea(property.area)) {
      errors.area = 'Valid area is required';
    }
    
    if (!isRequired(property.property_type)) {
      errors.property_type = 'Property type is required';
    }
    
    if (!isRequired(property.listing_type)) {
      errors.listing_type = 'Listing type is required';
    }
    
    if (property.bedrooms !== undefined && !isInteger(property.bedrooms)) {
      errors.bedrooms = 'Bedrooms must be a whole number';
    }
    
    if (property.bathrooms !== undefined && !isFloat(property.bathrooms)) {
      errors.bathrooms = 'Bathrooms must be a number';
    }
    
    if (property.location) {
      if (!isValidLatitude(property.location.coordinates[1])) {
        errors.latitude = 'Valid latitude is required (-90 to 90)';
      }
      
      if (!isValidLongitude(property.location.coordinates[0])) {
        errors.longitude = 'Valid longitude is required (-180 to 180)';
      }
    }
    
    return errors;
  };
  
  // User form validation
  export const validateUserForm = (user) => {
    const errors = {};
    
    if (!isRequired(user.firstName)) {
      errors.firstName = 'First name is required';
    } else if (!isValidName(user.firstName)) {
      errors.firstName = 'First name can only contain letters, spaces, apostrophes, and hyphens';
    }
    
    if (!isRequired(user.lastName)) {
      errors.lastName = 'Last name is required';
    } else if (!isValidName(user.lastName)) {
      errors.lastName = 'Last name can only contain letters, spaces, apostrophes, and hyphens';
    }
    
    if (!isValidEmail(user.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (user.password && !isValidPassword(user.password)) {
      errors.password = 'Password must be at least 8 characters with at least one number';
    }
    
    if (user.password !== user.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (user.phone && !isValidPhone(user.phone)) {
      errors.phone = 'Valid phone number is required';
    }
    
    return errors;
  };
  
  // Search form validation
  export const validateSearchForm = (search) => {
    const errors = {};
    
    if (search.priceMin && search.priceMax && 
        parseFloat(search.priceMin) > parseFloat(search.priceMax)) {
      errors.priceRange = 'Minimum price cannot be greater than maximum price';
    }
    
    if (search.priceMin && !isValidPrice(search.priceMin)) {
      errors.priceMin = 'Minimum price must be a positive number';
    }
    
    if (search.priceMax && !isValidPrice(search.priceMax)) {
      errors.priceMax = 'Maximum price must be a positive number';
    }
    
    return errors;
  };
  
  // Login form validation
  export const validateLoginForm = (credentials) => {
    const errors = {};
    
    if (!isValidEmail(credentials.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (!isRequired(credentials.password)) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };
  
  // Contact form validation
  export const validateContactForm = (contact) => {
    const errors = {};
    
    if (!isRequired(contact.name)) {
      errors.name = 'Name is required';
    }
    
    if (!isValidEmail(contact.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (!isRequired(contact.message)) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };
  
  // Property image validation
  export const validatePropertyImage = (file) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      return 'File must be JPEG, PNG, or WebP format';
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    return null; // No error
  };