import React, { useState, useEffect, useRef } from 'react';

const PropertySearchComponent = ({ 
  onLocationSelect, 
  onClearSearch, 
  selectedLocation,
  onAddressSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularLocations, setPopularLocations] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (selectedLocation) {
      setSearchQuery(selectedLocation.display_text);
    } else {
      setSearchQuery('');
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchPopularLocations();
  }, []);

  const fetchPopularLocations = async () => {
    try {
      const response = await fetch('/api/properties/search/popular-locations');
      
      // Parse response only ONCE
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Error: ${data.error || data.message || 'Unknown error'}`);
      }
      
      if (data.success) {
        setPopularLocations(data.data);
      }
    } catch (error) {
      console.error('Error fetching popular locations:', error);
    }
  };

  const searchLocations = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`/api/properties/search/locations?q=${encodeURIComponent(query)}&limit=10`);
      
      // Parse response only ONCE - this fixes the "Body has already been consumed" error
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Error: ${data.error || data.message || 'Unknown error'}`);
      }

      if (data.success) {
        setSuggestions(data.data || []);
        setShowDropdown(true);
        console.log('✅ Location suggestions:', data.data);
      } else {
        throw new Error(data.message || 'API response indicates failure');
      }
    } catch (error) {
      console.error('Error searching locations:', error.message);
      setFetchError(error.message);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    setSearchQuery(suggestion.display_text);
    setShowDropdown(false);
    setSuggestions([]);
    await fetchPropertiesByLocation(suggestion);
  };

  const fetchPropertiesByLocation = async (location, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/properties/search/by-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, filters })
      });
      
      // Parse response only ONCE
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Error: ${data.error || data.message || 'Unknown error'}`);
      }
      
      if (data.success) {
        onLocationSelect(location, data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('🔍 Performing location search:', searchQuery.trim());
      await searchLocations(searchQuery.trim());
    } else {
      console.warn('⚠️ Search query is empty');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearchSubmit(e);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    if (onClearSearch) onClearSearch();
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'zipcode': return <span style={{ fontSize: '16px', color: '#2196f3' }}>📮</span>;
      case 'city': return <span style={{ fontSize: '16px', color: '#4caf50' }}>🏙️</span>;
      case 'area': return <span style={{ fontSize: '16px', color: '#9c27b0' }}>📍</span>;
      case 'address': return <span style={{ fontSize: '16px', color: '#ff9800' }}>🧭</span>;
      default: return <span style={{ fontSize: '16px', color: '#757575' }}>📍</span>;
    }
  };

  const handleInputFocus = () => {
    if (!searchQuery && popularLocations.length > 0) {
      setSuggestions(popularLocations);
      setShowDropdown(true);
    } else if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearchSubmit}>
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
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => searchLocations(e.target.value), 300);
              }}
              onFocus={handleInputFocus}
              onKeyPress={handleKeyPress}
              placeholder="市区町村、郵便番号、または住所で検索..."
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              style={{
                width: '100%',
                paddingLeft: '3rem',
                paddingRight: '2.5rem',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#9ca3af'
              }}
              title="Search"
            >🔍</button>
            {(searchQuery || selectedLocation) && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '40px',
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
              >✕</button>
            )}
            {isLoading && (
              <div style={{
                position: 'absolute',
                right: '68px',
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
                    人気の物件
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
          {fetchError && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              background: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginTop: '0.5rem',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '300px'
            }}>
              <span>{fetchError}</span>
              <button
                onClick={() => setFetchError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: '#dc2626',
                  padding: '0 0.25rem'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </form>

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