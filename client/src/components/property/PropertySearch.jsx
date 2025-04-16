import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const PropertySearch = ({ className = '', compact = false }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    type: '',
    status: 'any',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams();
    
    if (searchParams.location) {
      queryParams.append('location', searchParams.location);
    }
    
    if (searchParams.type) {
      queryParams.append('type', searchParams.type);
    }
    
    if (searchParams.status !== 'any') {
      queryParams.append('status', searchParams.status);
    }
    
    navigate(`/search?${queryParams.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-wrap gap-2 ${className}`}>
        <input
          type="text"
          name="location"
          placeholder="City, address, or ZIP"
          value={searchParams.location}
          onChange={handleChange}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <Button type="submit">Search</Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="City, address, or ZIP"
            value={searchParams.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            name="type"
            value={searchParams.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex">
            <div className="flex items-center mr-4">
              <input
                type="radio"
                id="any"
                name="status"
                value="any"
                checked={searchParams.status === 'any'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="any" className="ml-2 text-sm text-gray-700">
                Any
              </label>
            </div>
            <div className="flex items-center mr-4">
              <input
                type="radio"
                id="sale"
                name="status"
                value="sale"
                checked={searchParams.status === 'sale'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sale" className="ml-2 text-sm text-gray-700">
                For Sale
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rent"
                name="status"
                value="rent"
                checked={searchParams.status === 'rent'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rent" className="ml-2 text-sm text-gray-700">
                For Rent
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button type="submit" fullWidth>
          Search Properties
        </Button>
      </div>
    </form>
  );
};

export default PropertySearch;