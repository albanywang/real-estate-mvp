import React from 'react';
import { formatPrice, formatArea, formatTraditionalPrice } from '../utils/formatUtils';
import { getImageUrl } from '../services/api';

// Property Card Component
const PropertyCard = ({ property, isSelected, onClick }) => {

  const handleImageError = (e) => {
    console.error(`Image failed to load: ${e.target.src}`);
    e.target.src = getImageUrl('/images/placeholder.jpg');
  };  

  return (
    <div className={`property-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {/* Make sure the title is here */}
      <div className="property-title">{property.title}</div>

      {/* Image with error handling */}
      <div className="property-img-container" style={{ height: '200px', width: '100%' }}>
        {property.images && property.images.length > 0 ? (
          <img 
            className="property-img" 
            src={getImageUrl(property.images[0])} 
            alt={property.title} 
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div className="no-image-placeholder">No Image Available</div>
        )}
      </div>

      <div className="property-price">{formatTraditionalPrice(property.price)}</div>
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