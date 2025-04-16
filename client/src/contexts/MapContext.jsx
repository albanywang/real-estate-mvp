import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export const useMapContext = () => {
  return useContext(MapContext);
};

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [currentCenter, setCurrentCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [currentZoom, setCurrentZoom] = useState(12);

  const panTo = (coordinates, zoom = 15) => {
    if (map) {
      map.setView(coordinates, zoom);
    }
  };

  const flyTo = (coordinates, zoom = 15) => {
    if (map) {
      map.flyTo(coordinates, zoom);
    }
  };

  const fitBounds = (bounds, options = {}) => {
    if (map) {
      map.fitBounds(bounds, options);
    }
  };

  const value = {
    map,
    setMap,
    currentCenter,
    setCurrentCenter,
    currentZoom,
    setCurrentZoom,
    panTo,
    flyTo,
    fitBounds,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};