/**
 * AETHER React - Taskbar Component
 * Windows 95 style taskbar with start button and window buttons
 */

import { useState, useEffect } from 'react';

const WINDOW_LABELS = {
  ethos: 'ETHOS',
  pathos: 'PATHOS',
  logos: 'LOGOS',
  about: 'About AETHER',
  portfolio: 'Portfolio',
  contact: 'Contact',
};

function Taskbar({
  windows,
  activeWindows,
  onStartClick,
  onWindowClick,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="taskbar">
      <button className="start-button" onClick={onStartClick}>
        <svg
          className="start-button-logo"
          viewBox="0 0 32 32"
          width="24"
          height="24"
        >
          {/* AETHER Logo simplified for start button */}
          <circle cx="16" cy="16" r="14" fill="#667eea" />
          <polygon
            points="16,6 26,24 6,24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x="16"
            y="20"
            textAnchor="middle"
            fill="white"
            fontSize="6"
            fontWeight="bold"
          >
            AE
          </text>
        </svg>
        <span>Start</span>
      </button>

      <div className="taskbar-items">
        {activeWindows.map((windowName) => {
          const windowState = windows[windowName];
          return (
            <button
              key={windowName}
              className={`task-button ${!windowState.minimized ? 'active' : ''}`}
              onClick={() => onWindowClick(windowName)}
            >
              {WINDOW_LABELS[windowName] || windowName}
            </button>
          );
        })}
      </div>

      <div className="system-tray">
        <span>{formatTime(currentTime)}</span>
      </div>
    </div>
  );
}

export default Taskbar;
