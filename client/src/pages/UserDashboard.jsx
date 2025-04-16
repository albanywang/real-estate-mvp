import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Profile from '../components/user/Profile';
import SavedProperties from '../components/user/SavedProperties';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Get the active tab based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/saved')) return 'saved';
    return 'profile';
  };

  const activeTab = getActiveTab();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">
          Welcome back, {user?.firstName || 'User'}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">
                    {user?.firstName || ''} {user?.lastName || ''}
                  </h3>
                  <p className="text-gray-600 text-sm">{user?.email || ''}</p>
                </div>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className={`block px-4 py-2 rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      My Profile
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/saved"
                    className={`block px-4 py-2 rounded-md ${
                      activeTab === 'saved'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Saved Properties
                    </div>
                  </Link>
                </li>
                <li>
                  
                    <a href="#"
                    className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Property Tours
                    </div>
                  </a>
                </li>
                <li>
                  
                   <a href="#"
                    className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                      Messages
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3">
          <Routes>
            <Route index element={<Profile />} />
            <Route path="saved" element={<SavedProperties />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;