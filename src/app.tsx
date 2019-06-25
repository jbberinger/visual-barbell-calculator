import React, { useState, useEffect, useRef } from 'react';
import './style/app.scss';
import Dimension from './util/dimension';
import BarbellCanvas from './component/barbell-canvas';
import WeightInput from './component/weight-input';

const App: React.FC = () => {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const dimension = new Dimension(15);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      dimension.update(15);
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
        <BarbellCanvas dimension={dimension} />
      </main>
    </div>
  );
}

export default App;
