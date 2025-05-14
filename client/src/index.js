import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { LanguageProvider } from './contexts/LanguageContext';
import './assets/styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);