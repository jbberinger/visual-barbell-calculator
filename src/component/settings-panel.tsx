import React, { useContext, ChangeEvent, useEffect } from 'react';
import { SettingsContext, defaultSettingsState } from '../context/settings-context';

// Settings drawer to control plates available and barbell/collar weights
const SettingsPanel: React.FC<any> = () => {
  const [settingsState, setSettingsState] = useContext(SettingsContext);
  const { plates } = settingsState;
  const kgPlateList: string[] = Object.keys(plates.kg).sort((a, b) => parseFloat(b) - parseFloat(a));
  const lbPlateList: string[] = Object.keys(plates.lb).sort((a, b) => parseFloat(b) - parseFloat(a));

  // Ensures string is a valid decimal
  const sanitizeDecimal = (input: string): string => `${parseFloat(input.replace(/[^0-9.]/g, ''))}`;

  // Checks if value is positive and numeric with no spaces
  const isPositiveNumeric = (value: any): boolean => {
    return !isNaN(value - parseFloat(value)) && parseFloat(value) > 0 && value === sanitizeDecimal(value)
  };

  const handlePlateSelect = (unit: string, plate: string, event: ChangeEvent<HTMLButtonElement>) => {
    console.log('handle plate select');
    const updatedSettings = { ...settingsState };
    updatedSettings.plates[unit][plate] = parseFloat(event.target.value);
    setSettingsState(updatedSettings);
  }

  const handleEquipmentInput = (equipment: string, unit: string, event: ChangeEvent<HTMLButtonElement>) => {
    const kgToLbFactor = 2.20462262;
    console.log('handle equipment input');
    const updatedSettings = { ...settingsState };

    let value = event.target.value;

    /////////

    if (value !== '00') {
      // displays 0 when cleared
      if (value === '') {
        value = '0';
        updatedSettings.equipment[equipment].lb = 0;
        updatedSettings.equipment[equipment].kg = 0;
        setSettingsState(updatedSettings);
      }
      // prefixes 0 to decimal numbers < 0
      else if (value === '.') {
        value = '0.';
        updatedSettings.equipment[equipment].lb = value;
        updatedSettings.equipment[equipment].kg = value;
        setSettingsState(updatedSettings);
      }
      // checks for valid decimal number input
      else if (isPositiveNumeric(value)) {
        // Converts and updates other unit 
        let convertedValue: number;
        if (unit === 'kg') {
          convertedValue = Math.round(parseFloat(value) * kgToLbFactor * 100) / 100;
          updatedSettings.equipment[equipment].lb = convertedValue;
        } else {
          convertedValue = Math.round(parseFloat(value) / kgToLbFactor * 100) / 100;
          updatedSettings.equipment[equipment].kg = convertedValue;
        }

        updatedSettings.equipment[equipment][unit] = parseFloat(value);
        setSettingsState(updatedSettings);
      }
    }
  }

  // Resets all settings to default values
  const handleDefault = () => {
    const updatedSettings = { ...settingsState };
    updatedSettings.equipment.collar = { ...defaultSettingsState.equipment.collar }
    updatedSettings.equipment.barbell = { ...defaultSettingsState.equipment.barbell };
    updatedSettings.plates.kg = { ...defaultSettingsState.plates.kg };
    updatedSettings.plates.lb = { ...defaultSettingsState.plates.lb };
    setSettingsState(updatedSettings);
  }

  return (
    <div className='settings-panel'>
      <form>

        <div className='settings-equipment'>
          <div className='equipment-group'>
            <h4>Barbell Weight</h4>
            <div className='equipment-weight-container'>
              <EquipmentSettingCard
                unit='kg'
                equipment='barbell'
                currentValue={settingsState}
                handleEquipmentInput={
                  (event: ChangeEvent<HTMLButtonElement>) => handleEquipmentInput('barbell', 'kg', event)
                }
              />
              <EquipmentSettingCard
                unit='lb'
                equipment='barbell'
                currentValue={settingsState}
                handleEquipmentInput={
                  (event: ChangeEvent<HTMLButtonElement>) => handleEquipmentInput('barbell', 'lb', event)
                }
              />
            </div>
          </div>
          <div className='equipment-group'>
            <h4>Collar Weight</h4>
            <div className='equipment-weight-container'>
              <EquipmentSettingCard
                unit='kg'
                equipment='collar'
                currentValue={settingsState}
                handleEquipmentInput={
                  (event: ChangeEvent<HTMLButtonElement>) => handleEquipmentInput('collar', 'kg', event)
                }
              />
              <EquipmentSettingCard
                unit='lb'
                equipment='collar'
                currentValue={settingsState}
                handleEquipmentInput={
                  (event: ChangeEvent<HTMLButtonElement>) => handleEquipmentInput('collar', 'lb', event)
                }
              />
            </div>
          </div>
        </div>

        <div className='settings-plates'>
          <div className='plate-group'>
            <h4>KG Plate Pairs</h4>
            {
              kgPlateList.map(plate => (
                <PlateSettingCard
                  handlePlateSelect={
                    (event: ChangeEvent<HTMLButtonElement>) => handlePlateSelect('kg', plate, event)
                  }
                  plateWeight={plate}
                  unit='kg'
                  currentValue={plates.kg[plate]}
                  key={`plateCard${plate}kg`}
                />
              ))
            }
          </div>
          <div className='plate-group'>
            <h4>LB Plate Pairs</h4>
            {
              lbPlateList.map(plate => (
                <PlateSettingCard
                  handlePlateSelect={
                    (event: ChangeEvent<HTMLButtonElement>) => handlePlateSelect('lb', plate, event)
                  }
                  plateWeight={plate}
                  unit='lb'
                  currentValue={plates.lb[plate]}
                  key={`plateCard${plate}lb`}
                />
              ))
            }
          </div>
        </div>

      </form >
      <div className='submit-group'>
        <button onClick={handleDefault}>default</button>
      </div>
    </div>

  );
}

// Input for equipment weights
const EquipmentSettingCard: React.FC<any> = ({ unit, equipment, currentValue, handleEquipmentInput }) => {
  return (
    <div className='equipment-card'>
      <div className='setting-input-container'>
        <label>
          <input
            type='text'
            value={
              currentValue.equipment[equipment][unit] != 0
                ? currentValue.equipment[equipment][unit]
                : ''
            }
            placeholder='0'
            onChange={handleEquipmentInput}
          />
          <span className='equipment-unit'>{unit}</span>
        </label>
      </div>

    </div>
  )
}

// Input with increment/decrement buttons for plates available
const PlateSettingCard: React.FC<any> = ({ handlePlateSelect, plateWeight, unit, currentValue }) => {
  const options = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '∞'];
  const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, Infinity];
  return (
    <div className='plate-card'>

      <select onChange={handlePlateSelect} value={currentValue} id={`select-${plateWeight}-${unit}`}>
        {
          options.map((option, index) => (
            <option
              value={values[index]}
              key={Math.random()}
              onChange={handlePlateSelect}
            >
              {option}
            </option>
          ))
        }
      </select>
      <label htmlFor={`select-${plateWeight}-${unit}`}>
        {plateWeight}
      </label>
    </div>
  )
}

export default SettingsPanel;