// This is the view part of MVC model
import React, { useState, useEffect } from 'react';
import { formatPrice, formatArea, formatPriceInMan } from '../utils/formatUtils';
import PropertyDetailPopup from './PropertyDetailPopup';
import MapComponent from './MapComponent';
import PropertyCard from './PropertyCard';
import FiltersPanel from './FiltersPanel';
import LoginPopup from './LoginPopup';
import japanesePhrases from '../utils/japanesePhrases';
import { fetchProperties, debugAPI } from '../services/api';
// Import the fullscreen image functionality
import '../utils/FullscreenImageViewer'; // Adjust path as needed

// Main App Component
const App = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [detailProperty, setDetailProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStats, setApiStats] = useState({ total: 0, count: 0 });
  const [fullscreenViewerReady, setFullscreenViewerReady] = useState(false);
  
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
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

  // Initialize fullscreen image viewer
  useEffect(() => {
    const initializeFullscreenViewer = () => {
      // Check if the fullscreen viewer is available
      if (window.openFullscreenImage && window.fullscreenViewer) {
        console.log('✅ Fullscreen image viewer initialized');
        setFullscreenViewerReady(true);
      } else {
        console.log('⏳ Waiting for fullscreen viewer to initialize...');
        // Try again after a short delay
        setTimeout(initializeFullscreenViewer, 100);
      }
    };

    // Initialize with a small delay to ensure the script has loaded
    setTimeout(initializeFullscreenViewer, 50);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      // The fullscreen viewer handles its own cleanup
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
    
    // Also close fullscreen viewer if it's open
    if (window.fullscreenViewer && window.fullscreenViewer.isOpen) {
      window.fullscreenViewer.close();
    }
  };

  // Fetch properties from API using the improved fetchProperties function
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Loading properties...');
        
        // Use the improved fetchProperties function
        const result = await fetchProperties();
        
        console.log('✅ Properties loaded:', result);
        console.log('📊 Properties data:', result.properties);
        
        // Check if we got an error in the result
        if (result.error) {
          throw new Error(result.error);
        }
        
        // Ensure we have an array of properties
        const propertiesArray = Array.isArray(result.properties) ? result.properties : [];
        
        console.log(`📍 Setting ${propertiesArray.length} properties`);
        
        // Log location fields specifically for debugging
        propertiesArray.forEach(property => {
          console.log(`Property ID ${property.id} location:`, property.location);
        });
        
        setProperties(propertiesArray);
        setFilteredProperties(propertiesArray);
        setApiStats({
          total: result.total || propertiesArray.length,
          count: result.count || propertiesArray.length
        });
        
      } catch (error) {
        console.error('❌ Error fetching properties:', error);
        setError(error.message || japanesePhrases.errorLoading);
        
        // Set empty arrays on error
        setProperties([]);
        setFilteredProperties([]);
        setApiStats({ total: 0, count: 0 });
        
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, []);

  // Function to apply filters - Updated to use correct property field names
  const applyFilters = () => {
    console.log('🔍 Applying filters:', filters);
    
    let filtered = [...properties];
    
    // Filter by property type (using correct field name)
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }
    
    // Filter by price range
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(p => parseFloat(p.price) >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(p => parseFloat(p.price) <= maxPrice);
    }
    
    // Filter by layout (間取り)
    if (filters.layout) {
      filtered = filtered.filter(p => p.layout === filters.layout);
    }
    
    // Filter by structure (構造)
    if (filters.structure) {
      filtered = filtered.filter(p => p.structure === filters.structure);
    }
    
    // Filter by area (面積)
    if (filters.minArea) {
      const minArea = parseFloat(filters.minArea);
      filtered = filtered.filter(p => parseFloat(p.area) >= minArea);
    }
    if (filters.maxArea) {
      const maxArea = parseFloat(filters.maxArea);
      filtered = filtered.filter(p => parseFloat(p.area) <= maxArea);
    }
    
    // Filter by year built (築年数) - Updated for correct field name
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
    
    // Filter by management fee (管理費) - Updated for correct field name
    if (filters.minManagementFee) {
      const minFee = parseFloat(filters.minManagementFee);
      filtered = filtered.filter(p => parseFloat(p.managementFee || 0) >= minFee);
    }
    if (filters.maxManagementFee) {
      const maxFee = parseFloat(filters.maxManagementFee);
      filtered = filtered.filter(p => parseFloat(p.managementFee || 0) <= maxFee);
    }
    
    // Filter by features
    if (filters.hasGarage) {
      filtered = filtered.filter(p => p.parking && (p.parking.includes('有') || p.parking.includes('あり')));
    }
    if (filters.hasAC) {
      filtered = filtered.filter(p => p.others && p.others.includes('エアコン'));
    }
    if (filters.hasAutoLock) {
      filtered = filtered.filter(p => p.facilitiesServices && p.facilitiesServices.includes('オートロック'));
    }
    
    console.log(`🔍 Filtered ${properties.length} properties down to ${filtered.length}`);
    
    // Update filtered properties
    setFilteredProperties(filtered);
    
    // Close filters panel on mobile
    setShowFilters(false);
  };

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Function to close the login popup
  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  // Retry function for error state
  const retryLoading = async () => {
    console.log('🔄 Retrying to load properties...');
    
    // Reset states
    setError(null);
    setIsLoading(true);
    
    // Reload the component by re-triggering the useEffect
    try {
      const result = await fetchProperties();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      const propertiesArray = Array.isArray(result.properties) ? result.properties : [];
      
      setProperties(propertiesArray);
      setFilteredProperties(propertiesArray);
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

  // Enhanced debug function with fullscreen viewer info
  React.useEffect(() => {
    // Make debug function available globally
    window.debugRealEstate = {
      properties,
      filteredProperties,
      filters,
      apiStats,
      debugAPI,
      retryLoading,
      fullscreenViewerReady,
      fullscreenViewer: window.fullscreenViewer || null,
      openFullscreenImage: window.openFullscreenImage || null
    };
  }, [properties, filteredProperties, filters, apiStats, fullscreenViewerReady]);

  // Handle keyboard shortcuts at app level
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when detail popup is open and fullscreen is not open
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
      <header>
        <a href="#" className="logo">
          <i className="fas fa-home"></i>
          {japanesePhrases.appTitle}
        </a>
        <nav>
          <ul>
            <li><a href="#">{japanesePhrases.buy}</a></li>
            <li><a href="#">{japanesePhrases.rent}</a></li>
            <li><a href="#">{japanesePhrases.sell}</a></li>
            <li><a href="#">{japanesePhrases.agents}</a></li>
          </ul>
        </nav>
        
        {/* Enhanced debug info in header (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '10px', 
            fontSize: '12px', 
            color: '#666',
            background: 'rgba(255,255,255,0.9)',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div>{apiStats.count} properties loaded</div>
            <div style={{ color: fullscreenViewerReady ? 'green' : 'orange' }}>
              📸 {fullscreenViewerReady ? 'Ready' : 'Loading...'}
            </div>
          </div>
        )}
      </header>

      <main style={{ height: 'calc(100vh - 64px)' }}>
        {/* Left Column - Filters */}
        <div className={`filters ${showFilters ? 'active' : ''}`}>
          <FiltersPanel
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
            phrases={japanesePhrases}
            propertyTypes={[
              { value: '中古マンション', label: japanesePhrases.usedApartment },
              { value: '新築マンション', label: japanesePhrases.newApartment },
              { value: '中古一戸建て', label: japanesePhrases.usedHouse },
              { value: '新築一戸建て', label: japanesePhrases.newHouse }
            ]}
            layoutOptions={[
              { value: '1R', label: '1R' },
              { value: '1K', label: '1K' },
              { value: '1DK', label: '1DK' },
              { value: '1LDK', label: '1LDK' },
              { value: '2K', label: '2K' },
              { value: '2DK', label: '2DK' },
              { value: '2LDK', label: '2LDK' },
              { value: '3LDK', label: '3LDK' },
              { value: '4LDK', label: '4LDK' }
            ]}
            structureOptions={[
              { value: 'RC', label: 'RC（鉄筋コンクリート）' },
              { value: 'SRC', label: 'SRC（鉄骨鉄筋コンクリート）' },
              { value: 'S', label: 'S（鉄骨造）' },
              { value: 'W', label: 'W（木造）' }
            ]}
          />
          
          {/* Mobile filter toggle button */}
          <button 
            className="mobile-filter-toggle"
            onClick={toggleFilters}
            style={{
              display: 'none', // Will be shown on mobile via CSS
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              zIndex: 1000,
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <i className="fas fa-filter"></i>
          </button>
        </div>

        {/* Center Column - Map */}
        <div className="map-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{japanesePhrases.loading}</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={retryLoading}>
                {japanesePhrases.retry}
              </button>
              <br />
              <small style={{ marginTop: '10px', display: 'block', color: '#666' }}>
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

        {/* Right Column - Property list with loading state */}
        <div className="property-list">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{japanesePhrases.loading}</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={retryLoading}>
                {japanesePhrases.retry}
              </button>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <details>
                  <summary>Debug Info</summary>
                  <pre>{JSON.stringify({ error, apiStats, fullscreenViewerReady }, null, 2)}</pre>
                </details>
              </div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              {properties.length === 0 ? (
                <>
                  <p>{japanesePhrases.noProperties}</p>
                  <p>No properties found in database</p>
                  <button onClick={retryLoading} style={{ marginTop: '10px' }}>
                    {japanesePhrases.retry}
                  </button>
                </>
              ) : (
                <>
                  <p>No properties match your current filters</p>
                  <p>Try adjusting your search criteria</p>
                  <button 
                    onClick={() => {
                      setFilters({
                        location: '',
                        propertyType: '',
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
                      setFilteredProperties(properties);
                    }}
                    style={{ marginTop: '10px' }}
                  >
                    Clear All Filters
                  </button>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    Showing 0 of {properties.length} properties
                  </p>
                </>
              )}
            </div>
          ) : (
            <>             
              {/* Property cards */}
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={selectedProperty === property.id}
                  onClick={() => {
                    console.log('🏠 Property selected:', property);
                    setSelectedProperty(property.id);
                    openPropertyDetail(property);
                  }}
                  phrases={japanesePhrases}
                />
              ))}
            </>
          )}
        </div>
      </main>

      {/* Login Popup */}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeLoginPopup}
      />
      
      {/* Property Detail Popup with fullscreen support */}
      <PropertyDetailPopup
        property={detailProperty}
        isOpen={isDetailPopupOpen}
        onClose={closePropertyDetail}
        phrases={japanesePhrases}
        fullscreenViewerReady={fullscreenViewerReady}
      />
    </>
  );
};

export default App;