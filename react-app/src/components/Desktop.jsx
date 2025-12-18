import React from 'react';
import { useWindowContext } from '../context/WindowContext';

function Desktop() {
  const { openWindow } = useWindowContext();

  return (
    <>
      <main className="desktop">
        {/* Brand Logo */}
        <div className="brand-logo-container">
          <img
            src="/assets/webp/aether-brand-logo-main.webp"
            alt="AETHER - Phygital Experience Platform"
          />
        </div>

        {/* Three Main Buttons */}
        <div className="main-button-container">
          {/* ETHOS Button */}
          <div
            className="main-desktop-button"
            onClick={() => openWindow('ethos')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openWindow('ethos')}
          >
            <img
              src="/assets/webp/aether-brand-logo-main.webp"
              alt="ETHOS"
              className="button-icon"
            />
            <div className="button-label">ETHOS</div>
            <div className="button-subtitle">Credibility, Authority & The Vision</div>
          </div>

          {/* PATHOS Button */}
          <div
            className="main-desktop-button"
            onClick={() => openWindow('pathos')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openWindow('pathos')}
          >
            <img
              src="/assets/webp/aether-ip-tales-of-lucidia.webp"
              alt="PATHOS"
              className="button-icon"
            />
            <div className="button-label">PATHOS</div>
            <div className="button-subtitle">Emotion, Connection & Project Impact</div>
          </div>

          {/* LOGOS Button */}
          <div
            className="main-desktop-button"
            onClick={() => openWindow('logos')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openWindow('logos')}
          >
            <img
              src="/assets/webp/BRANDwork-ProjectionMapping-CircuitNeuron.webp"
              alt="LOGOS"
              className="button-icon"
            />
            <div className="button-label">LOGOS</div>
            <div className="button-subtitle">Logic, Systems & Technical Expertise</div>
          </div>
        </div>
      </main>

      {/* Side Buttons */}
      <div className="side-buttons">
        <button
          className="side-button"
          onClick={() => openWindow('portfolio')}
        >
          <span>📁</span>
          <span>Portfolio</span>
        </button>
        <button
          className="side-button"
          onClick={() => openWindow('brands')}
        >
          <span>⭐</span>
          <span>Brands & IP</span>
        </button>
        <button
          className="side-button"
          onClick={() => openWindow('about')}
        >
          <span>ℹ️</span>
          <span>About</span>
        </button>
      </div>
    </>
  );
}

export default Desktop;
