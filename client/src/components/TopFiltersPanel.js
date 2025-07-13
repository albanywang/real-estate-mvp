import React, { useState, useCallback, useEffect } from 'react';
import PropertySearchComponent from './PropertySearchComponent';
import japanesePhrases from '../utils/japanesePhrases';

const TopFiltersPanel = ({ 
  filters, 
  setFilters, 
  applyFilters,
  onLocationSelect,
  onClearLocationSearch,
  selectedLocation,
  searchMode = 'all',
  priceOptions = [],
  areaOptions = [],
  propertyStatusOptions = [],
  propertyTypeOptions = [],
  isLoading = false,
  priceRange = { min: 0, max: 100000000 },
  areaRange = { min: 0, max: 500 },
  onAddressSearch
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // Add state for selected area option
  const [selectedAreaOption, setSelectedAreaOption] = useState('');
  const [selectedPriceOption, setSelectedPriceOption] = useState('');

  useEffect(() => {
    console.log('TopFiltersPanel props:', { onAddressSearch, type: typeof onAddressSearch });
  }, [onAddressSearch]);

  const handleFilterChange = useCallback((name, value) => {
    console.log(`🔍 Filter changed: ${name} = ${value}`);
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  }, [filters, setFilters]);

  // Add new handleAreaChange function
  const handleAreaChange = useCallback((value) => {
    console.log(`🔍 Area filter changed: ${value}`);
    const newFilters = { ...filters, minArea: '', maxArea: '' };
    if (value === 'under30') {
      newFilters.maxArea = '30';
    } else if (value === '30plus') {
      newFilters.minArea = '30';
    } else if (value) {
      newFilters.minArea = value;
    }
    setFilters(newFilters);
    setSelectedAreaOption(value); // Track selected option
  }, [filters, setFilters]);
  
  // Add handlePriceChange function
  const handlePriceChange = useCallback((value) => {
    console.log(`🔍 Price filter changed: ${value}`);
    const newFilters = { ...filters, minPrice: '', maxPrice: '' };
    if (value === 'under1000') {
      newFilters.maxPrice = '1000';
    } else if (value === '1000plus') {
      newFilters.minPrice = '1000';
    } else if (value) {
      newFilters.minPrice = value;
    }
    setFilters(newFilters);
    setSelectedPriceOption(value);
  }, [filters, setFilters]);

  const clearAllFilters = useCallback(() => {
    console.log('🧹 Clearing all filters');
    const clearedFilters = {
      propertyType: '',
      walkDistance: '',
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
    setSelectedAreaOption(''); 
    setSelectedPriceOption('');
  }, [setFilters]);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  );

  const formatPrice = (price) => {
    if (!price) return '';
    return `${parseInt(price).toLocaleString()}万`;
  };

  const handleClearLocationSearch = () => {
    console.log('🧹 Clearing selected location');
    // This should clear the selectedLocation state in the parent
    // Assuming selectedLocation is managed with useState in a higher component
    // If not, you need to pass a setter or manage it here with useState
  };

  return (
    <div style={{ background: '#fff',  borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', minWidth: '300px', position: 'relative' }}>
            <PropertySearchComponent
              onLocationSelect={onLocationSelect}
              onClearSearch={onClearLocationSearch}
              selectedLocation={selectedLocation}
              onAddressSearch={onAddressSearch}
            />
          </div>
          <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
            <select
              value={filters.propertyType || ''}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
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
              {propertyTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: '0 0 auto', minWidth: '140px' }}>
            <select
              value={filters.walkDistance || ''}
              onChange={(e) => handleFilterChange('walkDistance', e.target.value)}
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
          <div style={{ flex: '0 0 auto', minWidth: '120px' }}>
            <select
              value={selectedPriceOption}
              onChange={(e) => handlePriceChange( e.target.value)}
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
              {priceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: '0 0 auto', minWidth: '110px' }}>
            <select
              value={selectedAreaOption}
              onChange={(e) => handleAreaChange(e.target.value)}
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
              {areaOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
        {(selectedLocation || hasActiveFilters) && (
          <div style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>フィルター:</span>
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
            {filters.propertyType && (
              <span style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Type: {propertyTypeOptions.find(opt => opt.value === filters.propertyType)?.label || 'Unknown Type'}
              </span>
            )}
            {filters.walkDistance && (
              <span style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                distance: {propertyStatusOptions.find(opt => opt.value === filters.walkDistance)?.label || 'Unknown Distance'}
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
                {formatPrice(filters.minPrice)} 以上
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
                {formatPrice(filters.maxPrice)} まで
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
                {areaOptions.find(opt => opt.value === filters.minArea)?.label || (filters.minArea === 'under30' ? '30㎡-' : `${filters.minArea}㎡+`)} 以上
              </span>
            )}
            {filters.maxArea && (
              <span style={{
                background: '#ecfdf5',
                color: '#065f46',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {filters.maxArea}㎡ まで
              </span>
            )}            
          </div>
        )}
      </div>
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