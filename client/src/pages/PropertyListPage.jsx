import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyList from '../components/property/PropertyList';
import SearchFilters from '../components/map/SearchFilters';
import MapView from '../components/map/MapView';
import { getProperties } from '../services/api';
import { MapProvider } from '../contexts/MapContext';

const PropertyListPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const location = useLocation();

  useEffect(() => {
    // Extract filters from URL query params
    const queryParams = new URLSearchParams(location.search);
    const filtersFromUrl = {};
    
    for (const [key, value] of queryParams.entries()) {
      filtersFromUrl[key] = value;
    }
    
    setActiveFilters(filtersFromUrl);
    
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties(filtersFromUrl);
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Error loading properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [location.search]);

  const handleApplyFilters = (filters) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    // Update URL
    const queryString = queryParams.toString();
    const newUrl = `${location.pathname}${queryString ? `?${queryString}` : ''}`;
    window.history.pushState(null, '', newUrl);
    
    // Trigger re-fetch with new filters
    setActiveFilters(filters);
    
    // Re-fetch properties with new filters
    const fetchPropertiesWithFilters = async () => {
      try {
        setLoading(true);
        const data = await getProperties(filters);
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Error loading properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertiesWithFilters();
  };

  // Calculate map center based on property locations
  const calculateMapCenter = () => {
    if (properties.length === 0) {
      return [40.7128, -74.0060]; // Default to NYC
    }
    
    // Calculate average of lat/lng coordinates
    const sum = properties.reduce(
      (acc, property) => {
        if (property.location && property.location.coordinates) {
          return [
            acc[0] + property.location.coordinates[1],
            acc[1] + property.location.coordinates[0]
          ];
        }
        return acc;
      },
      [0, 0]
    );
    
    return [
      sum[0] / properties.length,
      sum[1] / properties.length
    ];
  };

  return (
    <MapProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Properties {Object.keys(activeFilters).length > 0 ? '(Filtered)' : ''}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters onApplyFilters={handleApplyFilters} />
          </div>

          {/* Properties Content */}
          <div className="lg:col-span-3">
            {/* View Toggle */}
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${properties.length} properties found`}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === 'map'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* View Content */}
            {viewMode === 'grid' ? (
              <PropertyList properties={properties} loading={loading} error={error} />
            ) : (
              <div className="h-[700px] bg-gray-100 rounded-lg overflow-hidden">
                <MapView
                  properties={properties}
                  center={calculateMapCenter()}
                  zoom={12}
                  height="100%"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MapProvider>
  );
};

export default PropertyListPage;