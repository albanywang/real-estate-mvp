import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './assets/styles/index.css';
import './assets/styles/property_detail.css';
import './assets/styles/login_popup.css';
import './assets/styles/map_popup.css';
import './assets/styles/login_popup.css';
import './assets/styles/price_marker.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './services/AuthContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(  
    <AuthProvider>
      <App />
    </AuthProvider>);
} else {
  console.error('Root element not found');
}

