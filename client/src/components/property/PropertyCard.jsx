import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { toggleSavedProperty } from '../../services/api';

const PropertyCard = ({ property }) => {
  const { user, isAuthenticated, updateSavedProperties } = useAuth();
  const isSaved = user?.savedProperties?.includes(property.id);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      await toggleSavedProperty(property.id);
      updateSavedProperties();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  return (
    <Card hoverable className="h-full flex flex-col">
      <Link to={`/properties/${property.id}`} className="block flex-grow">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <img
              src={property.images && property.images.length > 0 ? property.images[0].image_url : '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={handleSave}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              aria-label={isSaved ? 'Unsave property' : 'Save property'}
            >
              <svg
                className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md">
              {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
          <p className="text-gray-600 mb-2 truncate">{property.address}</p>
          <p className="text-xl font-bold text-blue-600 mb-2">
            ${property.price.toLocaleString()}
            {property.listing_type === 'rent' && '/month'}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{property.bedrooms} Beds</span>
            <span>{property.bathrooms} Baths</span>
            <span>{property.area} sq ft</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;