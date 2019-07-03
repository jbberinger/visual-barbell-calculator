import React, { useRef, useState, useEffect, useContext, ChangeEvent } from 'react';
import { SettingsContext, WeightUnit } from '../context/settings-context';

// Navigation for switching between weight units and triggering the settings drawer animation
const NavPanel: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [, , , , , setCurrentWeightUnit] = useContext(SettingsContext);

  const handleSettingsButton = () => {
    const offset: string = settingsVisible ? '-40vh' : '0';
    const grid: HTMLElement = document.querySelector('.grid') as HTMLElement;
    grid.style.transform = `translateY(${offset})`;
    setSettingsVisible(!settingsVisible);
  }

  const handleRadioButton = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCurrentWeightUnit(event.target.value)
  }

  return (
    <nav className='nav'>
      <form>
        <label>
          <input
            type='radio'
            name='weightUnit'
            className='nav-unit-radio'
            defaultChecked={true}
            value={WeightUnit.KG}
            onChange={e => handleRadioButton(e)}
          />
          kg
        </label>
        <label>
          <input
            type='radio'
            name='weightUnit'
            className='nav-unit-radio'
            defaultChecked={false}
            value={WeightUnit.LB}
            onChange={e => handleRadioButton(e)}
          />
          lb
        </label>
      </form>
      <button className='nav-button' onClick={handleSettingsButton}>settings</button>
    </nav>
  )
}

export default NavPanel;