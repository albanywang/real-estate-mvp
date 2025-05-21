import React, { useState, useEffect } from 'react';
import { formatPrice, formatArea, formatPriceInMan } from '../utils/formatUtils';
import PropertyDetailPopup from './PropertyDetailPopup';
import MapComponent from './MapComponent';
import PropertyCard from './PropertyCard';
import FiltersPanel from './FiltersPanel'; // If you have this component
import LoginPopup from './LoginPopup';
import japanesePhrases from '../utils/japanesePhrases';

const API_URL = 'http://localhost:3001/api';



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
  });

  const openPropertyDetail = (property) => {
    setDetailProperty(property);
    setIsDetailPopupOpen(true);
  };

  const closePropertyDetail = () => {
    setIsDetailPopupOpen(false);
  };

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/properties');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched properties:", data);
        // Log location fields specifically
        data.forEach(property => {
          console.log(`Property ID ${property.id} location:`, property.location);
        });
        setProperties(data);
        setFilteredProperties(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(japanesePhrases.errorLoading);
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  // Function to apply filters
  const applyFilters = () => {
    let filtered = [...properties];
    
    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.property_type === filters.propertyType);
    }
    
    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice));
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
      filtered = filtered.filter(p => p.area >= parseFloat(filters.minArea));
    }
    if (filters.maxArea) {
      filtered = filtered.filter(p => p.area <= parseFloat(filters.maxArea));
    }
    
    // Filter by year built (築年数)
    if (filters.minYear) {
      filtered = filtered.filter(p => {
        const yearBuilt = typeof p.year_built === 'string' 
          ? parseInt(p.year_built.replace(/[^0-9]/g, '')) 
          : p.year_built;
        return yearBuilt >= parseInt(filters.minYear);
      });
    }
    if (filters.maxYear) {
      filtered = filtered.filter(p => {
        const yearBuilt = typeof p.year_built === 'string' 
          ? parseInt(p.year_built.replace(/[^0-9]/g, '')) 
          : p.year_built;
        return yearBuilt <= parseInt(filters.maxYear);
      });
    }
    
    // Filter by management fee (管理費)
    if (filters.minManagementFee) {
      filtered = filtered.filter(p => p.management_fee >= parseInt(filters.minManagementFee));
    }
    if (filters.maxManagementFee) {
      filtered = filtered.filter(p => p.management_fee <= parseInt(filters.maxManagementFee));
    }
    
    // Filter by features
    if (filters.hasGarage) {
      filtered = filtered.filter(p => p.parking === '有');
    }
    if (filters.hasAC) {
      filtered = filtered.filter(p => p.others && p.others.includes('エアコン'));
    }
    if (filters.hasAutoLock) {
      filtered = filtered.filter(p => p.facilities_services && p.facilities_services.includes('オートロック'));
    }
    
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
              <button onClick={() => window.location.reload()}>
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
              visible={true} // Add this prop
            />
          )}
        </div>

        {/* Property list with loading state */}
        <div className="property-list">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>{t.noProperties}</p>
              <p>{t.tryAdjusting}</p>
            </div>
          ) : (
            filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                isSelected={selectedProperty === property.id}
                onClick={() => {
                  setSelectedProperty(property.id);
                  openPropertyDetail(property);
                }}
                phrases={japanesePhrases}
              />
            ))
          )}
        </div>
      </main>

      {/* Login Popup - Using conditional rendering */}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeLoginPopup}
      />
      {/* property popup show detail information */}
      <PropertyDetailPopup
        property={detailProperty}
        isOpen={isDetailPopupOpen}
        onClose={closePropertyDetail}
        phrases={japanesePhrases}
      />
    </>
  );
};

export default App;