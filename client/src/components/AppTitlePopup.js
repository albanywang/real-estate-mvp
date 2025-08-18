import React, { useState } from 'react';

const AppTitlePopup = ({ isMobile, japanesePhrases }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'app-title-popup-overlay') {
      closePopup();
    }
  };

  return (
    <>
      {/* Clickable App Title */}
      <h1 
        className="app-title clickable" 
        onClick={openPopup}
        style={{ cursor: 'pointer' }}
      >
        {isMobile ? 'Real Estate' : japanesePhrases.appTitle}
      </h1>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="app-title-popup-overlay" onClick={handleOverlayClick}>
          <div className={`app-title-popup-content ${isMobile ? 'mobile' : ''}`}>
            <button 
              className="app-title-popup-close" 
              onClick={closePopup}
              aria-label="Close popup"
            >
              ×
            </button>
            
            <div className="app-title-popup-header">
              <h2>不動産検索プラットフォーム</h2>
            </div>
            
            <div className="app-title-popup-body">
              <p>日本市場向けの不動産検索プラットフォームを開発いたしました。</p>
              
              <div className="demo-link-section">
                <p><strong>デモサイト:</strong></p>
                <a 
                  href="https://real-estate-client-i3v9.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="demo-link"
                >
                  https://real-estate-client-i3v9.onrender.com/
                </a>
              </div>
              
              <p>実際にお試しいただき、もしご興味をお持ちいただけましたら：</p>
              
              <ul className="collaboration-list">
                <li>技術提携</li>
                <li>データ連携</li>
                <li>プラットフォーム買取</li>
              </ul>
              
              <p>などについてご相談させていただけますでしょうか。</p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <strong>王雷</strong>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:+19176476866">1-917-647-6866</a>
                  <span className="location">（ニューヨーク米国）</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:albanywang2000@gmail.com">albanywang2000@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppTitlePopup;