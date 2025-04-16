import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertySearch from '../components/property/PropertySearch';
import PropertyCard from '../components/property/PropertyCard';
import { getProperties } from '../services/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        setLoading(true);
        // In a real app, you would have an API endpoint for featured properties
        // For now, we'll just get the first 3 properties
        const properties = await getProperties();
        setFeaturedProperties(properties.slice(0, 3));
      } catch (error) {
        console.error('Error loading featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-blue-700 h-screen-half bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/hero-image.jpg"
              alt="Beautiful homes"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find Your Perfect Home
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Search properties for sale and rent across the United States
            </p>
            <div className="mt-10">
              <PropertySearch className="max-w-4xl mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Properties</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                to="/properties"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Simple steps to find your dream property
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Search Properties</h3>
                <p className="mt-2 text-gray-600">
                  Use our advanced search to find properties that match your criteria
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Details</h3>
                <p className="mt-2 text-gray-600">
                  Explore property details, photos, and interactive maps
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Contact Agent</h3>
                <p className="mt-2 text-gray-600">
                  Connect with our agents to schedule viewings or ask questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Hear from people who found their perfect home with us
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                    <p className="text-gray-600">New York, NY</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "HomeQuest made finding our dream apartment incredibly easy. The map search feature was incredibly helpful in exploring neighborhoods."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Michael Rodriguez</h4>
                    <p className="text-gray-600">San Francisco, CA</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "After months of searching, we finally found our perfect home thanks to HomeQuest. The filtering options saved us so much time!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Emily Chen</h4>
                    <p className="text-gray-600">Chicago, IL</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The virtual tours feature on HomeQuest allowed us to narrow down our options before scheduling in-person viewings. Highly recommend!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Stay Updated</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Subscribe to our newsletter for the latest property listings and market insights
            </p>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-900 text-white px-6 py-3 rounded-r-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;