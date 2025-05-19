import japanesePhrases from '../utils/japanesePhrases';
import React, { useState, useEffect } from 'react';

// Login Popup Component
const LoginPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  
  // If popup is not open, return null
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'signin') {
      // Handle sign in
      console.log('Sign in with:', formData.email, formData.password);
      // You would add authentication logic here
    } else {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        alert('パスワードが一致しません！');
        return;
      }
      console.log('Register with:', formData.name, formData.email, formData.password);
      // You would add registration logic here
    }
    
    // For demo, just close the popup
    onClose();
  };
  
  const handleOverlayClick = (e) => {
    if (e.target.className === 'login-popup-overlay') {
      onClose();
    }
  };
  
  // Effect for event listener
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);
  
  return (
    <div className="login-popup-overlay" onClick={handleOverlayClick}>
      <div className="login-popup-content">
        <button className="login-popup-close" onClick={onClose}>×</button>
        
        <div className="login-popup-header">
          <h2>{japanesePhrases.welcome}</h2>
        </div>
        
        <div className="login-popup-tabs">
          <div 
            className={`login-popup-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            {japanesePhrases.signIn}
          </div>
          <div 
            className={`login-popup-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            {japanesePhrases.newAccount}
          </div>
        </div>
        
        <form className="login-popup-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="login-popup-form-group">
              <label htmlFor="name">{japanesePhrases.fullName}</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder={japanesePhrases.fullNamePlaceholder}
                required={activeTab === 'register'}
              />
            </div>
          )}
          
          <div className="login-popup-form-group">
            <label htmlFor="email">{japanesePhrases.email}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder={japanesePhrases.emailPlaceholder}
              required
            />
          </div>
          
          <div className="login-popup-form-group">
            <label htmlFor="password">{japanesePhrases.password}</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder={activeTab === 'signin' ? japanesePhrases.passwordPlaceholder : japanesePhrases.createPasswordPlaceholder}
              required
            />
          </div>
          
          {activeTab === 'register' && (
            <div className="login-popup-form-group">
              <label htmlFor="confirmPassword">{japanesePhrases.confirmPassword}</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={japanesePhrases.confirmPasswordPlaceholder}
                required={activeTab === 'register'}
              />
            </div>
          )}
          
          {activeTab === 'signin' && (
            <div className="login-popup-forgot">
              <a href="#">{japanesePhrases.forgotPassword}</a>
            </div>
          )}
          
          <button type="submit" className="login-popup-submit">
            {activeTab === 'signin' ? japanesePhrases.signIn : japanesePhrases.createAccount}
          </button>
          
          <div className="login-popup-divider">{japanesePhrases.orConnectWith}</div>
          
          <div className="login-popup-social">
            <button type="button" className="login-popup-social-btn google">
              <i className="fab fa-google"></i> {japanesePhrases.continueWithGoogle}
            </button>
            <button type="button" className="login-popup-social-btn line">
              <i className="fab fa-line"></i> {japanesePhrases.continueWithLine}
            </button>
            <button type="button" className="login-popup-social-btn yahoo">
              <i className="fab fa-yahoo"></i> {japanesePhrases.continueWithYahoo}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;