// =======================
// USER PROFILE COMPONENT
// =======================

import React, { useState, useEffect } from 'react';
import { useAuth, useFavorites, useSearchHistory } from './authContext';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { favorites, loadFavorites } = useFavorites();
  const { searchHistory, loadSearchHistory } = useSearchHistory();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    preferredLanguage: 'ja'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data when component opens
  useEffect(() => {
    if (isOpen && user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        preferredLanguage: user.preferredLanguage || 'ja'
      });
    }
  }, [isOpen, user]);

  // Load favorites and search history when tabs are accessed
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'favorites') {
        loadFavorites();
      } else if (activeTab === 'history') {
        loadSearchHistory();
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccess('プロフィールが更新されました。');
        setIsEditing(false);
      } else {
        setError(result.error || 'プロフィールの更新に失敗しました。');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('エラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('新しいパスワードが一致しません。');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください。');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setSuccess('パスワードが変更されました。');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error || 'パスワードの変更に失敗しました。');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('エラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('ログアウトしますか？')) {
      await logout();
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            マイアカウント
          </h2>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 1.5rem'
        }}>
          {[
            { id: 'profile', label: 'プロフィール' },
            { id: 'favorites', label: 'お気に入り' },
            { id: 'history', label: '検索履歴' },
            { id: 'settings', label: '設定' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {/* Error/Success Messages */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
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
              fontSize: '0.875rem'
            }}>
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ margin: 0 }}>基本情報</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    編集
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        氏名 *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        required
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        メールアドレス *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        電話番号
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        生年月日
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleProfileChange}
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        性別
                      </label>
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleProfileChange}
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">選択してください</option>
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                        <option value="other">その他</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '1.5rem',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setError('');
                        setSuccess('');
                      }}
                      disabled={isSubmitting}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {isSubmitting ? '保存中...' : '保存'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <strong>氏名:</strong> {user?.fullName || '-'}
                  </div>
                  <div>
                    <strong>メールアドレス:</strong> {user?.email || '-'}
                  </div>
                  <div>
                    <strong>電話番号:</strong> {user?.phone || '-'}
                  </div>
                  <div>
                    <strong>生年月日:</strong> {user?.dateOfBirth ? formatDate(user.dateOfBirth) : '-'}
                  </div>
                  <div>
                    <strong>性別:</strong> {
                      user?.gender === 'male' ? '男性' : 
                      user?.gender === 'female' ? '女性' : 
                      user?.gender === 'other' ? 'その他' : '-'
                    }
                  </div>
                  <div>
                    <strong>登録日:</strong> {user?.createdAt ? formatDate(user.createdAt) : '-'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>お気に入り物件</h3>
              {favorites.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
                  <p>お気に入りの物件がありません</p>
                  <p style={{ fontSize: '0.875rem' }}>物件をお気に入りに追加すると、ここに表示されます。</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {favorites.map(favorite => (
                    <div
                      key={favorite.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        display: 'flex',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                          {favorite.property?.title || 'タイトル不明'}
                        </h4>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                          {favorite.property?.address || '住所不明'}
                        </p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#dc2626' }}>
                          {favorite.property?.price ? `¥${favorite.property.price.toLocaleString()}` : '価格不明'}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            // Open property detail
                            console.log('Open property:', favorite.propertyId);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            marginRight: '0.5rem'
                          }}
                        >
                          詳細
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('お気に入りから削除しますか？')) {
                              // Remove from favorites logic would go here
                              console.log('Remove from favorites:', favorite.propertyId);
                            }
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>検索履歴</h3>
              {searchHistory.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p>検索履歴がありません</p>
                  <p style={{ fontSize: '0.875rem' }}>物件を検索すると、履歴がここに表示されます。</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '0.5rem'
                }}>
                  {searchHistory.slice(0, 20).map(search => (
                    <div
                      key={search.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          {search.searchQuery || '地図検索'}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {search.resultsCount}件の結果 • {formatDate(search.createdAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // Re-run search logic would go here
                          console.log('Re-run search:', search);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        再検索
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>設定</h3>
              
              {/* Password Change */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>パスワード変更</h4>
                <form onSubmit={handleChangePassword}>
                  <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        現在のパスワード *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        新しいパスワード *
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        新しいパスワード（確認） *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        justifySelf: 'start'
                      }}
                    >
                      {isSubmitting ? '変更中...' : 'パスワード変更'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Account Actions */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>アカウント操作</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    ログアウト
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('アカウントを削除すると、すべてのデータが失われます。本当に削除しますか？')) {
                        // Account deletion logic would go here
                        alert('アカウント削除機能は現在開発中です。');
                      }
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    アカウント削除
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =======================
// FAVORITE BUTTON COMPONENT
// =======================

const FavoriteButton = ({ propertyId, className = '', style = {} }) => {
  const { isLoggedIn } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!isLoggedIn) {
      alert('お気に入りに追加するにはログインが必要です。');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isFavorite(propertyId)) {
        const result = await removeFromFavorites(propertyId);
        if (!result.success) {
          alert('お気に入りから削除できませんでした。');
        }
      } else {
        const result = await addToFavorites(propertyId);
        if (!result.success) {
          alert('お気に入りに追加できませんでした。');
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      alert('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    ...style
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={className}
      style={defaultStyle}
      title={isFavorite(propertyId) ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      {isLoading ? (
        '⏳'
      ) : isFavorite(propertyId) ? (
        '❤️'
      ) : (
        '🤍'
      )}
    </button>
  );
};

// =======================
// USER HEADER COMPONENT
// =======================

const UserHeader = ({ onOpenProfile, onOpenLogin }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('ログアウトしますか？')) {
      await logout();
      setShowDropdown(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <button
        onClick={onOpenLogin}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        ログイン
      </button>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <span>{user?.fullName || 'ユーザー'}</span>
        <span>▼</span>
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.25rem',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          minWidth: '200px',
          zIndex: 1001
        }}>
          <button
            onClick={() => {
              onOpenProfile();
              setShowDropdown(false);
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            マイアカウント
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#dc2626'
            }}
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};

export { UserProfile, FavoriteButton, UserHeader };
export default UserProfile;