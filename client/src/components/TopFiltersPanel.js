import React, { useState, useCallback } from 'react';
import PropertySearchComponent from './PropertySearchComponent';
import japanesePhrases from '../utils/japanesePhrases';

const TopFiltersPanel = ({ 
  filters, 
  setFilters, 
  applyFilters,
  // Location search props
  onLocationSelect,
  onClearLocationSearch,
  selectedLocation,
  searchMode = 'all',
  // Options for dropdowns
  propertyTypes = [],
  isLoading = false,
  // Statistics for showing ranges
  priceRange = { min: 0, max: 100000000 },
  areaRange = { min: 0, max: 500 }
}) => {

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle filter changes
  const handleFilterChange = useCallback((name, value) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    // Auto-apply filters for immediate feedback
    setTimeout(() => applyFilters(), 100);
  }, [filters, setFilters, applyFilters]);

  // Clear all filters except location
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      propertyType: '',
      propertyStatus: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      layout: '',
      structure: '',
      minYear: '',
      maxYear: '',
      minManagementFee: '',
      maxManagementFee: '',
      hasGarage: false,
      hasAC: false,
      hasAutoLock: false
    };
    setFilters(clearedFilters);
    applyFilters();
  }, [setFilters, applyFilters]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  );

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => 
    value !== '' && value !== false
  ).length;

  // Format price display
  const formatPrice = (price) => {
    if (!price) return '';
    return `¥${parseInt(price).toLocaleString()}万`;
  };

  // Price range options (in 万円)
  const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '1000', label: '¥1,000万+' },
    { value: '2000', label: '¥2,000万+' },
    { value: '3000', label: '¥3,000万+' },
    { value: '5000', label: '¥5,000万+' },
    { value: '7000', label: '¥7,000万+' },
    { value: '10000', label: '¥1億+' }
  ];

  const maxPriceOptions = [
    { value: '', label: 'No Max' },
    { value: '2000', label: '¥2,000万' },
    { value: '3000', label: '¥3,000万' },
    { value: '5000', label: '¥5,000万' },
    { value: '7000', label: '¥7,000万' },
    { value: '10000', label: '¥1億' },
    { value: '15000', label: '¥1.5億' }
  ];

  // Area options (in ㎡)
  const areaOptions = [
    { value: '', label: 'Any Size' },
    { value: '30', label: '30㎡+' },
    { value: '50', label: '50㎡+' },
    { value: '70', label: '70㎡+' },
    { value: '100', label: '100㎡+' },
    { value: '150', label: '150㎡+' }
  ];

  const maxAreaOptions = [
    { value: '', label: 'No Max' },
    { value: '50', label: '50㎡' },
    { value: '70', label: '70㎡' },
    { value: '100', label: '100㎡' },
    { value: '150', label: '150㎡' },
    { value: '200', label: '200㎡' }
  ];

  // Property status options
  const propertyStatusOptions = [
    { value: '', label: 'For Sale' },
    { value: 'for sale', label: 'For Sale' },
    { value: 'under contract', label: 'Under Contract' },
    { value: 'sold', label: 'Recently Sold' }
  ];

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {/* Main Filter Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          
          {/* Search Component - Takes up most space */}
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <PropertySearchComponent
              onLocationSelect={onLocationSelect}
              onClearSearch={onClearLocationSearch}
              selectedLocation={selectedLocation}
            />
          </div>

          {/* Property Status Dropdown */}
          <div style={{ flex: '0 0 auto', minWidth: '140px' }}>
            <select
              value={filters.propertyStatus || ''}
              onChange={(e) => handleFilterChange('propertyStatus', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: '#fff',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              {propertyStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price Dropdown */}
          <div style={{ flex: '0 0 auto', minWidth: '120px' }}>
            <select
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: '#fff',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">{japanesePhrases.priceRange}</option>
              {priceOptions.slice(1).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Dropdown */}
          <div style={{ flex: '0 0 auto', minWidth: '120px' }}>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: '#fff',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">Max Price</option>
              {maxPriceOptions.slice(1).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Area Size Dropdown */}
          <div style={{ flex: '0 0 auto', minWidth: '110px' }}>
            <select
              value={filters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: '#fff',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">{japanesePhrases.area}</option>              
              {areaOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #dc2626',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: '#fff',
                color: '#dc2626',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Quick Filter Tags */}
        {(selectedLocation || hasActiveFilters) && (
          <div style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active filters:</span>
            
            {selectedLocation && (
              <span style={{
                background: '#dbeafe',
                color: '#1e40af',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📍 {selectedLocation.display_text}
                <button
                  onClick={onClearLocationSearch}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1e40af',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  ✕
                </button>
              </span>
            )}

            {filters.propertyStatus && (
              <span style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Status: {filters.propertyStatus}
              </span>
            )}

            {filters.minPrice && (
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Min: {formatPrice(filters.minPrice)}
              </span>
            )}

            {filters.maxPrice && (
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Max: {formatPrice(filters.maxPrice)}
              </span>
            )}

            {filters.minArea && (
              <span style={{
                background: '#ecfdf5',
                color: '#065f46',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Min: {filters.minArea}㎡
              </span>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel (Collapsible) */}
      {showAdvancedFilters && (
        <div style={{
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              
              {/* Property Type */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Property Type
                </label>
                <select
                  value={filters.propertyType || ''}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    background: '#fff'
                  }}
                >
                  <option value="">Any Type</option>
                  {propertyTypes.length > 0 ? (
                    propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="中古マンション">Used Apartment</option>
                      <option value="新築マンション">New Apartment</option>
                      <option value="中古一戸建て">Used House</option>
                      <option value="新築一戸建て">New House</option>
                    </>
                  )}
                </select>
              </div>

              {/* Layout */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Layout
                </label>
                <select
                  value={filters.layout || ''}
                  onChange={(e) => handleFilterChange('layout', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    background: '#fff'
                  }}
                >
                  <option value="">Any Layout</option>
                  <option value="1R">1R</option>
                  <option value="1K">1K</option>
                  <option value="1DK">1DK</option>
                  <option value="1LDK">1LDK</option>
                  <option value="2K">2K</option>
                  <option value="2DK">2DK</option>
                  <option value="2LDK">2LDK</option>
                  <option value="3LDK">3LDK</option>
                  <option value="4LDK">4LDK+</option>
                </select>
              </div>

              {/* Year Built Range */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Year Built
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.minYear || ''}
                    onChange={(e) => handleFilterChange('minYear', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.maxYear || ''}
                    onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Features
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                    <input
                      type="checkbox"
                      checked={filters.hasGarage || false}
                      onChange={(e) => handleFilterChange('hasGarage', e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Parking
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                    <input
                      type="checkbox"
                      checked={filters.hasAC || false}
                      onChange={(e) => handleFilterChange('hasAC', e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    A/C
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                    <input
                      type="checkbox"
                      checked={filters.hasAutoLock || false}
                      onChange={(e) => handleFilterChange('hasAutoLock', e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Auto Lock
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopFiltersPanel;