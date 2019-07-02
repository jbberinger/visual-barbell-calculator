import React, { useRef, useState, useEffect, useContext, MouseEvent } from 'react';
import { CalculatorContext } from '../context/calculator-context';
import { WeightUnit } from '../context/settings-context';

// Navigation for switching between weight units and triggering the settings drawer animation
const NavPanel: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [currentWeightUnit, setCurrentWeightUnit] = useContext(CalculatorContext);

  const handleWeightUnitButton = (event: MouseEvent<HTMLButtonElement>) => {
    const id: string | null = event.currentTarget.getAttribute('id');
    if (id && id === 'kgUnitButton' && currentWeightUnit === WeightUnit.LB) {
      setCurrentWeightUnit(WeightUnit.LB);
    } else if (id === 'lbUnitButton' && currentWeightUnit === WeightUnit.KG) {
      setCurrentWeightUnit(WeightUnit.KG);
    }
  }

  const handleSettingsButton = () => {
    const offset: string = settingsVisible ? '-40vh' : '0';
    const grid: HTMLElement = document.querySelector('.grid') as HTMLElement;
    grid.style.transform = `translateY(${offset})`;
    setSettingsVisible(!settingsVisible);
  }

  return (
    <nav className='nav'>
      <div>
        <input type='radio' />
        <button className='nav-button' id='kgUnitButton' onClick={handleWeightUnitButton}>kg</button>
        <input type='radio' />
        <button className='nav-button' id='lbUnitButton' onClick={handleWeightUnitButton}>lb</button>
      </div>
      <button className='nav-button' onClick={handleSettingsButton}>settings</button>
    </nav>
  )
}

export default NavPanel;