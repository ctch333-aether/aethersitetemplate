/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';

const WindowContext = createContext(null);

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState({
    ethos: { isOpen: false, isMinimized: false, zIndex: 100, position: { top: 50, left: 50 } },
    pathos: { isOpen: false, isMinimized: false, zIndex: 100, position: { top: 80, left: 120 } },
    logos: { isOpen: false, isMinimized: false, zIndex: 100, position: { top: 110, left: 190 } },
    about: { isOpen: false, isMinimized: false, zIndex: 100, position: { top: 140, left: 260 } },
    portfolio: { isOpen: false, isMinimized: false, zIndex: 100, position: { top: 60, left: 100 } },
    brands: { isOpen: false, isMinimized: false, zIndex: 100, position: { top: 90, left: 150 } },
  });

  const [maxZIndex, setMaxZIndex] = useState(100);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const openWindow = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        isOpen: true,
        isMinimized: false,
        zIndex: maxZIndex + 1
      }
    }));
    setMaxZIndex(prev => prev + 1);
    setStartMenuOpen(false);
  }, [maxZIndex]);

  const closeWindow = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        isOpen: false,
        isMinimized: false
      }
    }));
  }, []);

  const minimizeWindow = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        isMinimized: true
      }
    }));
  }, []);

  const restoreWindow = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        isMinimized: false,
        zIndex: maxZIndex + 1
      }
    }));
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const bringToFront = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        zIndex: maxZIndex + 1
      }
    }));
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const updateWindowPosition = useCallback((windowName, position) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        position
      }
    }));
  }, []);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
  }, []);

  const closeStartMenu = useCallback(() => {
    setStartMenuOpen(false);
  }, []);

  const value = {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    bringToFront,
    updateWindowPosition,
    startMenuOpen,
    toggleStartMenu,
    closeStartMenu
  };

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}
