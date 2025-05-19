import React, { useState, useEffect } from 'react';

/**
 * SmartImageLoader - Tries multiple path formats to load images
 * when the exact server configuration is unclear
 */
const SmartImageLoader = ({ src, alt, className, style, fallbackImg = null }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Create a list of possible paths to try based on the original path
  const getPathVariations = (originalPath) => {
    if (!originalPath) return [];
    
    // Normalize the path
    const normalized = String(originalPath).trim();
    
    // Generate variations to try
    return [
      // 1. Original path
      normalized,
      // 2. Ensure it starts with slash
      normalized.startsWith('/') ? normalized : `/${normalized}`,
      // 3. Try with public prefix
      `/public${normalized.startsWith('/') ? normalized : `/${normalized}`}`,
      // 4. Try without 'images' folder
      normalized.replace('/images/', '/'),
      // 5. Try with static prefix
      `/static${normalized.startsWith('/') ? normalized : `/${normalized}`}`,
      // 6. Try absolute URL (if it's already a relative URL)
      !normalized.startsWith('http') ? 
        window.location.origin + (normalized.startsWith('/') ? normalized : `/${normalized}`) : 
        normalized
    ];
  };
  
  // Try loading the image with different path variations
  useEffect(() => {
    // Reset state
    setIsLoading(true);
    setErrorMessage(null);
    setImageSrc(null);
    
    if (!src) {
      setIsLoading(false);
      setErrorMessage('No image source provided');
      return;
    }
    
    // Get all path variations to try
    const pathVariations = getPathVariations(src);
    console.log('Trying path variations:', pathVariations);
    
    // Try each path variation sequentially
    const tryNextPath = (index) => {
      if (index >= pathVariations.length) {
        setIsLoading(false);
        setErrorMessage(`Failed to load image after trying ${pathVariations.length} path variations`);
        // Log all attempted paths for debugging
        console.error('All attempted paths failed:', pathVariations);
        return;
      }
      
      const path = pathVariations[index];
      const img = new Image();
      
      img.onload = () => {
        console.log(`✓ Image loaded successfully with path: ${path}`);
        setImageSrc(path);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        console.log(`× Failed to load image with path: ${path}`);
        // Try the next path
        tryNextPath(index + 1);
      };
      
      img.src = path;
    };
    
    // Start trying paths
    tryNextPath(0);
    
    // Cleanup
    return () => {
      // Nothing to clean up
    };
  }, [src]);
  
  // Container styles
  const containerStyles = {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style
  };
  
  // Image styles
  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  };
  
  // Final className
  const finalClassName = `smart-image-loader ${className || ''}`;
  
  // What to render
  return (
    <div style={containerStyles} className={finalClassName}>
      {isLoading && (
        <div className="loading-state">Loading...</div>
      )}
      
      {!isLoading && errorMessage && (
        <div className="error-state">
          {fallbackImg ? (
            <img 
              src={fallbackImg} 
              alt={alt || 'Fallback image'} 
              style={imageStyles}
            />
          ) : (
            <div className="error-message">{errorMessage || 'Image Not Available'}</div>
          )}
        </div>
      )}
      
      {!isLoading && imageSrc && (
        <img 
          src={imageSrc}
          alt={alt || 'Image'} 
          style={imageStyles}
        />
      )}
    </div>
  );
};

export default SmartImageLoader;