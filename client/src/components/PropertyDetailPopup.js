import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { formatPrice, formatManagementFee, formatArea, formatBalcony } from '../utils/formatUtils';

const PropertyDetailPopup = ({ property, isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language];

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
              <span>{t.propertyInfo}</span>
            </div>
          </div>
          
        {/* First table - Transportation and Address */}
        <table className="property-detail-table">
        <tbody>
            <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>{t.transportation}</th>
                <td style={{ width: '80%', textAlign: 'left' }}>{property.transportation}</td>
            </tr>
            <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>{t.address}</th>
                <td style={{ width: '80%', textAlign: 'left' }}>{property.address}</td>
            </tr>
            <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>{t.propertyType}</th>
                <td style={{ width: '80%', textAlign: 'left' }}>{property.propertyType}</td>
            </tr>            
        </tbody>
        </table>
        {/* Second table - Price and fees */}
        <table className="property-detail-table property-detail-table-grid">
        <tbody>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.price}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatPrice(property.price)}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.pricePerSquareMeter}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatPrice(Math.round(property.price / property.area))}</td>            
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.managementFee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatManagementFee(property.managementFee)}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.repairReserveFund}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatManagementFee(property.repairReserveFund)}</td>                
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.landLeaseFee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.landLeaseFee}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.rightFee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.rightFee}</td>                
            </tr> 
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.depositGuarantee}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.depositGuarantee}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.maintenanceFees}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.maintenanceFees}</td>                
            </tr>   
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.otherFees}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.otherFees}</td>              
            </tr>                                               
        </tbody>
        </table>        
        {/* Third table - All other property details */}
        <table className="property-detail-table property-detail-table-grid">
        <tbody>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.layout}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.layout}</td>
                <th style={{ width: '15%', textAlign: 'left' }}></th>
                <td style={{ width: '35%', textAlign: 'left' }}></td>
            </tr>          
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.area}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatArea(property.area)}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.balcony}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{formatBalcony(property.balcony)}</td>
            </tr>
            {/* Continue with other rows */}
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.floorInfo}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.floorInfo}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.structure}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.structure}</td>
            </tr>
            <tr>
            <th style={{ width: '15%', textAlign: 'left' }}>{t.yearBuilt}</th>
            <td style={{ width: '35%', textAlign: 'left' }}>{property.yearBuilt}</td>
            <th style={{ width: '15%', textAlign: 'left' }}>{t.totalUnits}</th>
            <td style={{ width: '35%', textAlign: 'left' }}>{property.totalUnits}</td>
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.parking}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.parking}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.bikeStorage}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.bikeStorage}</td>
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.bicycleParking}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.bicycleParking}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.pets}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.pets}</td>
            </tr> 
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.landRights}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.landRights}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.siteArea}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.siteArea}</td>
            </tr>  
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.managementForm}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.managementForm}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.landLawNotofication}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.landLawNotofication}</td>
            </tr>                                 
        </tbody>
        </table>
        {/* Fourth table - list date */}
        <table className="property-detail-table property-detail-table-grid">
        <tbody>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.propertyNumber}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.propertyNumber}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.currentSituation}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.currentSituation}</td>            
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.extraditionPossibleDate}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.extraditionPossibleDate}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.transactionMode}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.transactionMode}</td>            
            </tr>
            <tr>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.informationReleaseDate}</th>
                <td style={{ width: '35%', textAlign: 'left' }}>{property.informationReleaseDate}</td>
                <th style={{ width: '15%', textAlign: 'left' }}>{t.nextScheduledUpdateDate}</th>
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