import React, { useState, useEffect, useRef } from 'react';

const PropertySearchComponent = ({ 
  onLocationSelect, 
  onClearSearch, 
  selectedLocation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularLocations, setPopularLocations] = useState([]);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Initialize search query from selected location
  useEffect(() => {
    if (selectedLocation) {
      setSearchQuery(selectedLocation.display_text);
    } else {
      setSearchQuery('');
    }
  }, [selectedLocation]);

  // Fetch popular locations on component mount
  useEffect(() => {
    fetchPopularLocations();
  }, []);

  const fetchPopularLocations = async () => {
    try {
      const response = await fetch('/api/properties/search/popular-locations');
      const data = await response.json();
      if (data.success) {
        setPopularLocations(data.data);
      }
    } catch (error) {
      console.error('Error fetching popular locations:', error);
    }
  };

  // Debounced search function
  const searchLocations = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/properties/search/locations?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion) => {
    setSearchQuery(suggestion.display_text);
    setShowDropdown(false);
    setSuggestions([]);

    // Fetch properties for selected location
    await fetchPropertiesByLocation(suggestion);
  };

  // Fetch properties based on selected location
  const fetchPropertiesByLocation = async (location, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/properties/search/by-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          filters: filters
        })
      });

      const data = await response.json();
      if (data.success) {
        // Call the parent component's callback with location and properties
        onLocationSelect(location, data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    setSuggestions([]);
    setShowDropdown(false);
    
    // Call parent component's clear callback
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'zipcode':
        return <span style={{ fontSize: '16px', color: '#2196f3' }}>📮</span>;
      case 'city':
        return <span style={{ fontSize: '16px', color: '#4caf50' }}>🏙️</span>;
      case 'area':
        return <span style={{ fontSize: '16px', color: '#9c27b0' }}>📍</span>;
      case 'address':
        return <span style={{ fontSize: '16px', color: '#ff9800' }}>🧭</span>;
      default:
        return <span style={{ fontSize: '16px', color: '#757575' }}>📍</span>;
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!searchQuery && popularLocations.length > 0) {
      setSuggestions(popularLocations);
      setShowDropdown(true);
    } else if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative" ref={searchInputRef}>
        <div className="relative">
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            fontSize: '20px',
            color: '#9ca3af'
          }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search by city, postal code, or address..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '3rem',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              outline: 'none'
            }}
          />
          
          {/* Clear button */}
          {(searchQuery || selectedLocation) && (
            <button
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                fontSize: '16px',
                color: '#9ca3af'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Clear search"
            >
              ✕
            </button>
          )}
          
          {/* Loading spinner */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              right: '2.5rem',
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && (suggestions.length > 0 || popularLocations.length > 0) && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            marginTop: '0.25rem',
            maxHeight: '20rem',
            overflowY: 'auto',
            zIndex: 50
          }}>
            {!searchQuery && popularLocations.length > 0 && (
              <div style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
                  Popular Locations
                </p>
              </div>
            )}
            
            {(searchQuery ? suggestions : popularLocations).map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                onClick={() => handleSuggestionSelect(suggestion)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderBottom: '1px solid #f9fafb',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {getSuggestionIcon(suggestion.type)}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>
                    {suggestion.display_text}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>
                    {suggestion.type} • {suggestion.property_count} properties
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getSuggestionIcon(selectedLocation.type)}
              <span style={{ fontWeight: '500', color: '#1e40af' }}>
                {selectedLocation.display_text}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#2563eb' }}>
                ({selectedLocation.property_count || 0} properties)
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              style={{
                color: '#2563eb',
                background: 'none',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.color = '#2563eb'}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PropertySearchComponent;