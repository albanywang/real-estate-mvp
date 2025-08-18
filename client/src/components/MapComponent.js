import L from 'leaflet';
import React, { useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css'; // Make sure Leaflet CSS is imported
import { formatArea, formatTraditionalPrice } from '../utils/formatUtils';

// Fix Leaflet's icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Map Component
const MapComponent = (props) => {
  const { properties, selectedProperty, setSelectedProperty, openPropertyDetail } = props;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const hasInitializedView = useRef(false);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map centered on Tokyo
      mapInstanceRef.current = L.map(mapRef.current).setView([35.6762, 139.6503], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter valid properties and transform location
    const validProperties = properties
      .map(property => {
        let latlng = null;

        // Case 1: GeoJSON format
        if (property.location && property.location.type === 'Point' && Array.isArray(property.location.coordinates)) {
          const [lng, lat] = property.location.coordinates; // GeoJSON: [lng, lat]
          if (!isNaN(lat) && !isNaN(lng)) {
            latlng = [lat, lng]; // Leaflet: [lat, lng]
          }
        } 
        // Case 2: Direct lat/lng properties
        else if (property.latitude && property.longitude) {
          if (!isNaN(property.latitude) && !isNaN(property.longitude)) {
            latlng = [property.latitude, property.longitude];
          }
        }
        // Case 3: WKB format (handle if necessary)
        else if (property.location && typeof property.location === 'string' && 
                property.location.startsWith('0101000020E6')) {
          console.warn(`Property ID ${property.id} has WKB format that needs conversion:`, property.location);
          // For now, skip these - would need proper conversion
          return null;
        }

        if (!latlng) {
          console.warn(`Property ID ${property.id} has invalid location data:`, property.location);
          return null;
        }

        return { ...property, location: latlng };
      })
      .filter(property => property !== null);

    if (validProperties.length === 0) {
      console.warn("No properties with valid location data");
      return;
    }

    // Add markers for properties
    validProperties.forEach(property => {
      // Create custom HTML for the marker
      const markerHtml = `
        <div class="price-pill-container" data-property-id="${property.id}">
          <div class="price-pill-marker${property.id === selectedProperty ? ' selected' : ''}">
            <span class="price-pill-text">${formatTraditionalPrice(property.price)}</span>
          </div>
          <div class="price-pill-arrow"></div>
        </div>
      `;

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [80, 30],
        iconAnchor: [30, 30]
      });

      // Create marker with custom icon
      const marker = L.marker(property.location, {
        icon: customIcon,
        riseOnHover: true
      }).addTo(mapInstanceRef.current);

      // Add click event directly to the marker
      marker.on('click', function(e) {
        // Prevent event bubbling
        L.DomEvent.stopPropagation(e);
        
        // Update selected property
        setSelectedProperty(property.id);
        
        // Directly call the detail function
        if (typeof openPropertyDetail === 'function') {
          openPropertyDetail(property);
        }
      });

      // When marker is added to map, get the element for hover effect
      marker.on('add', function () {
        setTimeout(() => {
          const markerElements = document.getElementsByClassName('price-pill-marker');
          for (let i = 0; i < markerElements.length; i++) {
            if (markerElements[i].innerHTML.includes(formatTraditionalPrice(property.price))) {
              const markerElement = markerElements[i];

              // Add hover effects
              markerElement.addEventListener('mouseover', function () {
                this.classList.add('hover');
              });

              markerElement.addEventListener('mouseout', function () {
                if (property.id !== selectedProperty) {
                  this.classList.remove('hover');
                }
              });

              // Add click event - directly trigger property detail (backup for custom HTML)
              let isProcessingClick = false;
              markerElement.addEventListener('click', function(e) {
                // Prevent event bubbling to avoid double triggers
                e.stopPropagation();
                
                // Prevent multiple rapid clicks
                if (isProcessingClick) return;
                isProcessingClick = true;
                
                // Update selected property
                setSelectedProperty(property.id);
                
                // Directly call the detail function
                if (typeof openPropertyDetail === 'function') {
                  openPropertyDetail(property);
                }
                
                // Reset processing flag
                setTimeout(() => {
                  isProcessingClick = false;
                }, 300);
              });

              break;
            }
          }
        }, 100);
      });

      markersRef.current.push(marker);
    });

    // Set map view to show all properties initially or when no property is selected
    if (!hasInitializedView.current || !selectedProperty) {
      if (validProperties.length > 0) {
        // Create a group of all markers to fit bounds
        const group = new L.featureGroup(markersRef.current);
        
        try {
          // Fit map to show all markers with padding
          mapInstanceRef.current.fitBounds(group.getBounds(), {
            padding: [20, 20], // Add padding around the bounds
            maxZoom: 15 // Don't zoom in too much for single properties
          });
          
          hasInitializedView.current = true;
        } catch (error) {
          console.warn("Could not fit bounds, using default view:", error);
          // Fallback to Tokyo center if bounds fitting fails
          mapInstanceRef.current.setView([35.6762, 139.6503], 12);
        }
      }
    } 
    // If a specific property is selected, center on it
    else if (selectedProperty) {
      const selectedPropertyData = validProperties.find(p => p.id === selectedProperty);
      if (selectedPropertyData) {
        mapInstanceRef.current.setView(selectedPropertyData.location, 15);
      }
    }

    // Clean up window function if needed
    return () => {
      // Clean up when component unmounts
      if (mapInstanceRef.current) {
        delete window.openPropertyDetail;
      }
    };
  }, [properties, selectedProperty, setSelectedProperty, openPropertyDetail]);

  return <div id="map" ref={mapRef}></div>;
};

export default MapComponent;