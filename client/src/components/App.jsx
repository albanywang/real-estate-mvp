import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { formatPriceInMan } from '../utils/formatUtils';

const API_URL = 'http://localhost:3001/api';

// Utility function for price formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat('ja-JP', { 
    style: 'currency', 
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(price);
};

// Utility function for area formatting
const formatArea = (area) => {
  return `${area}㎡`;
};


// Map Component
const MapComponent = (props) => {
  const { properties, selectedProperty, setSelectedProperty, openPropertyDetail, t } = props;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);


  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map centered on Tokyo
      mapInstanceRef.current = L.map(mapRef.current).setView([35.6762, 139.6503], 12);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  
    // Function to format area
    const formatArea = (area) => {
      return `${area}㎡`;
    };
    
    // Add markers for properties
    properties.forEach(property => {
      if (!property.location) {
        console.warn(`Property ID ${property.id} is missing location coordinates`);
        return; // Skip this property
      }
      // Create custom HTML for the marker
      const markerHtml = `
      <div class="price-pill-container">
        <div class="price-pill-marker${property.id === selectedProperty ? ' selected' : ''}">
          <span class="price-pill-text">${formatPriceInMan(property.price)}</span>
        </div>
        <div class="price-pill-arrow"></div>
      </div>
      `;
      
      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [80, 30],
        iconAnchor: [30, 30]
      });
      
      // Create marker with custom icon
      const marker = L.marker(property.location, { 
        icon: customIcon,
        riseOnHover: true
      }).addTo(mapInstanceRef.current);
      
      // Store the marker element for hover effects
      let markerElement;
      
      marker.bindPopup(`
          <div class="map-popup">
            <img src="${property.images[0]}" alt="${property.title}" />
            <h3>${property.title}</h3>
            <div class="map-popup-price">${new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
              maximumFractionDigits: 0
            }).format(property.price)}</div>
            <p>${property.layout} | ${formatArea(property.area)}</p>
            <p>${property.address}</p>
            <button class="map-popup-detail-btn" onclick="window.openPropertyDetail(${property.id})">詳細を見る</button>
          </div>
        `);

      // When marker is added to map, get the element for hover effect
      marker.on('add', function() {
        setTimeout(() => {
          const markerElements = document.getElementsByClassName('price-marker');
          for (let i = 0; i < markerElements.length; i++) {
            if (markerElements[i].innerHTML.includes(formatPriceInMan(property.price))) {
              markerElement = markerElements[i];
              
              // Add hover effects
              markerElement.addEventListener('mouseover', function() {
                this.classList.add('hover');
              });
              
              markerElement.addEventListener('mouseout', function() {
                if (property.id !== selectedProperty) {
                  this.classList.remove('hover');
                }
              });
              
              // Add click event
              markerElement.addEventListener('click', function() {
                setSelectedProperty(property.id);
                marker.openPopup();
                if (typeof openPropertyDetail === 'function') {
                  openPropertyDetail(property);
                }
              });
              
              break;
            }
          }
        }, 100);
      });
        
      // When popup opens, update selected state
      marker.on('popupopen', function() {
        setSelectedProperty(property.id);
      });
            
      // Highlight selected property
      if (property.id === selectedProperty) {
        marker.openPopup();
        mapInstanceRef.current.setView(property.location, 15);
      }
      
      markersRef.current.push(marker);
    });
    
    // Also update your window function
    window.openPropertyDetail = (id) => {
      const property = properties.find(p => p.id === id);
      if (property && typeof openPropertyDetail === 'function') {
        setSelectedProperty(id);
        openPropertyDetail(property);
      }
    }; 

    // Make the selectProperty function available to the popup button
    window.selectProperty = (id) => {
      setSelectedProperty(id);
    };
    
    return () => {
      // Clean up when component unmounts
      if (mapInstanceRef.current) {
        // Remove global function
        delete window.openPropertyDetail;
      }
    };
  }, [properties, selectedProperty, setSelectedProperty, openPropertyDetail]);
  
  return <div id="map" ref={mapRef}></div>;
};

