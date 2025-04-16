import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getSavedProperties, toggleSavedProperty } from '../../services/api';
import PropertyList from '../property/PropertyList';

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateSavedProperties } = useAuth();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        setLoading(true);
        const data = await getSavedProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Error loading saved properties. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleRemoveProperty = async (propertyId) => {
    try {
      await toggleSavedProperty(propertyId);
      setProperties((prevProperties) => 
        prevProperties.filter((property) => property.id !== propertyId)
      );
      updateSavedProperties();
    } catch (err) {
      console.error('Error removing property:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Saved Properties</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-48 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Saved Properties</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Saved Properties</h2>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't saved any properties yet.</p>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 font-medium">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row">
              <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                <Link to={`/properties/${property.id}`}>
                  <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <img
                      src={property.images && property.images.length > 0 ? property.images[0].image_url : '/placeholder-property.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-2/4 flex-grow">
                <Link to={`/properties/${property.id}`} className="hover:text-blue-600">
                  <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
                </Link>
                <p className="text-gray-600 mb-2">{property.address}</p>
                <p className="text-blue-600 font-bold mb-2">
                  ${property.price.toLocaleString()}
                  {property.listing_type === 'rent' && '/month'}
                </p>
                <div className="flex text-sm text-gray-500 mb-4">
                  <span className="mr-4">{property.bedrooms} Beds</span>
                  <span className="mr-4">{property.bathrooms} Baths</span>
                  <span>{property.area} sq ft</span>
                </div>
              </div>
              <div className="md:w-1/4 flex md:flex-col justify-end">
                <button
                  onClick={() => handleRemoveProperty(property.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;