/**
 * AETHER React - Loading Screen Component
 * Boot-style loading animation with AETHER branding
 */

import { useState, useEffect } from 'react';

function LoadingScreen({ onComplete }) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${isHidden ? 'hidden' : ''}`}>
      <div className="boot-text">INITIALIZING AETHER PXR v3.0...</div>
      <svg
        className="alchemical-loader"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />

        {/* Spinning Triangle */}
        <g style={{ transformOrigin: 'center', animation: 'spin 4s linear infinite' }}>
          <polygon
            points="100,20 170,150 30,150"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </g>

        {/* Inner Triangle (inverted) */}
        <g style={{ transformOrigin: 'center', animation: 'spin 4s linear infinite reverse' }}>
          <polygon
            points="100,150 145,60 55,60"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
          />
        </g>

        {/* Center Circle */}
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* AETHER Text */}
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontFamily="'MS Sans Serif', sans-serif"
          fontWeight="bold"
        >
          AETHER
        </text>
      </svg>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
