import React, { useState, useEffect, useCallback } from 'react';
import japanesePhrases from '../utils/japanesePhrases';
import { formatPrice, formatTraditionalPrice, formatManagementFee, formatArea, formatBalcony } from '../utils/formatUtils';
import { getImageUrl } from '../services/api';
import { formatDate, formatDateCompact, formatDateRelative } from '../utils/formatDate';

const PropertyDetailPopup = ({ property, isOpen, onClose, phrases, fullscreenViewerReady }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());

  // Reset image index and errors when property changes
  useEffect(() => {
    if (property) {
      console.log('🏠 PropertyDetailPopup received property:', {
        id: property.id,
        title: property.title,
        propertyType: property.propertyType,
        yearBuilt: property.yearBuilt,
        transactionMode: property.transactionMode,
        propertyNumber: property.propertyNumber
      });      
      setCurrentImageIndex(0);
      setImageLoadErrors(new Set());
      setIsImageLoading(false);
    }
  }, [property]);

  // Image navigation functions
  const nextImage = useCallback(() => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  }, [property?.images?.length]);

  const prevImage = useCallback(() => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  }, [property?.images?.length]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < (property?.images?.length || 0)) {
      setCurrentImageIndex(index);
    }
  }, [property?.images?.length]);

  // Handle fullscreen image click
  const handleImageClick = useCallback((imageIndex = 0) => {
    if (!fullscreenViewerReady || !property?.images?.length) {
      console.warn('Fullscreen viewer not ready or no images available');
      return;
    }

    try {
      // Convert image paths to full URLs
      const imageUrls = property.images.map(image => getImageUrl(image));
      
      // Open fullscreen viewer with clicked image
      if (window.openFullscreenImage) {
        console.log('🖼️ Opening fullscreen viewer with', imageUrls.length, 'images, starting at index', imageIndex);
        window.openFullscreenImage(imageUrls, imageIndex);
      } else {
        console.error('Fullscreen image function not available');
      }
    } catch (error) {
      console.error('Error opening fullscreen image:', error);
    }
  }, [fullscreenViewerReady, property?.images]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't handle keys if fullscreen viewer is open
      if (window.fullscreenViewer?.isOpen) return;

      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'Enter':
        case ' ':
          if (e.target.classList.contains('grid-image') || e.target.classList.contains('thumbnail-small')) {
            e.preventDefault();
            // Find the image index from the clicked element
            const imageElements = document.querySelectorAll('.grid-image, .thumbnail-small img');
            const clickedIndex = Array.from(imageElements).findIndex(el => el === e.target || el.contains(e.target));
            handleImageClick(clickedIndex >= 0 ? clickedIndex : 0);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage, onClose, handleImageClick]);

  // Handle image loading states
  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  const handleImageError = useCallback((e, imageIndex) => {
    console.error('Image failed to load:', e.target.src);
    setImageLoadErrors(prev => new Set([...prev, imageIndex]));
    setIsImageLoading(false);
    e.target.src = getImageUrl('/images/placeholder.jpg');
  }, []);

  const handleImageLoadStart = useCallback(() => {
    setIsImageLoading(true);
  }, []);

  // If not open, don't render anything
  if (!isOpen || !property) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'property-detail-overlay') {
      onClose();
    }
  };

  // Helper function to display fees with fallback to "－" for null or empty values
  const displayFee = (fee) => {
    return (fee === null || fee === '' || fee === undefined) ? '－' : fee;
  };

  // Check if images exist and have content
  const hasImages = property?.images && property.images.length > 0;
  const hasMultipleImages = hasImages && property.images.length > 1;
  const currentImageHasError = imageLoadErrors.has(currentImageIndex);

  return (
    <div className="property-detail-overlay" onClick={handleOverlayClick}>
      <div className="property-detail-content">
        <button 
          className="property-detail-close" 
          onClick={onClose}
          aria-label="Close property details"
        >
          ×
        </button>
        
        <div className="property-detail-header">
          <div className="property-detail-title-section">
            <h1 className="property-detail-title">{property.title}</h1>
            <div className="property-detail-price">
              {formatTraditionalPrice(property.price)}
            </div>
          </div>
        </div>
        
        <div className="property-detail-images">
          {hasImages ? (
            <>
              {/* Image count header */}
              <div className="images-header">
                <h3>
                  <i className="fas fa-images"></i>
                  {japanesePhrases.photos} ({property.images.length})
                </h3>
                {fullscreenViewerReady && (
                  <div className="fullscreen-hint-header">
                    <i className="fas fa-expand"></i>
                    <span>{japanesePhrases.viewFullscreen}</span>
                  </div>
                )}
              </div>

              {/* Images grid */}
              <div className={`images-grid ${property.images.length === 1 ? 'single-image' : ''}`}>
                {property.images.slice(0, 6).map((image, index) => (
                  <div 
                    key={index} 
                    className={`image-item ${index === 0 ? 'main-image' : 'secondary-image'}`}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${property.title} - image ${index + 1}`}
                      className="grid-image"
                      onError={(e) => handleImageError(e, index)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View image ${index + 1} in fullscreen gallery`}
                      style={{ 
                        cursor: fullscreenViewerReady ? 'pointer' : 'default'
                      }}
                    />
                    
                    {/* Loading overlay for individual images */}
                    {isImageLoading && currentImageIndex === index && (
                      <div className="image-loading-overlay">
                        <div className="loading-spinner small"></div>
                      </div>
                    )}

                    {/* Error overlay */}
                    {imageLoadErrors.has(index) && (
                      <div className="image-error-overlay">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>{japanesePhrases.failedToLoad}</span>
                      </div>
                    )}

                    {/* Hover overlay with fullscreen icon */}
                    {fullscreenViewerReady && !imageLoadErrors.has(index) && (
                      <div className="image-hover-overlay">
                        <i className="fas fa-expand"></i>
                      </div>
                    )}
                  </div>
                ))}

                {/* "View more" overlay if there are more than 6 images */}
                {property.images.length > 6 && (
                  <div 
                    className="view-more-overlay"
                    onClick={() => handleImageClick(0)}
                  >
                    <div className="view-more-content">
                      <i className="fas fa-plus"></i>
                      <span>+{property.images.length - 6}</span>
                      <div className="view-more-text">View all photos</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Show all thumbnails if more than 6 images */}
              {property.images.length > 6 && (
                <div className="all-thumbnails">
                  <div className="thumbnails-header">
                    <span>All Photos</span>
                  </div>
                  <div className="thumbnails-grid">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        className={`thumbnail-small ${imageLoadErrors.has(index) ? 'error' : ''}`}
                        onClick={() => handleImageClick(index)}
                        aria-label={`View image ${index + 1} in fullscreen`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`Thumbnail ${index + 1}`}
                          onError={(e) => {
                            setImageLoadErrors(prev => new Set([...prev, index]));
                            e.target.src = getImageUrl('/images/placeholder.jpg');
                          }}
                        />
                        {imageLoadErrors.has(index) && (
                          <div className="thumbnail-error-overlay">
                            <i className="fas fa-exclamation-triangle"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Fallback for no images */
            <div className="no-images-placeholder">
              <i className="fas fa-image"></i>
              <p>{japanesePhrases.noImagesAvailable}</p>
            </div>
          )}
        </div>
        
        <div className="property-detail-body">
          <div className="property-detail-info-header">
            <div className="property-detail-icon-container">
              <i className="fas fa-info-circle"></i>
              <span>{phrases?.propertyInfo || japanesePhrases.propertyInfo}</span>
            </div>
          </div>
          
          {/* First table - Transportation and Address */}
          <table className="property-detail-table">
            <tbody>
              <tr>
                <th>{phrases?.transportation || japanesePhrases.transportation}</th>
                <td>{property.transportation || '－'}</td>
              </tr>
              <tr>
                <th>{phrases?.address || japanesePhrases.address}</th>
                <td>{property.address || '－'}</td>
              </tr>
              <tr>
                <th>{phrases?.propertyType || japanesePhrases.propertyType}</th>
                <td>{property.propertyType || '－'}</td>
              </tr>            
            </tbody>
          </table>

          {/* Second table - Price and fees */}
          <div className="property-detail-info-header">
            <div className="property-detail-icon-container">
              <i className="fas fa-yen-sign"></i>
              <span>{japanesePhrases.priceAndFees}</span>
            </div>
          </div>
          
          <table className="property-detail-table property-detail-table-grid">
            <tbody>
              <tr>
                <th>{phrases?.price || japanesePhrases.price}</th>
                <td>{formatTraditionalPrice(property.price)}</td>
                <th>{phrases?.pricePerSquareMeter || japanesePhrases.pricePerSquareMeter}</th>
                <td>{property.area ? formatTraditionalPrice(Math.round(property.price / property.area)) : '－'}</td>            
              </tr>
              <tr>
                <th>{phrases?.managementFee || japanesePhrases.managementFee}</th>
                <td>{formatPrice(property.managementFee)}</td>
                <th>{phrases?.repairReserveFund || japanesePhrases.repairReserveFund}</th>
                <td>{formatPrice(property.repairReserveFund)}</td>                
              </tr>
              <tr>
                <th>{phrases?.landLeaseFee || japanesePhrases.landLeaseFee}</th>
                <td>{displayFee(property.landLeaseFee)}</td>
                <th>{phrases?.rightFee || japanesePhrases.rightFee}</th>
                <td>{displayFee(property.rightFee)}</td>                
              </tr> 
              <tr>
                <th>{phrases?.depositGuarantee || japanesePhrases.depositGuarantee}</th>
                <td>{displayFee(property.depositGuarantee)}</td>
                <th>{phrases?.maintenanceFees || japanesePhrases.maintenanceFees}</th>
                <td>{displayFee(property.maintenanceFees)}</td>                
              </tr>   
              <tr>
                <th>{phrases?.otherFees || japanesePhrases.otherFees}</th>
                <td>{displayFee(property.otherFees)}</td>
                <td colSpan="2"></td>              
              </tr>                                               
            </tbody>
          </table>        

          {/* Third table - Property specifications */}
          <div className="property-detail-info-header">
            <div className="property-detail-icon-container">
              <i className="fas fa-home"></i>
              <span>{japanesePhrases.propertyDetails}</span>
            </div>
          </div>
          
          <table className="property-detail-table property-detail-table-grid">
            <tbody>
              <tr>
                <th>{phrases?.layout || japanesePhrases.layout}</th>
                <td>{property.layout || '－'}</td>
                <th>{phrases?.area || japanesePhrases.area}</th>
                <td>{formatArea(property.area)}</td>
              </tr>          
              <tr>
                <th>{phrases?.balcony || japanesePhrases.balcony}</th>
                <td>{formatBalcony(property.balconyArea)}</td>
                <th>{phrases?.floorInfo || japanesePhrases.floorInfo}</th>
                <td>{property.floorInfo || '－'}</td>
              </tr>
              <tr>
                <th>{phrases?.structure || japanesePhrases.structure}</th>
                <td>{property.structure || '－'}</td>
                <th>{phrases?.yearBuilt || japanesePhrases.yearBuilt}</th>
                <td>{property.yearBuilt || '－'}</td>
              </tr>
              <tr>
                <th>{phrases?.totalUnits || japanesePhrases.totalUnits}</th>
                <td>{property.totalUnits || '－'}</td>
                <th>{phrases?.parking || japanesePhrases.parking}</th>
                <td>{property.parking || '－'}</td>
              </tr>
              <tr>
                <th>{phrases?.bikeStorage || japanesePhrases.bikeStorage}</th>
                <td>{property.bikeStorage || '－'}</td>
                <th>{phrases?.bicycleParking || japanesePhrases.bicycleParking}</th>
                <td>{property.bicycleParking || '－'}</td>
              </tr>
              <tr>
                <th>{phrases?.pets || japanesePhrases.pets}</th>
                <td>{property.pets || '－'}</td>
                <th>{phrases?.landRights || japanesePhrases.landRights}</th>
                <td>{property.landRights || '－'}</td>
              </tr> 
              <tr>
                <th>{phrases?.siteArea || japanesePhrases.siteArea}</th>
                <td>{property.siteArea || '－'}</td>
                <th>{phrases?.managementForm || japanesePhrases.managementForm}</th>
                <td>{property.managementForm || '－'}</td>
              </tr>  
              <tr>
                <th>{phrases?.direction  || japanesePhrases.direction }</th>
                <td>{property.direction || '－'}</td>                
                <th>{phrases?.remarks  || japanesePhrases.remarks }</th>
                <td>{property.remarks || '－'}</td>
              </tr>                                 
            </tbody>
          </table>

          {/* NEW: Condominium Details (for condominiums) */}
          {(property.propertyType === '新築マンション' || property.propertyType === '中古マンション') && 
          (property.condominiumSalesCompany || property.managementCompany) && (
            <>
              <div className="property-detail-info-header">
                <div className="property-detail-icon-container">
                  <i className="fas fa-building"></i>
                  <span>マンション詳細</span>
                </div>
              </div>
              
              <table className="property-detail-table property-detail-table-grid">
                <tbody>
                  {property.condominiumSalesCompany && (
                    <tr>
                      <th>分譲会社</th>
                      <td>{property.condominiumSalesCompany}</td>
                      <th>管理会社</th>
                      <td>{property.managementCompany || '－'}</td>
                    </tr>
                  )}
                  {property.constructionCompany && (
                    <tr>
                      <th>施工会社</th>
                      <td>{property.constructionCompany}</td>
                      <th>設計会社</th>
                      <td>{property.designCompany || '－'}</td>
                    </tr>
                  )}
                  {property.direction && (
                    <tr>
                      <th>向き</th>
                      <td>{property.direction}</td>
                      <th>都市計画</th>
                      <td>{property.urbanPlanning || '－'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* NEW: Building & Land Details (for houses) */}
          {(property.propertyType === '新築戸建' || property.propertyType === '中古戸建') && (
            <>
              <div className="property-detail-info-header">
                <div className="property-detail-icon-container">
                  <i className="fas fa-home"></i>
                  <span>建物・土地詳細</span>
                </div>
              </div>
              
              <table className="property-detail-table property-detail-table-grid">
                <tbody>
                  <tr>
                    <th>建物面積</th>
                    <td>{property.buildingArea ? `${property.buildingArea}㎡` : '－'}</td>
                    <th>土地面積</th>
                    <td>{property.landArea ? `${property.landArea}㎡` : '－'}</td>
                  </tr>
                  <tr>
                    <th>建ぺい率</th>
                    <td>{property.buildingCoverageRatio ? `${property.buildingCoverageRatio}%` : '－'}</td>
                    <th>容積率</th>
                    <td>{property.floorAreaRatio ? `${property.floorAreaRatio}%` : '－'}</td>
                  </tr>
                  <tr>
                    <th>接道状況</th>
                    <td colSpan="3">{property.accessSituation || '－'}</td>
                  </tr>
                  {property.constructionCompany && (
                    <tr>
                      <th>施工会社</th>
                      <td>{property.constructionCompany}</td>
                      <th>設計会社</th>
                      <td>{property.designCompany || '－'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}


          {/* NEW: Investment Analysis (if rental data exists) */}
          {(property.estimatedRent || property.currentRent || property.assumedYield) && (
            <>
              <div className="property-detail-info-header">
                <div className="property-detail-icon-container">
                  <i className="fas fa-chart-line"></i>
                  <span>投資収益分析</span>
                </div>
              </div>
              
              <table className="property-detail-table property-detail-table-grid">
                <tbody>
                  {(property.estimatedRent || property.currentRent) && (
                    <tr>
                      <th>想定賃料(年間)</th>
                      <td>{property.estimatedRent ? `${property.estimatedRent.toLocaleString()}円` : '－'}</td>
                      <th>現行賃料(年間)</th>
                      <td>{property.currentRent ? `${property.currentRent.toLocaleString()}円` : '－'}</td>
                    </tr>
                  )}
                  {(property.assumedYield || property.currentYield) && (
                    <tr>
                      <th>想定利回り</th>
                      <td>{property.assumedYield ? `${(property.assumedYield * 100).toFixed(2)}%` : '－'}</td>
                      <th>現行利回り</th>
                      <td>{property.currentYield ? `${(property.currentYield * 100).toFixed(2)}%` : '－'}</td>
                    </tr>
                  )}
                  {property.rentalStatus && (
                    <tr>
                      <th>賃貸状況</th>
                      <td>{property.rentalStatus === 'vacant' ? '空室' : 
                          property.rentalStatus === 'occupied' ? '賃貸中' : 
                          property.rentalStatus === 'available' ? '賃貸可能' : property.rentalStatus}</td>
                      <th>建物内住戸数</th>
                      <td>{property.numberOfUnitsInTheBuilding || '－'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          
          {/* Seventh table - Transaction info */}
          <div className="property-detail-info-header">
            <div className="property-detail-icon-container">
              <i className="fas fa-calendar"></i>
              <span>{japanesePhrases.others}</span>
            </div>
          </div>
          
          <table className="property-detail-table property-detail-table-grid">
            <tbody>
              <tr>
                <th>{phrases?.propertyNumber || japanesePhrases.propertyNumber}</th>
                <td>{property.propertyNumber || '－'}</td>
                <th>{phrases?.currentSituation || japanesePhrases.currentSituation}</th>
                <td>{property.currentSituation || '－'}</td>            
              </tr>
              <tr>
                <th>{phrases?.extraditionPossibleDate || japanesePhrases.extraditionPossibleDate}</th>
                <td>{formatDate(property.extraditionPossibleDate) || '－'}</td>
                <th>{phrases?.transactionMode || japanesePhrases.transactionMode}</th>
                <td>{property.transactionMode || '－'}</td>            
              </tr>
              <tr>
                <th>{phrases?.informationReleaseDate || japanesePhrases.informationReleaseDate}</th>
                <td>{formatDate(property.informationReleaseDate) || '－'}</td>
                <th>{phrases?.nextScheduledUpdateDate || japanesePhrases.nextScheduledUpdateDate}</th>
                <td>{formatDate(property.nextScheduledUpdateDate) || '－'}</td>            
              </tr>                                                            
            </tbody>
          </table>          

          {/* Action buttons */}
          <div className="property-detail-buttons">
            <button className="property-detail-btn loan-calculator">
              <i className="fas fa-calculator"></i>
              Loan Calculator
            </button>
            <button className="property-detail-btn contact">
              <i className="fas fa-envelope"></i>
              {japanesePhrases.contactAgent}
            </button>
          </div>                  
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPopup;