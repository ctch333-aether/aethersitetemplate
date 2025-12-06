/**
 * AETHER Assets React Components v2.0.0
 * 
 * Modern React components for optimal image loading with:
 * - Automatic format selection (AVIF > WebP > PNG)
 * - LQIP blur-up effect
 * - Lazy loading with IntersectionObserver
 * - Responsive srcset generation
 * - Win95 aesthetic frames
 * 
 * Usage:
 * import { AetherImage, AetherGallery, Win95Frame } from './aether-assets-react';
 * 
 * <AetherImage 
 *   assetId="aether-brand-logo-main" 
 *   alt="AETHER Logo"
 *   sizes="(max-width: 640px) 100vw, 50vw"
 * />
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';

// =============================================================================
// Configuration
// =============================================================================

const CONFIG = {
  basePath: '/assets',
  formats: ['avif', 'webp', 'png'],
  thumbSizes: [64, 128, 256, 512],
  defaultSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to detect format support
 */
export function useFormatSupport() {
  const [supports, setSupports] = useState({ avif: false, webp: false });
  
  useEffect(() => {
    // Check WebP
    const webp = new Image();
    webp.onload = () => setSupports(s => ({ ...s, webp: true }));
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    // Check AVIF
    const avif = new Image();
    avif.onload = () => setSupports(s => ({ ...s, avif: true }));
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABpAQ0AIyExAAAAAP+I9ngA==';
  }, []);
  
  return supports;
}

/**
 * Hook for lazy loading with IntersectionObserver
 */
export function useLazyLoad(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { rootMargin: options.rootMargin || '50px', threshold: 0.01 }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [options.rootMargin]);
  
  return { ref, isVisible, hasLoaded, setHasLoaded };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generate srcset for an asset
 */
export function generateSrcset(assetId, format = 'webp') {
  const ext = format === 'png' ? 'png' : format;
  const thumbPath = `${CONFIG.basePath}/thumbnails`;
  const fullPath = format === 'png' 
    ? `${CONFIG.basePath}/png-fallback`
    : `${CONFIG.basePath}/${format}`;
  
  const parts = CONFIG.thumbSizes.map(size => 
    `${thumbPath}/${size}/${assetId}-${size}w.${ext} ${size}w`
  );
  parts.push(`${fullPath}/${assetId}.${ext} 1024w`);
  
  return parts.join(', ');
}

/**
 * Get LQIP URL for an asset
 */
export function getLqipUrl(assetId) {
  return `${CONFIG.basePath}/lqip/${assetId}-blur.webp`;
}

// =============================================================================
// Components
// =============================================================================

/**
 * Main image component with progressive loading
 */
export function AetherImage({
  assetId,
  alt = '',
  className = '',
  sizes = CONFIG.defaultSizes,
  lazy = true,
  showLqip = true,
  onLoad,
  style,
  ...props
}) {
  const supports = useFormatSupport();
  const { ref, isVisible, hasLoaded, setHasLoaded } = useLazyLoad();
  const [error, setError] = useState(false);
  
  const lqipUrl = useMemo(() => getLqipUrl(assetId), [assetId]);
  
  const handleLoad = (e) => {
    setHasLoaded(true);
    onLoad?.(e);
  };
  
  const handleError = () => {
    setError(true);
  };
  
  // Determine best format
  const bestFormat = supports.avif ? 'avif' : supports.webp ? 'webp' : 'png';
  
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    ...(showLqip && !hasLoaded ? {
      backgroundImage: `url(${lqipUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {}),
    ...style
  };
  
  const imgStyle = {
    opacity: hasLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    width: '100%',
    height: 'auto',
    display: 'block'
  };
  
  if (error) {
    return (
      <div ref={ref} className={`aether-img-error ${className}`} style={containerStyle}>
        <span>Failed to load image</span>
      </div>
    );
  }
  
  return (
    <div ref={ref} className={`aether-img-frame ${className}`} style={containerStyle}>
      {(isVisible || !lazy) && (
        <picture>
          {/* AVIF source */}
          {supports.avif && (
            <source
              type="image/avif"
              srcSet={generateSrcset(assetId, 'avif')}
              sizes={sizes}
            />
          )}
          
          {/* WebP source */}
          {supports.webp && (
            <source
              type="image/webp"
              srcSet={generateSrcset(assetId, 'webp')}
              sizes={sizes}
            />
          )}
          
          {/* Fallback img */}
          <img
            src={`${CONFIG.basePath}/png-fallback/${assetId}.png`}
            srcSet={generateSrcset(assetId, 'png')}
            sizes={sizes}
            alt={alt}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            style={imgStyle}
            {...props}
          />
        </picture>
      )}
    </div>
  );
}

/**
 * Win95-style window frame for images
 */
export function Win95Frame({
  children,
  title = 'Image',
  className = '',
  showTitleBar = true,
  variant = 'default', // 'default', 'inset', 'mspaint'
  style
}) {
  const frameStyle = {
    background: '#c0c0c0',
    border: '2px solid',
    borderColor: '#ffffff #808080 #808080 #ffffff',
    boxShadow: '1px 1px 0 #404040',
    ...style
  };
  
  const titleBarStyle = {
    background: 'linear-gradient(90deg, #000080, #1084d0)',
    color: 'white',
    padding: '2px 4px',
    fontFamily: '"MS Sans Serif", "Segoe UI", Tahoma, sans-serif',
    fontWeight: 'bold',
    fontSize: '11px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none'
  };
  
  const contentStyle = {
    padding: variant === 'mspaint' ? '3px' : '8px',
    ...(variant === 'inset' ? {
      margin: '4px',
      border: '2px solid',
      borderColor: '#808080 #ffffff #ffffff #808080',
      background: 'white'
    } : {})
  };
  
  return (
    <div className={`win95-frame ${className}`} style={frameStyle}>
      {showTitleBar && (
        <div style={titleBarStyle}>
          <span>{title}</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            <button style={{ width: '16px', height: '14px', fontSize: '10px' }}>_</button>
            <button style={{ width: '16px', height: '14px', fontSize: '10px' }}>□</button>
            <button style={{ width: '16px', height: '14px', fontSize: '10px' }}>×</button>
          </div>
        </div>
      )}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

/**
 * Gallery grid component
 */
export function AetherGallery({
  assets,
  columns = 3,
  gap = 16,
  className = '',
  renderItem,
  style
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    ...style
  };
  
  return (
    <div className={`aether-gallery ${className}`} style={gridStyle}>
      {assets.map((asset, index) => (
        renderItem ? renderItem(asset, index) : (
          <AetherImage
            key={asset.id || asset}
            assetId={typeof asset === 'string' ? asset : asset.id}
            alt={typeof asset === 'object' ? asset.alt : ''}
          />
        )
      ))}
    </div>
  );
}

/**
 * Team member card component
 */
export function TeamMemberCard({
  assetId,
  name,
  title,
  className = '',
  frameStyle = 'win95'
}) {
  const cardStyle = {
    textAlign: 'center',
    maxWidth: '280px'
  };
  
  const ImageWrapper = frameStyle === 'win95' ? Win95Frame : 'div';
  const wrapperProps = frameStyle === 'win95' 
    ? { title: name, variant: 'inset' }
    : {};
  
  return (
    <div className={`team-member-card ${className}`} style={cardStyle}>
      <ImageWrapper {...wrapperProps}>
        <AetherImage
          assetId={assetId}
          alt={`${name} - ${title}`}
          sizes="280px"
        />
      </ImageWrapper>
      <h3 style={{ 
        fontFamily: '"MS Sans Serif", sans-serif',
        margin: '12px 0 4px'
      }}>
        {name}
      </h3>
      <p style={{ 
        color: '#808080',
        fontSize: '0.875em',
        margin: 0
      }}>
        {title}
      </p>
    </div>
  );
}

/**
 * Portfolio card with hover overlay
 */
export function PortfolioCard({
  assetId,
  title,
  description,
  category,
  className = '',
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default'
  };
  
  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '16px',
    color: 'white',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };
  
  return (
    <div
      className={`portfolio-card ${className}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <AetherImage
        assetId={assetId}
        alt={title}
        style={{
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s ease'
        }}
      />
      <div style={overlayStyle}>
        {category && (
          <span style={{ 
            fontSize: '0.75em', 
            textTransform: 'uppercase',
            opacity: 0.8,
            marginBottom: '4px'
          }}>
            {category}
          </span>
        )}
        <h3 style={{ margin: '0 0 4px', fontSize: '1.1em' }}>{title}</h3>
        {description && (
          <p style={{ margin: 0, fontSize: '0.875em', opacity: 0.9 }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Exports
// =============================================================================

export default {
  AetherImage,
  AetherGallery,
  Win95Frame,
  TeamMemberCard,
  PortfolioCard,
  useFormatSupport,
  useLazyLoad,
  generateSrcset,
  getLqipUrl,
  CONFIG
};
