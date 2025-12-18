/**
 * AETHER React - Window Manager Hook
 * Manages Windows 95 style windows - open, close, minimize, drag
 */

import { useState, useCallback, useRef } from 'react';

export function useWindowManager() {
  const [windows, setWindows] = useState({
    ethos: { active: false, minimized: false, zIndex: 1 },
    pathos: { active: false, minimized: false, zIndex: 1 },
    logos: { active: false, minimized: false, zIndex: 1 },
    about: { active: false, minimized: false, zIndex: 1 },
    portfolio: { active: false, minimized: false, zIndex: 1 },
    contact: { active: false, minimized: false, zIndex: 1 },
  });

  const zIndexCounter = useRef(1);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const openWindow = useCallback((windowName) => {
    zIndexCounter.current += 1;
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        active: true,
        minimized: false,
        zIndex: zIndexCounter.current
      }
    }));
    setStartMenuOpen(false);
  }, []);

  const closeWindow = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        active: false,
        minimized: false
      }
    }));
  }, []);

  const minimizeWindow = useCallback((windowName) => {
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        minimized: true
      }
    }));
  }, []);

  const restoreWindow = useCallback((windowName) => {
    zIndexCounter.current += 1;
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        minimized: false,
        zIndex: zIndexCounter.current
      }
    }));
  }, []);

  const focusWindow = useCallback((windowName) => {
    zIndexCounter.current += 1;
    setWindows(prev => ({
      ...prev,
      [windowName]: {
        ...prev[windowName],
        zIndex: zIndexCounter.current
      }
    }));
  }, []);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
  }, []);

  const closeStartMenu = useCallback(() => {
    setStartMenuOpen(false);
  }, []);

  const activeWindows = Object.entries(windows)
    .filter(([, state]) => state.active)
    .map(([name]) => name);

  return {
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
  };
}

export default useWindowManager;
