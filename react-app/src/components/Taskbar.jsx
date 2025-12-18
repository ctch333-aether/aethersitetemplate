import React, { useState, useEffect } from 'react';
import { useWindowContext } from '../context/WindowContext';

const WINDOW_NAMES = {
  ethos: '🛡️ ETHOS',
  pathos: '❤️ PATHOS',
  logos: '🧠 LOGOS',
  about: 'ℹ️ About',
  portfolio: '📁 Portfolio',
  brands: '⭐ Brands',
};

function Taskbar() {
  const { windows, toggleStartMenu, restoreWindow, minimizeWindow } = useWindowContext();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClock(time);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const openWindows = Object.entries(windows).filter(([, state]) => state.isOpen);

  const handleTaskButtonClick = (windowId) => {
    const windowState = windows[windowId];
    if (windowState.isMinimized) {
      restoreWindow(windowId);
    } else {
      minimizeWindow(windowId);
    }
  };

  return (
    <div className="taskbar">
      <button className="start-button" onClick={toggleStartMenu}>
        <img
          src="/assets/webp/aether-brand-logo-main.webp"
          alt=""
          className="start-button-logo"
        />
        <span>Start</span>
      </button>

      <div className="taskbar-items">
        {openWindows.map(([windowId, state]) => (
          <button
            key={windowId}
            className={`task-button ${!state.isMinimized ? 'active' : ''}`}
            onClick={() => handleTaskButtonClick(windowId)}
          >
            {WINDOW_NAMES[windowId] || windowId}
          </button>
        ))}
      </div>

      <div className="system-tray">
        <span>{clock}</span>
      </div>
    </div>
  );
}

export default Taskbar;
