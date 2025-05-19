import React, { useState, useEffect, useRef } from 'react';

/**
 * A robust image component that handles loading states and errors
 */
const PropertyImage = ({ src, alt, className, style }) => {
  const [status, setStatus] = useState('loading');
  const imageRef = useRef(null);
  const retryCount = useRef(0);
  const maxRetries = 2;
  
  // Format the image URL properly
  const formatImageUrl = (url) => {
    if (!url) return null;
    
    // Make sure we have a string
    const path = String(url);
    
    // Handle various path formats
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };
  
  // Handle loading the image
  const loadImage = (imgSrc) => {
    setStatus('loading');
    
    const formattedSrc = formatImageUrl(imgSrc);
    if (!formattedSrc) {
      setStatus('error');
      return;
    }
    
    // Clear previous image reference if any
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
    }
    
    // Create a new image object
    const img = new Image();
    imageRef.current = img;
    
    img.onload = () => {
      setStatus('loaded');
      retryCount.current = 0; // Reset retry count on success
    };
    
    img.onerror = () => {
      // Try a few times before giving up
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        console.log(`Retrying image load (${retryCount.current}/${maxRetries}): ${formattedSrc}`);
        
        // Add a small delay before retry
        setTimeout(() => loadImage(imgSrc), 1000);
      } else {
        console.error(`Failed to load image after ${maxRetries} retries: ${formattedSrc}`);
        setStatus('error');
      }
    };
    
    img.src = formattedSrc;
  };
  
  // Load the image when src changes
  useEffect(() => {
    if (src) {
      loadImage(src);
    } else {
      setStatus('error');
    }
    
    // Cleanup function
    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, [src]);
  
  // Styles for different states
  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style
  };
  
  // Combine provided className with default
  const fullClassName = `property-image ${className || ''}`;
  
  // Render based on status
  return (
    <div style={containerStyle} className={fullClassName}>
      {status === 'loading' && (
        <div className="loading-indicator">Loading...</div>
      )}
      
      {status === 'error' && (
        <div className="error-placeholder">
          <span>Image Not Available</span>
        </div>
      )}
      
      {status === 'loaded' && imageRef.current && (
        <img 
          src={imageRef.current.src}
          alt={alt || 'Property'} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};

export default PropertyImage;