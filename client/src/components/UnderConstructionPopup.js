import React from 'react';

const UnderConstructionPopup = ({ 
  isOpen, 
  onClose, 
  title = "機能開発中",
  message = "この機能は現在開発中です。",
  subtitle = null,
  icon = "🚧",
  buttonText = "了解しました",
  type = "construction" // 'construction', 'coming-soon', 'maintenance', 'info'
}) => {
  if (!isOpen) return null;

  // Different styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'coming-soon':
        return {
          icon: '🚀',
          buttonColor: '#10b981',
          buttonHoverColor: '#059669',
          subtitle: subtitle || 'もうすぐリリース予定です！'
        };
      case 'maintenance':
        return {
          icon: '⚙️',
          buttonColor: '#f59e0b',
          buttonHoverColor: '#d97706',
          subtitle: subtitle || 'メンテナンス中です。'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          buttonColor: '#3b82f6',
          buttonHoverColor: '#2563eb',
          subtitle: subtitle || ''
        };
      case 'construction':
      default:
        return {
          icon: '🚧',
          buttonColor: '#3b82f6',
          buttonHoverColor: '#2563eb',
          subtitle: subtitle || 'しばらくお待ちください。ご不便をおかけして申し訳ありません。'
        };
    }
  };

  const typeStyles = getTypeStyles();
  const displayIcon = icon !== '🚧' ? icon : typeStyles.icon;
  const displaySubtitle = subtitle !== null ? subtitle : typeStyles.subtitle;

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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {displayIcon}
        </div>
        
        {/* Title */}
        <h2 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          {title}
        </h2>
        
        {/* Main Message */}
        <p style={{
          margin: '0 0 1.5rem 0',
          fontSize: '1rem',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        
        {/* Subtitle/Additional info */}
        {displaySubtitle && (
          <p style={{
            margin: '0 0 2rem 0',
            fontSize: '0.875rem',
            color: '#9ca3af',
            lineHeight: '1.4'
          }}>
            {displaySubtitle}
          </p>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: typeStyles.buttonColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = typeStyles.buttonHoverColor}
          onMouseOut={(e) => e.target.style.backgroundColor = typeStyles.buttonColor}
        >
          {buttonText}
        </button>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default UnderConstructionPopup;