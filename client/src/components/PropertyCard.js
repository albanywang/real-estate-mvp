import React, { useRef, useEffect } from 'react';
import { formatPrice, formatArea } from '../utils/formatUtils';
import SmartImageLoader from './SmartImageLoader'; // Import the new component

// Property Card Component
const PropertyCard = ({ property, isSelected, onClick }) => {
  // Add error handling for images
  const handleImageError = (e) => {
    console.error(`Failed to load image: ${e.target.src}`);
    e.target.src = "/placeholder.jpg"; // Fallback image
  };

  return (
    <div className={`property-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {/* Make sure the title is here */}
      <div className="property-title">{property.title}</div>

      {/* Use the SmartImageLoader with a fixed height container */}
      <div style={{ height: '200px', width: '100%' }}>
        <SmartImageLoader 
          src={property.images && property.images.length > 0 ? property.images[0] : null}
          alt={property.title}
          className="property-img"
          fallbackImg="/placeholder.jpg" // Optional fallback image
        />
      </div>

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

export default PropertyCard;