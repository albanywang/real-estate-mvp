import japanesePhrases from '../utils/japanesePhrases';
import React, { useState, useEffect } from 'react';

// Filters Component
const FiltersPanel = ({ filters, setFilters, applyFilters}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Safeguard against rendering if essential props are missing
  if (!filters || !setFilters || !applyFilters) {
    console.error('FiltersPanel: Missing required props');
    return <div>Error: Missing required properties</div>;
  }

  return (
    <div className="filters">
      <h2>{japanesePhrases.findYourPerfectHome || "理想の住まいを探す" }</h2>
      
      <div className="filter-group">
        <label>{japanesePhrases.location || "エリア"}</label>
        <input 
          type="text" 
          name="location" 
          placeholder={japanesePhrases.locationPlaceholder || "リアを入力"}
          value={filters.location}
          onChange={handleChange}
        />
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.propertyType}</label>
        <select name="propertyType" value={filters.propertyType} onChange={handleChange}>
          <option value="">{japanesePhrases.any}</option>
          <option value="house">{japanesePhrases.house}</option>
          <option value="apartment">{japanesePhrases.apartment}</option>
          <option value="mansion">{japanesePhrases.mansion}</option>
          <option value="land">{japanesePhrases.land}</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.priceRange}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minPrice" 
            placeholder={japanesePhrases.min}
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxPrice" 
            placeholder={japanesePhrases.max}
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.layout}</label>
        <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
          <option value="">{japanesePhrases.any}</option>
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
        <label>{japanesePhrases.structure}</label>
        <select name="structure" value={filters.structure} onChange={handleChange}>
          <option value="">{japanesePhrases.any}</option>
          <option value="RC">RC（鉄筋コンクリート）</option>
          <option value="SRC">SRC（鉄骨鉄筋コンクリート）</option>
          <option value="S">S（鉄骨造）</option>
          <option value="W">W（木造）</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.squareFeet}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minSqft" 
            placeholder={japanesePhrases.min}
            value={filters.minSqft}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxSqft" 
            placeholder={japanesePhrases.max}
            value={filters.maxSqft}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.yearBuilt}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minYear" 
            placeholder={japanesePhrases.min}
            value={filters.minYear}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxYear" 
            placeholder={japanesePhrases.max}
            value={filters.maxYear}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.managementFee}</label>
        <div className="price-range">
          <input 
            type="number" 
            name="minManagementFee" 
            placeholder={japanesePhrases.min}
            value={filters.minManagementFee}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxManagementFee" 
            placeholder={japanesePhrases.max}
            value={filters.maxManagementFee}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>{japanesePhrases.features}</label>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="feature-garage" 
              name="hasGarage"
              checked={filters.hasGarage}
              onChange={handleChange}
            />
            <label htmlFor="feature-garage">{japanesePhrases.garage}</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="feature-ac" 
              name="hasAC"
              checked={filters.hasAC}
              onChange={handleChange}
            />
            <label htmlFor="feature-ac">{japanesePhrases.ac}</label>
          </div>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="feature-autoLock" 
              name="hasAutoLock"
              checked={filters.hasAutoLock}
              onChange={handleChange}
            />
            <label htmlFor="feature-autoLock">{japanesePhrases.autoLock}</label>
          </div>
        </div>
      </div>
      
      <button className="search-btn" onClick={applyFilters}>
        <i className="fas fa-search"></i> {japanesePhrases.search}
      </button>
    </div>
  );
};

export default FiltersPanel;