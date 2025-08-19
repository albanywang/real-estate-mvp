import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../services/authContext';
import UserFavorites from './UserFavorites';
import { formatPrice, formatArea, formatPriceInMan } from '../utils/formatUtils';
import PropertyDetailPopup from './PropertyDetailPopup';
import MapComponent from './MapComponent';
import PropertyCard from './PropertyCard';
import TopFiltersPanel from './TopFiltersPanel';
import LoginPopup from './LoginPopup';
import japanesePhrases from '../utils/japanesePhrases';
import { fetchProperties, debugAPI } from '../services/api';
import '../utils/FullscreenImageViewer';
import UnderConstructionPopup from './UnderConstructionPopup';

window.japanesePhrases = japanesePhrases;

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
  const [currentView, setCurrentView] = useState('properties');
  
  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'map'

  console.log('japanesePhrases check:', japanesePhrases);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add this function to handle showing favorites
  const handleShowFavorites = () => {
    setCurrentView('favorites');
  };

  // Add this function to go back to properties
  const handleShowProperties = () => {
    setCurrentView('properties');
  };

  // Function to open the login popup
  const handleOpenLogin = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsLoginPopupOpen(true);
  };

  // Function to close the login popup
  const handleCloseLogin = () => {
    setIsLoginPopupOpen(false);
  };

  // Location-based search state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationProperties, setLocationProperties] = useState([]);
  const [searchMode, setSearchMode] = useState('all'); // 'all' or 'location'
  const [sortOption, setSortOption] = useState('createdAt-desc');
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'construction',
    title: '',
    message: ''
  });

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
    walkDistance: '',
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
  const walkDistanceOptions = [
    { value: '', label: '駅からの徒歩' },
    { value: '1', label: '1分以内' },
    { value: '3', label: '3分以内' },
    { value: '5', label: '5分以内' },
    { value: '7', label: '7分以内' },
    { value: '10', label: '10分以内' },
    { value: '15', label: '15分以内' },
    { value: '20', label: '20分以内' }
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
    const uniquePropertyTypes = [...new Set(processedProperties.map(p => p.propertytype))];
    console.log('🔍 Unique propertyType values in location data:', uniquePropertyTypes);
    
    setSelectedLocation(location);
    setLocationProperties(processedProperties);
    setSearchMode('location');
    
    // Apply existing filters to the location-based properties
    applyFiltersToProperties(processedProperties);
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
    
    if (filters.walkDistance) {
      const maxWalkDistance = parseInt(filters.walkDistance, 10);
      filtered = filtered.filter(p => {
        const walkDistance = p.walkDistance; // NEW - camelCase
        return walkDistance !== null && walkDistance !== undefined && walkDistance <= maxWalkDistance;
      });
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
      
      const propertiesArray = Array.isArray(result.properties) ? result.properties : [];
      
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

  // Mobile toggle for view switching
  const MobileViewToggle = () => (
    <div style={{
      display: 'flex',
      background: '#f3f4f6',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      margin: '0.5rem 1rem'
    }}>
      <button
        onClick={() => setMobileView('list')}
        style={{
          flex: 1,
          padding: '0.5rem',
          background: mobileView === 'list' ? '#3b82f6' : 'transparent',
          color: mobileView === 'list' ? 'white' : '#6b7280',
          border: 'none',
          borderRadius: '0.375rem',
          fontWeight: '500',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        📋 リスト
      </button>
      <button
        onClick={() => setMobileView('map')}
        style={{
          flex: 1,
          padding: '0.5rem',
          background: mobileView === 'map' ? '#3b82f6' : 'transparent',
          color: mobileView === 'map' ? 'white' : '#6b7280',
          border: 'none',
          borderRadius: '0.375rem',
          fontWeight: '500',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        🗺️ マップ
      </button>
    </div>
  );

  // Mobile Filters Button
  const MobileFiltersButton = () => (
    <button
      onClick={() => setShowMobileFilters(true)}
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '3.5rem',
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000
      }}
    >
      🔍
    </button>
  );

// Add this component inside your App.jsx file:
  const UserAuthSection = ({ onOpenLogin, phrases, onShowFavorites }) => {
    const { user, isLoggedIn, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    
    if (isLoggedIn && user) {
      return (
        <div style={{ position: 'relative' }}>
          {/* User name - clickable to toggle dropdown */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              background: 'transparent',
              border: 'none',
              color: '#374151', 
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.25rem' : '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              fontSize: isMobile ? '0.8rem' : '1rem'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {isMobile ? user.full_name?.split(' ')[0] || user.email.split('@')[0] : user.full_name || user.email}
            <span style={{ 
              fontSize: '0.7rem',
              transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ▼
            </span>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <>
              {/* Backdrop to close dropdown when clicking outside */}
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 998
                }}
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown content */}
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                minWidth: isMobile ? '160px' : '180px',
                zIndex: 999
              }}>
                {/* User info section */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#111827',
                    fontSize: '0.875rem'
                  }}>
                    {user.full_name}
                  </div>
                  <div style={{ 
                    color: '#6b7280',
                    fontSize: '0.75rem'
                  }}>
                    {user.email}
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '0.5rem 0' }}>
                  {/* Favorites button - NEW */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onShowFavorites) {
                        onShowFavorites();
                      }
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span>💝</span>
                    お気に入り
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Add profile functionality later
                      console.log('Profile clicked');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span>👤</span>
                    プロフィール
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Add settings functionality later
                      console.log('Settings clicked');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span>⚙️</span>
                    設定
                  </button>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: '#f3f4f6',
                    margin: '0.5rem 0'
                  }} />

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span>🚪</span>
                    ログアウト
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
    
    // When not logged in, show login link
    return (
      <a
        href="#"
        onClick={onOpenLogin}
        style={{ 
          textDecoration: 'none', 
          color: '#6b7280', 
          fontWeight: '500', 
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          fontSize: isMobile ? '0.8rem' : '1rem'
        }}
      >
        {phrases.signIn}
      </a>
    );
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
      searchMode,
      isMobile,
      mobileView
    };
  }, [properties, filteredProperties, filters, apiStats, fullscreenViewerReady, selectedLocation, locationProperties, searchMode, isMobile, mobileView]);

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
    <AuthProvider>
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 1001,
          height: isMobile ? '56px' : '64px',
          width: '100%',
        }}
      >
        <div
          className="header-container"
          style={{
            width: '100%',
            padding: isMobile ? '0 0.75rem' : '0 1rem',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >

          {/* Centered Logo */}
          <div
            className="logo-container"
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: isMobile ? '120px' : '150px',
            }}
          >
            <a
              href="#"
              className="logo"
                  onClick={(e) => {
                    setPopup({
                      isOpen: true,
                      title: japanesePhrases.partnership,
                      message: `日本市場向けの不動産検索プラットフォームを開発いたしました。

                                すべてのデータはデモです!

                                実際にお試しいただき、もしご興味をお持ちいただけましたら：
                                - 技術提携
                                - データ連携
                                - プラットフォーム買取

                                などについてご相談させていただけますでしょうか。

                                王雷[連絡先] 1-917-647-6866 （ニューヨーク米国）
                                E-mail: albanywang2000@gmail.com`
                    });
                  }}
                  style={{ 
                    textDecoration: 'none', 
                    color: '#6b7280', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
            >
              <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>🏠</span>
              {japanesePhrases.appTitle}
            </a>
          </div>

          {/* Right Side - Development Info */}
          <div
            className="right-nav"
            style={{
              display: 'flex',
              gap: isMobile ? '0.5rem' : '1rem',
              flexShrink: 0,
              minWidth: isMobile ? '120px' : '250px',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {!isMobile && (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPopup({
                      isOpen: true,
                      type: 'construction',
                      title: japanesePhrases.advertisement,
                      message: 'この機能は現在開発中です。'
                    });
                  }}
                  style={{ 
                    textDecoration: 'none', 
                    color: '#6b7280', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {japanesePhrases.advertisement}
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPopup({
                      isOpen: true,
                      type: 'coming-soon',
                      title: japanesePhrases.help,
                      message: 'ヘルプセンターをまもなく開設予定です！'
                    });
                  }}
                  style={{ 
                    textDecoration: 'none', 
                    color: '#6b7280', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {japanesePhrases.help}
                </a>
              </>
            )}
            <UserAuthSection 
              onOpenLogin={handleOpenLogin}
              phrases={japanesePhrases}
              onShowFavorites={handleShowFavorites}
            />
          </div>
        </div>
      </header>

      {/* Mobile Filters Overlay */}
      {isMobile && showMobileFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1002
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                フィルター
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
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
                walkDistanceOptions={walkDistanceOptions}
                propertyTypeOptions={propertyTypeOptions}
                isLoading={isLoading}
                priceRange={{ min: 0, max: 50000 }}
                areaRange={{ min: 20, max: 300 }}
                onAddressSearch={handleAddressSearch}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      {!isMobile && (
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
          walkDistanceOptions={walkDistanceOptions}
          propertyTypeOptions={propertyTypeOptions}
          isLoading={isLoading}
          priceRange={{ min: 0, max: 50000 }}
          areaRange={{ min: 20, max: 300 }}
          onAddressSearch={handleAddressSearch}
          isMobile={false}
        />
      )}

      {/* Mobile View Toggle */}
      {isMobile && currentView === 'properties' && (
        <MobileViewToggle />
      )}

      {/* Main Content Area */}
      <div style={{ 
        height: isMobile ? 
          (currentView === 'properties' ? 'calc(100vh - 120px)' : 'calc(100vh - 56px)') : 
          'calc(100vh - 184px)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        
        {/* Show UserFavorites when currentView is 'favorites' */}
        {currentView === 'favorites' ? (
          <div style={{ 
            width: '100%',
            overflowY: 'auto',
            background: '#fff'
          }}>
            {/* Back button */}
            <div style={{ 
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}>
              <button 
                onClick={handleShowProperties}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                ← すべての物件に戻る
              </button>
            </div>
            <UserFavorites />
          </div>
        ) : (
          <>
            {/* Desktop Layout */}
            {!isMobile ? (
              <>
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
              </>
            ) : (
              /* Mobile Layout */
              <>
                {/* Map View for Mobile */}
                {mobileView === 'map' && (
                  <div style={{ 
                    flex: 1,
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
                      </div>
                    ) : (
                      <MapComponent 
                        properties={filteredProperties} 
                        selectedProperty={selectedProperty}
                        setSelectedProperty={setSelectedProperty}
                        openPropertyDetail={openPropertyDetail}
                        phrases={japanesePhrases}
                        visible={mobileView === 'map'}
                        isMobile={true}
                      />
                    )}
                  </div>
                )}

                {/* List View for Mobile */}
                {mobileView === 'list' && (
                  <div style={{ 
                    flex: 1,
                    overflowY: 'auto',
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
                        {/* Mobile Results Header */}
                        <div style={{ 
                          padding: '0.75rem 1rem',
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
                              fontSize: '0.875rem', 
                              fontWeight: '600',
                              color: '#1f2937'
                            }}>
                              {filteredProperties.length} 物件
                            </p>
                          <select
                              value={sortOption}
                              onChange={(e) => setSortOption(e.target.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
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
                        
                        {/* Mobile Property Cards - Single Column Layout */}
                        <div style={{ 
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
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
                                isMobile={true}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile Filters Button */}
      {isMobile && currentView === 'properties' && (
        <MobileFiltersButton />
      )}

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={handleCloseLogin}
      />
      
      <PropertyDetailPopup
        property={detailProperty}
        isOpen={isDetailPopupOpen}
        onClose={closePropertyDetail}
        phrases={japanesePhrases}
        fullscreenViewerReady={fullscreenViewerReady}
        isMobile={isMobile}
      />

      <UnderConstructionPopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({...popup, isOpen: false})}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .header-container {
            padding: 0 0.5rem !important;
          }
          
          .logo {
            font-size: 1rem !important;
          }
          
          .right-nav {
            gap: 0.25rem !important;
            min-width: 100px !important;
          }
          
          /* Hide scrollbar on mobile for cleaner look */
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          
          /* Ensure touch targets are at least 44px */
          button, a, select, input {
            min-height: 44px;
            display: flex;
            align-items: center;
          }
          
          /* Improve touch scrolling */
          div {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .header-container {
            padding: 0 1rem;
          }
          
          /* Adjust grid for tablets */
          .property-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 1025px) {
          .property-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          /* Ensure images and icons look crisp on retina displays */
          img {
            image-rendering: -webkit-optimize-contrast;
          }
        }
        
        /* Dark mode support (if needed in the future) */
        @media (prefers-color-scheme: dark) {
          /* Add dark mode styles here if needed */
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Focus styles for keyboard navigation */
        button:focus, a:focus, select:focus, input:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-friendly {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </AuthProvider>
  );
};

export default App;