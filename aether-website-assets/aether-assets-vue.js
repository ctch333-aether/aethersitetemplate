/**
 * AETHER Assets Vue 3 Components v2.0.0
 * 
 * Vue 3 Composition API components for optimal image loading
 * 
 * Usage:
 * import { AetherImage, AetherGallery, Win95Frame } from './aether-assets-vue';
 * 
 * <AetherImage 
 *   asset-id="aether-brand-logo-main" 
 *   alt="AETHER Logo"
 * />
 */

import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue';

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
// Composables
// =============================================================================

/**
 * Composable for format support detection
 */
export function useFormatSupport() {
  const supportsAvif = ref(false);
  const supportsWebp = ref(false);
  
  onMounted(() => {
    // Check WebP
    const webp = new Image();
    webp.onload = () => { supportsWebp.value = true; };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    // Check AVIF
    const avif = new Image();
    avif.onload = () => { supportsAvif.value = true; };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABpAQ0AIyExAAAAAP+I9ngA==';
  });
  
  return { supportsAvif, supportsWebp };
}

/**
 * Composable for lazy loading
 */
export function useLazyLoad(options = {}) {
  const elementRef = ref(null);
  const isVisible = ref(false);
  const hasLoaded = ref(false);
  
  let observer = null;
  
  onMounted(() => {
    if (!elementRef.value) return;
    
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: options.rootMargin || '50px', threshold: 0.01 }
    );
    
    observer.observe(elementRef.value);
  });
  
  onUnmounted(() => {
    observer?.disconnect();
  });
  
  return { elementRef, isVisible, hasLoaded };
}

// =============================================================================
// Utility Functions
// =============================================================================

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

export function getLqipUrl(assetId) {
  return `${CONFIG.basePath}/lqip/${assetId}-blur.webp`;
}

// =============================================================================
// Components
// =============================================================================

/**
 * Main image component
 */
export const AetherImage = defineComponent({
  name: 'AetherImage',
  props: {
    assetId: { type: String, required: true },
    alt: { type: String, default: '' },
    sizes: { type: String, default: CONFIG.defaultSizes },
    lazy: { type: Boolean, default: true },
    showLqip: { type: Boolean, default: true }
  },
  emits: ['load', 'error'],
  setup(props, { emit }) {
    const { supportsAvif, supportsWebp } = useFormatSupport();
    const { elementRef, isVisible, hasLoaded } = useLazyLoad();
    const error = ref(false);
    
    const lqipUrl = computed(() => getLqipUrl(props.assetId));
    
    const containerStyle = computed(() => ({
      position: 'relative',
      overflow: 'hidden',
      ...(props.showLqip && !hasLoaded.value ? {
        backgroundImage: `url(${lqipUrl.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {})
    }));
    
    const imgStyle = computed(() => ({
      opacity: hasLoaded.value ? 1 : 0,
      transition: 'opacity 0.3s ease',
      width: '100%',
      height: 'auto',
      display: 'block'
    }));
    
    const handleLoad = (e) => {
      hasLoaded.value = true;
      emit('load', e);
    };
    
    const handleError = (e) => {
      error.value = true;
      emit('error', e);
    };
    
    return () => {
      if (error.value) {
        return h('div', { 
          ref: elementRef,
          class: 'aether-img-error',
          style: containerStyle.value
        }, 'Failed to load image');
      }
      
      const sources = [];
      
      if (supportsAvif.value) {
        sources.push(h('source', {
          type: 'image/avif',
          srcset: generateSrcset(props.assetId, 'avif'),
          sizes: props.sizes
        }));
      }
      
      if (supportsWebp.value) {
        sources.push(h('source', {
          type: 'image/webp',
          srcset: generateSrcset(props.assetId, 'webp'),
          sizes: props.sizes
        }));
      }
      
      const img = h('img', {
        src: `${CONFIG.basePath}/png-fallback/${props.assetId}.png`,
        srcset: generateSrcset(props.assetId, 'png'),
        sizes: props.sizes,
        alt: props.alt,
        loading: props.lazy ? 'lazy' : 'eager',
        decoding: 'async',
        onLoad: handleLoad,
        onError: handleError,
        style: imgStyle.value
      });
      
      return h('div', {
        ref: elementRef,
        class: 'aether-img-frame',
        style: containerStyle.value
      }, [
        (isVisible.value || !props.lazy) && h('picture', null, [...sources, img])
      ]);
    };
  }
});

/**
 * Win95 frame component
 */
export const Win95Frame = defineComponent({
  name: 'Win95Frame',
  props: {
    title: { type: String, default: 'Image' },
    showTitleBar: { type: Boolean, default: true },
    variant: { type: String, default: 'default' }
  },
  setup(props, { slots }) {
    const frameStyle = {
      background: '#c0c0c0',
      border: '2px solid',
      borderColor: '#ffffff #808080 #808080 #ffffff',
      boxShadow: '1px 1px 0 #404040'
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
    
    const contentStyle = computed(() => ({
      padding: props.variant === 'mspaint' ? '3px' : '8px',
      ...(props.variant === 'inset' ? {
        margin: '4px',
        border: '2px solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        background: 'white'
      } : {})
    }));
    
    return () => h('div', { class: 'win95-frame', style: frameStyle }, [
      props.showTitleBar && h('div', { style: titleBarStyle }, [
        h('span', null, props.title),
        h('div', { style: { display: 'flex', gap: '2px' } }, [
          h('button', { style: { width: '16px', height: '14px', fontSize: '10px' } }, '_'),
          h('button', { style: { width: '16px', height: '14px', fontSize: '10px' } }, '□'),
          h('button', { style: { width: '16px', height: '14px', fontSize: '10px' } }, '×')
        ])
      ]),
      h('div', { style: contentStyle.value }, slots.default?.())
    ]);
  }
});

/**
 * Gallery component
 */
export const AetherGallery = defineComponent({
  name: 'AetherGallery',
  props: {
    assets: { type: Array, required: true },
    columns: { type: Number, default: 3 },
    gap: { type: Number, default: 16 }
  },
  setup(props, { slots }) {
    const gridStyle = computed(() => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
      gap: `${props.gap}px`
    }));
    
    return () => h('div', { class: 'aether-gallery', style: gridStyle.value }, 
      props.assets.map((asset, index) => 
        slots.item 
          ? slots.item({ asset, index })
          : h(AetherImage, {
              key: typeof asset === 'string' ? asset : asset.id,
              assetId: typeof asset === 'string' ? asset : asset.id,
              alt: typeof asset === 'object' ? asset.alt : ''
            })
      )
    );
  }
});

// =============================================================================
// Plugin Installation
// =============================================================================

export default {
  install(app) {
    app.component('AetherImage', AetherImage);
    app.component('AetherGallery', AetherGallery);
    app.component('Win95Frame', Win95Frame);
    
    app.config.globalProperties.$aetherAssets = {
      generateSrcset,
      getLqipUrl,
      CONFIG
    };
  }
};

export { CONFIG };
