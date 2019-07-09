import React, { useState, useContext, ChangeEvent } from 'react';
import { CalculatorContext } from '../context/calculator-context';
import { SettingsContext, WeightUnit } from '../context/settings-context';

// Navigation for switching between weight units and triggering the settings drawer animation
const NavPanel: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [, , , , currentWeightUnit, setCurrentWeightUnit] = useContext(SettingsContext);
  const [calculatorState, , convertedTotal, setConvertedTotal] = useContext(CalculatorContext);

  // Triggers settings drawer animation
  const handleSettingsButton = () => {
    setSettingsVisible(!settingsVisible);
    const settingsPanel: HTMLElement = document.querySelector('.settings-panel') as HTMLElement;
    const grid: HTMLElement = document.querySelector('.grid') as HTMLElement;
    if (!settingsVisible) {
      settingsPanel.style.height = 'initial';
      grid.style.transform = `translateY(${settingsPanel.offsetHeight}px)`;
    } else {
      // hacky fix until css height transition problem resolved
      // setTimeout(() => { settingsPanel.style.height = '0' }, 500);
      grid.style.transform = 'translateY(0)';
    }
  }

  // Changes weight unit and converts total
  const handleWeightUnit = (event: ChangeEvent<HTMLInputElement>) => {
    const kgToLbFactor = 2.20462262;
    const weightUnit: WeightUnit = parseInt(event.target.value);
    console.log(weightUnit);
    const total = calculatorState.total;
    let convertedTotal: number = 0;
    setCurrentWeightUnit(weightUnit);
    if (total !== '') {
      if (weightUnit === WeightUnit.KG) {
        convertedTotal = Math.round(parseFloat(total) / kgToLbFactor * 100) / 100;
      } else {
        convertedTotal = Math.round(parseFloat(total) * kgToLbFactor * 100) / 100;
      }
    }
    setConvertedTotal(convertedTotal);
  }

  return (
    <nav className='nav'>
      <form>
        <label style={{ color: `${currentWeightUnit === WeightUnit.KG ? 'white' : ''}` }}>

          <input
            type='radio'
            name='weightUnit'
            className='nav-unit-radio'
            defaultChecked={true}
            value={WeightUnit.KG}
            onChange={handleWeightUnit}
          />
          kg
          </label>
        <label style={{ color: `${currentWeightUnit === WeightUnit.LB ? 'white' : ''}` }}>
          <input
            type='radio'
            name='weightUnit'
            className='nav-unit-radio'
            defaultChecked={false}
            value={WeightUnit.LB}
            onChange={handleWeightUnit}
          />
          lb
          </label>
      </form>
      <button className='nav-button' onClick={handleSettingsButton}>settings</button>
    </nav>
  )
}

export default NavPanel;