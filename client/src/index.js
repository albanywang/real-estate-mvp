import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
//import { LanguageProvider } from './contexts/LanguageContext';
import './assets/styles/index.css';
import './assets/styles/property_detail.css';
import './assets/styles/login_popup.css';
import './assets/styles/map_popup.css';
import './assets/styles/login_popup.css';
import './assets/styles/price_marker.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}

