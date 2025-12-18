import React, { useCallback } from 'react';
import { useWindowContext } from '../context/WindowContext';
import { useDrag } from '../hooks/useDrag';

const ICONS = {
  shield: '🛡️',
  heart: '❤️',
  brain: '🧠',
  info: 'ℹ️',
  folder: '📁',
  star: '⭐',
};

function Window({ windowId, title, icon, width = 800, children }) {
  const { windows, closeWindow, minimizeWindow, bringToFront, updateWindowPosition } = useWindowContext();
  const windowState = windows[windowId];

  const handlePositionChange = useCallback((newPosition) => {
    updateWindowPosition(windowId, newPosition);
  }, [windowId, updateWindowPosition]);

  const handleDragStart = useCallback(() => {
    bringToFront(windowId);
  }, [windowId, bringToFront]);

  const { position, handleMouseDown } = useDrag(
    windowState?.position || { top: 50, left: 50 },
    handlePositionChange,
    handleDragStart
  );

  if (!windowState?.isOpen || windowState?.isMinimized) {
    return null;
  }

  const isActive = windowState.isOpen && !windowState.isMinimized;

  return (
    <div
      className={`window ${isActive ? 'active' : ''}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        zIndex: windowState.zIndex,
      }}
      onClick={() => bringToFront(windowId)}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-title">
          <span>{ICONS[icon] || '📄'}</span>
          <span>{title}</span>
        </div>
        <div className="window-controls">
          <button
            className="window-button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(windowId);
            }}
            aria-label="Minimize"
          >
            _
          </button>
          <button
            className="window-button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(windowId);
            }}
            aria-label="Close"
          >
            ✕
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
