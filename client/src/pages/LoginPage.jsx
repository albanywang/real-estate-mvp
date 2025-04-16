import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      // Save auth token to local storage or a cookie
      localStorage.setItem('authToken', response.data.token);
      
      // Set user in state (you'd normally use a context or redux for this)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-container">
          <img 
            src="/images/login-real-estate.jpg" 
            alt="Modern home interior" 
            className="login-image"
          />
          <div className="login-image-overlay">
            <h2>Find Your Dream Home</h2>
            <p>Join our platform to discover properties that match your lifestyle.</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-buttons">
              <button className="social-button google">
                <i className="fab fa-google"></i> Google
              </button>
              <button className="social-button facebook">
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
            </div>
          </div>

          <div className="register-prompt">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for styling the login page
const LoginPageCSS = `
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f8f9fa;
  }
  
  .login-container {
    display: flex;
    width: 100%;
    max-width: 1000px;
    min-height: 600px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .login-image-container {
    flex: 1;
    position: relative;
    display: none;
  }
  
  @media (min-width: 768px) {
    .login-image-container {
      display: block;
    }
  }
  
  .login-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .login-image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 30px;
  }
  
  .login-image-overlay h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
    font-weight: 600;
  }
  
  .login-image-overlay p {
    margin: 0;
    font-size: 16px;
    max-width: 90%;
  }
  
  .login-form-container {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
  }
  
  .login-header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .login-header h1 {
    margin: 0 0 10px 0;
    font-size: 32px;
    font-weight: 700;
    color: #2c7be5;
  }
  
  .login-header p {
    margin: 0;
    color: #6e84a3;
  }
  
  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #3b506c;
  }
  
  .form-group input {
    padding: 12px;
    border: 1px solid #e3e6f0;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #2c7be5;
    box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.2);
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .forgot-password {
    color: #2c7be5;
    text-decoration: none;
  }
  
  .login-button {
    padding: 12px;
    background-color: #2c7be5;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .login-button:hover {
    background-color: #1a68d1;
  }
  
  .login-button:disabled {
    background-color: #a7c5f2;
    cursor: not-allowed;
  }
  
  .social-login {
    margin-top: 30px;
    text-align: center;
  }
  
  .social-login p {
    color: #6e84a3;
    margin-bottom: 15px;
    position: relative;
  }
  
  .social-login p::before,
  .social-login p::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background-color: #e3e6f0;
  }
  
  .social-login p::before {
    left: 0;
  }
  
  .social-login p::after {
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
  
  .social-button:hover {
    background-color: #f8f9fa;
  }
  
  .social-button.google {
    color: #ea4335;
  }
  
  .social-button.facebook {
    color: #1877f2;
  }
  
  .register-prompt {
    margin-top: auto;
    text-align: center;
    padding-top: 30px;
    color: #6e84a3;
  }
  
  .register-prompt a {
    color: #2c7be5;
    font-weight: 600;
    text-decoration: none;
  }
  
  .register-prompt a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 767px) {
    .login-container {
      flex-direction: column;
    }
    
    .login-form-container {
      padding: 30px 20px;
    }
  }
`;

// Add the CSS to the document
const styleElement = document.createElement('style');
styleElement.innerHTML = LoginPageCSS;
document.head.appendChild(styleElement);

export default LoginPage;