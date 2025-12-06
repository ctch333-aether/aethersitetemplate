/**
 * AETHER Assets Web Components v2.0.0
 * Custom elements for optimized asset loading
 * 
 * Components:
 * - <aether-image> : Optimized image with LQIP, srcset, lazy loading
 * - <aether-gallery> : Responsive image gallery
 * - <aether-hero> : Full-width hero image with priority loading
 * 
 * @example
 * <aether-image 
 *   asset="aether-portfolio-enchant-lights-01" 
 *   alt="Enchant Christmas lights"
 *   sizes="(max-width: 640px) 100vw, 50vw">
 * </aether-image>
 */

// Import dominant colors (can be inlined or loaded)
const DOMINANT_COLORS = {};

/**
 * Base class for AETHER image components
 */
class AetherImageBase extends HTMLElement {
  static get observedAttributes() {
    return ['asset', 'alt', 'sizes', 'loading', 'priority'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loaded = false;
  }

  get basePath() {
    return this.getAttribute('base-path') || '/assets';
  }

  get asset() {
    return this.getAttribute('asset') || '';
  }

  get alt() {
    return this.getAttribute('alt') || '';
  }

  get sizes() {
    return this.getAttribute('sizes') || '100vw';
  }

  get loading() {
    return this.getAttribute('loading') || 'lazy';
  }

  get priority() {
    return this.hasAttribute('priority');
  }

  // Get placeholder color for asset
  getPlaceholderColor(assetId) {
    return DOMINANT_COLORS[assetId] || '#1a1a2e';
  }

  // Generate srcset for responsive images
  generateSrcset(assetId, format = 'webp') {
    const base = this.basePath;
    const sizes = [400, 800];
    const parts = [];
    
    // Mobile size
    parts.push(`${base}/webp-mobile/${assetId}_400w.webp 400w`);
    
    // Medium size
    parts.push(`${base}/webp-medium/${assetId}_800w.webp 800w`);
    
    // Full size
    parts.push(`${base}/webp/${assetId}.webp 1600w`);
    
    return parts.join(', ');
  }

  // Common styles
  getBaseStyles() {
    return `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        background-color: var(--aether-placeholder-color, #1a1a2e);
      }
      
      .container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        filter: blur(20px);
        transform: scale(1.1);
        transition: opacity 0.3s ease-out;
      }
      
      .placeholder.loaded {
        opacity: 0;
      }
      
      picture {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
      
      img.loaded {
        opacity: 1;
      }
      
      .error {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ff6b6b;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        padding: 20px;
        text-align: center;
      }
      
      /* Aspect ratio support */
      :host([aspect="16-9"]) { aspect-ratio: 16 / 9; }
      :host([aspect="4-3"]) { aspect-ratio: 4 / 3; }
      :host([aspect="1-1"]) { aspect-ratio: 1 / 1; }
      :host([aspect="3-2"]) { aspect-ratio: 3 / 2; }
      :host([aspect="21-9"]) { aspect-ratio: 21 / 9; }
    `;
  }
}

/**
 * <aether-image> - Optimized image component
 */
class AetherImage extends AetherImageBase {
  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  render() {
    const assetId = this.asset;
    if (!assetId) {
      this.shadowRoot.innerHTML = `<div class="error">No asset specified</div>`;
      return;
    }

    const placeholderColor = this.getPlaceholderColor(assetId);
    const lqipUrl = `${this.basePath}/lqip/${assetId}-blur.webp`;
    const srcset = this.generateSrcset(assetId);
    const fallbackSrc = `${this.basePath}/webp/${assetId}.webp`;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        :host {
          --aether-placeholder-color: ${placeholderColor};
        }
      </style>
      <div class="container">
        <div class="placeholder" style="background-image: url('${lqipUrl}')"></div>
        <picture>
          <source 
            type="image/webp" 
            srcset="${srcset}"
            sizes="${this.sizes}">
          <source 
            type="image/avif" 
            srcset="${this.basePath}/avif/${assetId}.avif"
            sizes="${this.sizes}">
          <img 
            src="${fallbackSrc}"
            alt="${this.alt}"
            loading="${this.loading}"
            decoding="${this.priority ? 'sync' : 'async'}"
            ${this.priority ? 'fetchpriority="high"' : ''}>
        </picture>
      </div>
    `;

    // Handle load event
    const img = this.shadowRoot.querySelector('img');
    const placeholder = this.shadowRoot.querySelector('.placeholder');

    img.onload = () => {
      img.classList.add('loaded');
      placeholder.classList.add('loaded');
      this._loaded = true;
      this.dispatchEvent(new CustomEvent('load', { detail: { asset: assetId } }));
    };

    img.onerror = () => {
      this.shadowRoot.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="error">Failed to load: ${assetId}</div>
      `;
      this.dispatchEvent(new CustomEvent('error', { detail: { asset: assetId } }));
    };

