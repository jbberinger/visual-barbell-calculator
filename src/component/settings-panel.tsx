import React, { useContext, ChangeEvent, useState } from 'react';
import { SettingsContext, defaultSettingsState } from '../context/settings-context';

// Settings drawer to control plates available and barbell/collar weights
const SettingsPanel: React.FC<any> = () => {
  const [settingsState, setSettingsState] = useContext(SettingsContext);
  const { plates } = settingsState;
  const kgPlateList: string[] = Object.keys(plates.kg).sort((a, b) => parseFloat(b) - parseFloat(a));
  const lbPlateList: string[] = Object.keys(plates.lb).sort((a, b) => parseFloat(b) - parseFloat(a));
  const [localEquipmentState, setLocalEquipmentState] = useState<any>({
    barbell: {
      kg: settingsState.equipment.barbell.kg.toString(),
      lb: settingsState.equipment.barbell.lb.toString(),
    },
    collar: {
      kg: settingsState.equipment.collar.kg.toString(),
      lb: settingsState.equipment.collar.lb.toString(),
    }
  });

  // Ensures string is a valid decimal
  const sanitizeDecimal = (input: string): string => `${input.replace(/[^0-9.]/g, '')}`;

  // Checks if value is positive and numeric with no spaces
  const isPositiveNumeric = (value: any): boolean => {
    return !isNaN(value - parseFloat(value)) && parseFloat(value) > 0 && value === sanitizeDecimal(value)
  };

  // 
  const handlePlateSelect = (unit: string, plate: string, event: ChangeEvent<HTMLButtonElement>) => {
    const updatedSettings = { ...settingsState };
    updatedSettings.plates[unit][plate] = parseFloat(event.target.value);
    setSettingsState(updatedSettings);
  }

  //  Sanitizes input and converts to other unit if necessary
  const handleEquipmentInput = (equipment: string, unit: string, event: ChangeEvent<HTMLButtonElement>) => {
    const kgToLbFactor = 2.20462262;
    let value = event.target.value;

    const updatedEquipmentState = { ...localEquipmentState };
    if (value !== '00') {
      // displays 0 when cleared
      if (value === '' || value === '0') {
        updatedEquipmentState[equipment].kg = '0';
        updatedEquipmentState[equipment].lb = '0';
        setLocalEquipmentState(updatedEquipmentState);
      }
      // prefixes 0 to decimal numbers < 0
      else if (value === '0.') {
        updatedEquipmentState[equipment][unit] = '0.';
        setLocalEquipmentState(updatedEquipmentState);
      }
      // checks for valid decimal number input
      else if (isPositiveNumeric(value)) {
        // strips leading 0 if not part of decimal
        if (value[0] === '0' && value[1] !== '.') {
          value = value.slice(1);
        }
        const updatedSettingsState = { ...settingsState };
        // checks if input is the start of a decimal
        // prevents conversion if input ends with a period
        if (value[value.length - 1] === '.') {
          updatedEquipmentState[equipment][unit] = value;
        } else {
          // Converts and updates other equipment unit 
          let convertedValue: number;
          if (unit === 'kg') {
            convertedValue = Math.round(parseFloat(value) * kgToLbFactor * 100) / 100;
            updatedEquipmentState[equipment].lb = convertedValue.toString();
            updatedSettingsState.equipment[equipment].lb = convertedValue;
          } else {
            convertedValue = Math.round(parseFloat(value) / kgToLbFactor * 100) / 100;
            updatedEquipmentState[equipment].kg = convertedValue.toString();
            updatedSettingsState.equipment[equipment].kg = convertedValue;
          }
          updatedEquipmentState[equipment][unit] = value;
          setSettingsState(updatedSettingsState);
        }

        setLocalEquipmentState(updatedEquipmentState);
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
                currentValue={localEquipmentState.barbell.kg}
                handleEquipmentInput={
                  (event: ChangeEvent<HTMLButtonElement>) => handleEquipmentInput('barbell', 'kg', event)
                }
              />
              <EquipmentSettingCard
                unit='lb'
                equipment='barbell'
                currentValue={localEquipmentState.barbell.lb}
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
                currentValue={localEquipmentState.collar.kg}
                handleEquipmentInput={
                  (event: ChangeEvent<HTMLButtonElement>) => handleEquipmentInput('collar', 'kg', event)
                }
              />
              <EquipmentSettingCard
                unit='lb'
                equipment='collar'
                currentValue={localEquipmentState.collar.lb}
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
            value={currentValue}
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