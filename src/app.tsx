import React, { useState, useEffect } from 'react';
import './style/app.scss';
import Dimension from './util/dimension';
import BarbellCanvas from './component/barbell-canvas';
import Calculator from './component/calculator';
import SettingsPanel from './component/settings-panel';
import NavPanel from './component/nav-panel';
import Footer from './component/footer';
import { CalculatorProvider } from './context/calculator-context';
import { SettingsProvider } from './context/settings-context';

const App: React.FC = () => {
  // Calculates canvas width from screen width with constraints.
  //
  // Media query constraints:
  // @media (min-width: 800px) and (min-height: 1080px)
  // 
  const canvasWidthFromScreenWidth = (): number => {
    return (window.innerWidth > 800 && window.innerHeight < 1080)
      ? window.innerWidth / 2
      : window.innerWidth > 315 ? window.innerWidth : 315;
  }

  const [screenWidth, setScreenWidth] = useState(canvasWidthFromScreenWidth());
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  // Calculates bar width relative to screen width with 'magic ratio'
  const barWidthFromScreenWidth = (width: number): number => width * (15 / 320);
  const dimension = new Dimension(barWidthFromScreenWidth(screenWidth));

  // Updates dimensions relative to screen width on screen resize
  useEffect(() => {
    const handleResize = () => {
      const updatedCanvasWidth = canvasWidthFromScreenWidth();
      setScreenWidth(updatedCanvasWidth);
      dimension.update(barWidthFromScreenWidth(updatedCanvasWidth));
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [screenWidth, dimension]);

  return (
    <SettingsProvider>
      <CalculatorProvider>
        <div className='app'>
          <NavPanel />
          <SettingsPanel />
          <main className='grid'>
            <Calculator />
            <BarbellCanvas
              dimension={dimension}
              screenWidth={screenWidth}
            />
            <Footer />
          </main>
        </div>
      </CalculatorProvider>
    </SettingsProvider>
  );
}

export default App;
