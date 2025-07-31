import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';

const UserFavorites = () => {
  const { user, isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL from environment
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://real-estate-server-34eu.onrender.com/api';

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchFavorites();
    }
  }, [isLoggedIn, user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Fetching user favorites...');
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log('📋 Favorites response:', result);

      if (response.ok && result.success) {
        setFavorites(result.favorites || []);
      } else {
        setError(result.error || 'お気に入りの取得に失敗しました');
      }
    } catch (err) {
      console.error('❌ Error fetching favorites:', err);
      setError('お気に入りの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (propertyId) => {
    try {
      console.log('🗑️ Removing from favorites:', propertyId);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));
        console.log('✅ Removed from favorites successfully');
      } else {
        console.error('❌ Failed to remove from favorites:', result.error);
      }
    } catch (err) {
      console.error('❌ Error removing from favorites:', err);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '価格応談';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#6b7280' 
      }}>
        <p>お気に入りを表示するにはログインしてください。</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          display: 'inline-block',
          width: '2rem',
          height: '2rem',
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>
          お気に入りを読み込み中...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center' 
      }}>
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1rem',
          color: '#dc2626'
        }}>
          <p>❌ {error}</p>
          <button 
            onClick={fetchFavorites}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center' 
      }}>
        <div style={{
          background: '#f9fafb',
          border: '2px dashed #d1d5db',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
          <h3 style={{ 
            margin: '0 0 0.5rem 0',
            color: '#374151',
            fontSize: '1.25rem'
          }}>
            お気に入りはまだありません
          </h3>
          <p style={{ margin: 0 }}>
            物件を気に入ったら♡ボタンでお気に入りに追加しましょう
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ 
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ 
          margin: '0',
          color: '#111827',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          💝 お気に入りの物件 ({favorites.length}件)
        </h2>
        <p style={{ 
          margin: '0.5rem 0 0 0',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          {user.full_name}さんがお気に入りに追加した物件一覧
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }}
          >
            {/* Property Image */}
            <div style={{ 
              position: 'relative',
              height: '200px',
              background: '#f3f4f6'
            }}>
              {favorite.property?.mainImageUrl ? (
                <img
                  src={favorite.property.mainImageUrl}
                  alt={favorite.property.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '3rem'
                }}>
                  🏠
                </div>
              )}
              
              {/* Remove from favorites button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(favorite.propertyId);
                }}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(220, 38, 38, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '2.5rem',
                  height: '2.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(220, 38, 38, 1)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(220, 38, 38, 0.9)'}
                title="お気に入りから削除"
              >
                ❤️
              </button>
            </div>

            {/* Property Details */}
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.4'
              }}>
                {favorite.property?.title || '物件名未設定'}
              </h3>

              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {favorite.property?.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📍</span>
                    <span>{favorite.property.address}</span>
                  </div>
                )}

                {favorite.property?.area && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📐</span>
                    <span>{favorite.property.area}㎡</span>
                  </div>
                )}

                {favorite.property?.propertyType && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🏷️</span>
                    <span>{favorite.property.propertyType}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#059669'
                }}>
                  {formatPrice(favorite.property?.price)}
                </div>
                
                <div style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  追加日: {new Date(favorite.createdAt).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add some CSS animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserFavorites;