/* ==========================================================================
   Silver Paintbucket Studios - JavaScript Application Code
   ========================================================================== */

// 1. Painting Database
let paintingDatabase = {
  1: {
    id: 1,
    title: "Sunshine Valley",
    artist: "Elena Valerius",
    desc: "This stunning impasto piece captures the dynamic contrast of wild yellow buttercups and electric blue lupines in a sun-drenched valley. Created with a heavy palette knife technique, the thick oil layers create a textured surface that catches and plays with ambient light.",
    price: 245,
    image: "assets/paintings/painting_1.png",
    medium: "Oil on Stretched Canvas",
    dimensions: "24\" x 24\"",
    category: "Landscape"
  },
  2: {
    id: 2,
    title: "Dancing Blooms",
    artist: "Julian S. Thorne",
    desc: "A lighthearted, fluid watercolor painting showcasing cosmos and poppies swaying gently in a summer breeze. The artist uses custom-made high-texture paper and translucent layers of pigments to evoke a sense of weightless motion.",
    price: 190,
    image: "assets/paintings/painting_2.png",
    medium: "Watercolor on Arches Paper",
    dimensions: "18\" x 24\"",
    category: "Floral"
  },
  3: {
    id: 3,
    title: "Ocean Whisper",
    artist: "Mikaela Wu",
    desc: "A striking minimalist landscape that explores the quiet threshold between sky and water. Mikaela Wu blends dark charcoal acrylics with real silver dust to form a metallic horizon that reflects changing light conditions in the room.",
    price: 220,
    image: "assets/paintings/painting_3.png",
    medium: "Acrylic and Silver Dust on Wood Block",
    dimensions: "20\" x 20\"",
    category: "Minimalist"
  },
  4: {
    id: 4,
    title: "Colorful Abstract",
    artist: "Sarah J.",
    desc: "An explosive abstract expressionist piece filled with high-energy splatters of deep cobalt, brilliant magenta, and liquid gold leaf. The heavy, layered canvas celebrates the beauty of spontaneous creation and Bucky's favorite concept: messy genius.",
    price: 280,
    image: "assets/paintings/painting_4.png",
    medium: "Mixed Media on Canvas",
    dimensions: "30\" x 30\"",
    category: "Abstract"
  },
  5: {
    id: 5,
    title: "Midnight Jazz",
    artist: "Alex M.",
    desc: "An atmospheric cityscape that captures a saxophonist playing under a gaslamp in a rain-slicked alleyway. The reflection of glowing neon signs on wet cobblestones creates a rich tapestry of colors and shadows.",
    price: 310,
    image: "assets/paintings/painting_5.png",
    medium: "Oil on Linen Board",
    dimensions: "24\" x 30\"",
    category: "Urban / Moody"
  },
  6: {
    id: 6,
    title: "Serene Heights",
    artist: "Marcus Vance",
    desc: "A grand oil painting capturing a dramatic alpine sunrise. The first rays of morning light illuminate snow-capped peaks in golden hues, while a sea of clouds rolls gently through the pine valley below.",
    price: 350,
    image: "assets/paintings/painting_6.png",
    medium: "Oil on Stretched Canvas",
    dimensions: "36\" x 24\"",
    category: "Landscape"
  },
  7: {
    id: 7,
    title: "Golden Field",
    artist: "Elena Valerius",
    desc: "A companion piece to Sunshine Valley, this warm-toned study captures a golden wheat field at the peak of summer, with heavy impasto textures expressing the dense, sun-ripened stalks.",
    price: 260,
    image: "assets/paintings/painting_7.png",
    medium: "Oil on Canvas",
    dimensions: "20\" x 20\"",
    category: "Landscape"
  },
  8: {
    id: 8,
    title: "Spring Whispers",
    artist: "Julian S. Thorne",
    desc: "A delicate watercolor painting featuring soft pastel cherry blossoms and primroses. Thorne's precise brushwork captures the fragile, fleeting beauty of spring in an elegant, airy composition.",
    price: 180,
    image: "assets/paintings/painting_8.png",
    medium: "Watercolor on Paper",
    dimensions: "16\" x 20\"",
    category: "Floral"
  },
  9: {
    id: 9,
    title: "Midnight Tide",
    artist: "Mikaela Wu",
    desc: "A deep, contemplative sister piece to Ocean Whisper. This work emphasizes the deep indigo tones of the night ocean against a subtle, shimmering silver foil line that defines the coastal horizon.",
    price: 230,
    image: "assets/paintings/painting_9.png",
    medium: "Acrylic and Silver Foil on Wood",
    dimensions: "20\" x 20\"",
    category: "Minimalist"
  }
};

// 2. Shopping Cart System
let cart = [];

window.addToCart = function(paintingId, title, price) {
  cart.push({ id: paintingId, title: title, price: price });
  updateCartCount();
  showToast(title);
  
  // Animation effect on cart badge
  const cartBadge = document.getElementById('cart-badge-container');
  cartBadge.classList.add('jiggle');
  setTimeout(() => {
    cartBadge.classList.remove('jiggle');
  }, 2500);
};

// ==========================================================================
// Global Layout Syncing (kvdb.io integration) & CMS Renderers
// ==========================================================================

const DATABASE_URL = 'https://kvdb.io/spb_studios_cfg_2026_dbx1/settings';
let isApplyingStyles = false;
const root = document.documentElement;
const cssResetBtn = document.getElementById('css-reset-btn-el');

// --- Dynamic Content Rendering & Pagination State ---
let currentPage = 1;
const itemsPerPage = 9;
let currentCardStyles = []; // Cache layout customizer styles from kvdb.io
let paintingOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];



function renderPaginationControls(totalPages) {
  const pagEl = document.querySelector('.gallery-pagination');
  if (!pagEl) return;
  pagEl.innerHTML = '';

  pagEl.style.display = 'flex';

  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `pag-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderPaintings();
      const targetSec = document.getElementById('gallery-section');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
    pagEl.appendChild(btn);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pag-btn next-btn';
    nextBtn.innerHTML = 'Next <i class="fa-solid fa-angle-right"></i>';
    nextBtn.addEventListener('click', () => {
      currentPage++;
      renderPaintings();
      const targetSec = document.getElementById('gallery-section');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
    pagEl.appendChild(nextBtn);
  }
}

window.renderPaintings = function() {
  const gridEl = document.getElementById('paintings-grid-el');
  if (!gridEl) return;

  const activeFilterBtn = document.querySelector('.filter-btn.active');
  const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

  // Re-synchronize paintingOrder with paintingDatabase keys
  const allPaintings = [];
  paintingOrder.forEach(id => {
    if (paintingDatabase[id]) {
      allPaintings.push(paintingDatabase[id]);
    }
  });
  Object.keys(paintingDatabase).forEach(id => {
    const numId = Number(id);
    if (!paintingOrder.includes(numId)) {
      paintingOrder.push(numId);
      allPaintings.push(paintingDatabase[numId]);
    }
  });

  const filteredPaintings = allPaintings.filter(p => {
    return activeFilter === 'all' || p.category.toLowerCase() === activeFilter;
  });

  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pagePaintings = filteredPaintings.slice(startIdx, startIdx + itemsPerPage);

  gridEl.innerHTML = '';
  
  pagePaintings.forEach(painting => {
    const card = document.createElement('article');
    card.className = 'painting-card theme-light';
    card.setAttribute('data-category', painting.category.toLowerCase());
    card.setAttribute('data-id', painting.id);
    
    card.innerHTML = `
      <div class="card-header">
        <h3 class="painting-title">${painting.title}</h3>
      </div>
      <div class="painting-image-wrapper frame-wood">
        <img src="${painting.image}" alt="${painting.title} - ${painting.medium}" class="painting-img" loading="lazy">
        <div class="card-overlay">
          <button class="btn-view-overlay" onclick="openPaintingModal(${painting.id})"><i class="fa-solid fa-expand"></i> View Details</button>
        </div>
      </div>
      <div class="card-body">
        <p class="artist-name"><a href="javascript:void(0)" class="artist-link" onclick="openArtistModal('${painting.artist.replace(/'/g, "\\'")}')">${painting.artist}</a></p>
        <p class="painting-desc">${painting.medium}</p>
        <div class="card-footer">
          <span class="price">$${painting.price}</span>
          <div class="card-actions">
            <a href="javascript:void(0)" class="link-view" onclick="openPaintingModal(${painting.id})">View Painting</a>
            <button class="btn-add-cart" onclick="addToCart(${painting.id}, '${painting.title.replace(/'/g, "\\'")}', ${painting.price})"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
      </div>
    `;
    gridEl.appendChild(card);
  });

  renderPaginationControls(totalPages);
  applyLoadedCardStyles();
};

window.renderArtists = function() {
  const gridEl = document.getElementById('artists-grid-el');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  
  Object.values(artistDatabase).forEach(artist => {
    const avatar = artist.image || 'assets/artists/default_avatar.png';
    const card = document.createElement('div');
    card.className = 'artist-profile-card';
    card.setAttribute('onclick', `openArtistModal('${artist.name.replace(/'/g, "\\'")}')`);
    
    card.innerHTML = `
      <div class="artist-avatar-wrapper">
        <img src="${avatar}" alt="${artist.name} Profile Picture" class="artist-avatar">
      </div>
      <h3 class="artist-profile-title">${artist.name}</h3>
      <p class="artist-medium">${artist.style}</p>
      <p class="artist-bio">${artist.ideas || artist.philosophy}</p>
    `;
    gridEl.appendChild(card);
  });
};

window.populateSelectors = function() {
  const filterTargetSel = document.getElementById('custom-filter-target');
  if (filterTargetSel) {
    const currentValue = filterTargetSel.value;
    filterTargetSel.innerHTML = '<option value="all">All Paintings (Default)</option>';
    
    // Populate ordered paintings in the selector
    paintingOrder.forEach(id => {
      const p = paintingDatabase[id];
      if (p) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.title;
        filterTargetSel.appendChild(opt);
      }
    });

    if (paintingDatabase[currentValue] || currentValue === 'all') {
      filterTargetSel.value = currentValue;
    } else {
      filterTargetSel.value = 'all';
    }
  }

  const cmsArtistSel = document.getElementById('cms-painting-artist');
  if (cmsArtistSel) {
    cmsArtistSel.innerHTML = '';
    Object.values(artistDatabase).forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.name;
      opt.textContent = a.name;
      cmsArtistSel.appendChild(opt);
    });
  }
};

window.renderCmsLists = function() {
  const pList = document.getElementById('cms-paintings-list');
  const aList = document.getElementById('cms-artists-list');
  if (!pList || !aList) return;

  pList.innerHTML = '';
  aList.innerHTML = '';

  // Render paintings in order with sorting arrows
  paintingOrder.forEach((id, index) => {
    const p = paintingDatabase[id];
    if (!p) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <span style="max-width: 140px; display: inline-block;">${p.title} (${p.artist})</span>
      <div class="cms-item-actions">
        <button class="cms-btn-sort" onclick="movePaintingUp(${p.id})" title="Move Up" ${index === 0 ? 'disabled style="opacity: 0.3; cursor: default;"' : ''}>
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button class="cms-btn-sort" onclick="movePaintingDown(${p.id})" title="Move Down" ${index === paintingOrder.length - 1 ? 'disabled style="opacity: 0.3; cursor: default;"' : ''}>
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button class="cms-btn-delete" onclick="handleCmsDeletePainting(${p.id})" title="Delete Painting">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
    pList.appendChild(li);
  });

  Object.values(artistDatabase).forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${a.name}</span>
      <button class="cms-btn-delete" onclick="handleCmsDeleteArtist('${a.name.replace(/'/g, "\\'")}')" title="Delete Artist">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    aList.appendChild(li);
  });
};

// --- Image Compression and Downscaling ---
function resizeAndConvertImage(file, maxDimension = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}



// --- Helper to Apply Loaded Configuration ---
function applyLoadedConfig(data) {
  if (!data) return;

  if (data.paintingDatabase && Object.keys(data.paintingDatabase).length > 0) {
    paintingDatabase = data.paintingDatabase;
  }
  if (data.artistDatabase && Object.keys(data.artistDatabase).length > 0) {
    artistDatabase = data.artistDatabase;
  }
  if (data.paintingOrder && data.paintingOrder.length > 0) {
    paintingOrder = data.paintingOrder;
  } else {
    paintingOrder = Object.keys(paintingDatabase).map(Number);
  }

  currentCardStyles = data.cardStyles || [];

  // Re-render components with newly loaded DB data
  renderPaintings();
  renderArtists();
  populateSelectors();
  renderCmsLists();

  if (!data.rootStyles) return;

  if (localStorage.getItem('bucky_admin_unlocked') === 'true' && document.getElementById('css-control-panel-el').classList.contains('open')) {
    return;
  }

  isApplyingStyles = true;

  // Apply root variables
  Object.keys(data.rootStyles).forEach(varName => {
    root.style.setProperty(varName, data.rootStyles[varName]);
  });

  // Clear existing card overrides first
  document.querySelectorAll('.painting-card').forEach(card => {
    card.style.cssText = '';
    card.classList.remove('theme-light');
    const wrapper = card.querySelector('.painting-image-wrapper');
    if (wrapper) {
      wrapper.classList.remove('frame-silver', 'frame-gold', 'frame-wood');
    }
  });

  // Sync customizer UI inputs
  if (data.inputValues) {
    Object.keys(data.inputValues).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = data.inputValues[id];
        
        const spanId = 'val-' + id.replace('custom-', '');
        const valSpan = document.getElementById(spanId);
        if (valSpan) {
          let suffix = '';
          if (id.includes('margin') || id.includes('radius') || id.includes('border') || id.includes('size')) suffix = 'px';
          else if (id.includes('brightness') || id.includes('contrast') || id.includes('saturation')) suffix = '%';
          else if (id.includes('hue')) suffix = '°';
          valSpan.textContent = el.value + suffix;
        }
      }
    });
  }

  isApplyingStyles = false;
}

// --- Sorting Helpers ---
window.movePaintingUp = function(id) {
  const index = paintingOrder.indexOf(id);
  if (index > 0) {
    paintingOrder[index] = paintingOrder[index - 1];
    paintingOrder[index - 1] = id;
    
    renderPaintings();
    renderCmsLists();
    saveGalleryStyles();
  }
};

window.movePaintingDown = function(id) {
  const index = paintingOrder.indexOf(id);
  if (index >= 0 && index < paintingOrder.length - 1) {
    paintingOrder[index] = paintingOrder[index + 1];
    paintingOrder[index + 1] = id;
    
    renderPaintings();
    renderCmsLists();
    saveGalleryStyles();
  }
};

function applyLoadedCardStyles() {
  if (!currentCardStyles) return;
  currentCardStyles.forEach(c => {
    const card = document.querySelector(`.painting-card[data-id="${c.id}"]`);
    if (card) {
      if (c.overrides) {
        Object.keys(c.overrides).forEach(varName => {
          card.style.setProperty(varName, c.overrides[varName]);
        });
      }
      if (c.isLight) {
        card.classList.add('theme-light');
      } else {
        card.classList.remove('theme-light');
      }
      const wrapper = card.querySelector('.painting-image-wrapper');
      if (wrapper) {
        wrapper.classList.remove('frame-silver', 'frame-gold', 'frame-wood');
        if (c.frameClass && c.frameClass !== 'none') {
          wrapper.classList.add(c.frameClass);
        }
      }
    }
  });
}

window.saveGalleryStyles = function() {
  if (localStorage.getItem('bucky_admin_unlocked') !== 'true') return;
  if (isApplyingStyles) return;

  const variables = [
    '--card-margin', '--card-radius', '--card-border-width', '--card-border-color',
    '--card-bg', '--card-shadow', '--card-glow-color', '--card-glow-size',
    '--card-padding', '--card-img-radius', '--card-img-height',
    '--card-img-object-fit', '--card-font-family', '--card-title-size',
    '--card-title-color', '--card-artist-size', '--card-artist-color',
    '--card-price-size', '--card-price-color', '--card-btn-bg',
    '--card-btn-color', '--card-btn-radius'
  ];

  const rootStyles = {};
  variables.forEach(varName => {
    rootStyles[varName] = root.style.getPropertyValue(varName) || getComputedStyle(root).getPropertyValue(varName).trim();
  });

  const inputValues = {};
  const inputsToSave = [
    'custom-margin', 'custom-radius', 'custom-frame', 'custom-bg-color',
    'custom-card-bg', 'custom-frame-border', 'custom-frame-margin',
    'custom-filter-target', 'custom-brightness', 'custom-contrast',
    'custom-saturation', 'custom-hue', 'custom-glow-color', 'custom-glow-size'
  ];
  inputsToSave.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      inputValues[id] = el.value;
    }
  });

  const payload = {
    rootStyles,
    cardStyles: currentCardStyles,
    inputValues,
    paintingDatabase,
    artistDatabase,
    paintingOrder,
    timestamp: Date.now()
  };

  // Save to Local Storage immediately as a secure backup
  localStorage.setItem('spb_gallery_data', JSON.stringify(payload));

  // Also POST to online database
  fetch(DATABASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).catch(err => console.warn('Error saving styles to database:', err));
};

window.loadGalleryStyles = function() {
  // First load from localStorage to prevent loss of newly added data
  const localDataStr = localStorage.getItem('spb_gallery_data');
  if (localDataStr) {
    try {
      const localData = JSON.parse(localDataStr);
      applyLoadedConfig(localData);
      console.log('Loaded configurations from localStorage backup.');
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
  }

  // Fetch online settings to merge/sync
  fetch(DATABASE_URL)
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => {
      if (!data) return;

      // Only apply online data if it is newer than local storage data
      const localDataStr = localStorage.getItem('spb_gallery_data');
      if (localDataStr) {
        try {
          const localData = JSON.parse(localDataStr);
          if (data.timestamp && localData.timestamp && data.timestamp < localData.timestamp) {
            console.log('Local storage data is newer than online database. Keeping local data.');
            return;
          }
        } catch (e) {}
      }

      applyLoadedConfig(data);
      console.log('Synced with online database successfully.');
    })
    .catch(err => {});
};

// Hook into Customizer changes to auto-save
const inputControls = [
  'custom-margin', 'custom-radius', 'custom-frame', 'custom-bg-color',
  'custom-card-bg', 'custom-frame-border', 'custom-frame-margin',
  'custom-brightness', 'custom-contrast', 'custom-saturation',
  'custom-hue', 'custom-glow-color', 'custom-glow-size'
];
inputControls.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(eventType, () => {
      clearTimeout(window.saveStylesDebounce);
      window.saveStylesDebounce = setTimeout(saveGalleryStyles, 500);
    });
  }
});

// Sync after reset button click
if (cssResetBtn) {
  cssResetBtn.addEventListener('click', () => {
    setTimeout(saveGalleryStyles, 100);
  });
}

// Load styles initially on page load
document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top on refresh
  if ('history' in window && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Initial render from defaults
  renderPaintings();
  renderArtists();
  populateSelectors();
  renderCmsLists();

  loadGalleryStyles();
  setInterval(loadGalleryStyles, 5000);
});

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = cart.length;
  }
}

// 3. Toast Notifications
function showToast(paintingTitle) {
  const container = document.getElementById('toast-container-el');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast cart-added';
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <span><strong>${paintingTitle}</strong> added to collection!</span>
  `;
  
  container.appendChild(toast);
  
  // Slide out and remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// Add CSS toastFadeOut dynamically if needed, or define in styles.css.
// Defining animation styles inline for fallback
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes toastFadeOut {
    to {
      transform: translateY(20px);
      opacity: 0;
    }
  }
  .jiggle {
    animation: jiggleAnim 0.5s ease-in-out;
  }
  @keyframes jiggleAnim {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1) rotate(-3deg); }
    50% { transform: scale(0.95) rotate(3deg); }
    75% { transform: scale(1.05) rotate(-1deg); }
  }
`;
document.head.appendChild(styleSheet);

// 4. Painting Modal Controller
const modal = document.getElementById('detail-modal');
const modalCloseBtn = document.getElementById('modal-close-btn-el');
let lastActiveElement = null;

window.openPaintingModal = function(id) {
  const painting = paintingDatabase[id];
  if (!painting || !modal) return;
  
  // Keep track of focused element for accessibility
  lastActiveElement = document.activeElement;
  
  // Set modal content
  const modalImg = document.getElementById('modal-painting-image');
  modalImg.src = painting.image;
  modalImg.alt = `${painting.title} - ${painting.artist}`;
  
  // Copy painting filters to modal image
  const card = document.querySelector(`.painting-card[data-id="${id}"]`);
  if (card && modalImg) {
    const filtersToSync = [
      { varName: '--painting-brightness' },
      { varName: '--painting-contrast' },
      { varName: '--painting-saturate' },
      { varName: '--painting-hue-rotate' }
    ];
    filtersToSync.forEach(item => {
      const val = card.style.getPropertyValue(item.varName) || '';
      if (val) {
        modalImg.style.setProperty(item.varName, val);
      } else {
        modalImg.style.removeProperty(item.varName);
      }
    });
  }
  document.getElementById('modal-artist-name').textContent = painting.artist;
  document.getElementById('modal-painting-title').textContent = painting.title;
  document.getElementById('modal-painting-category').textContent = painting.category;
  document.getElementById('modal-medium').textContent = painting.medium;
  document.getElementById('modal-dimensions').textContent = painting.dimensions;
  document.getElementById('modal-painting-desc').textContent = painting.desc;
  document.getElementById('modal-price').textContent = `$${painting.price}`;
  
  // Wire up the add to cart button in the modal
  const buyBtn = document.getElementById('modal-add-to-cart-btn');
  // Remove existing listeners by replacing button with a clone
  const newBuyBtn = buyBtn.cloneNode(true);
  buyBtn.parentNode.replaceChild(newBuyBtn, buyBtn);
  
  newBuyBtn.addEventListener('click', () => {
    addToCart(painting.id, painting.title, painting.price);
  });
  
  // Open modal
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus on modal close button or purchase button
  newBuyBtn.focus();
  
  // Listen for escape key
  document.addEventListener('keydown', handleEscClose);
}

window.closePaintingModal = function() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  // Restore focus
  if (lastActiveElement) {
    lastActiveElement.focus();
  }
  
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(e) {
  if (e.key === 'Escape') {
    closePaintingModal();
  }
}

// Wire modal close actions
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closePaintingModal);
}
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePaintingModal();
    }
  });
}

// 5. Gallery Filtering
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    currentPage = 1; // Reset to page 1 on filter change
    renderPaintings();
  });
});

// 6. Mobile Menu Toggle
const mobileNavBtn = document.getElementById('mobile-nav-btn');
const mainNav = document.getElementById('main-nav');

if (mobileNavBtn && mainNav) {
  mobileNavBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    const icon = mobileNavBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });
  
  // Close menu when clicking nav item
  const navItems = mainNav.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mainNav.classList.remove('open');
      const icon = mobileNavBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });
}

// 7. Navigation Highlighting on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item:not(.cart-btn)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href === `#${current}` || (current === 'gallery-section' && href === '#gallery')) {
      item.classList.add('active');
    }
  });
});

// 8. Contact Form Submission Mock
function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.elements['name'].value;
  const email = form.elements['email'].value;
  const subject = form.elements['subject'].value;
  const message = form.elements['message'].value;
  
  // Simple check
  if (!name || !email || !subject || !message) return;
  
  // Show a toast that message was sent!
  const container = document.getElementById('toast-container-el');
  if (container) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderColor = '#3b82f6';
    toast.innerHTML = `
      <i class="fa-solid fa-paper-plane" style="color: #3b82f6;"></i>
      <span>Message sent successfully to Bucky!</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3000);
  }
  
  // Reset form
  form.reset();
}

// 9. CSS Control Panel Customizer Logic
const cssPanel = document.getElementById('css-control-panel-el');
const cssPanelToggle = document.getElementById('css-panel-toggle-btn');
const cssPanelClose = document.getElementById('css-panel-close-btn');

// Toggle Open/Close panel or open login modal
if (cssPanelToggle && cssPanel) {
  cssPanelToggle.addEventListener('click', () => {
    const isUnlocked = localStorage.getItem('bucky_admin_unlocked') === 'true';
    if (isUnlocked) {
      cssPanel.classList.toggle('open');
    } else {
      openAdminLogin();
    }
  });
}
if (cssPanelClose && cssPanel) {
  cssPanelClose.addEventListener('click', () => {
    cssPanel.classList.remove('open');
  });
}


// Close panel when clicking off / outside
document.addEventListener('click', (e) => {
  if (cssPanel && cssPanel.classList.contains('open')) {
    if (!cssPanel.contains(e.target) && !cssPanelToggle.contains(e.target) && !e.target.closest('.painting-card')) {
      cssPanel.classList.remove('open');
    }
  }
});

// Bind sliders to CSS custom variables on :root or individual cards
const filterTargetSelect = document.getElementById('custom-filter-target');
const resetTargetBtn = document.getElementById('css-reset-target-btn');

const slidersToSync = [
  { id: 'custom-margin', varName: '--painting-padding', suffix: 'px' },
  { id: 'custom-radius', varName: '--painting-radius', suffix: 'px' },
  { id: 'custom-brightness', varName: '--painting-brightness', suffix: '%' },
  { id: 'custom-contrast', varName: '--painting-contrast', suffix: '%' },
  { id: 'custom-saturation', varName: '--painting-saturate', suffix: '%' },
  { id: 'custom-hue', varName: '--painting-hue-rotate', suffix: 'deg' },
  { id: 'custom-frame-border', varName: '--frame-border-width', suffix: 'px' },
  { id: 'custom-frame-margin', varName: '--frame-margin', suffix: 'px' }
];

function syncSlidersToTarget() {
  const target = filterTargetSelect ? filterTargetSelect.value : 'all';
  
  // Highlight active target card
  document.querySelectorAll('.painting-card').forEach(card => {
    card.classList.remove('customizer-active-target');
  });
  
  if (target !== 'all') {
    const activeCard = document.querySelector(`.painting-card[data-id="${target}"]`);
    if (activeCard) {
      activeCard.classList.add('customizer-active-target');
    }
    if (resetTargetBtn) resetTargetBtn.style.display = 'inline-block';
  } else {
    if (resetTargetBtn) resetTargetBtn.style.display = 'none';
  }
  
  slidersToSync.forEach(item => {
    const slider = document.getElementById(item.id);
    const valSpan = document.getElementById('val-' + item.id.replace('custom-', ''));
    if (!slider) return;
    
    let currentVal = '';
    if (target === 'all') {
      currentVal = root.style.getPropertyValue(item.varName) || getComputedStyle(root).getPropertyValue(item.varName);
    } else {
      const card = document.querySelector(`.painting-card[data-id="${target}"]`);
      if (card) {
        currentVal = card.style.getPropertyValue(item.varName) || root.style.getPropertyValue(item.varName) || getComputedStyle(root).getPropertyValue(item.varName);
      }
    }
    
    if (currentVal) {
      const numVal = parseInt(currentVal.replace(item.suffix, '').trim(), 10);
      if (!isNaN(numVal)) {
        slider.value = numVal;
        if (valSpan) {
          valSpan.textContent = numVal + item.suffix;
        }
      }
    }
  });
}

if (filterTargetSelect) {
  filterTargetSelect.addEventListener('change', syncSlidersToTarget);
}

// Bind card clicks to select target painting cell via event delegation
const gridEl = document.getElementById('paintings-grid-el');
if (gridEl) {
  gridEl.addEventListener('click', (e) => {
    const card = e.target.closest('.painting-card');
    if (!card) return;
    
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.modal-overlay')) {
      return;
    }
    
    const id = card.getAttribute('data-id');
    if (id && filterTargetSelect) {
      if (cssPanel && !cssPanel.classList.contains('open')) {
        return;
      }
      filterTargetSelect.value = id;
      syncSlidersToTarget();
      
      // Auto expand filters section if collapsed
      const filtersSection = document.getElementById('section-filters');
      if (filtersSection && filtersSection.classList.contains('collapsed')) {
        filtersSection.classList.remove('collapsed');
      }
      
      const filterSection = document.querySelector('.css-control-panel');
      if (filterSection) {
        // Scroll target select and filters into view in customizer panel
        filterSection.scrollTop = 150;
      }
    }
  });
}

// Bind reset single target override
if (resetTargetBtn) {
  resetTargetBtn.addEventListener('click', () => {
    const target = filterTargetSelect ? filterTargetSelect.value : 'all';
    if (target !== 'all') {
      const card = document.querySelector(`.painting-card[data-id="${target}"]`);
      if (card) {
        slidersToSync.forEach(item => {
          card.style.removeProperty(item.varName);
        });
        syncSlidersToTarget();
        
        // Show success toast for single card reset
        const container = document.getElementById('toast-container-el');
        if (container) {
          const title = card.querySelector('.painting-title')?.textContent || 'Painting';
          const toast = document.createElement('div');
          toast.className = 'toast';
          toast.style.borderColor = '#10b981';
          toast.innerHTML = `
            <i class="fa-solid fa-rotate-left" style="color: #10b981;"></i>
            <span>Reset filters for <strong>${title}</strong></span>
          `;
          container.appendChild(toast);
          setTimeout(() => {
            toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => {
              toast.remove();
            }, 400);
          }, 2500);
        }
      }
    }
  });
}

// Helper to manage cache overrides for paginated elements
function setCardStyleOverride(cardId, varName, value) {
  let c = currentCardStyles.find(item => item.id == cardId);
  if (!c) {
    c = { id: cardId.toString(), overrides: {}, frameClass: '', isLight: true };
    currentCardStyles.push(c);
  }
  if (!c.overrides) c.overrides = {};
  if (value === null || value === undefined) {
    delete c.overrides[varName];
  } else {
    c.overrides[varName] = value;
  }
}

function setCardFrameOverride(cardId, frameClass) {
  let c = currentCardStyles.find(item => item.id == cardId);
  if (!c) {
    c = { id: cardId.toString(), overrides: {}, frameClass: '', isLight: true };
    currentCardStyles.push(c);
  }
  c.frameClass = frameClass;
}

function setCardLightOverride(cardId, isLight) {
  let c = currentCardStyles.find(item => item.id == cardId);
  if (!c) {
    c = { id: cardId.toString(), overrides: {}, frameClass: '', isLight: true };
    currentCardStyles.push(c);
  }
  c.isLight = isLight;
}

// Helper to bind input slider
function bindCssVar(sliderId, cssVarName, suffix = '') {
  const slider = document.getElementById(sliderId);
  const valSpan = document.getElementById('val-' + sliderId.replace('custom-', ''));
  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    const target = filterTargetSelect ? filterTargetSelect.value : 'all';
    
    if (target === 'all') {
      root.style.setProperty(cssVarName, val + suffix);
    } else {
      const card = document.querySelector(`.painting-card[data-id="${target}"]`);
      if (card) {
        card.style.setProperty(cssVarName, val + suffix);
      }
      setCardStyleOverride(target, cssVarName, val + suffix);
    }
    
    if (valSpan) {
      valSpan.textContent = val + suffix;
    }
  });
}

// Bind range sliders
bindCssVar('custom-margin', '--painting-padding', 'px');
bindCssVar('custom-radius', '--painting-radius', 'px');
bindCssVar('custom-brightness', '--painting-brightness', '%');
bindCssVar('custom-contrast', '--painting-contrast', '%');
bindCssVar('custom-saturation', '--painting-saturate', '%');
bindCssVar('custom-hue', '--painting-hue-rotate', 'deg');
bindCssVar('custom-glow-size', '--mascot-glow-size', 'px');
bindCssVar('custom-frame-border', '--frame-border-width', 'px');
bindCssVar('custom-frame-margin', '--frame-margin', 'px');

// Bind Bucky's Glow color dropdown
const glowColorSelect = document.getElementById('custom-glow-color');
if (glowColorSelect) {
  glowColorSelect.addEventListener('change', (e) => {
    root.style.setProperty('--mascot-glow-color', e.target.value);
  });
}

// Bind Painting Frame selector
const frameSelect = document.getElementById('custom-frame');
if (frameSelect) {
  frameSelect.addEventListener('change', (e) => {
    const selectedFrame = e.target.value;
    const target = filterTargetSelect ? filterTargetSelect.value : 'all';
    
    if (target === 'all') {
      const wrappers = document.querySelectorAll('.painting-image-wrapper');
      wrappers.forEach(wrapper => {
        wrapper.classList.remove('frame-silver', 'frame-gold', 'frame-wood');
        if (selectedFrame !== 'none') {
          wrapper.classList.add('frame-' + selectedFrame);
        }
      });
    } else {
      const card = document.querySelector(`.painting-card[data-id="${target}"]`);
      if (card) {
        const wrapper = card.querySelector('.painting-image-wrapper');
        if (wrapper) {
          wrapper.classList.remove('frame-silver', 'frame-gold', 'frame-wood');
          if (selectedFrame !== 'none') {
            wrapper.classList.add('frame-' + selectedFrame);
          }
        }
      }
      setCardFrameOverride(target, selectedFrame !== 'none' ? 'frame-' + selectedFrame : 'none');
    }
  });
}

// Auto-activate frame style if width is adjusted when currently set to none
const frameBorderSlider = document.getElementById('custom-frame-border');
if (frameBorderSlider) {
  frameBorderSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0 && frameSelect && frameSelect.value === 'none') {
      frameSelect.value = 'silver';
      frameSelect.dispatchEvent(new Event('change'));
    }
  });
}

// Bind Painting Matting Background Color selector
const bgColorSelect = document.getElementById('custom-bg-color');
if (bgColorSelect) {
  bgColorSelect.addEventListener('change', (e) => {
    root.style.setProperty('--painting-bg-color', e.target.value);
  });
}

// Bind Painting Card (Cell) Background Color selector
const cardBgSelect = document.getElementById('custom-card-bg');
if (cardBgSelect) {
  cardBgSelect.addEventListener('change', (e) => {
    const selectedVal = e.target.value;
    const target = filterTargetSelect ? filterTargetSelect.value : 'all';
    const isLight = ['#dbeafe', '#eddcd2', '#d8f3dc'].includes(selectedVal);
    
    if (target === 'all') {
      root.style.setProperty('--card-bg-color', selectedVal);
      const cards = document.querySelectorAll('.painting-card');
      cards.forEach(card => {
        if (isLight) {
          card.classList.add('theme-light');
        } else {
          card.classList.remove('theme-light');
        }
      });
    } else {
      const card = document.querySelector(`.painting-card[data-id="${target}"]`);
      if (card) {
        card.style.setProperty('--card-bg-color', selectedVal);
        if (isLight) {
          card.classList.add('theme-light');
        } else {
          card.classList.remove('theme-light');
        }
      }
      setCardStyleOverride(target, '--card-bg-color', selectedVal);
      setCardLightOverride(target, isLight);
    }
  });
}

// Bind Reset customizer button
if (cssResetBtn) {
  cssResetBtn.addEventListener('click', () => {
    // Reset ranges in DOM
    document.getElementById('custom-margin').value = 16;
    document.getElementById('custom-radius').value = 4;
    document.getElementById('custom-brightness').value = 100;
    document.getElementById('custom-contrast').value = 100;
    document.getElementById('custom-saturation').value = 100;
    document.getElementById('custom-hue').value = 0;
    document.getElementById('custom-glow-size').value = 25;
    document.getElementById('custom-frame-border').value = 4;
    document.getElementById('custom-frame-margin').value = 12;
    
    // Clear all card-level filter overrides
    currentCardStyles = [];
    document.querySelectorAll('.painting-card').forEach(card => {
      slidersToSync.forEach(item => {
        card.style.removeProperty(item.varName);
      });
      card.classList.remove('customizer-active-target');
    });
    if (filterTargetSelect) {
      filterTargetSelect.value = 'all';
    }
    if (resetTargetBtn) {
      resetTargetBtn.style.display = 'none';
    }
    
    // Reset select inputs
    if (frameSelect) frameSelect.value = 'wood';
    if (glowColorSelect) glowColorSelect.value = 'rgba(138, 43, 226, 0.65)';
    if (bgColorSelect) bgColorSelect.value = '#001f54';
    if (cardBgSelect) cardBgSelect.value = '#eddcd2';
    
    // Reset values in span elements
    document.getElementById('val-margin').textContent = '16px';
    document.getElementById('val-radius').textContent = '4px';
    document.getElementById('val-brightness').textContent = '100%';
    document.getElementById('val-contrast').textContent = '100%';
    document.getElementById('val-saturation').textContent = '100%';
    document.getElementById('val-hue').textContent = '0°';
    document.getElementById('val-glow-size').textContent = '25px';
    document.getElementById('val-frame-border').textContent = '4px';
    document.getElementById('val-frame-margin').textContent = '12px';
    
    // Reset CSS variables
    root.style.setProperty('--painting-padding', '16px');
    root.style.setProperty('--painting-radius', '4px');
    root.style.setProperty('--painting-bg-color', '#001f54');
    root.style.setProperty('--card-bg-color', '#eddcd2');
    root.style.setProperty('--frame-border-width', '4px');
    root.style.setProperty('--frame-margin', '12px');
    root.style.setProperty('--painting-brightness', '100%');
    root.style.setProperty('--painting-contrast', '100%');
    root.style.setProperty('--painting-saturate', '100%');
    root.style.setProperty('--painting-hue-rotate', '0deg');
    root.style.setProperty('--mascot-glow-size', '25px');
    root.style.setProperty('--mascot-glow-color', 'rgba(138, 43, 226, 0.65)');
    
    // Reset wrapper frame classes and card light theme classes
    const wrappers = document.querySelectorAll('.painting-image-wrapper');
    wrappers.forEach(wrapper => {
      wrapper.classList.remove('frame-silver', 'frame-gold', 'frame-wood');
      wrapper.classList.add('frame-wood');
    });
    
    const cards = document.querySelectorAll('.painting-card');
    cards.forEach(card => {
      card.classList.remove('theme-light');
      card.classList.add('theme-light');
    });
    
    // Show feedback toast
    const container = document.getElementById('toast-container-el');
    if (container) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.style.borderColor = '#10b981';
      toast.innerHTML = `
        <i class="fa-solid fa-rotate-left" style="color: #10b981;"></i>
        <span>Customizer parameters reset successfully!</span>
      `;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          toast.remove();
        }, 400);
      }, 2500);
    }
  });
}

// Interactive Bucky Mascot Switcher
window.switchBuckyCategory = function(category) {
  // Update active tab button
  const tabs = document.querySelectorAll('.bucky-tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('onclick').includes(category)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Toggle lists
  const lists = document.querySelectorAll('.bucky-pose-list');
  lists.forEach(list => {
    if (list.id === category + '-list') {
      list.classList.remove('hidden');
    } else {
      list.classList.add('hidden');
    }
  });
};

window.changeBuckyPose = function(imgSrc, description) {
  const avatarImg = document.getElementById('about-bucky-img-el');
  const descEl = document.getElementById('bucky-pose-desc-el');
  if (avatarImg) {
    // Add smooth transition fade out
    avatarImg.style.opacity = '0.3';
    setTimeout(() => {
      avatarImg.src = imgSrc + '?v=117';
      avatarImg.style.opacity = '1';
      
      // Dynamic scaling for sports poses to sit in the card window better
      if (imgSrc.includes('gym_1')) { // Archery
        avatarImg.style.transform = 'scale(1.0) translateY(10px)';
      } else if (imgSrc.includes('gym_4')) { // Weightlifting
        avatarImg.style.transform = 'scale(1.2) translateY(10px)';
      } else if (imgSrc.includes('gym_3')) { // Gymnastics rings
        avatarImg.style.transform = 'scale(1.1)';
      } else {
        avatarImg.style.transform = 'scale(1)';
      }
    }, 150);
  }
  if (descEl) {
    descEl.textContent = description;
  }
};

// Collapsible Customizer Sections
document.querySelectorAll('.css-section-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const parentSection = toggle.closest('.css-panel-section');
    if (parentSection) {
      parentSection.classList.toggle('collapsed');
    }
  });
});

// 10. Artist Database & Modal Controller
let artistDatabase = {
  "Elena Valerius": {
    name: "Elena Valerius",
    style: "Landscape & Impressionist Painter",
    origin: "Munich, Germany",
    image: "assets/artists/elena_valerius.png",
    philosophy: "Nature's grandeur cannot be captured by smooth, flat lines. Through heavy impasto and metallic overlays, I seek to make light physically tangible.",
    ideas: "Elena specializes in heavy-textured palette knife landscapes. Her work utilizes thick strokes and gold overlays to capture the dramatic effects of natural lighting in meadows. By layering oil paints with palette knives, she creates a sculptured surface that interacts dynamically with the ambient light of the room.",
    statPaintings: "2 Paintings",
    statExperience: "12 Years",
    statMessy: "85%"
  },
  "Julian S. Thorne": {
    name: "Julian S. Thorne",
    style: "Floral Watercolor Specialist",
    origin: "Portland, Oregon, USA",
    image: "assets/artists/julian_thorne.png",
    philosophy: "Watercolor is a collaborative dance between pigment, water, and paper. I embrace the beautiful accidents of fluid motion.",
    ideas: "Julian creates whimsical, fluid watercolor arrangements. His signature style focuses on the delicate movement of wildflowers, capturing the wild energy of flora on custom textured papers. He works with bleeding edges and translucent layers of paint to evoke organic life and wind motion.",
    statPaintings: "2 Paintings",
    statExperience: "8 Years",
    statMessy: "60%"
  },
  "Mikaela Wu": {
    name: "Mikaela Wu",
    style: "Minimalist Acrylic Artist",
    origin: "Vancouver, Canada",
    image: "assets/artists/mikaela_wu.png",
    philosophy: "The void is as active as the form. I seek quiet spaces where the boundary lines become windows for introspection.",
    ideas: "Mikaela explores empty spaces and metallic boundary lines. Her coastal studies balance pitch black acrylic bases with silver dust horizons to represent silent tides. Her work uses minimalist color palettes to encourage mindfulness and focus on subtle ambient shifts.",
    statPaintings: "2 Paintings",
    statExperience: "6 Years",
    statMessy: "15%"
  },
  "Sarah J.": {
    name: "Sarah J.",
    style: "Textured Abstract Expressionist",
    origin: "London, UK",
    image: "assets/artists/sarah_j.png",
    philosophy: "Art is raw, spontaneous energy. My paintings are snapshots of messy genius in action, capturing the pure joy of creation.",
    ideas: "Sarah works with high-energy acrylic splatters and multi-layered mixed media. Her philosophy embraces Bucky's favorite concept: messy genius. She layers gold leaf and raw pigments spontaneously, allowing texture to tell the story of the paint's movement.",
    statPaintings: "1 Painting",
    statExperience: "9 Years",
    statMessy: "95%"
  },
  "Alex M.": {
    name: "Alex M.",
    style: "Urban & Moody Scene Painter",
    origin: "Chicago, Illinois, USA",
    image: "assets/artists/alex_m.png",
    philosophy: "The city breathes at night. I capture the quiet drama of rainy streets, glowing neon, and silent silhouettes.",
    ideas: "Alex paints atmospheric cityscapes using deep oil glazes. He is fascinated by light reflecting off wet cobblestones and how a solitary silhouette under a streetlamp can tell a story of modern isolation and beauty.",
    statPaintings: "1 Painting",
    statExperience: "10 Years",
    statMessy: "45%"
  },
  "Marcus Vance": {
    name: "Marcus Vance",
    style: "Grand Landscape Oil Painter",
    origin: "Denver, Colorado, USA",
    philosophy: "The mountains are monuments of time. I paint to preserve the silent, golden moment of dawn breaking over stone.",
    ideas: "Marcus is a master of grand scale alpine oil painting. Using classical glazing methods and light layers, he captures the depth of misty pine valleys, sunrise-colored peaks, and vast atmospheric distances.",
    statPaintings: "1 Painting",
    statExperience: "25 Years",
    statMessy: "30%"
  },
  "Fernando Velasquez": {
    name: "Fernando Velasquez",
    style: "Geometric Abstract Sculptor",
    origin: "Madrid, Spain",
    image: "assets/artists/fernando_velasquez.png",
    philosophy: "Geometry is the architecture of nature. By reducing forms to lines and clean blocks of color, I seek the underlying order of chaos.",
    ideas: "Fernando works with bold geometric shapes, sharp lines, and primary color blocks, integrating wooden sculpture overlays onto heavy linen canvases to blend painting and sculpture. His work explores mathematical patterns, symmetry, and architectural aesthetics, seeking balance in modern environments.",
    statPaintings: "1 Painting",
    statExperience: "15 Years",
    statMessy: "10%"
  }
};

const artistModal = document.getElementById('artist-modal');
const artistModalCloseBtn = document.getElementById('artist-modal-close-btn-el');
let artistLastActiveElement = null;

window.openArtistModal = function(name) {
  const artist = artistDatabase[name];
  if (!artist || !artistModal) return;
  
  artistLastActiveElement = document.activeElement;
  
  document.getElementById('modal-artist-image').src = artist.image;
  document.getElementById('modal-artist-image').alt = `${artist.name} - Profile Portrait`;
  document.getElementById('modal-artist-origin').textContent = `Origin: ${artist.origin}`;
  document.getElementById('modal-artist-fullname').textContent = artist.name;
  document.getElementById('modal-artist-style').textContent = artist.style;
  document.getElementById('modal-artist-philosophy').textContent = `"${artist.philosophy}"`;
  document.getElementById('modal-artist-ideas-desc').textContent = artist.ideas;
  
  document.getElementById('modal-artist-stat-paintings').textContent = artist.statPaintings;
  document.getElementById('modal-artist-stat-experience').textContent = artist.statExperience;
  document.getElementById('modal-artist-stat-messy').textContent = artist.statMessy;
  
  artistModal.classList.add('open');
  artistModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  if (artistModalCloseBtn) artistModalCloseBtn.focus();
  
  document.addEventListener('keydown', handleArtistEscClose);
};

window.closeArtistModal = function() {
  if (!artistModal) return;
  artistModal.classList.remove('open');
  artistModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  if (artistLastActiveElement) {
    artistLastActiveElement.focus();
  }
  
  document.removeEventListener('keydown', handleArtistEscClose);
};

function handleArtistEscClose(e) {
  if (e.key === 'Escape') {
    closeArtistModal();
  }
}

if (artistModalCloseBtn) {
  artistModalCloseBtn.addEventListener('click', closeArtistModal);
}
if (artistModal) {
  artistModal.addEventListener('click', (e) => {
    if (e.target === artistModal) {
      closeArtistModal();
    }
  });
}

// 11. Admin Access & Password Lock Controller
let adminLastActiveElement = null;

// Initialize Admin Status from LocalStorage on load
document.addEventListener('DOMContentLoaded', () => {
  const isUnlocked = localStorage.getItem('bucky_admin_unlocked') === 'true';
  if (isUnlocked) {
    document.body.classList.add('admin-logged-in');
  }
  
  // Bind Admin Login modal event listeners safely inside DOMContentLoaded
  const adminModal = document.getElementById('admin-login-modal');
  const adminModalCloseBtn = document.getElementById('admin-login-close-btn-el');
  if (adminModalCloseBtn) {
    adminModalCloseBtn.addEventListener('click', closeAdminLogin);
  }
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        closeAdminLogin();
      }
    });
  }
});

function openAdminLogin() {
  console.log("SPB App: openAdminLogin executed.");
  const adminModal = document.getElementById('admin-login-modal');
  if (!adminModal) {
    console.error("SPB App: admin-login-modal element NOT found in DOM!");
    return;
  }
  console.log("SPB App: admin-login-modal found:", adminModal);
  adminLastActiveElement = document.activeElement;
  
  // Clear inputs and error fields
  const pwdInput = document.getElementById('admin-password');
  if (pwdInput) pwdInput.value = '';
  const errorEl = document.getElementById('admin-login-error');
  if (errorEl) errorEl.textContent = '';
  
  adminModal.classList.add('open');
  console.log("SPB App: admin-login-modal classList after adding 'open':", adminModal.classList.toString());
  adminModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  if (pwdInput) pwdInput.focus();
  document.addEventListener('keydown', handleAdminEscClose);
}
window.openAdminLogin = openAdminLogin;

function closeAdminLogin() {
  const adminModal = document.getElementById('admin-login-modal');
  if (!adminModal) return;
  adminModal.classList.remove('open');
  adminModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (adminLastActiveElement) {
    adminLastActiveElement.focus();
  }
  document.removeEventListener('keydown', handleAdminEscClose);
}
window.closeAdminLogin = closeAdminLogin;

function handleAdminEscClose(e) {
  if (e.key === 'Escape') {
    closeAdminLogin();
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById('admin-password');
  const errorEl = document.getElementById('admin-login-error');
  
  if (passwordInput.value === 'admin') {
    // Correct Password
    localStorage.setItem('bucky_admin_unlocked', 'true');
    document.body.classList.add('admin-logged-in');
    closeAdminLogin();
    
    // Automatically open the customizer control panel upon successful login
    const cssPanel = document.getElementById('css-control-panel-el');
    if (cssPanel) {
      cssPanel.classList.add('open');
    }
    
    // Show success toast
    const container = document.getElementById('toast-container-el');
    if (container) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.style.borderColor = '#10b981';
      toast.innerHTML = `
        <i class="fa-solid fa-lock-open" style="color: #10b981;"></i>
        <span>Admin Panel authenticated successfully!</span>
      `;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          toast.remove();
        }, 400);
      }, 2500);
    }
  } else {
    // Incorrect Password
    errorEl.textContent = 'Invalid administrator password. Access denied.';
    passwordInput.value = '';
    passwordInput.focus();
  }
}
window.handleAdminLogin = handleAdminLogin;

window.handleAdminLogout = function() {
  localStorage.removeItem('bucky_admin_unlocked');
  document.body.classList.remove('admin-logged-in');
  
  // Close panel if open
  const cssPanel = document.getElementById('css-control-panel-el');
  if (cssPanel) {
    cssPanel.classList.remove('open');
  }
  
  // Show lock toast
  const container = document.getElementById('toast-container-el');
  if (container) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderColor = '#f59e0b';
    toast.innerHTML = `
      <i class="fa-solid fa-lock" style="color: #f59e0b;"></i>
      <span>Admin customizer panel locked.</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2500);
  }
};


// ==========================================================================
// CMS Content Management Form & Event Handlers
// ==========================================================================

// Add Artist Form Handler
window.handleCmsAddArtist = async function(event) {
  event.preventDefault();
  const name = document.getElementById('cms-artist-name').value.trim();
  const style = document.getElementById('cms-artist-medium').value.trim();
  const origin = document.getElementById('cms-artist-origin').value.trim() || 'Unknown';
  const avatarFile = document.getElementById('cms-artist-avatar').files[0];
  const philosophy = document.getElementById('cms-artist-philosophy').value.trim() || 'Art is life.';
  const bio = document.getElementById('cms-artist-bio').value.trim();
  const years = document.getElementById('cms-artist-years').value.trim() || '1';
  const messiness = document.getElementById('cms-artist-messiness').value.trim() || '5/10 splatters';

  if (artistDatabase[name]) {
    alert('Artist already exists!');
    return;
  }

  let avatarUrl = 'assets/artists/default_avatar.png';
  if (avatarFile) {
    try {
      avatarUrl = await resizeAndConvertImage(avatarFile, 400);
    } catch (e) {
      console.error('Error scaling avatar image:', e);
      alert('Failed to scale avatar image.');
      return;
    }
  }

  artistDatabase[name] = {
    name: name,
    style: style,
    origin: origin,
    image: avatarUrl,
    philosophy: philosophy,
    ideas: bio,
    statPaintings: '0 Paintings',
    statExperience: `${years} Years`,
    statMessy: messiness.includes('%') ? messiness : (messiness.includes('/') ? Math.round((parseInt(messiness)/10)*100)+'%' : '50%')
  };

  renderArtists();
  populateSelectors();
  renderCmsLists();
  saveGalleryStyles();
  
  // Reset form
  document.getElementById('cms-artist-form').reset();
  
  showCmsToast('Artist added successfully!');
};

// Add Painting Form Handler
window.handleCmsAddPainting = async function(event) {
  event.preventDefault();
  const title = document.getElementById('cms-painting-title').value.trim();
  const artistName = document.getElementById('cms-painting-artist').value;
  const category = document.getElementById('cms-painting-category').value;
  const price = parseInt(document.getElementById('cms-painting-price').value.trim()) || 0;
  const imageFile = document.getElementById('cms-painting-image').files[0];
  const medium = document.getElementById('cms-painting-medium').value.trim();
  const dimensions = document.getElementById('cms-painting-dimensions').value.trim();
  const desc = document.getElementById('cms-painting-desc').value.trim() || '';

  if (!imageFile) {
    alert('Please upload a painting photo.');
    return;
  }

  let imageUrl = '';
  try {
    imageUrl = await resizeAndConvertImage(imageFile, 800);
  } catch (e) {
    console.error('Error scaling painting image:', e);
    alert('Failed to scale painting image.');
    return;
  }

  // Generate unique ID
  const existingIds = Object.keys(paintingDatabase).map(Number);
  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  paintingDatabase[nextId] = {
    id: nextId,
    title: title,
    artist: artistName,
    desc: desc,
    price: price,
    image: imageUrl,
    medium: medium,
    dimensions: dimensions,
    category: category.charAt(0).toUpperCase() + category.slice(1)
  };

  // Increment artist painting count
  if (artistDatabase[artistName]) {
    const currentCount = parseInt(artistDatabase[artistName].statPaintings) || 0;
    artistDatabase[artistName].statPaintings = `${currentCount + 1} Painting${currentCount + 1 !== 1 ? 's' : ''}`;
  }

  renderPaintings();
  populateSelectors();
  renderCmsLists();
  saveGalleryStyles();

  // Reset form
  document.getElementById('cms-painting-form').reset();

  showCmsToast('Painting added successfully!');
};

window.handleCmsDeletePainting = function(id) {
  if (!confirm('Are you sure you want to delete this painting?')) return;
  const p = paintingDatabase[id];
  if (p && artistDatabase[p.artist]) {
    const currentCount = parseInt(artistDatabase[p.artist].statPaintings) || 1;
    artistDatabase[p.artist].statPaintings = `${currentCount - 1} Painting${currentCount - 1 !== 1 ? 's' : ''}`;
  }
  delete paintingDatabase[id];
  renderPaintings();
  populateSelectors();
  renderCmsLists();
  saveGalleryStyles();
  showCmsToast('Painting deleted.');
};

window.handleCmsDeleteArtist = function(name) {
  if (!confirm(`Are you sure you want to delete artist "${name}" and all of their paintings?`)) return;
  
  // Delete all paintings by this artist
  Object.keys(paintingDatabase).forEach(id => {
    if (paintingDatabase[id].artist === name) {
      delete paintingDatabase[id];
    }
  });

  delete artistDatabase[name];

  renderPaintings();
  renderArtists();
  populateSelectors();
  renderCmsLists();
  saveGalleryStyles();
  showCmsToast('Artist and their paintings deleted.');
};

function showCmsToast(message) {
  const container = document.getElementById('toast-container-el');
  if (container) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderColor = '#3b82f6';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2500);
  }
}

window.handleResetDatabaseToDefaults = function() {
  if (!confirm('Are you sure you want to reset the database to defaults? This will restore all default paintings/artists and clear your local backups.')) return;
  localStorage.removeItem('spb_gallery_data');
  location.reload();
};

