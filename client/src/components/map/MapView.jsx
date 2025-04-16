import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropertyMarker from './PropertyMarker';
import { useMapContext } from '../../contexts/MapContext';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapView = ({ properties = [], center = [40.7128, -74.0060], zoom = 12, height = '600px' }) => {
  const mapRef = useRef(null);
  const { setMap } = useMapContext();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current) {
      setMap(mapRef.current);
    }
  }, [mapRef, setMap]);

  useEffect(() => {
    setMarkers(properties);
  }, [properties]);

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={(map) => {
          mapRef.current = map;
          setMap(map);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {markers.map((property) => (
          <PropertyMarker
            key={property.id}
            property={property}
            position={[property.location.coordinates[1], property.location.coordinates[0]]}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;