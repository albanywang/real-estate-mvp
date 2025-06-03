import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building, Hash, Navigation } from 'lucide-react';

const PropertySearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

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
    setSelectedLocation(suggestion);
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
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'zipcode':
        return <Hash className="w-4 h-4 text-blue-500" />;
      case 'city':
        return <Building className="w-4 h-4 text-green-500" />;
      case 'area':
        return <MapPin className="w-4 h-4 text-purple-500" />;
      case 'address':
        return <Navigation className="w-4 h-4 text-orange-500" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-500" />;
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
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Search Input */}
      <div className="relative mb-6" ref={searchInputRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search by city, postal code, or address..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && (suggestions.length > 0 || popularLocations.length > 0) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
            {!searchQuery && popularLocations.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-2">Popular Locations</p>
              </div>
            )}
            
            {(searchQuery ? suggestions : popularLocations).map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-50 last:border-b-0"
              >
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{suggestion.display_text}</p>
                  <p className="text-sm text-gray-500 capitalize">
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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            {getSuggestionIcon(selectedLocation.type)}
            <span className="font-medium text-blue-900">
              Showing properties in: {selectedLocation.display_text}
            </span>
            <span className="text-sm text-blue-600">
              ({properties.length} properties found)
            </span>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {property.images && property.images.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
                  {property.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ¥{property.price?.toLocaleString()}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}</span>
                  </p>
                  <p>Layout: {property.layout || 'N/A'}</p>
                  <p>Area: {property.area}㎡</p>
                  <p>Type: {property.propertyType}</p>
                  {property.yearBuilt && <p>Built: {property.yearBuilt}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {selectedLocation && properties.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">
            Try searching for a different location or adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertySearchComponent;