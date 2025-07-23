// First, let's create a simple test version to isolate the issue
import React, { useState } from 'react';
import japanesePhrases from '../utils/japanesePhrases';

// Simple test component to replace LoginPopup temporarily
const SimpleLoginTest = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Test Login Popup</h2>
        <p>If you can see this, the basic popup works!</p>
        <button onClick={onClose} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Close
        </button>
      </div>
    </div>
  );
};

// Debugging steps to try in your App.js:

// STEP 1: Replace LoginPopup import with simple test
// import LoginPopup from './LoginPopup';  // Comment this out
// import SimpleLoginTest as LoginPopup from './path/to/this/file';  // Use this instead

// STEP 2: Check if japanesePhrases is causing the issue
console.log('japanesePhrases check:', japanesePhrases);

// STEP 3: Add error boundary around LoginPopup
class LoginErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LoginPopup Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', color: 'red', border: '1px solid red' }}>
          <h3>LoginPopup Error</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// STEP 4: Use the error boundary in your App.js
// <LoginErrorBoundary>
//   <LoginPopup
//     isOpen={isLoginPopupOpen}
//     onClose={handleCloseLogin}
//   />
// </LoginErrorBoundary>

export default SimpleLoginTest;
export { LoginErrorBoundary };