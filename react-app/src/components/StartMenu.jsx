import React from 'react';
import { useWindowContext } from '../context/WindowContext';

function StartMenu() {
  const { startMenuOpen, openWindow, closeStartMenu } = useWindowContext();

  const handleMenuItemClick = (windowId) => {
    openWindow(windowId);
    closeStartMenu();
  };

  return (
    <div className={`start-menu ${startMenuOpen ? 'show' : ''}`}>
      <div className="menu-container">
        <div className="start-menu-banner">AETHER</div>
        <div className="menu-items">
          <div
            className="menu-item"
            onClick={() => handleMenuItemClick('ethos')}
            role="button"
            tabIndex={0}
          >
            <span>🛡️</span>
            <span>ETHOS - Credibility</span>
          </div>
          <div
            className="menu-item"
            onClick={() => handleMenuItemClick('pathos')}
            role="button"
            tabIndex={0}
          >
            <span>❤️</span>
            <span>PATHOS - Emotion</span>
          </div>
          <div
            className="menu-item"
            onClick={() => handleMenuItemClick('logos')}
            role="button"
            tabIndex={0}
          >
            <span>🧠</span>
            <span>LOGOS - Logic</span>
          </div>
          <div className="menu-divider" />
          <div
            className="menu-item"
            onClick={() => handleMenuItemClick('portfolio')}
            role="button"
            tabIndex={0}
          >
            <span>📁</span>
            <span>Portfolio Gallery</span>
          </div>
          <div
            className="menu-item"
            onClick={() => handleMenuItemClick('brands')}
            role="button"
            tabIndex={0}
          >
            <span>⭐</span>
            <span>Brands & IP</span>
          </div>
          <div className="menu-divider" />
          <div
            className="menu-item"
            onClick={() => handleMenuItemClick('about')}
            role="button"
            tabIndex={0}
          >
            <span>ℹ️</span>
            <span>About AETHER</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartMenu;
