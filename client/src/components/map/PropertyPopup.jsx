import React from 'react';
import { Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const PropertyPopup = ({ property }) => {
  return (
    <Popup>
      <div className="w-64">
        <div className="aspect-w-16 aspect-h-9 mb-2 overflow-hidden rounded">
          <img
            src={property.images && property.images.length > 0 ? property.images[0].image_url : '/placeholder-property.jpg'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-lg truncate">{property.title}</h3>
        <p className="text-gray-700">{property.address}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-blue-600">${property.price.toLocaleString()}</p>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">{property.bedrooms} bd</span>
            <span>{property.bathrooms} ba</span>
          </div>
        </div>
        <Link
          to={`/properties/${property.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mt-3 text-sm"
        >
          View Details
        </Link>
      </div>
    </Popup>
  );
};

export default PropertyPopup;