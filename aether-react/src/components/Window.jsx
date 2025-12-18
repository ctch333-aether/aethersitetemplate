/**
 * AETHER React - Window Component
 * Windows 95 style draggable window with title bar controls
 * Supports both mouse and touch events for mobile
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// Check if device is mobile (used to disable dragging on small screens)
const isMobileDevice = () => window.innerWidth <= 768;

function Window({
  // eslint-disable-next-line no-unused-vars
  id,
  title,
  icon,
  isActive,
  isMinimized,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
  initialPosition = { top: 50, left: 50 },
  width = 900,
  children,
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get client coordinates from mouse or touch event
  const getClientCoords = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }, []);

  const handleDragStart = useCallback((e) => {
    if (e.target.closest('.window-controls')) return;
    if (isMobile) return; // Disable dragging on mobile (windows are full-screen)

    const coords = getClientCoords(e);
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: coords.x - rect.left,
      y: coords.y - rect.top,
    };
    onFocus?.();
  }, [onFocus, isMobile, getClientCoords]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || isMobile) return;

    const coords = getClientCoords(e);
    const newX = coords.x - dragOffset.current.x;
    const newY = coords.y - dragOffset.current.y;

    const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - 50 - (windowRef.current?.offsetHeight || 0);

    setPosition({
      left: Math.max(0, Math.min(newX, maxX)),
      top: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging, isMobile, getClientCoords]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse and touch event listeners
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      // Touch events
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.addEventListener('touchcancel', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isActive || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="window active"
      style={{
        top: isMobile ? undefined : `${position.top}px`,
        left: isMobile ? undefined : `${position.left}px`,
        width: isMobile ? undefined : `${width}px`,
        zIndex,
        display: 'flex',
      }}
      onClick={onFocus}
    >
      <div
        className="window-header"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{ cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'move') }}
      >
        <div className="window-title">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="window-controls">
          <button
            className="window-button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            aria-label="Minimize"
          >
            _
          </button>
          <button
            className="window-button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Close"
          >
            x
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}

export default Window;
