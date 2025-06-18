import L from 'leaflet';
import React, { useRef, useEffect, useState } from 'react';
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
  // Add state for school markers (place inside MapComponent function)
  const [selectedSchoolType, setSelectedSchoolType] = useState(''); // '' for none, 'primary', 'middle', 'high'
  const [schoolMarkers, setSchoolMarkers] = useState([]);

  // Add function to fetch and display schools (place inside MapComponent function)
  const fetchSchoolsInBounds = async () => {
    if (!mapInstanceRef.current || !selectedSchoolType) return;
    const bounds = mapInstanceRef.current.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    try {
      // Map school type to isced:level
      const levelMap = {
        primary: '1',
        middle: '2',
        high: '3'
      };
      const level = levelMap[selectedSchoolType];

      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="school"]["isced:level"="${level}"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
          way["amenity"="school"]["isced:level"="${level}"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
          relation["amenity"="school"]["isced:level"="${level}"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
        );
        out center;
      `;
      console.log('🔍 Sending Overpass query:', overpassQuery);
      console.log('🔍 Map bounds:', { sw: [sw.lat, sw.lng], ne: [ne.lat, ne.lng] });

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      });
      if (!response.ok) throw new Error(`Failed to fetch schools: ${response.status}`);
      const data = await response.json();
      console.log('🔍 Overpass response:', data);

      // Remove existing school markers
      schoolMarkers.forEach(marker => marker.remove());

      // Filter schools strictly by selected isced:level
      const filteredSchools = data.elements.filter(school => {
        const iscedLevel = school.tags['isced:level'] || '';
        const isMatch = iscedLevel.includes(level);
        console.log('🔍 Filtering school:', { name: school.tags.name || 'Unnamed', iscedLevel, isMatch });
        return isMatch;
      });

      // Create new school markers
      const newMarkers = filteredSchools.map(school => {
        const lat = school.lat || school.center.lat;
        const lng = school.lon || school.center.lon;
        const schoolName = school.tags.name || 'Unnamed School';
        console.log('🔍 School found:', { name: schoolName, lat, lng, tags: school.tags });

        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png', // Graduation hat icon
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          })
        }).addTo(mapInstanceRef.current);

        // Create popup content with only school name
        const popupContent = `
          <div style="width: 200px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0; font-size: 14px; color: #333;">${schoolName}</h3>
          </div>
        `;

        // Bind popup to open on mouseover and close on mouseout
        marker.bindPopup(popupContent, {
          closeButton: false,
          autoClose: false,
          closeOnClick: false
        });

        marker.on('mouseover', function () {
          this.openPopup();
        });
        marker.on('mouseout', function () {
          this.closePopup();
        });

        return marker;
      });

      console.log(`🔍 Created ${newMarkers.length} school markers`);
      setSchoolMarkers(newMarkers);
      if (newMarkers.length === 0) {
        console.warn('⚠️ No schools found in the current map bounds for type:', selectedSchoolType);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchoolMarkers([]);
      setSelectedSchoolType('');
    }
  };
  // Update toggleSchoolMarkers to handle dropdown selection
  const handleSchoolTypeChange = (type) => {
    // Always clear existing markers
    schoolMarkers.forEach(marker => marker.remove());
    setSchoolMarkers([]);

    if (type === selectedSchoolType) {
      // Selecting the same type clears selection
      setSelectedSchoolType('');
    } else {
      // Switch to new type and fetch new schools
      setSelectedSchoolType(type);
      fetchSchoolsInBounds(); // Immediately fetch new data
    }
  };

  // Inside the existing useEffect in MapComponent.js (replace the entire useEffect)
  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map centered on Tokyo
      mapInstanceRef.current = L.map(mapRef.current).setView([35.6762, 139.6503], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Add map bounds change listener
    const onMoveEnd = () => {
      if (selectedSchoolType) {
        fetchSchoolsInBounds();
      }
    };
    mapInstanceRef.current.on('moveend', onMoveEnd);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter valid properties and transform location
    const validProperties = properties
      .map(property => {
        let latlng = null;
        if (property.location && property.location.type === 'Point' && Array.isArray(property.location.coordinates)) {
          const [lng, lat] = property.location.coordinates;
          if (!isNaN(lat) && !isNaN(lng)) {
            latlng = [lat, lng];
          }
        } else if (property.latitude && property.longitude) {
          if (!isNaN(property.latitude) && !isNaN(property.longitude)) {
            latlng = [property.latitude, property.longitude];
          }
        } else if (property.location && typeof property.location === 'string' && 
                  property.location.startsWith('0101000020E6')) {
          console.warn(`Property ID ${property.id} has WKB format that needs conversion:`, property.location);
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
      const markerHtml = `
        <div class="price-pill-container" data-property-id="${property.id}">
          <div class="price-pill-marker${property.id === selectedProperty ? ' selected' : ''}">
            <span class="price-pill-text">${formatTraditionalPrice(property.price)}</span>
          </div>
          <div class="price-pill-arrow"></div>
        </div>
      `;
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [80, 30],
        iconAnchor: [30, 30]
      });
      const marker = L.marker(property.location, {
        icon: customIcon,
        riseOnHover: true
      }).addTo(mapInstanceRef.current);

      marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        setSelectedProperty(property.id);
        if (typeof openPropertyDetail === 'function') {
          openPropertyDetail(property);
        }
      });

      marker.on('add', function () {
        setTimeout(() => {
          const markerElements = document.getElementsByClassName('price-pill-marker');
          for (let i = 0; i < markerElements.length; i++) {
            if (markerElements[i].innerHTML.includes(formatTraditionalPrice(property.price))) {
              const markerElement = markerElements[i];
              markerElement.addEventListener('mouseover', function () {
                this.classList.add('hover');
              });
              markerElement.addEventListener('mouseout', function () {
                if (property.id !== selectedProperty) {
                  this.classList.remove('hover');
                }
              });
              let isProcessingClick = false;
              markerElement.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isProcessingClick) return;
                isProcessingClick = true;
                setSelectedProperty(property.id);
                if (typeof openPropertyDetail === 'function') {
                  openPropertyDetail(property);
                }
                setTimeout(() => {
                  isProcessingClick = false;
                }, 300);
              });
              break;
            }
          }
        }, 100);
      });

      if (property.id === selectedProperty) {
        mapInstanceRef.current.setView(property.location, 15);
      }

      markersRef.current.push(marker);
    });

    // Clean up
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('moveend', onMoveEnd);
        delete window.openPropertyDetail;
      }
    };
  }, [properties, selectedProperty, setSelectedProperty, openPropertyDetail, selectedSchoolType]);

  // Place inside MapComponent return JSX (replace existing return statement)
  return (
    <div id="map" ref={mapRef} style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
      }}>
        <select
          value={selectedSchoolType}
          onChange={(e) => handleSchoolTypeChange(e.target.value)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="">学校を選択</option>
          <option value="primary">小学校</option>
          <option value="middle">中学校</option>
          <option value="high">高等学校</option>
        </select>
      </div>
    </div>
  );
};

// Update CSS (replace existing <style jsx> block)
<style jsx>{`
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .leaflet-popup-content {
    margin: 8px;
  }
`}</style>

export default MapComponent;