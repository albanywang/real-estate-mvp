import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import MapView from '../map/MapView';
import { useAuth } from '../../contexts/AuthContext';
import { toggleSavedProperty } from '../../services/api';

const PropertyDetail = ({ property }) => {
  const [activeImage, setActiveImage] = useState(0);
  const { user, isAuthenticated, updateSavedProperties } = useAuth();
  const navigate = useNavigate();
  
  const isSaved = user?.savedProperties?.includes(property.id);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${property.id}` } });
      return;
    }
    
    try {
      await toggleSavedProperty(property.id);
      updateSavedProperties();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  if (!property) {
    return <div className="text-center py-12">Loading property details...</div>;
  }

  const mapPosition = property.location 
    ? [property.location.coordinates[1], property.location.coordinates[0]] 
    : [40.7128, -74.0060]; // Default to NYC if no location

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <p className="text-xl text-gray-600">{property.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
              <img
                src={property.images && property.images.length > 0 
                  ? property.images[activeImage].image_url 
                  : '/placeholder-property.jpg'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {property.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-w-4 aspect-h-3 rounded overflow-hidden cursor-pointer ${
                      index === activeImage ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image.image_url}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{property.area} sq ft</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{property.property_type}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</span>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <MapView 
              properties={[property]} 
              center={mapPosition} 
              zoom={15} 
              height="400px" 
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-8">
            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-600">
                ${property.price.toLocaleString()}
                {property.listing_type === 'rent' && '/month'}
              </p>
              <div className="flex items-center text-gray-600 mt-2">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                fullWidth 
                size="lg"
                onClick={() => window.location.href = `mailto:contact@homequest.com?subject=Inquiry about ${property.title}`}
              >
                Contact Agent
              </Button>
              <Button 
                fullWidth 
                variant={isSaved ? 'outline' : 'secondary'} 
                size="lg"
                onClick={handleSave}
              >
                {isSaved ? 'Saved' : 'Save Property'}
              </Button>
              <Button 
                fullWidth 
                variant="outline" 
                size="lg"
                onClick={() => window.open(`https://www.google.com/maps?q=${property.address},+${property.city},+${property.state}+${property.zip_code}`, '_blank')}
              >
                Get Directions
              </Button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Request a Tour</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select a time</option>
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
                <Button type="submit" fullWidth>Schedule Tour</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;