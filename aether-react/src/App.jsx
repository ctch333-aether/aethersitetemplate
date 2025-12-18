/**
 * AETHER React - Main Application Component
 * Windows 95 Style Phygital Experience Platform
 */

import { useState, useCallback } from 'react';
import './styles/globals.css';

// Components
import MatrixRain from './components/MatrixRain';
import LoadingScreen from './components/LoadingScreen';
import Desktop from './components/Desktop';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';

// Window Contents
import {
  EthosContent,
  PathosContent,
  LogosContent,
  AboutContent,
  PortfolioContent,
  ContactContent,
} from './components/windows';

// Hooks
import useWindowManager from './hooks/useWindowManager';

// Window configuration
const WINDOW_CONFIG = {
  ethos: {
    title: 'ETHOS - The AETHER Vision: Credibility & Authority',
    icon: 'E',
    initialPosition: { top: 50, left: 50 },
    width: 900,
    component: EthosContent,
  },
  pathos: {
    title: 'PATHOS - Emotional Connection & Human Impact',
    icon: 'P',
    initialPosition: { top: 80, left: 120 },
    width: 900,
    component: PathosContent,
  },
  logos: {
    title: 'LOGOS - Logic, Systems & Technology',
    icon: 'L',
    initialPosition: { top: 110, left: 190 },
    width: 900,
    component: LogosContent,
  },
  about: {
    title: 'About AETHER',
    icon: 'i',
    initialPosition: { top: 140, left: 260 },
    width: 700,
    component: AboutContent,
  },
  portfolio: {
    title: 'Portfolio - Selected Works',
    icon: 'W',
    initialPosition: { top: 60, left: 150 },
    width: 850,
    component: PortfolioContent,
  },
  contact: {
    title: 'Contact AETHER',
    icon: '@',
    initialPosition: { top: 90, left: 200 },
    width: 800,
    component: ContactContent,
  },
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    windows,
    activeWindows,
    startMenuOpen,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    toggleStartMenu,
    closeStartMenu,
  } = useWindowManager();

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleDesktopButtonClick = useCallback((windowId) => {
    openWindow(windowId);
  }, [openWindow]);

  const handleStartMenuItemClick = useCallback((windowId) => {
    openWindow(windowId);
    closeStartMenu();
  }, [openWindow, closeStartMenu]);

  const handleTaskbarWindowClick = useCallback((windowName) => {
    const windowState = windows[windowName];
    if (windowState.minimized) {
      restoreWindow(windowName);
    } else {
      focusWindow(windowName);
    }
  }, [windows, restoreWindow, focusWindow]);

  return (
    <div className="app">
      {/* Background Layers */}
      <div className="sky-glass-layer" />
      <MatrixRain />

      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* Main Desktop */}
      {!isLoading && (
        <>
          <Desktop onButtonClick={handleDesktopButtonClick} />

          {/* Windows */}
          {Object.entries(WINDOW_CONFIG).map(([windowId, config]) => {
            const windowState = windows[windowId];
            const ContentComponent = config.component;

            return (
              <Window
                key={windowId}
                id={windowId}
                title={config.title}
                icon={config.icon}
                isActive={windowState?.active}
                isMinimized={windowState?.minimized}
                zIndex={windowState?.zIndex || 1}
                initialPosition={config.initialPosition}
                width={config.width}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onFocus={() => focusWindow(windowId)}
              >
                <ContentComponent />
              </Window>
            );
          })}

          {/* Start Menu */}
          <StartMenu
            isOpen={startMenuOpen}
            onItemClick={handleStartMenuItemClick}
            onClose={closeStartMenu}
          />

          {/* Taskbar */}
          <Taskbar
            windows={windows}
            activeWindows={activeWindows}
            onStartClick={toggleStartMenu}
            onWindowClick={handleTaskbarWindowClick}
          />
        </>
      )}
    </div>
  );
}

export default App;
