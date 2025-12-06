/**
 * AETHER Assets Loader v2.0.0
 * Optimized image loading with IntersectionObserver, LQIP, and srcset management
 * 
 * Features:
 * - Lazy loading with IntersectionObserver
 * - LQIP (Low Quality Image Placeholder) blur-up effect
 * - Automatic WebP/PNG fallback detection
 * - Responsive srcset generation
 * - Preload critical images
 * - Performance metrics collection
 * 
 * @license MIT
 * @author AETHER Phygital Experience Platform
 */

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' 
    ? module.exports = factory() 
    : typeof define === 'function' && define.amd 
      ? define(factory) 
      : (global.AetherAssets = factory());
}(this, function() {
  'use strict';

  // Configuration defaults
  const CONFIG = {
    basePath: '/assets',
    webpPath: '/assets/webp',
    pngPath: '/assets/png-fallback',
    thumbPath: '/assets/thumbnails',
    lqipPath: '/assets/lqip',
    mediumPath: '/assets/webp-medium',
    
    // IntersectionObserver options
    rootMargin: '50px 0px',
    threshold: 0.01,
    
    // Image sizes for srcset
    thumbSizes: [64, 128, 256, 512],
    
    // Animation classes
    loadedClass: 'loaded',
    loadingClass: 'loading',
    errorClass: 'error',
    
    // Performance
    enableMetrics: false,
    debug: false
  };

  // Browser feature detection
  const SUPPORTS = {
    webp: false,
    avif: false,
    intersectionObserver: 'IntersectionObserver' in window,
    loading: 'loading' in HTMLImageElement.prototype
  };

  // Metrics collection
  const metrics = {
    imagesLoaded: 0,
    totalLoadTime: 0,
    errors: []
  };

  /**
   * Detect WebP support
   */
  function detectWebPSupport() {
    return new Promise(resolve => {
      const webp = new Image();
      webp.onload = webp.onerror = function() {
        SUPPORTS.webp = webp.height === 2;
        resolve(SUPPORTS.webp);
      };
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Log messages in debug mode
   */
  function log(...args) {
    if (CONFIG.debug) {
      console.log('[AetherAssets]', ...args);
    }
  }

  /**
   * Generate srcset string for an asset
   * @param {string} assetId - Asset identifier (without extension)
   * @param {boolean} useWebP - Whether to use WebP format
   * @returns {string} srcset attribute value
   */
  function generateSrcset(assetId, useWebP = true) {
    const ext = useWebP && SUPPORTS.webp ? 'webp' : 'png';
    const sizes = CONFIG.thumbSizes;
    
    const srcsetParts = sizes.map(size => {
      return `${CONFIG.thumbPath}/${size}/${assetId}-${size}w.${ext} ${size}w`;
    });
    
    // Add full size
    const fullPath = useWebP && SUPPORTS.webp ? CONFIG.webpPath : CONFIG.pngPath;
    srcsetParts.push(`${fullPath}/${assetId}.${ext} 1024w`);
    
    return srcsetParts.join(', ');
  }

  /**
   * Generate sizes attribute based on common breakpoints
   * @param {Object} options - Size configuration
   * @returns {string} sizes attribute value
   */
  function generateSizes(options = {}) {
    const {
      mobile = '100vw',
      tablet = '50vw',
      desktop = '33vw'
    } = options;
    
    return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
  }

  /**
   * Create a picture element with WebP/PNG fallback
   * @param {string} assetId - Asset identifier
   * @param {Object} options - Configuration options
   * @returns {HTMLPictureElement}
   */
  function createPicture(assetId, options = {}) {
    const {
      alt = '',
      className = '',
      lazy = true,
      sizes = null,
      useLqip = true
    } = options;

    const picture = document.createElement('picture');
    
    // WebP source
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.srcset = generateSrcset(assetId, true);
    if (sizes) webpSource.sizes = sizes;
    picture.appendChild(webpSource);
    
    // Fallback img
    const img = document.createElement('img');
    img.src = `${CONFIG.pngPath}/${assetId}.png`;
    img.alt = alt;
    img.className = className;
    
    if (lazy) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    
    if (sizes) {
      img.sizes = sizes;
      img.srcset = generateSrcset(assetId, false);
    }
    
    picture.appendChild(img);
    
    // Add LQIP background if requested
    if (useLqip) {
      picture.style.backgroundImage = `url(${CONFIG.lqipPath}/${assetId}-blur.webp)`;
      picture.style.backgroundSize = 'cover';
      picture.style.backgroundPosition = 'center';
      
      img.onload = function() {
        picture.style.backgroundImage = 'none';
        img.classList.add(CONFIG.loadedClass);
      };
    }
    
    return picture;
  }

  /**
   * Initialize lazy loading with IntersectionObserver
   * @param {string} selector - CSS selector for images to lazy load
   */
  function initLazyLoading(selector = 'img[data-src], img[loading="lazy"]') {
    if (!SUPPORTS.intersectionObserver) {
      // Fallback: load all images immediately
      document.querySelectorAll(selector).forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const startTime = performance.now();
          
          img.classList.add(CONFIG.loadingClass);
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          img.onload = function() {
            const loadTime = performance.now() - startTime;
            img.classList.remove(CONFIG.loadingClass);
            img.classList.add(CONFIG.loadedClass);
            
            if (CONFIG.enableMetrics) {
              metrics.imagesLoaded++;
              metrics.totalLoadTime += loadTime;
              log(`Loaded ${img.src} in ${loadTime.toFixed(2)}ms`);
            }
          };
          
          img.onerror = function() {
            img.classList.remove(CONFIG.loadingClass);
            img.classList.add(CONFIG.errorClass);
            
            if (CONFIG.enableMetrics) {
              metrics.errors.push(img.src);
            }
            log(`Error loading ${img.src}`);
          };
          
          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: CONFIG.rootMargin,
      threshold: CONFIG.threshold
    });

    document.querySelectorAll(selector).forEach(img => {
      observer.observe(img);
    });
    
    log(`Observing ${document.querySelectorAll(selector).length} images`);
    
    return observer;
  }

  /**
   * Preload critical images
   * @param {Array<string>} assetIds - Array of asset IDs to preload
   */
  function preloadImages(assetIds) {
    assetIds.forEach(assetId => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.type = SUPPORTS.webp ? 'image/webp' : 'image/png';
      link.href = SUPPORTS.webp 
        ? `${CONFIG.webpPath}/${assetId}.webp`
        : `${CONFIG.pngPath}/${assetId}.png`;
      document.head.appendChild(link);
      log(`Preloading ${assetId}`);
    });
  }

  /**
   * Get performance metrics
   * @returns {Object} Metrics object
   */
  function getMetrics() {
    return {
      ...metrics,
      averageLoadTime: metrics.imagesLoaded > 0 
        ? metrics.totalLoadTime / metrics.imagesLoaded 
        : 0
    };
  }

  /**
   * Update configuration
   * @param {Object} options - Configuration options to merge
   */
  function configure(options) {
    Object.assign(CONFIG, options);
    log('Configuration updated', CONFIG);
  }

  /**
   * Initialize the library
   * @param {Object} options - Configuration options
   */
  async function init(options = {}) {
    configure(options);
    await detectWebPSupport();
    
    log('Initialized with WebP support:', SUPPORTS.webp);
    log('Native lazy loading support:', SUPPORTS.loading);
    
    // Auto-initialize lazy loading if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initLazyLoading();
      });
    } else {
      initLazyLoading();
    }
  }

  // Asset data (can be populated from manifest)
  const assetRegistry = {};

  /**
   * Register assets from manifest
   * @param {Object} manifest - Asset manifest object
   */
  function registerAssets(manifest) {
    if (manifest.assets) {
      Object.entries(manifest.assets).forEach(([category, assets]) => {
        assets.forEach(asset => {
          assetRegistry[asset.id] = {
            ...asset,
            category
          };
        });
      });
    }
    log(`Registered ${Object.keys(assetRegistry).length} assets`);
  }

  /**
   * Get asset info by ID
   * @param {string} assetId - Asset identifier
   * @returns {Object|null} Asset info or null
   */
  function getAsset(assetId) {
    return assetRegistry[assetId] || null;
  }

  /**
   * Get all assets by category
   * @param {string} category - Category name
   * @returns {Array} Array of assets
   */
  function getAssetsByCategory(category) {
    return Object.values(assetRegistry).filter(a => a.category === category);
  }

  // Public API
  return {
    init,
    configure,
    createPicture,
    generateSrcset,
    generateSizes,
    initLazyLoading,
    preloadImages,
    getMetrics,
    registerAssets,
    getAsset,
    getAssetsByCategory,
    supports: SUPPORTS,
    version: '2.0.0'
  };

}));
