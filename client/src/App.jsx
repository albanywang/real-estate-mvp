import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import UserDashboard from './pages/UserDashboard';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import SavedProperties from './components/user/SavedProperties';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { MapProvider } from './contexts/MapContext';
import './assets/styles/index.css';

function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertyListPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />}>
                  <Route index element={<Profile />} />
                  <Route path="saved" element={<SavedProperties />} />
                </Route>
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MapProvider>
    </AuthProvider>
  );
}

export default App;