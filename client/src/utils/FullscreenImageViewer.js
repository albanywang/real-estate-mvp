// Enhanced Fullscreen Image Popup Functionality with iPad Support
class FullscreenImageViewer {
  constructor() {
    this.isOpen = false;
    this.currentImageIndex = 0;
    this.images = [];
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    
    this.createOverlay();
    this.bindEvents();
  }

  createOverlay() {
    // Create the fullscreen overlay HTML with enhanced iPad support
    const overlayHTML = `
      <div class="fullscreen-image-overlay" id="fullscreenImageOverlay">
        <div class="fullscreen-image-container">
          <button class="fullscreen-close" id="fullscreenClose">
            <i class="fas fa-times"></i>
          </button>
          
          <button class="fullscreen-nav-btn fullscreen-prev-btn" id="fullscreenPrev">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button class="fullscreen-nav-btn fullscreen-next-btn" id="fullscreenNext">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <img class="fullscreen-image" id="fullscreenImage" alt="Fullscreen view">
          
          <div class="image-counter" id="imageCounter">1 / 1</div>
          
          <div class="fullscreen-zoom-controls">
            <button class="zoom-btn" id="zoomOut">
              <i class="fas fa-minus"></i>
            </button>
            <div class="zoom-info" id="zoomInfo">100%</div>
            <button class="zoom-btn" id="zoomIn">
              <i class="fas fa-plus"></i>
            </button>
            <button class="zoom-btn" id="zoomReset" title="Reset zoom and position">
              <i class="fas fa-expand-arrows-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    
    // Get references to elements
    this.overlay = document.getElementById('fullscreenImageOverlay');
    this.image = document.getElementById('fullscreenImage');
    this.closeBtn = document.getElementById('fullscreenClose');
    this.prevBtn = document.getElementById('fullscreenPrev');
    this.nextBtn = document.getElementById('fullscreenNext');
    this.zoomInBtn = document.getElementById('zoomIn');
    this.zoomOutBtn = document.getElementById('zoomOut');
    this.zoomResetBtn = document.getElementById('zoomReset');
    this.zoomInfo = document.getElementById('zoomInfo');
    this.imageCounter = document.getElementById('imageCounter');

    // Add enhanced styles for iPad
    this.addEnhancedStyles();
  }

  addEnhancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced fullscreen styles for iPad - Remove gray overlay */
      .fullscreen-image-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background-color: rgba(0, 0, 0, 0.95) !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 10000 !important;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        /* Remove any potential gray overlay */
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .fullscreen-image-overlay.active {
        opacity: 1 !important;
        visibility: visible !important;
      }

      .fullscreen-image-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        /* Ensure no background or overlay */
        background: transparent !important;
      }

      /* Remove any pseudo-elements that might create gray overlays */
      .fullscreen-image-overlay::before,
      .fullscreen-image-overlay::after,
      .fullscreen-image-container::before,
      .fullscreen-image-container::after {
        display: none !important;
        content: none !important;
      }

      /* Enhanced close button for iPad */
      .fullscreen-close {
        position: absolute !important;
        top: 20px !important;
        right: 20px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        color: #333 !important;
        border: none !important;
        border-radius: 50% !important;
        width: 60px !important;
        height: 60px !important;
        font-size: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 10001 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.3s ease !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
        /* Ensure no additional background */
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .fullscreen-close:hover {
        background: #ff4757 !important;
        color: white !important;
        transform: scale(1.1) !important;
      }

      /* Enhanced navigation buttons for iPad */
      .fullscreen-nav-btn {
        position: absolute !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        background: rgba(255, 255, 255, 0.95) !important;
        color: #333 !important;
        border: none !important;
        border-radius: 50% !important;
        width: 70px !important;
        height: 70px !important;
        font-size: 28px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 10001 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.3s ease !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
        /* Ensure no additional background */
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .fullscreen-prev-btn {
        left: 30px !important;
      }

      .fullscreen-next-btn {
        right: 30px !important;
      }

      .fullscreen-nav-btn:hover {
        background: white !important;
        transform: translateY(-50%) scale(1.1) !important;
      }

      /* Image counter for iPad */
      .image-counter {
        position: absolute !important;
        top: 30px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background: rgba(0, 0, 0, 0.8) !important;
        color: white !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
        font-size: 16px !important;
        font-weight: bold !important;
        z-index: 10001 !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* Enhanced zoom controls for iPad */
      .fullscreen-zoom-controls {
        position: absolute !important;
        bottom: 30px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        display: flex !important;
        gap: 8px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        padding: 12px 16px !important;
        border-radius: 25px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        z-index: 10001 !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .zoom-btn {
        background: transparent !important;
        border: none !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 16px !important;
        color: #333 !important;
        transition: background-color 0.2s !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
      }

      .zoom-btn:hover {
        background: rgba(0, 0, 0, 0.1) !important;
      }

      .zoom-info {
        display: flex !important;
        align-items: center !important;
        font-size: 14px !important;
        color: #666 !important;
        margin: 0 12px !important;
        min-width: 50px !important;
        justify-content: center !important;
        font-weight: bold !important;
      }

      /* Enhanced image styling - Remove any potential overlays */
      .fullscreen-image {
        max-width: 85vw !important;
        max-height: 85vh !important;
        object-fit: contain !important;
        cursor: grab !important;
        transition: transform 0.2s ease !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        /* Ensure no background or overlay on image */
        background: transparent !important;
        border: none !important;
        outline: none !important;
      }

      .fullscreen-image.zoomed {
        cursor: grab !important;
      }

      .fullscreen-image:active {
        cursor: grabbing !important;
      }

      /* Mobile/Tablet specific adjustments */
      @media (max-width: 1024px) {
        .fullscreen-close {
          top: 15px !important;
          right: 15px !important;
          width: 55px !important;
          height: 55px !important;
          font-size: 22px !important;
        }

        .fullscreen-nav-btn {
          width: 65px !important;
          height: 65px !important;
          font-size: 26px !important;
        }

        .fullscreen-prev-btn {
          left: 20px !important;
        }

        .fullscreen-next-btn {
          right: 20px !important;
        }

        .image-counter {
          top: 20px !important;
          font-size: 14px !important;
          padding: 6px 12px !important;
        }

        .fullscreen-zoom-controls {
          bottom: 20px !important;
          padding: 10px 14px !important;
        }

        .zoom-btn {
          width: 36px !important;
          height: 36px !important;
          font-size: 14px !important;
        }

        .zoom-info {
          font-size: 12px !important;
          margin: 0 8px !important;
          min-width: 40px !important;
        }

        /* iPad specific - ensure no gray overlay */
        .fullscreen-image-overlay {
          background-color: rgba(0, 0, 0, 0.98) !important;
        }
      }

      /* Prevent text selection and context menus */
      .fullscreen-image-overlay * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }

      /* Prevent zoom on double tap for iOS */
      .fullscreen-image-overlay {
        touch-action: manipulation !important;
      }

      /* Force remove any potential conflicting styles from other CSS */
      .fullscreen-image-overlay,
      .fullscreen-image-overlay *:not(.fullscreen-image) {
        box-sizing: border-box !important;
      }

      /* Remove any potential modal or dialog overlays */
      .fullscreen-image-overlay .modal-backdrop,
      .fullscreen-image-overlay .overlay,
      .fullscreen-image-overlay .backdrop {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // Close events
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    // Navigation events
    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.previousImage();
    });
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextImage();
    });
    
    // Zoom events
    this.zoomInBtn.addEventListener('click', () => this.zoomIn());
    this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
    this.zoomResetBtn.addEventListener('click', () => this.resetZoom());
    
    // Mouse wheel zoom
    this.image.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });
    
    // Touch events for swipe navigation
    this.bindTouchEvents();
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.previousImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
        case '+':
        case '=':
          this.zoomIn();
          break;
        case '-':
          this.zoomOut();
          break;
        case '0':
          this.resetZoom();
          break;
      }
    });
    
    // Touch and drag events for panning
    this.bindDragEvents();
  }

  bindTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    this.overlay.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    this.overlay.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
          this.previousImage(); // Swipe right = previous
        } else {
          this.nextImage(); // Swipe left = next
        }
      }
    });
  }

  bindDragEvents() {
    // Mouse events
    this.image.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());
    
    // Touch events for panning (separate from swipe)
    this.image.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && this.scale > 1) {
        this.startDrag(e.touches[0]);
      }
    });
    document.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        e.preventDefault();
        this.drag(e.touches[0]);
      }
    });
    document.addEventListener('touchend', () => this.endDrag());
  }

  startDrag(e) {
    if (this.scale <= 1) return;
    
    this.isDragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.image.style.cursor = 'grabbing';
  }

  drag(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.lastX;
    const deltaY = e.clientY - this.lastY;
    
    this.translateX += deltaX;
    this.translateY += deltaY;
    
    this.updateImageTransform();
    
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  endDrag() {
    this.isDragging = false;
    this.image.style.cursor = this.scale > 1 ? 'grab' : 'grab';
  }

  open(images, startIndex = 0) {
    this.images = images;
    this.currentImageIndex = startIndex;
    this.isOpen = true;
    
    this.loadCurrentImage();
    this.updateNavigation();
    this.updateImageCounter();
    this.resetZoom();
    
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  loadCurrentImage() {
    if (this.images.length === 0) return;
    
    const currentImage = this.images[this.currentImageIndex];
    this.image.src = currentImage;
    this.image.alt = `Image ${this.currentImageIndex + 1} of ${this.images.length}`;
  }

  updateNavigation() {
    const hasMultipleImages = this.images.length > 1;
    this.prevBtn.style.display = hasMultipleImages ? 'flex' : 'none';
    this.nextBtn.style.display = hasMultipleImages ? 'flex' : 'none';
  }

  updateImageCounter() {
    this.imageCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
    this.imageCounter.style.display = this.images.length > 1 ? 'block' : 'none';
  }

  previousImage() {
    if (this.images.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.loadCurrentImage();
    this.updateImageCounter();
    this.resetZoom();
  }

  nextImage() {
    if (this.images.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.loadCurrentImage();
    this.updateImageCounter();
    this.resetZoom();
  }

  zoomIn() {
    this.scale = Math.min(this.scale * 1.2, 5);
    this.updateImageTransform();
    this.updateZoomInfo();
  }

  zoomOut() {
    this.scale = Math.max(this.scale / 1.2, 0.5);
    this.updateImageTransform();
    this.updateZoomInfo();
  }

  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateImageTransform();
    this.updateZoomInfo();
  }

  updateImageTransform() {
    this.image.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
    this.image.classList.toggle('zoomed', this.scale > 1);
  }

  updateZoomInfo() {
    this.zoomInfo.textContent = `${Math.round(this.scale * 100)}%`;
  }
}

// Initialize the fullscreen viewer
const fullscreenViewer = new FullscreenImageViewer();

// Function to open fullscreen view
function openFullscreenImage(images, startIndex = 0) {
  fullscreenViewer.open(images, startIndex);
}

// Make sure these are available globally
window.fullscreenViewer = fullscreenViewer;
window.openFullscreenImage = openFullscreenImage;