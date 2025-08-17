import React, { useState, useEffect, useCallback } from 'react';
import japanesePhrases from '../utils/japanesePhrases';
import { formatPrice, formatTraditionalPrice, formatManagementFee, formatArea, formatBalcony } from '../utils/formatUtils';
import { getImageUrl } from '../services/api';
import { formatDate, formatDateCompact, formatDateRelative } from '../utils/formatDate';

const PropertyDetailPopup = ({ property, isOpen, onClose, phrases, fullscreenViewerReady, isMobile }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

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
          if (e.target.classList.contains('carousel-image')) {
            e.preventDefault();
            handleImageClick(currentImageIndex);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage, onClose, handleImageClick, currentImageIndex]);

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

  // Mobile Image Carousel Component
  const MobileImageCarousel = () => (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '250px',
      background: '#f8f9fa',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }}>
      {hasImages ? (
        <>
          {/* Main Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              cursor: fullscreenViewerReady ? 'pointer' : 'default'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => handleImageClick(currentImageIndex)}
          >
            <img
              src={getImageUrl(property.images[currentImageIndex])}
              alt={`${property.title} - image ${currentImageIndex + 1}`}
              className="carousel-image"
              onError={(e) => handleImageError(e, currentImageIndex)}
              onLoad={handleImageLoad}
              onLoadStart={handleImageLoadStart}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Loading overlay */}
            {isImageLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  border: '3px solid #f3f4f6',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            )}

            {/* Error overlay */}
            {currentImageHasError && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</span>
                <span style={{ fontSize: '0.875rem' }}>{japanesePhrases.failedToLoad}</span>
              </div>
            )}

            {/* Fullscreen hint */}
            {fullscreenViewerReady && !currentImageHasError && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span>🔍</span>
                <span>タップで拡大</span>
              </div>
            )}
          </div>

          {/* Navigation arrows for multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                ›
              </button>
            </>
          )}

          {/* Image counter and dots */}
          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* Image counter */}
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.75rem',
              fontSize: '0.75rem'
            }}>
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Dots navigation */}
            {hasMultipleImages && property.images.length <= 10 && (
              <div style={{
                display: 'flex',
                gap: '0.375rem'
              }}>
                {property.images.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(index);
                    }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentImageIndex ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  />
                ))}
                {property.images.length > 5 && (
                  <div style={{
                    color: 'white',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    +{property.images.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* No images placeholder */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏠</span>
          <span style={{ fontSize: '0.875rem' }}>{japanesePhrases.noImagesAvailable}</span>
        </div>
      )}
    </div>
  );

  // Desktop Image Grid Component (original)
  const DesktopImageGrid = () => (
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
  );

  return (
    <div 
      className="property-detail-overlay" 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '2rem',
        overflowY: 'auto'
      }}
    >
      <div 
        className="property-detail-content"
        style={{
          background: 'white',
          borderRadius: isMobile ? '0' : '0.75rem',
          width: isMobile ? '100%' : 'min(90vw, 800px)',
          height: isMobile ? '100%' : 'auto',
          maxHeight: isMobile ? '100%' : '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button 
          className="property-detail-close"
          onClick={onClose}
          aria-label="Close property details"
          style={{
            position: 'absolute',
            top: isMobile ? '0.75rem' : '1rem',
            right: isMobile ? '0.75rem' : '1rem',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ×
        </button>
        
        <div style={{
          padding: isMobile ? '1rem' : '1.5rem'
        }}>
          {/* Header */}
          <div style={{
            marginBottom: '1rem',
            paddingTop: isMobile ? '2rem' : '0'
          }}>
            <h1 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              {property.title}
            </h1>
            <div style={{
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: '700',
              color: '#3b82f6'
            }}>
              {formatTraditionalPrice(property.price)}
            </div>
          </div>
          
          {/* Images */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isMobile ? <MobileImageCarousel /> : <DesktopImageGrid />}
          </div>
          
          {/* Property Details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Transportation and Address */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <span style={{ color: '#3b82f6' }}>ℹ️</span>
                <span>{phrases?.propertyInfo || japanesePhrases.propertyInfo}</span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.transportation || japanesePhrases.transportation}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.transportation || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.address || japanesePhrases.address}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.address || '－'}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.propertyType || japanesePhrases.propertyType}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.propertyType || '－'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price and fees */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <span style={{ color: '#3b82f6' }}>💰</span>
                <span>{japanesePhrases.priceAndFees}</span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.price || japanesePhrases.price}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatTraditionalPrice(property.price)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.pricePerSquareMeter || japanesePhrases.pricePerSquareMeter}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.area ? formatTraditionalPrice(Math.round(property.price / property.area)) : '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.managementFee || japanesePhrases.managementFee}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatPrice(property.managementFee)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.repairReserveFund || japanesePhrases.repairReserveFund}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatPrice(property.repairReserveFund)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.landLeaseFee || japanesePhrases.landLeaseFee}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {displayFee(property.landLeaseFee)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.rightFee || japanesePhrases.rightFee}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {displayFee(property.rightFee)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.depositGuarantee || japanesePhrases.depositGuarantee}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {displayFee(property.depositGuarantee)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.maintenanceFees || japanesePhrases.maintenanceFees}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {displayFee(property.maintenanceFees)}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.otherFees || japanesePhrases.otherFees}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {displayFee(property.otherFees)}
                  </div>
                </div>
              </div>
            </div>

            {/* Property specifications */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <span style={{ color: '#3b82f6' }}>🏠</span>
                <span>{japanesePhrases.propertyDetails}</span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.layout || japanesePhrases.layout}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.layout || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.area || japanesePhrases.area}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatArea(property.area)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.balcony || japanesePhrases.balcony}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatBalcony(property.balconyArea)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.floorInfo || japanesePhrases.floorInfo}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.floorInfo || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.structure || japanesePhrases.structure}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.structure || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.yearBuilt || japanesePhrases.yearBuilt}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.yearBuilt || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.totalUnits || japanesePhrases.totalUnits}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.totalUnits || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.parking || japanesePhrases.parking}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.parking || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.bikeStorage || japanesePhrases.bikeStorage}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.bikeStorage || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.bicycleParking || japanesePhrases.bicycleParking}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.bicycleParking || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.pets || japanesePhrases.pets}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.pets || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.landRights || japanesePhrases.landRights}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.landRights || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.direction || japanesePhrases.direction}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.direction || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.siteArea || japanesePhrases.siteArea}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.siteArea || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.managementForm || japanesePhrases.managementForm}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.managementForm || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.remarks || japanesePhrases.remarks}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.remarks || '－'}
                  </div>
                </div>
              </div>
            </div>

            {/* Condominium Details (for condominiums) */}
            {(property.propertyType === '新築マンション' || property.propertyType === '中古マンション') && 
            (property.condominiumSalesCompany || property.managementCompany) && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  <span style={{ color: '#3b82f6' }}>🏢</span>
                  <span>マンション詳細</span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  {property.condominiumSalesCompany && (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          分譲会社
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.condominiumSalesCompany}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          管理会社
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.managementCompany || '－'}
                        </div>
                      </div>
                    </>
                  )}
                  {property.constructionCompany && (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          施工会社
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.constructionCompany}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          設計会社
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.designCompany || '－'}
                        </div>
                      </div>
                    </>
                  )}
                  {property.urbanPlanning && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                        都市計画
                      </div>
                      <div style={{ color: '#374151' }}>
                        {property.urbanPlanning}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Building & Land Details (for houses) */}
            {(property.propertyType === '新築戸建' || property.propertyType === '中古戸建') && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  <span style={{ color: '#3b82f6' }}>🏘️</span>
                  <span>建物・土地詳細</span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      建物面積
                    </div>
                    <div style={{ color: '#374151' }}>
                      {property.buildingArea ? `${property.buildingArea}㎡` : '－'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      土地面積
                    </div>
                    <div style={{ color: '#374151' }}>
                      {property.landArea ? `${property.landArea}㎡` : '－'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      建ぺい率
                    </div>
                    <div style={{ color: '#374151' }}>
                      {property.buildingCoverageRatio ? `${property.buildingCoverageRatio}%` : '－'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      容積率
                    </div>
                    <div style={{ color: '#374151' }}>
                      {property.floorAreaRatio ? `${property.floorAreaRatio}%` : '－'}
                    </div>
                  </div>
                  {property.accessSituation && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                        接道状況
                      </div>
                      <div style={{ color: '#374151' }}>
                        {property.accessSituation}
                      </div>
                    </div>
                  )}
                  {property.constructionCompany && (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          施工会社
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.constructionCompany}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          設計会社
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.designCompany || '－'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Investment Analysis (if rental data exists) */}
            {(property.estimatedRent || property.currentRent || property.assumedYield) && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  <span style={{ color: '#3b82f6' }}>📈</span>
                  <span>投資収益分析</span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  {(property.estimatedRent || property.currentRent) && (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          想定賃料(年間)
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.estimatedRent ? `${property.estimatedRent.toLocaleString()}円` : '－'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          現行賃料(年間)
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.currentRent ? `${property.currentRent.toLocaleString()}円` : '－'}
                        </div>
                      </div>
                    </>
                  )}
                  {(property.assumedYield || property.currentYield) && (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          想定利回り
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.assumedYield ? `${(property.assumedYield * 100).toFixed(2)}%` : '－'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          現行利回り
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.currentYield ? `${(property.currentYield * 100).toFixed(2)}%` : '－'}
                        </div>
                      </div>
                    </>
                  )}
                  {property.rentalStatus && (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          賃貸状況
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.rentalStatus === 'vacant' ? '空室' : 
                          property.rentalStatus === 'occupied' ? '賃貸中' : 
                          property.rentalStatus === 'available' ? '賃貸可能' : property.rentalStatus}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                          建物内住戸数
                        </div>
                        <div style={{ color: '#374151' }}>
                          {property.numberOfUnitsInTheBuilding || '－'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Transaction info */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <span style={{ color: '#3b82f6' }}>📅</span>
                <span>{japanesePhrases.others}</span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.propertyNumber || japanesePhrases.propertyNumber}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.propertyNumber || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.currentSituation || japanesePhrases.currentSituation}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.currentSituation || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.extraditionPossibleDate || japanesePhrases.extraditionPossibleDate}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatDate(property.extraditionPossibleDate) || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.transactionMode || japanesePhrases.transactionMode}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {property.transactionMode || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.informationReleaseDate || japanesePhrases.informationReleaseDate}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatDate(property.informationReleaseDate) || '－'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {phrases?.nextScheduledUpdateDate || japanesePhrases.nextScheduledUpdateDate}
                  </div>
                  <div style={{ color: '#374151' }}>
                    {formatDate(property.nextScheduledUpdateDate) || '－'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1rem',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button style={{
                flex: 1,
                padding: isMobile ? '0.875rem' : '0.75rem 1.5rem',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span>🧮</span>
                Loan Calculator
              </button>
              <button style={{
                flex: 1,
                padding: isMobile ? '0.875rem' : '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span>✉️</span>
                {japanesePhrases.contactAgent}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPopup;