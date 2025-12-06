/**
 * AETHER Performance Budget Tracker v2.0.0
 * Monitor and enforce image loading performance budgets
 * 
 * Features:
 * - Real-time performance monitoring
 * - Budget enforcement warnings
 * - Core Web Vitals integration
 * - Lighthouse-compatible reporting
 */

(function(global) {
  'use strict';

  const BUDGETS = {
    // Individual asset size limits (KB)
    heroImage: 150,
    galleryImage: 80,
    thumbnail: 15,
    lqip: 1,
    
    // Page-level limits
    totalImages: 500,  // KB per page
    criticalImages: 100,  // KB for above-the-fold
    
    // Timing budgets (ms)
    lcp: 2500,  // Largest Contentful Paint
    fcp: 1800,  // First Contentful Paint
    tti: 3800,  // Time to Interactive
    
    // Count limits
    maxImagesPerPage: 50,
    maxCriticalImages: 3
  };

  const metrics = {
    images: [],
    totalSize: 0,
    criticalSize: 0,
    violations: [],
    lcp: null,
    fcp: null,
    timing: {}
  };

  let observer = null;
  let reportCallback = null;

  /**
   * Track an image load
   */
  function trackImage(entry) {
    const img = entry.target;
    const url = img.currentSrc || img.src;
    
    // Estimate size from natural dimensions (approximate)
    const estimatedSize = estimateImageSize(img);
    
    const isCritical = isAboveTheFold(img);
    
    const imageData = {
      url,
      timestamp: performance.now(),
      estimatedSizeKb: estimatedSize,
      isCritical,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.clientWidth,
      displayHeight: img.clientHeight,
      format: getImageFormat(url)
    };
    
    metrics.images.push(imageData);
    metrics.totalSize += estimatedSize;
    
    if (isCritical) {
      metrics.criticalSize += estimatedSize;
    }
    
    // Check budgets
    checkBudgets(imageData);
    
    return imageData;
  }

  /**
   * Estimate image file size from dimensions
   */
  function estimateImageSize(img) {
    const pixels = img.naturalWidth * img.naturalHeight;
    const format = getImageFormat(img.currentSrc || img.src);
    
    // Rough bytes-per-pixel estimates
    const bpp = {
      avif: 0.15,
      webp: 0.25,
      jpeg: 0.35,
      jpg: 0.35,
      png: 0.5
    };
    
    const bytesPerPixel = bpp[format] || 0.3;
    return Math.round((pixels * bytesPerPixel) / 1024);
  }

  /**
   * Get image format from URL
   */
  function getImageFormat(url) {
    const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase();
    return ext || 'unknown';
  }

  /**
   * Check if element is above the fold
   */
  function isAboveTheFold(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /**
   * Check performance budgets
   */
  function checkBudgets(imageData) {
    const violations = [];
    
    // Check individual image size
    if (imageData.isCritical && imageData.estimatedSizeKb > BUDGETS.heroImage) {
      violations.push({
        type: 'IMAGE_SIZE',
        severity: 'warning',
        message: `Critical image exceeds budget: ${imageData.estimatedSizeKb}KB > ${BUDGETS.heroImage}KB`,
        url: imageData.url
      });
    }
    
    // Check total critical size
    if (metrics.criticalSize > BUDGETS.criticalImages) {
      violations.push({
        type: 'CRITICAL_TOTAL',
        severity: 'warning',
        message: `Critical images total exceeds budget: ${metrics.criticalSize}KB > ${BUDGETS.criticalImages}KB`
      });
    }
    
    // Check total page size
    if (metrics.totalSize > BUDGETS.totalImages) {
      violations.push({
        type: 'PAGE_TOTAL',
        severity: 'error',
        message: `Total image size exceeds budget: ${metrics.totalSize}KB > ${BUDGETS.totalImages}KB`
      });
    }
    
    // Check image count
    if (metrics.images.length > BUDGETS.maxImagesPerPage) {
      violations.push({
        type: 'IMAGE_COUNT',
        severity: 'warning',
        message: `Too many images: ${metrics.images.length} > ${BUDGETS.maxImagesPerPage}`
      });
    }
    
    if (violations.length > 0) {
      metrics.violations.push(...violations);
      
      if (reportCallback) {
        reportCallback({ type: 'violation', violations });
      }
      
      // Console warnings
      violations.forEach(v => {
        const method = v.severity === 'error' ? 'error' : 'warn';
        console[method](`[AETHER Budget] ${v.message}`);
      });
    }
  }

  /**
   * Observe Core Web Vitals
   */
  function observeWebVitals() {
    // LCP Observer
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
          
          if (metrics.lcp > BUDGETS.lcp) {
            metrics.violations.push({
              type: 'LCP',
              severity: 'error',
              message: `LCP exceeds budget: ${Math.round(metrics.lcp)}ms > ${BUDGETS.lcp}ms`
            });
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {}
      
      // FCP Observer
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
              
              if (metrics.fcp > BUDGETS.fcp) {
                metrics.violations.push({
                  type: 'FCP',
                  severity: 'warning',
                  message: `FCP exceeds budget: ${Math.round(metrics.fcp)}ms > ${BUDGETS.fcp}ms`
                });
              }
            }
          });
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {}
    }
  }

  /**
   * Initialize image load tracking
   */
  function observeImages() {
    if (!('IntersectionObserver' in window)) return;
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.complete) {
            trackImage(entry);
          } else {
            img.addEventListener('load', () => trackImage(entry), { once: true });
          }
          
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    
    // Observe all images
    document.querySelectorAll('img').forEach(img => {
      observer.observe(img);
    });
    
    // Watch for dynamically added images
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG') {
            observer.observe(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach(img => observer.observe(img));
          }
        });
      });
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Get performance report
   */
  function getReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalImages: metrics.images.length,
        totalSizeKb: metrics.totalSize,
        criticalImages: metrics.images.filter(i => i.isCritical).length,
        criticalSizeKb: metrics.criticalSize,
        violations: metrics.violations.length,
        lcp: metrics.lcp,
        fcp: metrics.fcp
      },
      budgets: BUDGETS,
      budgetStatus: {
        totalImages: metrics.totalSize <= BUDGETS.totalImages ? 'pass' : 'fail',
        criticalImages: metrics.criticalSize <= BUDGETS.criticalImages ? 'pass' : 'fail',
        imageCount: metrics.images.length <= BUDGETS.maxImagesPerPage ? 'pass' : 'fail',
        lcp: metrics.lcp ? (metrics.lcp <= BUDGETS.lcp ? 'pass' : 'fail') : 'pending',
        fcp: metrics.fcp ? (metrics.fcp <= BUDGETS.fcp ? 'pass' : 'fail') : 'pending'
      },
      images: metrics.images,
      violations: metrics.violations
    };
    
    return report;
  }

  /**
   * Print report to console
   */
  function printReport() {
    const report = getReport();
    
    console.group('📊 AETHER Performance Report');
    console.log(`Total Images: ${report.summary.totalImages}`);
    console.log(`Total Size: ${report.summary.totalSizeKb} KB`);
    console.log(`Critical Size: ${report.summary.criticalSizeKb} KB`);
    console.log(`LCP: ${report.summary.lcp ? Math.round(report.summary.lcp) + 'ms' : 'pending'}`);
    console.log(`FCP: ${report.summary.fcp ? Math.round(report.summary.fcp) + 'ms' : 'pending'}`);
    console.log(`Violations: ${report.summary.violations}`);
    
    console.group('Budget Status');
    Object.entries(report.budgetStatus).forEach(([key, status]) => {
      const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏳';
      console.log(`${icon} ${key}: ${status}`);
    });
    console.groupEnd();
    
    if (report.violations.length > 0) {
      console.group('Violations');
      report.violations.forEach(v => console.warn(`${v.type}: ${v.message}`));
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return report;
  }

  /**
   * Initialize tracker
   */
  function init(options = {}) {
    if (options.budgets) {
      Object.assign(BUDGETS, options.budgets);
    }
    
    if (options.onReport) {
      reportCallback = options.onReport;
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        observeImages();
        observeWebVitals();
      });
    } else {
      observeImages();
      observeWebVitals();
    }
    
    // Auto-report on page load complete
    window.addEventListener('load', () => {
      setTimeout(printReport, 1000);
    });
    
    console.log('[AETHER] Performance Budget Tracker initialized');
  }

  // Public API
  global.AetherBudget = {
    init,
    getReport,
    printReport,
    getBudgets: () => ({ ...BUDGETS }),
    setBudgets: (newBudgets) => Object.assign(BUDGETS, newBudgets),
    getMetrics: () => ({ ...metrics }),
    version: '2.0.0'
  };

})(typeof window !== 'undefined' ? window : this);
