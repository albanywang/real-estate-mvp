// real-estate-mvp/client/src/components/LoginPopup/LoginPopup.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router
import './LoginPopup.css';

const LoginPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  useEffect(() => {
    // Close popup when ESC key is pressed
    const handleEscKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the login logic or integrate with your existing loginPage logic
    console.log('Login attempt with:', { email, password });
    // After successful login, you might want to close the popup
    // onClose();
  };

  return (
    <div className="popup-overlay" onClick={(e) => {
      // Close the popup when clicking the overlay (outside the popup content)
      if (e.target.className === 'popup-overlay') onClose();
    }}>
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Welcome to Zillow</h2>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign in
          </button>
          <button 
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            New account
          </button>
        </div>
        
        {activeTab === 'signin' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="signin-button">Sign in</button>
            
            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
            
            <div className="divider">
              <span>Or connect with:</span>
            </div>
            
            <div className="social-buttons">
              <button type="button" className="social-button apple">
                <span className="icon apple-icon"></span>
                Continue with Apple
              </button>
              
              <button type="button" className="social-button facebook">
                <span className="icon facebook-icon"></span>
                Continue with Facebook
              </button>
              
              <button type="button" className="social-button google">
                <span className="icon google-icon"></span>
                Continue with Google
              </button>
            </div>
          </form>
        ) : (
          // Register tab content - you can import your registerPage.jsx here
          // or create a simpler embedded version
          <div className="register-container">
            {/* You could conditionally render your existing register page component */}
            {/* import RegisterPage from '../../pages/registerPage'; */}
            {/* <RegisterPage inPopup={true} /> */}
            
            {/* Or create a simple inline form for registration */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input
                  type="email"
                  id="reg-email"
                  placeholder="Enter email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  placeholder="Create password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm password"
                  required
                />
              </div>
              
              <button type="submit" className="signin-button">Create account</button>
              
              <div className="divider">
                <span>Or connect with:</span>
              </div>
              
              <div className="social-buttons">
                <button type="button" className="social-button apple">
                  <span className="icon apple-icon"></span>
                  Continue with Apple
                </button>
                
                <button type="button" className="social-button facebook">
                  <span className="icon facebook-icon"></span>
                  Continue with Facebook
                </button>
                
                <button type="button" className="social-button google">
                  <span className="icon google-icon"></span>
                  Continue with Google
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;