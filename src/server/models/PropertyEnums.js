// models/PropertyEnums.js
/**
 * Property-related enumerations and constants
 */
const PropertyEnums = {
  PROPERTY_TYPES: [
    'apartment',
    'house', 
    'condo',
    'townhouse',
    'studio',
    'penthouse',
    'duplex',
    'commercial',
    'land',
    'other'
  ],

  LAYOUTS: [
    '1R',      // 1 Room
    '1K',      // 1 Room + Kitchen
    '1DK',     // 1 Room + Dining Kitchen
    '1LDK',    // 1 Room + Living Dining Kitchen
    '2K',      // 2 Rooms + Kitchen
    '2DK',     // 2 Rooms + Dining Kitchen
    '2LDK',    // 2 Rooms + Living Dining Kitchen
    '3K',      // 3 Rooms + Kitchen
    '3DK',     // 3 Rooms + Dining Kitchen
    '3LDK',    // 3 Rooms + Living Dining Kitchen
    '4LDK+',   // 4+ Rooms + Living Dining Kitchen
    'maisonette',
    'loft',
    'penthouse'
  ],

  TRANSACTION_MODES: [
    'sale',
    'rent',
    'lease',
    'rent_with_option_to_buy',
    'auction',
    'foreclosure'
  ],

  MANAGEMENT_FORMS: [
    'self_managed',
    'professional_management',
    'cooperative',
    'condominium_association',
    'homeowners_association'
  ],

  LAND_RIGHTS: [
    'freehold',
    'leasehold',
    'cooperative',
    'shared_ownership',
    'ground_lease'
  ],

  PRICE_RANGES: {
    budget: { min: 0, max: 500000, label: 'Budget (Under ¥500K)' },
    mid: { min: 500000, max: 1500000, label: 'Mid-range (¥500K - ¥1.5M)' },
    luxury: { min: 1500000, max: null, label: 'Luxury (Over ¥1.5M)' }
  },

  SORT_OPTIONS: [
    { value: 'price_asc', label: 'Price: Low to High', field: 'price', order: 'ASC' },
    { value: 'price_desc', label: 'Price: High to Low', field: 'price', order: 'DESC' },
    { value: 'area_asc', label: 'Area: Small to Large', field: 'area', order: 'ASC' },
    { value: 'area_desc', label: 'Area: Large to Small', field: 'area', order: 'DESC' },
    { value: 'newest', label: 'Newest First', field: 'createdAt', order: 'DESC' },
    { value: 'oldest', label: 'Oldest First', field: 'createdAt', order: 'ASC' },
    { value: 'year_built_desc', label: 'Year Built: Newest', field: 'yearBuilt', order: 'DESC' },
    { value: 'year_built_asc', label: 'Year Built: Oldest', field: 'yearBuilt', order: 'ASC' }
  ]
};

export { PropertyEnums };