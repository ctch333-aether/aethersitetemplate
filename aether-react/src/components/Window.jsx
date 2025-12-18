/**
 * AETHER React - Window Component
 * Windows 95 style draggable window with title bar controls
 */

import { useState, useRef, useCallback, useEffect } from 'react';

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
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls')) return;

    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    onFocus?.();
  }, [onFocus]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - 40 - (windowRef.current?.offsetHeight || 0);

    setPosition({
      left: Math.max(0, Math.min(newX, maxX)),
      top: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isActive || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="window active"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        zIndex,
        display: 'flex',
      }}
      onClick={onFocus}
    >
      <div
        className="window-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'move' }}
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
