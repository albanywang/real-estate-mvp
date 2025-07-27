import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';

// Login Popup Component - Integrated with User Database
const LoginPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get auth methods from context
  const { login, register, googleLogin, lineLogin, yahooLogin, isLoading } = useAuth();
  
  // Hook must be called before early return
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

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
    phone: '電話番号',
    phonePlaceholder: '電話番号を入力してください（任意）',
    dateOfBirth: '生年月日',
    gender: '性別',
    genderMale: '男性',
    genderFemale: '女性',
    genderOther: 'その他',
    forgotPassword: 'パスワードを忘れた方',
    createAccount: 'アカウント作成',
    orConnectWith: 'または次のサービスでログイン',
    continueWithGoogle: 'Googleで続行',
    continueWithLine: 'LINEで続行',
    continueWithYahoo: 'Yahooで続行',
    loading: '処理中...',
    signingIn: 'サインイン中...',
    creatingAccount: 'アカウント作成中...'
  };
  
  // Get phrases safely
  let japanesePhrases = defaultPhrases;
  try {
    if (window.japanesePhrases) {
      japanesePhrases = { ...defaultPhrases, ...window.japanesePhrases };
    }
  } catch (error) {
    console.log('Using default Japanese phrases');
  }
  
  // Reset form when tab changes
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: ''
    });
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Reset form when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        gender: ''
      });
      setError('');
      setSuccess('');
      setIsSubmitting(false);
    }
  }, [isOpen]);
  
  // NOW it's safe to return early - all hooks have been called
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  const validateForm = () => {
    if (activeTab === 'signin') {
      if (!formData.email || !formData.password) {
        setError('メールアドレスとパスワードを入力してください。');
        return false;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('必須項目をすべて入力してください。');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('パスワードが一致しません。');
        return false;
      }
      
      if (formData.password.length < 8) {
        setError('パスワードは8文字以上で入力してください。');
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('有効なメールアドレスを入力してください。');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      if (activeTab === 'signin') {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          setSuccess('ログインしました！');
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setError(result.error || 'ログインに失敗しました。');
        }
      } else {
        // Registration
        const userData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          phone: formData.phone || null,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null
        };
        
        const result = await register(userData);
        
        if (result.success) {
          setSuccess(result.message || 'アカウントが作成されました！確認メールをご確認ください。');
          // Switch to sign in tab after successful registration
          setTimeout(() => {
            setActiveTab('signin');
            setSuccess('');
          }, 3000);
        } else {
          setError(result.error || 'アカウント作成に失敗しました。');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSocialLogin = async (provider) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      let result;
      
      switch (provider) {
        case 'google':
          // In a real app, you'd integrate with Google OAuth
          // For now, we'll show a placeholder
          setError('Google ログインは現在開発中です。');
          break;
        case 'line':
          setError('LINE ログインは現在開発中です。');
          break;
        case 'yahoo':
          setError('Yahoo ログインは現在開発中です。');
          break;
        default:
          setError('不明なログイン方法です。');
      }
    } catch (error) {
      console.error('Social login error:', error);
      setError('ソーシャルログインに失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };
  
  return (
    <div className="login-popup-overlay" onClick={handleOverlayClick}>
      <div className="login-popup-content">
        <button 
          className="login-popup-close" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          ×
        </button>
        
        <div className="login-popup-header">
          <h2>{japanesePhrases.welcome}</h2>
        </div>
        
        <div className="login-popup-tabs">
          <div 
            className={`login-popup-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => !isSubmitting && setActiveTab('signin')}
          >
            {japanesePhrases.signIn}
          </div>
          <div 
            className={`login-popup-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => !isSubmitting && setActiveTab('register')}
          >
            {japanesePhrases.newAccount}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            border: '1px solid #a7f3d0'
          }}>
            {success}
          </div>
        )}
        
        <form className="login-popup-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="login-popup-form-group">
              <label htmlFor="name">{japanesePhrases.fullName} *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder={japanesePhrases.fullNamePlaceholder}
                required={activeTab === 'register'}
                disabled={isSubmitting}
              />
            </div>
          )}
          
          <div className="login-popup-form-group">
            <label htmlFor="email">{japanesePhrases.email} *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder={japanesePhrases.emailPlaceholder}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="login-popup-form-group">
            <label htmlFor="password">{japanesePhrases.password} *</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder={activeTab === 'signin' ? japanesePhrases.passwordPlaceholder : japanesePhrases.createPasswordPlaceholder}
              required
              disabled={isSubmitting}
              minLength={activeTab === 'register' ? 8 : undefined}
            />
          </div>
          
          {activeTab === 'register' && (
            <>
              <div className="login-popup-form-group">
                <label htmlFor="confirmPassword">{japanesePhrases.confirmPassword} *</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={japanesePhrases.confirmPasswordPlaceholder}
                  required={activeTab === 'register'}
                  disabled={isSubmitting}
                  minLength={8}
                />
              </div>
              
              <div className="login-popup-form-group">
                <label htmlFor="phone">{japanesePhrases.phone}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={japanesePhrases.phonePlaceholder}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="login-popup-form-group">
                <label htmlFor="dateOfBirth">{japanesePhrases.dateOfBirth}</label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="login-popup-form-group">
                <label htmlFor="gender">{japanesePhrases.gender}</label>
                <select 
                  id="gender" 
                  name="gender" 
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">選択してください</option>
                  <option value="male">{japanesePhrases.genderMale}</option>
                  <option value="female">{japanesePhrases.genderFemale}</option>
                  <option value="other">{japanesePhrases.genderOther}</option>
                </select>
              </div>
            </>
          )}
          
          {activeTab === 'signin' && (
            <div className="login-popup-forgot">
              <a href="#" onClick={(e) => {
                e.preventDefault();
                // TODO: Implement forgot password functionality
                setError('パスワードリセット機能は現在開発中です。');
              }}>
                {japanesePhrases.forgotPassword}
              </a>
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-popup-submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <span style={{ marginRight: '0.5rem' }}>⏳</span>
                {activeTab === 'signin' ? japanesePhrases.signingIn : japanesePhrases.creatingAccount}
              </>
            ) : (
              activeTab === 'signin' ? japanesePhrases.signIn : japanesePhrases.createAccount
            )}
          </button>
          
          <div className="login-popup-divider">{japanesePhrases.orConnectWith}</div>
          
          <div className="login-popup-social">
            <button 
              type="button" 
              className="login-popup-social-btn google"
              onClick={() => handleSocialLogin('google')}
              disabled={isSubmitting}
            >
              <i className="fab fa-google"></i> {japanesePhrases.continueWithGoogle}
            </button>
            <button 
              type="button" 
              className="login-popup-social-btn line"
              onClick={() => handleSocialLogin('line')}
              disabled={isSubmitting}
            >
              <i className="fab fa-line"></i> {japanesePhrases.continueWithLine}
            </button>
            <button 
              type="button" 
              className="login-popup-social-btn yahoo"
              onClick={() => handleSocialLogin('yahoo')}
              disabled={isSubmitting}
            >
              <i className="fab fa-yahoo"></i> {japanesePhrases.continueWithYahoo}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;