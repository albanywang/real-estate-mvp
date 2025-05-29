// Fullscreen Image Popup Functionality
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
    // Create the fullscreen overlay HTML
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
  }

  bindEvents() {
    // Close events
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    // Navigation events
    this.prevBtn.addEventListener('click', () => this.previousImage());
    this.nextBtn.addEventListener('click', () => this.nextImage());
    
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

  bindDragEvents() {
    // Mouse events
    this.image.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());
    
    // Touch events
    this.image.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
    document.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        e.preventDefault();
        this.drag(e.touches[0]);
      }
    });
    document.addEventListener('touchend', () => this.endDrag());
  }

  startDrag(e) {
    if (this.scale <= 1) return; // Only allow dragging when zoomed in
    
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
    this.resetZoom();
    
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
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

  previousImage() {
    if (this.images.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.loadCurrentImage();
    this.resetZoom();
  }

  nextImage() {
    if (this.images.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.loadCurrentImage();
    this.resetZoom();
  }

  zoomIn() {
    this.scale = Math.min(this.scale * 1.2, 5); // Max 5x zoom
    this.updateImageTransform();
    this.updateZoomInfo();
  }

  zoomOut() {
    this.scale = Math.max(this.scale / 1.2, 0.5); // Min 0.5x zoom
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

// Function to open fullscreen view (to be called from your React component)
function openFullscreenImage(images, startIndex = 0) {
  fullscreenViewer.open(images, startIndex);
}

// Make sure these are available globally
window.fullscreenViewer = fullscreenViewer;
window.openFullscreenImage = openFullscreenImage;