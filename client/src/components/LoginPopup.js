import React, { useState, useEffect } from 'react';

// Login Popup Component - Fixed version of your original
const LoginPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  
  // Safe fallback for japanesePhrases
  const defaultPhrases = {
    welcome: 'ようこそ',
    signIn: 'サインイン',
    newAccount: '新規アカウント',
    fullName: '氏名',
    fullNamePlaceholder: '氏名を入力してください',
    email: 'メールアドレス',
    emailPlaceholder: 'メールアドレスを入力してください',
    password: 'パスワード',
    passwordPlaceholder: 'パスワードを入力してください',
    createPasswordPlaceholder: 'パスワードを作成してください',
    confirmPassword: 'パスワード確認',
    confirmPasswordPlaceholder: 'パスワードを再入力してください',
    forgotPassword: 'パスワードを忘れた方',
    createAccount: 'アカウント作成',
    orConnectWith: 'または次のサービスでログイン',
    continueWithGoogle: 'Googleで続行',
    continueWithLine: 'LINEで続行',
    continueWithYahoo: 'Yahooで続行'
  };
  
  // Try to get japanesePhrases safely
  let japanesePhrases = defaultPhrases;
  try {
    // This will use your actual japanesePhrases if available
    if (window.japanesePhrases) {
      japanesePhrases = window.japanesePhrases;
    }
  } catch (error) {
    console.log('Using default Japanese phrases');
  }
  
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
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Effect for event listener
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);
  
  // CSS styles as JavaScript objects (to avoid missing CSS file issues)
  const styles = {
    overlay: {
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
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      width: '90%',
      maxWidth: '420px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '0.25rem',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    tabsContainer: {
      display: 'flex',
      marginBottom: '2rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '4px'
    },
    tab: {
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'all 0.2s',
      color: '#6b7280'
    },
    activeTab: {
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      backgroundColor: 'white',
      cursor: 'pointer',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'all 0.2s',
      color: '#3b82f6',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#374151',
      fontWeight: '500',
      fontSize: '0.875rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    forgotLink: {
      display: 'block',
      textAlign: 'right',
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      transition: 'background-color 0.2s'
    },
    divider: {
      textAlign: 'center',
      margin: '1.5rem 0',
      color: '#6b7280',
      fontSize: '0.875rem',
      position: 'relative'
    },
    socialContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    socialButton: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'border-color 0.2s'
    },
    socialIcon: {
      width: '16px',
      height: '16px',
      display: 'inline-block'
    }
  };
  
  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.content}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        
        <div style={styles.header}>
          <h2 style={styles.title}>{japanesePhrases.welcome}</h2>
        </div>
        
        <div style={styles.tabsContainer}>
          <div 
            style={activeTab === 'signin' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('signin')}
          >
            {japanesePhrases.signIn}
          </div>
          <div 
            style={activeTab === 'register' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('register')}
          >
            {japanesePhrases.newAccount}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>{japanesePhrases.fullName}</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder={japanesePhrases.fullNamePlaceholder}
                required={activeTab === 'register'}
                style={styles.input}
              />
            </div>
          )}
          
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>{japanesePhrases.email}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder={japanesePhrases.emailPlaceholder}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>{japanesePhrases.password}</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder={activeTab === 'signin' ? japanesePhrases.passwordPlaceholder : japanesePhrases.createPasswordPlaceholder}
              required
              style={styles.input}
            />
          </div>
          
          {activeTab === 'register' && (
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>{japanesePhrases.confirmPassword}</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={japanesePhrases.confirmPasswordPlaceholder}
                required={activeTab === 'register'}
                style={styles.input}
              />
            </div>
          )}
          
          {activeTab === 'signin' && (
            <div>
              <a href="#" style={styles.forgotLink}>{japanesePhrases.forgotPassword}</a>
            </div>
          )}
          
          <button type="submit" style={styles.submitButton}>
            {activeTab === 'signin' ? japanesePhrases.signIn : japanesePhrases.createAccount}
          </button>
          
          <div style={styles.divider}>{japanesePhrases.orConnectWith}</div>
          
          <div style={styles.socialContainer}>
            <button type="button" style={styles.socialButton}>
              <span style={styles.socialIcon}>G</span> {japanesePhrases.continueWithGoogle}
            </button>
            <button type="button" style={styles.socialButton}>
              <span style={styles.socialIcon}>L</span> {japanesePhrases.continueWithLine}
            </button>
            <button type="button" style={styles.socialButton}>
              <span style={styles.socialIcon}>Y</span> {japanesePhrases.continueWithYahoo}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;