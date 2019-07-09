import React, { useState, useEffect, useRef } from 'react';
import './style/app.scss';
import Dimension from './util/dimension';
import BarbellCanvas from './component/barbell-canvas';
import Calculator from './component/calculator';
import SettingsPanel from './component/settings-panel';
import NavPanel from './component/nav-panel';
import { CalculatorProvider } from './context/calculator-context';
import { SettingsProvider } from './context/settings-context';
import { CanvasProvider } from './context/canvas-context'

const App: React.FC = () => {
  const [screenWidth, setScreenWidth] = useState(
    (window.innerWidth > 800 && window.innerHeight < 1080)
      ? window.innerWidth / 2
      : window.innerWidth
  );
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const barWidthFromScreenWidth = (width: number): number => width * (15 / 320);
  const dimension = new Dimension(barWidthFromScreenWidth(screenWidth));

  // Updates dimensions relative to screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth / 2);
      setScreenWidth(
        (window.innerWidth > 800 && window.innerHeight < 1080)
          ? window.innerWidth / 2
          : window.innerWidth
          );
      dimension.update(barWidthFromScreenWidth(screenWidth));
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [screenWidth, dimension]);

  return (
    <CanvasProvider>
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
            </main>
          </div>
        </CalculatorProvider>
      </SettingsProvider>
    </CanvasProvider>
  );
}

export default App;
