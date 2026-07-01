// zoom.js - Generic image zoom and lightbox magnifier for Skinny Dog Yoga

const initZoom = () => {
  console.log("zoom.js: Initializing image zoom features...");
  // 1. Create Lightbox HTML dynamically if it doesn't exist
  if (!document.getElementById('lightbox-modal')) {
    const lightboxContainer = document.createElement('div');
    lightboxContainer.id = 'lightbox-modal';
    lightboxContainer.className = 'lightbox-overlay';
    lightboxContainer.setAttribute('tabindex', '-1');
    lightboxContainer.setAttribute('role', 'dialog');
    lightboxContainer.setAttribute('aria-hidden', 'true');
    lightboxContainer.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close-btn" id="lightbox-close-btn-el" aria-label="Close image">&times;</button>
        <div class="lightbox-body">
          <div class="magnifier-container" id="magnifier-container-el">
            <img src="" alt="" class="lightbox-image" id="lightbox-image-el">
            <div class="magnifier-lens" id="magnifier-lens-el"></div>
          </div>
          <div class="lightbox-caption" id="lightbox-caption-el"></div>
        </div>
      </div>
    `;
    document.body.appendChild(lightboxContainer);
  }

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image-el');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn-el');
  const lightboxCaption = document.getElementById('lightbox-caption-el');
  const magnifierLens = document.getElementById('magnifier-lens-el');

  // 2. Open Lightbox Zoom Modal
  window.openZoomLightbox = function(imgSrc, imgAlt = '') {
    if (!lightboxModal || !lightboxImg) return;
    
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    if (lightboxCaption) {
      lightboxCaption.textContent = imgAlt || 'Zoomed View';
    }

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Disable background scroll
  };

  // 3. Close Lightbox Zoom Modal
  const closeZoomLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    if (magnifierLens) {
      magnifierLens.style.display = 'none';
    }
    document.body.style.overflow = ''; // Restore background scroll
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeZoomLightbox);
  }
  
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      // Close on clicking backdrop
      if (e.target === lightboxModal || e.target === lightboxModal.querySelector('.lightbox-content') || e.target === lightboxModal.querySelector('.lightbox-body')) {
        closeZoomLightbox();
      }
    });
  }

  // Listen for Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeZoomLightbox();
    }
  });

  // 4. Magnifying Glass Logic (3.0x zoom)
  const zoomLevel = 3.0;

  const moveMagnifier = (e) => {
    if (!lightboxImg || !magnifierLens) return;
    const rect = lightboxImg.getBoundingClientRect();
    
    // Position of cursor relative to the image bounding box
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Keep cursor position inside the image bounds
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    if (y < 0) y = 0;
    if (y > rect.height) y = rect.height;

    // Show lens
    magnifierLens.style.display = 'block';

    // Position lens center at current cursor position (using styles.css transform center translation)
    magnifierLens.style.left = `${x}px`;
    magnifierLens.style.top = `${y}px`;

    // Display zoomed portion as background image
    magnifierLens.style.backgroundImage = `url("${lightboxImg.src}")`;
    magnifierLens.style.backgroundSize = `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`;

    // Calculate background offsets to center the lens focus
    const lensWidth = magnifierLens.offsetWidth || 260;
    const lensHeight = magnifierLens.offsetHeight || 260;
    const bgX = (x * zoomLevel) - (lensWidth / 2);
    const bgY = (y * zoomLevel) - (lensHeight / 2);
    magnifierLens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  };

  if (lightboxImg && magnifierLens) {
    lightboxImg.addEventListener('mousemove', moveMagnifier);
    magnifierLens.addEventListener('mousemove', moveMagnifier);

    lightboxImg.addEventListener('mouseleave', () => {
      magnifierLens.style.display = 'none';
    });
  }

  // 5. Auto-bind zoom behavior to main product image on product detail pages
  const bindMainProductImage = () => {
    const mainProductImg = document.getElementById('main-product-img');
    if (mainProductImg) {
      mainProductImg.style.cursor = 'zoom-in';
      mainProductImg.addEventListener('click', () => {
        openZoomLightbox(mainProductImg.src, mainProductImg.alt);
      });

      // Add a helper click-to-zoom instruction label below the image
      const parent = mainProductImg.parentElement;
      if (parent && !parent.querySelector('.click-to-enlarge-label')) {
        const label = document.createElement('div');
        label.className = 'click-to-enlarge-label';
        label.style.marginTop = '15px';
        label.style.fontSize = '0.85rem';
        label.style.color = '#777';
        label.style.cursor = 'pointer';
        label.style.textAlign = 'center';
        label.innerHTML = '<i class="fa-solid fa-search-plus" style="margin-right: 5px;"></i> Click image to zoom & inspect texture';
        label.addEventListener('click', () => {
          openZoomLightbox(mainProductImg.src, mainProductImg.alt);
        });
        parent.appendChild(label);
      }
    }
  };

  bindMainProductImage();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initZoom);
} else {
  initZoom();
}
