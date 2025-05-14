import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import App from './components/App';
import { LanguageProvider } from './contexts/LanguageContext';
import './assets/styles/index.css';
import './assets/styles/property_detail.css';
import './assets/styles/login_popup.css';
import './assets/styles/map_popup.css';
import './assets/styles/login_popup.css';
import './assets/styles/price_marker.css';

ReactDOM.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

