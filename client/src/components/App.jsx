import React, { useState, useEffect } from 'react';
import { formatPrice, formatArea, formatPriceInMan } from '../utils/formatUtils';
import PropertyDetailPopup from './PropertyDetailPopup';
import MapComponent from './MapComponent';
import PropertyCard from './PropertyCard';
import TopFiltersPanel from './TopFiltersPanel';
import LoginPopup from './LoginPopup';
import japanesePhrases from '../utils/japanesePhrases';
import { fetchProperties, debugAPI } from '../services/api';
import '../utils/FullscreenImageViewer';

// Main App Component
const App = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [detailProperty, setDetailProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStats, setApiStats] = useState({ total: 0, count: 0 });
  const [fullscreenViewerReady, setFullscreenViewerReady] = useState(false);
  
  // Location-based search state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationProperties, setLocationProperties] = useState([]);
  const [searchMode, setSearchMode] = useState('all'); // 'all' or 'location'
  const [sortOption, setSortOption] = useState('createdAt-desc');

  const sortOptions = [
    { value: 'createdAt-desc', label: '登録: 新しい順' },
    { value: 'createdAt-asc', label: '登録: 古い順' },
    { value: 'price-asc', label: '低価格から' },
    { value: 'price-desc', label: '高価格から' },
    { value: 'area-asc', label: 'エリア小から' },
    { value: 'area-desc', label: 'エリア大から' },
    { value: 'yearBuilt-asc', label: '建築年: 古い順' },
    { value: 'yearBuilt-desc', label: '建築年: 新い順' }
  ];

  const sortProperties = (props) => {
    if (!props || !Array.isArray(props)) return props;
    
    const [field, direction] = sortOption.split('-');
    const sorted = [...props];
    
    sorted.sort((a, b) => {
      let valueA, valueB;
      
      switch (field) {
        case 'price':
          valueA = parseFloat(a.price) || 0;
          valueB = parseFloat(b.price) || 0;
          break;
        case 'area':
          valueA = parseFloat(a.area) || 0;
          valueB = parseFloat(b.area) || 0;
          break;
        case 'yearBuilt':
          valueA = parseInt(a.yearBuilt?.replace(/[^0-9]/g, '') || '0');
          valueB = parseInt(b.yearBuilt?.replace(/[^0-9]/g, '') || '0');
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return sorted;
  };

  const [filters, setFilters] = useState({
    propertyType: '',
    propertyStatus: '',
    minPrice: '',
    maxPrice: '',
    layout: '',
    structure: '',
    minArea: '',
    maxArea: '',
    minYear: '',
    maxYear: '',
    minManagementFee: '',
    maxManagementFee: '',
    hasGarage: false,
    hasAC: false,
    hasAutoLock: false
  });

  // Price range options (in 万円)
  const priceOptions = [
    { value: '', label: '価格帯' },
    { value: 'under1000', label: '1,000万-' },
    { value: '1000plus', label: '1,000万+' },
    { value: '2000', label: '2,000万+' },
    { value: '3000', label: '3,000万+' },
    { value: '5000', label: '5,000万+' },
    { value: '7000', label: '7,000万+' },
    { value: '10000', label: '1億+' }
  ];

  // Area options (in ㎡)
  const areaOptions = [
    { value: '', label: '専有面積' },
    { value: 'under30', label: '30㎡-' },
    { value: '30plus', label: '30㎡+' },    
    { value: '50', label: '50㎡+' },
    { value: '70', label: '70㎡+' },
    { value: '100', label: '100㎡+' },
    { value: '150', label: '150㎡+' }
  ];

  // Property status options
  const propertyStatusOptions = [
    { value: '', label: '購入' },
    { value: 'for sale', label: '購入' },
    { value: 'for rent', label: '賃貸' },
    { value: 'sold', label: '売却' }
  ];

  // Property type options
  const propertyTypeOptions = [
    { value: '', label: '物件種別' },
    { value: '中古マンション', label: '中古マンション' },
    { value: '新築マンション', label: '新築マンション' },
    { value: '中古戸建', label: '中古戸建' },
    { value: '新築戸建', label: '新築戸建' },
    { value: 'ビル', label: 'ビル' }
  ];


  // Initialize fullscreen image viewer
  useEffect(() => {
    const initializeFullscreenViewer = () => {
      if (window.openFullscreenImage && window.fullscreenViewer) {
        console.log('✅ Fullscreen image viewer initialized');
        setFullscreenViewerReady(true);
      } else {
        console.log('⏳ Waiting for fullscreen viewer to initialize...');
        setTimeout(initializeFullscreenViewer, 100);
      }
    };

    setTimeout(initializeFullscreenViewer, 50);

    return () => {
      if (window.fullscreenViewer && window.fullscreenViewer.close) {
        window.fullscreenViewer.close();
      }
    };
  }, []);

  const openPropertyDetail = (property) => {
    console.log('🏠 Opening property detail for:', property);
    setDetailProperty(property);
    setIsDetailPopupOpen(true);
  };

  const closePropertyDetail = () => {
    console.log('🏠 Closing property detail');
    setIsDetailPopupOpen(false);
    setDetailProperty(null);
    
    if (window.fullscreenViewer && window.fullscreenViewer.isOpen) {
      window.fullscreenViewer.close();
    }
  };

  // Fetch all properties from API
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Loading properties...');
        
        const result = await fetchProperties();
        
        console.log('✅ Properties loaded:', result);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        const propertiesArray = Array.isArray(result.properties) ? result.properties : [];
        
        // Log unique propertyType values for debugging
        const uniquePropertyTypes = [...new Set(propertiesArray.map(p => p.propertytype))];
        console.log('🔍 Unique propertyType values in data:', uniquePropertyTypes);
        
        console.log(`📍 Setting ${propertiesArray.length} properties`);
        
        setProperties(propertiesArray);
        
        if (searchMode === 'all') {
          setFilteredProperties(propertiesArray);
        }
        
        setApiStats({
          total: result.total || propertiesArray.length,
          count: result.count || propertiesArray.length
        });
        
      } catch (error) {
        console.error('❌ Error fetching properties:', error);
        setError(error.message || japanesePhrases.errorLoading);
        
        setProperties([]);
        setFilteredProperties([]);
        setApiStats({ total: 0, count: 0 });
        
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, []);

  // Add this function to your App.js
  const handleAddressSearch = async (searchTerm) => {
    console.log('🔍 Searching database for address:', searchTerm);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call your API to search by address/area code
      // Replace this URL with your actual API endpoint
      const response = await fetch(`/api/properties/search/address?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Address search results:', result);
      
     
      // Update state with search results
      setLocationProperties(searchProperties);
      setSearchMode('location');
      
      // Set selected location info
      setSelectedLocation({
        display_text: searchTerm,
        type: 'address_search',
        property_count: searchProperties.length
      });
      
      // Apply current filters to search results
      applyFiltersToProperties(searchProperties);
      
      console.log(`📍 Found ${searchProperties.length} properties for "${searchTerm}"`);
      
    } catch (error) {
      console.error('❌ Address search failed:', error);
      setError(`Search failed: ${error.message}`);
      
      // Clear search results on error
      setLocationProperties([]);
      setFilteredProperties([]);
      
    } finally {
      setIsLoading(false);
    }
  };  

  // Handle location selection from PropertySearchComponent
  const handleLocationSelect = (location, locationBasedProperties) => {
    console.log('📍 Location selected:', location);
    console.log('🏠 Properties for location:', locationBasedProperties);
    console.log('🏠 Properties count:', locationBasedProperties.length);
    
    // Check if we actually received properties
    if (!locationBasedProperties || !Array.isArray(locationBasedProperties)) {
      console.error('❌ Invalid properties data received:', locationBasedProperties);
      setError('No properties found for this location');
      return;
    }
    // FIXED: Remove the propertyTypeMapping since your API already returns correct data
    // Just use the properties as-is since your backend now returns proper field names
    const processedProperties = locationBasedProperties.map(p => ({
      ...p,
      // Ensure we have the right field names (your API should already provide these)
      propertyType: p.propertyType || p.propertytype || '',
      yearBuilt: p.yearBuilt || p.yearbuilt || '',
      transactionMode: p.transactionMode || p.transactionmode || ''
    }));
    console.log('🔄 Processed properties:', processedProperties);
    console.log('🔍 First property after processing:', processedProperties[0]);

    // Log unique propertyType values for location-based properties
    const uniquePropertyTypes = [...new Set(normalizedLocationProperties.map(p => p.propertytype))];
    console.log('🔍 Unique propertyType values in location data:', uniquePropertyTypes);
    
    setSelectedLocation(location);
    setLocationProperties(processedProperties);
    setSearchMode('location');
    
    // Apply existing filters to the location-based properties
    applyFiltersToProperties(normalizedLocationProperties);
  };

  // Handle clearing location search
  const handleClearLocationSearch = () => {
    console.log('🧹 Clearing location search');
    
    setSelectedLocation(null);
    setLocationProperties([]);
    setSearchMode('all');
    
    // Go back to showing all properties with current filters
    applyFiltersToProperties(properties);
  };

  // Normalize propertyType for comparison
  const normalizePropertyType = (type) => {
    if (!type) return '';
    return type.trim().replace(/\s+/g, '');
  };

  // Apply filters to properties
  const applyFiltersToProperties = (sourceProperties = null) => {
    console.log('🔍 Applying filters:', filters);
    console.log('🔍 Search mode:', searchMode);
    console.log('🔍 Source properties count:', sourceProperties?.length);
    
    // Determine which properties to filter
    let propertiesToFilter;
    if (sourceProperties) {
      propertiesToFilter = sourceProperties;
    } else if (searchMode === 'location') {
      propertiesToFilter = locationProperties;
    } else {
      propertiesToFilter = properties;
    }
    
    let filtered = [...propertiesToFilter];
    
    // Apply all filters
    if (filters.propertyType) {
      console.log('🔍 Filtering by propertyType:', filters.propertyType);
      console.log('🔍 Available properties before filter:', propertiesToFilter.map(p => ({
        id: p.id,
        title: p.title,
        propertyType: p.propertyType
      })));      
      const normalizedFilterType = normalizePropertyType(filters.propertyType);
      filtered = filtered.filter(p => {
        const normalizedPropertyType = normalizePropertyType(p.propertyType);
        const match = normalizedPropertyType === normalizedFilterType;
        console.log(`🔍 PropertyType check: ${normalizedPropertyType} === ${normalizedFilterType} -> ${match}`);
        return match;
      });
    }
    
    if (filters.propertyStatus) {
      filtered = filtered.filter(p => p.status === filters.propertyStatus);
    }
    
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice) * 10000; // Convert from 万円 to 円
      filtered = filtered.filter(p => parseFloat(p.price) >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice) * 10000; // Convert from 万円 to 円
      filtered = filtered.filter(p => parseFloat(p.price) <= maxPrice);
    }
    
    if (filters.layout) {
      filtered = filtered.filter(p => p.layout === filters.layout);
    }
    
    if (filters.structure) {
      filtered = filtered.filter(p => p.structure === filters.structure);
    }
    
    if (filters.minArea) {
      const minArea = parseFloat(filters.minArea);
      filtered = filtered.filter(p => parseFloat(p.area) >= minArea);
    }
    if (filters.maxArea) {
      const maxArea = parseFloat(filters.maxArea);
      filtered = filtered.filter(p => parseFloat(p.area) <= maxArea);
    }
    
    if (filters.minYear) {
      filtered = filtered.filter(p => {
        const yearBuilt = typeof p.yearBuilt === 'string' 
          ? parseInt(p.yearBuilt.replace(/[^0-9]/g, '')) 
          : p.yearBuilt;
        return yearBuilt >= parseInt(filters.minYear);
      });
    }
    if (filters.maxYear) {
      filtered = filtered.filter(p => {
        const yearBuilt = typeof p.yearBuilt === 'string' 
          ? parseInt(p.yearBuilt.replace(/[^0-9]/g, '')) 
          : p.yearBuilt;
        return yearBuilt <= parseInt(filters.maxYear);
      });
    }
    
    if (filters.minManagementFee) {
      const minFee = parseFloat(filters.minManagementFee);
      filtered = filtered.filter(p => parseFloat(p.managementFee || 0) >= minFee);
    }
    if (filters.maxManagementFee) {
      const maxFee = parseFloat(filters.maxManagementFee);
      filtered = filtered.filter(p => parseFloat(p.managementFee || 0) <= maxFee);
    }
    
    if (filters.hasGarage) {
      filtered = filtered.filter(p => p.parking && (p.parking.includes('有') || p.parking.includes('あり')));
    }
    if (filters.hasAC) {
      filtered = filtered.filter(p => p.others && p.others.includes('エアコン'));
    }
    if (filters.hasAutoLock) {
      filtered = filtered.filter(p => p.facilitiesServices && p.facilitiesServices.includes('オートロック'));
    }
    
    // Apply sorting
    filtered = sortProperties(filtered);
    console.log(`🔍 Filtered ${propertiesToFilter.length} properties down to ${filtered.length}`);
    console.log('🔍 Setting filteredProperties to:', filtered);
    
    // Log the propertyType of filtered properties for debugging
    console.log('🔍 Filtered properties propertyType values:', filtered.map(p => p.propertytype));
    
    setFilteredProperties(filtered);
  };

  // Apply filters function
  const applyFilters = () => {
    console.log('🔍 Triggering applyFilters with filters:', filters);
    applyFiltersToProperties();
  };

  // Trigger applyFilters when filters change
  useEffect(() => {
    console.log('🔍 Filters updated, applying filters:', filters);
    applyFilters();
  }, [filters, sortOption]);

  // Update filters when location search results change
  useEffect(() => {
    if (searchMode === 'location' && locationProperties.length > 0) {
      applyFiltersToProperties(locationProperties);
    }
  }, [locationProperties, searchMode]);

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  // Retry function for error state
  const retryLoading = async () => {
    console.log('🔄 Retrying to load properties...');
    
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await fetchProperties();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      
      // Log unique propertyType values for debugging
      const uniquePropertyTypes = [...new Set(propertiesArray.map(p => p.propertytype))];
      console.log('🔍 Unique propertyType values in retry data:', uniquePropertyTypes);
      
      setProperties(propertiesArray);
      
      if (searchMode === 'all') {
        setFilteredProperties(propertiesArray);
      }
      
      setApiStats({
        total: result.total || propertiesArray.length,
        count: result.count || propertiesArray.length
      });
      
    } catch (error) {
      console.error('❌ Retry failed:', error);
      setError(error.message || japanesePhrases.errorLoading);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced debug function
  React.useEffect(() => {
    window.debugRealEstate = {
      properties,
      filteredProperties,
      filters,
      apiStats,
      debugAPI,
      retryLoading,
      fullscreenViewerReady,
      fullscreenViewer: window.fullscreenViewer || null,
      openFullscreenImage: window.openFullscreenImage || null,
      selectedLocation,
      locationProperties,
      searchMode
    };
  }, [properties, filteredProperties, filters, apiStats, fullscreenViewerReady, selectedLocation, locationProperties, searchMode]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDetailPopupOpen && (!window.fullscreenViewer || !window.fullscreenViewer.isOpen)) {
        switch(e.key) {
          case 'Escape':
            closePropertyDetail();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDetailPopupOpen]);

  return (
    <>
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 1001,
          height: '64px',
          width: '100%',
        }}
      >
        <div
          className="header-container"
          style={{
            width: '100%',
            padding: '0 1rem',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Navigation */}
          <div
            className="left-nav"
            style={{
              display: 'flex',
              gap: '1rem',
              flexShrink: 0,
              minWidth: '250px',
              alignItems: 'center',
            }}
          >
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.buy}
            </a>
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.rent}
            </a>
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.sell}
            </a>
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.agents}
            </a>
          </div>

          {/* Centered Logo */}
          <div
            className="logo-container"
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '150px',
            }}
          >
            <a
              href="#"
              className="logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: '#1f2937',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏠</span>
              {japanesePhrases.appTitle}
            </a>
          </div>

          {/* Right Side - Development Info */}
          <div
            className="right-nav"
            style={{
              display: 'flex',
              gap: '1rem',
              flexShrink: 0,
              minWidth: '250px',
              alignItems: 'center',
            }}
          >
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.advertisement}
            </a>
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.help}
            </a>
            <a
              href="#"
              style={{ textDecoration: 'none', color: '#6b7280', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              {japanesePhrases.signIn}
            </a>
          </div>
        </div>
      </header>

      {/* Top Filters Panel */}
      <TopFiltersPanel
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        onLocationSelect={handleLocationSelect}
        onClearLocationSearch={handleClearLocationSearch}
        selectedLocation={selectedLocation}
        searchMode={searchMode}
        priceOptions={priceOptions}
        areaOptions={areaOptions}
        propertyStatusOptions={propertyStatusOptions}
        propertyTypeOptions={propertyTypeOptions}
        isLoading={isLoading}
        priceRange={{ min: 0, max: 50000 }}
        areaRange={{ min: 20, max: 300 }}
        onAddressSearch={handleAddressSearch}
      />

      {/* Main Content Area */}
      <div style={{ 
        height: 'calc(100vh - 184px)',
        display: 'flex'
      }}>
        
        {/* Map Container - Takes up 60% of width */}
        <div style={{ 
          flex: '0 0 60%',
          position: 'relative'
        }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', margin: 0 }}>{japanesePhrases.loading}</p>
            </div>
          ) : error ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: '1rem',
              padding: '2rem'
            }}>
              <p style={{ color: '#dc2626', margin: 0, textAlign: 'center' }}>{error}</p>
              <button 
                onClick={retryLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {japanesePhrases.retry}
              </button>
              <small style={{ color: '#6b7280', textAlign: 'center' }}>
                Debug: Open browser console and run `debugRealEstate.debugAPI()` for more info
              </small>
            </div>
          ) : (
            <MapComponent 
              properties={filteredProperties} 
              selectedProperty={selectedProperty}
              setSelectedProperty={setSelectedProperty}
              openPropertyDetail={openPropertyDetail}
              phrases={japanesePhrases}
              visible={true}
            />
          )}
        </div>

        <div style={{ padding: '1rem', background: '#f0f0f0', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br/>
          Search Mode: {searchMode}<br/>
          All Properties: {properties.length}<br/>
          Location Properties: {locationProperties.length}<br/>
          Filtered Properties: {filteredProperties.length}<br/>
          Selected Location: {selectedLocation?.display_text || 'None'}<br/>
        </div>

        {/* Property List Container - Takes up 40% of width */}
        <div style={{ 
          flex: '0 0 40%',
          overflowY: 'auto',
          borderLeft: '1px solid #e5e7eb',
          background: '#fff'
        }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                border: '3px solid #f3f4f6',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', margin: 0 }}>{japanesePhrases.loading}</p>
            </div>
          ) : error ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#dc2626' }}>{error}</p>
              <button 
                onClick={retryLoading}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                {japanesePhrases.retry}
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              {(searchMode === 'all' ? properties : locationProperties).length === 0 ? (
                <>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    {japanesePhrases.noProperties}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    No properties found {searchMode === 'location' ? 'in selected location' : 'in database'}
                  </p>
                  <button 
                    onClick={retryLoading} 
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                  >
                    {japanesePhrases.retry}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    No properties match your current filters
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Try adjusting your search criteria or clearing some filters
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Showing 0 of {searchMode === 'location' ? locationProperties.length : properties.length} properties
                    {searchMode === 'location' && selectedLocation && (
                      <span> in {selectedLocation.display_text}</span>
                    )}
                  </p>
                </>
              )}
            </div>
          ) : (
            <>             
              {/* Results Header */}
              <div style={{ 
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {filteredProperties.length} 最新物件
                  </p>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Property Cards - Two Column Layout */}
              <div style={{ 
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                {filteredProperties.map(property => (
                  <div key={property.id} style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}>
                    <PropertyCard
                      property={property}
                      isSelected={selectedProperty === property.id}
                      onClick={() => {
                        console.log('🏠 Property selected:', property);
                        setSelectedProperty(property.id);
                        openPropertyDetail(property);
                      }}
                      phrases={japanesePhrases}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeLoginPopup}
      />
      
      <PropertyDetailPopup
        property={detailProperty}
        isOpen={isDetailPopupOpen}
        onClose={closePropertyDetail}
        phrases={japanesePhrases}
        fullscreenViewerReady={fullscreenViewerReady}
      />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default App;