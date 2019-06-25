import React, { useState, useEffect, useRef } from 'react';
import './style/app.scss';
import Dimension from './util/dimension';
import BarbellCanvas from './component/barbell-canvas';
import WeightInput from './component/weight-input';

const App: React.FC = () => {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const barWidthFromScreenWidth = (width: number): number => width * (15 / 320);
  const dimension = new Dimension(barWidthFromScreenWidth(screenWidth));

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      dimension.update(barWidthFromScreenWidth(screenWidth));
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  })

  return (
    <div className='app'>
      <main className='grid'>
        <nav className='nav'>
          <div>🏋️</div>
          <div>settings</div>
        </nav>
        <WeightInput />
        <BarbellCanvas
          dimension={dimension}
          screenWidth={screenWidth}
        />
      </main>
    </div>
  );
}

export default App;
