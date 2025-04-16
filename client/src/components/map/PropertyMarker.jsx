import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import PropertyPopup from './PropertyPopup';

const createCustomIcon = (price) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="bg-blue-600 text-white px-2 py-1 rounded-lg font-bold shadow-md">$${price.toLocaleString()}</div>`,
    iconSize: [80, 40],
    iconAnchor: [40, 40],
  });
};

const PropertyMarker = ({ property, position }) => {
  const icon = createCustomIcon(property.price);

  return (
    <Marker 
      position={position} 
      icon={icon}
      title={property.title}
    >
      <PropertyPopup property={property} />
    </Marker>
  );
};

export default PropertyMarker;