import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer', // Default to buyer
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation (optional but validated if provided)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType
      });
      
      setSuccess(true);
      
      // Optionally auto-login the user
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.field) {
        // Server returned a specific field error
        setErrors({
          ...errors,
          [err.response.data.field]: err.response.data.message
        });
      } else {
        // General error
        setErrors({
          ...errors,
          general: err.response?.data?.message || 'Registration failed. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-image-container">
          <img 
            src="/images/register-real-estate.jpg" 
            alt="Modern building exterior" 
            className="register-image"
          />
          <div className="register-image-overlay">
            <h2>Join Our Community</h2>
            <p>Create an account to access exclusive property listings and save your favorites.</p>
          </div>
        </div>
        
        <div className="register-form-container">
          <div className="register-header">
            <h1>Create an Account</h1>
            <p>Fill in your details to get started</p>
          </div>

          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {success && (
            <div className="success-message">
              Account created successfully! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  disabled={loading || success}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  disabled={loading || success}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={loading || success}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 555-5555"
                className={errors.phone ? 'error' : ''}
                disabled={loading || success}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  disabled={loading || success}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading || success}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="userType">I am a*</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                disabled={loading || success}
              >
                <option value="buyer">Home Buyer</option>
                <option value="seller">Home Seller</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={loading || success}
                />
                <label htmlFor="agreeTerms">
                  I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading || success}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="social-register">
            <p>Or sign up with</p>
            <div className="social-buttons">
              <button className="social-button google" disabled={loading || success}>
                <i className="fab fa-google"></i> Google
              </button>
              <button className="social-button facebook" disabled={loading || success}>
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
            </div>
          </div>

          <div className="login-prompt">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for styling the registration page
const RegisterPageCSS = `
  .register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f8f9fa;
  }
  
  .register-container {
    display: flex;
    width: 100%;
    max-width: 1100px;
    min-height: 750px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .register-image-container {
    flex: 1;
    position: relative;
    display: none;
  }
  
  @media (min-width: 992px) {
    .register-image-container {
      display: block;
    }
  }
  
  .register-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .register-image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 30px;
  }
  
  .register-image-overlay h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
    font-weight: 600;
  }
  
  .register-image-overlay p {
    margin: 0;
    font-size: 16px;
    max-width: 90%;
  }
  
  .register-form-container {
    flex: 1.2;
    padding: 40px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .register-header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .register-header h1 {
    margin: 0 0 10px 0;
    font-size: 32px;
    font-weight: 700;
    color: #2c7be5;
  }
  
  .register-header p {
    margin: 0;
    color: #6e84a3;
  }
  
  .error-message, .success-message {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .error-message {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .success-message {
    background-color: #d4edda;
    color: #155724;
  }
  
  .register-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  @media (max-width: 767px) {
    .form-row {
      flex-direction: column;
      gap: 20px;
    }
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
  }
  
  .form-group label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #3b506c;
  }
  
  .form-group input, 
  .form-group select {
    padding: 12px;
    border: 1px solid #e3e6f0;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus, 
  .form-group select:focus {
    outline: none;
    border-color: #2c7be5;
    box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.2);
  }
  
  .form-group input.error,
  .form-group select.error {
    border-color: #dc3545;
  }
  
  .error-text {
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .checkbox-group {
    flex-direction: column;
  }
  
  .checkbox-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  
  .checkbox-wrapper input[type="checkbox"] {
    margin-top: 4px;
  }
  
  .checkbox-wrapper label {
    margin-bottom: 0;
    font-weight: normal;
    line-height: 1.5;
  }
  
  .checkbox-wrapper a {
    color: #2c7be5;
    text-decoration: none;
  }
  
  .checkbox-wrapper a:hover {
    text-decoration: underline;
  }
  
  .register-button {
    padding: 12px;
    background-color: #2c7be5;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 10px;
  }
  
  .register-button:hover {
    background-color: #1a68d1;
  }
  
  .register-button:disabled {
    background-color: #a7c5f2;
    cursor: not-allowed;
  }
  
  .social-register {
    margin-top: 30px;
    text-align: center;
  }
  
  .social-register p {
    color: #6e84a3;
    margin-bottom: 15px;
    position: relative;
  }
  
  .social-register p::before,
  .social-register p::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background-color: #e3e6f0;
  }
  
  .social-register p::before {
    left: 0;
  }
  
  .social-register p::after {
    right: 0;
  }
  
  .social-buttons {
    display: flex;
    gap: 15px;
  }
  
  .social-button {
    flex: 1;
    padding: 10px;
    border: 1px solid #e3e6f0;
    border-radius: 6px;
    background-color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .social-button:hover:not(:disabled) {
    background-color: #f8f9fa;
  }
  
  .social-button.google {
    color: #ea4335;
  }
  
  .social-button.facebook {
    color: #1877f2;
  }
  
  .social-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .login-prompt {
    margin-top: 30px;
    text-align: center;
    color: #6e84a3;
  }
  
  .login-prompt a {
    color: #2c7be5;
    font-weight: 600;
    text-decoration: none;
  }
  
  .login-prompt a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 991px) {
    .register-container {
      flex-direction: column;
    }
    
    .register-form-container {
      padding: 30px 20px;
    }
  }
`;

// Add the CSS to the document
const styleElement = document.createElement('style');
styleElement.innerHTML = RegisterPageCSS;
document.head.appendChild(styleElement);

export default RegisterPage;