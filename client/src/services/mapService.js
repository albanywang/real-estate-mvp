// This service handles map-related functionality

// Get user's current location
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };
  
  // Calculate distance between two points in km
  export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Create a bounding box from center point and radius
  export const createBoundingBox = (lat, lng, radiusInKm) => {
    const R = 6371; // Earth radius in km
    
    // Angular distance in radians
    const radDist = radiusInKm / R;
    
    const latMin = lat - radDist * 180 / Math.PI;
    const latMax = lat + radDist * 180 / Math.PI;
    
    // Adjust for longitude distances which vary with latitude
    const latR = lat * Math.PI / 180;
    const lonDelta = Math.asin(Math.sin(radDist) / Math.cos(latR)) * 180 / Math.PI;
    
    const lngMin = lng - lonDelta;
    const lngMax = lng + lonDelta;
    
    return [[latMin, lngMin], [latMax, lngMax]];
  };
  
  // Format an address for display
  export const formatAddress = (property) => {
    if (!property) return '';
    
    return `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
  };
  
  // Create custom marker icon for properties
  export const createPropertyMarker = (property, L) => {
    // This would be used with Leaflet to create custom markers
    // L is the Leaflet library instance
    
    const price = property.price.toLocaleString();
    const iconHtml = `<div class="property-marker">$${price}</div>`;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-property-marker',
      iconSize: [80, 40],
      iconAnchor: [40, 40]
    });
  };
  
  // Get map tiles configuration
  export const getMapTiles = () => {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    };
  };
  
  // Get default map center (New York City)
  export const getDefaultMapCenter = () => {
    return [40.7128, -74.0060];
  };
  
  // Get default map zoom level
  export const getDefaultMapZoom = () => {
    return 12;
  };