    // Preload if priority
    if (this.priority) {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'image';
      preload.type = 'image/webp';
      preload.imageSrcset = srcset;
      preload.imageSizes = this.sizes;
      document.head.appendChild(preload);
    }
  }
}

/**
 * <aether-hero> - Full-width hero image with priority loading
 */
class AetherHero extends AetherImageBase {
  static get observedAttributes() {
    return [...super.observedAttributes, 'height', 'overlay'];
  }

  get height() {
    return this.getAttribute('height') || '60vh';
  }

  get overlay() {
    return this.getAttribute('overlay') || '';
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  render() {
    const assetId = this.asset;
    if (!assetId) return;

    const placeholderColor = this.getPlaceholderColor(assetId);
    const lqipUrl = `${this.basePath}/lqip/${assetId}-blur.webp`;
    const srcset = this.generateSrcset(assetId);
    const fallbackSrc = `${this.basePath}/webp/${assetId}.webp`;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        :host {
          --aether-placeholder-color: ${placeholderColor};
          height: ${this.height};
          min-height: 300px;
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${this.overlay || 'linear-gradient(transparent 60%, rgba(0,0,0,0.7))'};
          pointer-events: none;
          z-index: 1;
        }
        
        .content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          z-index: 2;
          color: white;
        }
        
        ::slotted(*) {
          margin: 0;
        }
      </style>
      <div class="container">
        <div class="placeholder" style="background-image: url('${lqipUrl}')"></div>
        <picture>
          <source type="image/webp" srcset="${srcset}" sizes="100vw">
          <img 
            src="${fallbackSrc}"
            alt="${this.alt}"
            loading="eager"
            decoding="sync"
            fetchpriority="high">
        </picture>
        <div class="overlay"></div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;

    const img = this.shadowRoot.querySelector('img');
    const placeholder = this.shadowRoot.querySelector('.placeholder');

    img.onload = () => {
      img.classList.add('loaded');
      placeholder.classList.add('loaded');
    };
  }
}

/**
 * <aether-gallery> - Responsive image gallery
 */
class AetherGallery extends HTMLElement {
  static get observedAttributes() {
    return ['assets', 'columns', 'gap'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get assets() {
    try {
      return JSON.parse(this.getAttribute('assets') || '[]');
    } catch {
      return this.getAttribute('assets')?.split(',').map(s => s.trim()) || [];
    }
  }

  get columns() {
    return this.getAttribute('columns') || '3';
  }

  get gap() {
    return this.getAttribute('gap') || '1rem';
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  render() {
    const assetList = this.assets;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .gallery {
          display: grid;
          grid-template-columns: repeat(${this.columns}, 1fr);
          gap: ${this.gap};
        }
        
        @media (max-width: 768px) {
          .gallery {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .gallery {
            grid-template-columns: 1fr;
          }
        }
        
        .gallery-item {
          aspect-ratio: 4 / 3;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .gallery-item:hover {
          transform: scale(1.02);
        }
        
        .gallery-item aether-image {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
        }
      </style>
      <div class="gallery">
        ${assetList.map(asset => `
          <div class="gallery-item" data-asset="${asset}">
            <aether-image 
              asset="${asset}" 
              alt="${asset.replace(/-/g, ' ')}"
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
              aspect="4-3">
            </aether-image>
          </div>
        `).join('')}
      </div>
    `;

    // Add click handlers
    this.shadowRoot.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('select', {
          detail: { asset: item.dataset.asset },
          bubbles: true
        }));
      });
    });
  }
}

// Register components
customElements.define('aether-image', AetherImage);
customElements.define('aether-hero', AetherHero);
customElements.define('aether-gallery', AetherGallery);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AetherImage, AetherHero, AetherGallery };
}

console.log('[AetherComponents] Web Components v2.0.0 registered');