// Property Card Component
const PropertyCard = ({ property, isSelected, onClick, t }) => {
  return (
    <div className={`property-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {/* Make sure the title is here */}
      <div className="property-title">{property.title}</div>
      <img className="property-img" src={property.images[0]} alt={property.title} />
      <div className="property-price">{formatPrice(property.price)}</div>
      <div className="property-address">{property.address}</div>
      <div className="property-features">
        <div className="property-feature">
          <i className="fas fa-bed"></i>
          <span>{property.layout}</span>
        </div>
        <div className="property-feature">
          <i className="fas fa-building"></i>
          <span>{property.floorInfo}</span>
        </div>
        <div className="property-feature">
          <i className="fas fa-ruler-combined"></i>
          <span>{formatArea(property.area)}</span>
        </div>
      </div>
      <div className="property-transportation">{property.transportation}</div>
    </div>
  );
};

// Filters Component
const FiltersPanel = ({ filters, setFilters, applyFilters, t }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  return (
    <div className="filters">
      <h2>{t.findYourPerfectHome}</h2>
      
      <div className="filter-group">
        <label>{t.location}</label>
        <input 
          type="text" 
          name="location" 
          placeholder={t.locationPlaceholder}
          value={filters.location}
          onChange={handleChange}
        />
      </div>
      
      <div className="filter-group">
        <label>{t.propertyType}</label>
        <select name="propertyType" value={filters.propertyType} onChange={handleChange}>
          <option value="">{t.any}</option>
          <option value="house">{t.house}</option>
          <option value="apartment">{t.apartment}</option>
          <option value="mansion">{t.mansion}</option>
          <option value="land">{t.land}</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>{t.priceRange}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minPrice" 
            placeholder={t.min}
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxPrice" 
            placeholder={t.max}
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{t.layout}</label>
        <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
          <option value="">{t.any}</option>
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
      
      <div className="filter-group">
        <label>{t.structure}</label>
        <select name="structure" value={filters.structure} onChange={handleChange}>
          <option value="">{t.any}</option>
          <option value="RC">RC（鉄筋コンクリート）</option>
          <option value="SRC">SRC（鉄骨鉄筋コンクリート）</option>
          <option value="S">S（鉄骨造）</option>
          <option value="W">W（木造）</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>{t.squareFeet}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minSqft" 
            placeholder={t.min}
            value={filters.minSqft}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxSqft" 
            placeholder={t.max}
            value={filters.maxSqft}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{t.yearBuilt}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minYear" 
            placeholder={t.min}
            value={filters.minYear}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxYear" 
            placeholder={t.max}
            value={filters.maxYear}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{t.managementFee}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minManagementFee" 
            placeholder={t.min}
            value={filters.minManagementFee}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxManagementFee" 
            placeholder={t.max}
            value={filters.maxManagementFee}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{t.features}</label>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="feature-garage" 
              name="hasGarage"
              checked={filters.hasGarage}
              onChange={handleChange}
            />
            <label htmlFor="feature-garage">{t.garage}</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="feature-ac" 
              name="hasAC"
              checked={filters.hasAC}
              onChange={handleChange}
            />
            <label htmlFor="feature-ac">{t.ac}</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="feature-autoLock" 
              name="hasAutoLock"
              checked={filters.hasAutoLock}
              onChange={handleChange}
            />
            <label htmlFor="feature-autoLock">{t.autoLock}</label>
          </div>
        </div>
      </div>
      
      <button className="search-btn" onClick={applyFilters}>
        <i className="fas fa-search"></i> {t.search}
      </button>
    </div>
  );
};

// Login Popup Component
const LoginPopup = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  
  // If popup is not open, return null
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'signin') {
      // Handle sign in
      console.log('Sign in with:', formData.email, formData.password);
      // You would add authentication logic here
    } else {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        alert('パスワードが一致しません！');
        return;
      }
      console.log('Register with:', formData.name, formData.email, formData.password);
      // You would add registration logic here
    }
    
    // For demo, just close the popup
    onClose();
  };
  
  const handleOverlayClick = (e) => {
    if (e.target.className === 'login-popup-overlay') {
      onClose();
    }
  };
  
  // Effect for event listener
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);
  
  return (
    <div className="login-popup-overlay" onClick={handleOverlayClick}>
      <div className="login-popup-content">
        <button className="login-popup-close" onClick={onClose}>×</button>
        
        <div className="login-popup-header">
          <h2>{t.welcome}</h2>
        </div>
        
        <div className="login-popup-tabs">
          <div 
            className={`login-popup-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            {t.signIn}
          </div>
          <div 
            className={`login-popup-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            {t.newAccount}
          </div>
        </div>
        
        <form className="login-popup-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="login-popup-form-group">
              <label htmlFor="name">{t.fullName}</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder={t.fullNamePlaceholder}
                required={activeTab === 'register'}
              />
            </div>
          )}
          
          <div className="login-popup-form-group">
            <label htmlFor="email">{t.email}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder={t.emailPlaceholder}
              required
            />
          </div>
          
          <div className="login-popup-form-group">
            <label htmlFor="password">{t.password}</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder={activeTab === 'signin' ? t.passwordPlaceholder : t.createPasswordPlaceholder}
              required
            />
          </div>
          
          {activeTab === 'register' && (
            <div className="login-popup-form-group">
              <label htmlFor="confirmPassword">{t.confirmPassword}</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t.confirmPasswordPlaceholder}
                required={activeTab === 'register'}
              />
            </div>
          )}
          
          {activeTab === 'signin' && (
            <div className="login-popup-forgot">
              <a href="#">{t.forgotPassword}</a>
            </div>
          )}
          
          <button type="submit" className="login-popup-submit">
            {activeTab === 'signin' ? t.signIn : t.createAccount}
          </button>
          
          <div className="login-popup-divider">{t.orConnectWith}</div>
          
          <div className="login-popup-social">
            <button type="button" className="login-popup-social-btn google">
              <i className="fab fa-google"></i> {t.continueWithGoogle}
            </button>
            <button type="button" className="login-popup-social-btn line">
              <i className="fab fa-line"></i> {t.continueWithLine}
            </button>
            <button type="button" className="login-popup-social-btn yahoo">
              <i className="fab fa-yahoo"></i> {t.continueWithYahoo}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [language] = useState('jp');
  const t = translations[language] || translations.jp;

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
    let isMounted = true; // Flag to track mount state
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        
        // Add error checking for API endpoint
        const API_URL = 'http://localhost:3001/api'; // Make sure this is defined
        
        const response = await fetch(`${API_URL}/properties`);
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Only update state if still mounted
        if (isMounted) {
          setProperties(data);
          setFilteredProperties(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error:', error);
          setError('Failed to load');
          setIsLoading(false);
        }
      }
    };
    
    fetchProperties();
    // Cleanup function to run on unmount
    return () => {
      isMounted = false;
    };    
  }, []);
  
  // Apply filters through API
  const applyFilters = async () => {
    try {
      setIsLoading(true);
      
      const filterParams = {
        minPrice: filters.minPrice ? parseInt(filters.minPrice) || 0 : null,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) || 0 : null,
        propertyType: filters.propertyType || null,
        layout: filters.layout || null,
        minArea: filters.minArea ? parseFloat(filters.minArea) : null,
        maxArea: filters.maxArea ? parseFloat(filters.maxArea) : null,
      };
      
      const response = await fetch(`${API_URL}/properties/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
      });
      
      if (!response.ok) {
        throw new Error('Filter request failed');
      }
      
      const data = await response.json();
      // Validate before setting state
      if (Array.isArray(data)) {
        setFilteredProperties(data);
      } else {
        throw new Error('Expected array response');
      }
      setIsLoading(false);
      setShowFilters(false); // Close filters on mobile after applying
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Failed to filter properties. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Function to handle sign-in click directly
  const handleSignInClick = (e) => {
    if (e) e.preventDefault();
    setIsLoginPopupOpen(true);
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
          不動産ファインダー
        </a>
        <nav>
          <ul>
            <li><a href="#">{t.buy}</a></li>
            <li><a href="#">{t.rent}</a></li>
            <li><a href="#">{t.sell}</a></li>
            <li><a href="#">{t.agents}</a></li>
            <li><a href="#" id="sign-in-link" onClick={handleSignInClick}>{t.signIn}</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        {/* Left Column - Filters */}
        <div className={`filters ${showFilters ? 'active' : ''}`}>
          <FiltersPanel 
            filters={filters} 
            setFilters={setFilters} 
            applyFilters={applyFilters}
            t={t}
          />
        </div>
        
        {/* Center Column - Map */}
        <div className="map-container">
          <MapComponent 
            properties={filteredProperties} 
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            openPropertyDetail={openPropertyDetail}
            t={t} // Add this line
          />
          <button className="mobile-filters-toggle" onClick={toggleFilters}>
            <i className="fas fa-filter"></i> {t.filters}
          </button>
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
                t={t}
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
      />
    </>
  );
};

export default App;