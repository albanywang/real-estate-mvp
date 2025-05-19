import React, { useState } from 'react';
import japanesePhrases from '../utils/japanesePhrases';
import { formatPrice, formatManagementFee, formatArea, formatBalcony } from '../utils/formatUtils';

const PropertyDetailPopup = ({ property, isOpen, onClose }) => {


  // If not open, don't render anything
  if (!isOpen || !property) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'property-detail-overlay') {
      onClose();
    }
  };

// Add these state variables in your PropertyDetailPopup component
const [currentImageIndex, setCurrentImageIndex] = useState(0);

// Add these functions to handle image navigation
const nextImage = () => {
  setCurrentImageIndex((prevIndex) => 
    prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
  );
};

const prevImage = () => {
  setCurrentImageIndex((prevIndex) => 
    prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
  );
};  

  return (
    <div className="property-detail-overlay" onClick={handleOverlayClick}>
      <div className="property-detail-content">
        <button className="property-detail-close" onClick={onClose}>×</button>
        
        <div className="property-detail-header">
          <div className="property-detail-title-section">
            <h1 className="property-detail-title">{property.title}</h1>
          </div>
        </div>
        
        <div className="property-detail-images">
            <button className="image-nav-btn prev-btn" onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
            </button>
            
            <img 
                src={property.images[currentImageIndex]} 
                alt={`${property.title} - image ${currentImageIndex + 1}`} 
                className="property-detail-main-image" 
            />
            
            <button className="image-nav-btn next-btn" onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
            </button>
            
            <div className="image-counter">
                {currentImageIndex + 1}/{property.images.length}
            </div>
        </div>
        
        <div className="property-detail-body">
          <div className="property-detail-info-header">
            <div className="property-detail-icon-container">
              <i className="fas fa-file"></i>
              <span>{japanesePhrases.propertyInfo}</span>
            </div>
          </div>
          
        {/* First table - Transportation and Address */}
        <table className="property-detail-table">
        <tbody>
            <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>{japanesePhrases.transportation}</th>
                <td style={{ width: '80%', textAlign: 'left' }}>{property.transportation}</td>
            </tr>
            <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>{japanesePhrases.address}</th>
                <td style={{ width: '80%', textAlign: 'left' }}>{property.address}</td>
            </tr>
            <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>{japanesePhrases.propertyType}</th>
                <td style={{ width: '80%', textAlign: 'left' }}>{property.propertyType}</td>
            </tr>            
        </tbody>
        </table>
        {/* Second table - Price and fees */}
        <table className="property-detail-table property-detail-table-grid">
        <tbody>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.price}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatPrice(property.price)}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.pricePerSquareMeter}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatPrice(Math.round(property.price / property.area))}</td>            
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.managementFee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatManagementFee(property.managementFee)}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.repairReserveFund}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatManagementFee(property.repairReserveFund)}</td>                
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.landLeaseFee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.landLeaseFee}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.rightFee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.rightFee}</td>                
            </tr> 
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.depositGuarantee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.depositGuarantee}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.maintenanceFees}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.maintenanceFees}</td>                
            </tr>   
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.otherFees}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.otherFees}</td>              
            </tr>                                               
        </tbody>
        </table>        
        {/* Third table - All other property details */}
        <table className="property-detail-table property-detail-table-grid">
        <tbody>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.layout}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.layout}</td>
                <th style={{ width: '15%', textAlign: 'left' }}></th>
                <td style={{ width: '35%', textAlign: 'left' }}></td>
            </tr>          
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.area}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatArea(property.area)}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.balcony}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatBalcony(property.balcony)}</td>
            </tr>
            {/* Continue with other rows */}
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.floorInfo}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.floorInfo}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.structure}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.structure}</td>
            </tr>
            <tr>
            <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.yearBuilt}</th>
            <td style={{ width: '35%', textAlign: 'left' }}>{property.yearBuilt}</td>
            <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.totalUnits}</th>
            <td style={{ width: '35%', textAlign: 'left' }}>{property.totalUnits}</td>
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.parking}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.parking}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.bikeStorage}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.bikeStorage}</td>
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.bicycleParking}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.bicycleParking}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.pets}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.pets}</td>
            </tr> 
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.landRights}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.landRights}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.siteArea}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.siteArea}</td>
            </tr>  
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.managementForm}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.managementForm}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.landLawNotofication}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.landLawNotofication}</td>
            </tr>                                 
        </tbody>
        </table>
        {/* Fourth table - list date */}
        <table className="property-detail-table property-detail-table-grid">
        <tbody>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.propertyNumber}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.propertyNumber}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.currentSituation}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.currentSituation}</td>            
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.extraditionPossibleDate}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.extraditionPossibleDate}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.transactionMode}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.transactionMode}</td>            
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.informationReleaseDate}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.informationReleaseDate}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{japanesePhrases.nextScheduledUpdateDate}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.nextScheduledUpdateDate}</td>            
            </tr>                                                            
        </tbody>
        </table>                  
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPopup;