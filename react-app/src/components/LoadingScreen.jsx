import React, { useState, useEffect } from 'react';

function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${hidden ? 'hidden' : ''}`}>
      <div className="boot-text">AETHER PXE v2.0 - Initializing...</div>
      <img
        src="/assets/webp/aether-brand-logo-main.webp"
        alt="AETHER Loading"
        className="alchemical-loader"
      />
    </div>
  );
}

export default LoadingScreen;
