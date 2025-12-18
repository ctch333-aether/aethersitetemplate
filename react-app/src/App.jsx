import React, { useEffect } from 'react';
import './App.css';
import { useWindowContext } from './context/WindowContext';
import LoadingScreen from './components/LoadingScreen';
import SkyGlassLayer from './components/SkyGlassLayer';
import MatrixCanvas from './components/MatrixCanvas';
import Desktop from './components/Desktop';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import BelieveFooter from './components/BelieveFooter';
import EthosContent from './content/EthosContent';
import PathosContent from './content/PathosContent';
import LogosContent from './content/LogosContent';
import AboutContent from './content/AboutContent';
import PortfolioContent from './content/PortfolioContent';
import BrandsContent from './content/BrandsContent';

function App() {
  const { closeStartMenu } = useWindowContext();

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
        closeStartMenu();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [closeStartMenu]);

  return (
    <div className="app-container">
      <LoadingScreen />
      <SkyGlassLayer />
      <MatrixCanvas />

      <Desktop />

      <Window
        windowId="ethos"
        title="ETHOS - The AETHER Vision: Credibility & Authority"
        icon="shield"
        width={900}
      >
        <EthosContent />
      </Window>

      <Window
        windowId="pathos"
        title="PATHOS - Emotional Connection & Human Impact"
        icon="heart"
        width={900}
      >
        <PathosContent />
      </Window>

      <Window
        windowId="logos"
        title="LOGOS - Logic, Systems & Technology"
        icon="brain"
        width={900}
      >
        <LogosContent />
      </Window>

      <Window
        windowId="about"
        title="About AETHER"
        icon="info"
        width={700}
      >
        <AboutContent />
      </Window>

      <Window
        windowId="portfolio"
        title="AETHER Portfolio Gallery"
        icon="folder"
        width={1000}
      >
        <PortfolioContent />
      </Window>

      <Window
        windowId="brands"
        title="Brands & Intellectual Property"
        icon="star"
        width={900}
      >
        <BrandsContent />
      </Window>

      <BelieveFooter />
      <StartMenu />
      <Taskbar />
    </div>
  );
}

export default App;
