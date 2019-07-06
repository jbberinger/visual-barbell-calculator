import React, { useContext, ChangeEvent, useState } from 'react';
import { SettingsContext, initialSettingsState, WeightUnit } from '../context/settings-context';

// Settings drawer to control plates available and barbell/collar weights
const SettingsPanel: React.FC<any> = () => {

  const [settingsState, setSettingsState] = useContext(SettingsContext);
  const [localSettings, setLocalSettings] = useState({ ...settingsState });
  const { equipment, plates } = localSettings;
  const kgPlateList: string[] = Object.keys(plates.kg).sort((a, b) => parseFloat(b) - parseFloat(a));
  const lbPlateList: string[] = Object.keys(plates.lb).sort((a, b) => parseFloat(b) - parseFloat(a));

  // Ensures string is a valid decimal
  const sanitizeDecimal = (input: string): string => `${parseFloat(input.replace(/[^0-9.]/g, ''))}`;

  const handlePlateSelect = (event: ChangeEvent<HTMLButtonElement>) => {
    const [, weight, unit] = event!.target!.getAttribute('id')!.split('-');
    const updatedLocalSettings = { ...localSettings };
    updatedLocalSettings.plates[unit][weight] = event.target.value;
    setLocalSettings(updatedLocalSettings);
  }

  const handleEquipmentInput = (event: ChangeEvent<HTMLButtonElement>) => {
    const updatedLocalSettings = { ...localSettings };
    const [equipment, unit] = event.target!.getAttribute('id')!.split('-');
    let value = event.target.value;
    if (value === '') {
      value = '0';
    } else {
      value = sanitizeDecimal(event.target.value);
    }
    updatedLocalSettings.equipment[equipment][unit] = parseFloat(value);
    setLocalSettings(updatedLocalSettings);
  }

  const handleSave = () => {
    setSettingsState(localSettings);
  }

  return (
    <div className='settings-panel'>
      <form>

        <div className='settings-equipment'>
          <div className='equipment-group'>
            <h4>Barbell Weight</h4>
            <EquipmentSettingCard
              unit='kg'
              equipment='barbell'
              currentValue={localSettings}
              handleEquipmentInput={handleEquipmentInput}
            />
            <EquipmentSettingCard
              unit='lb'
              equipment='barbell'
              currentValue={localSettings}
              handleEquipmentInput={handleEquipmentInput}
            />
          </div>
          <div className='equipment-group'>
            <h4>Collar Weight</h4>
            <EquipmentSettingCard
              unit='kg'
              equipment='collar'
              currentValue={localSettings}
              handleEquipmentInput={handleEquipmentInput}
            />
            <EquipmentSettingCard
              unit='lb'
              equipment='collar'
              currentValue={localSettings}
              handleEquipmentInput={handleEquipmentInput}
            />
          </div>
        </div>

        <div className='settings-plates'>
          <div className='plate-group'>
            <h4>KG Plates</h4>
            {
              kgPlateList.map(plate => (
                <PlateSettingCard
                  handlePlateSelect={handlePlateSelect}
                  plateWeight={plate}
                  unit='kg'
                  currentValue={plates.kg[plate]}
                  key={`plateCard${plate}kg`}
                />
              ))
            }
          </div>
          <div className='plate-group'>
            <h4>LB Plates</h4>
            {
              lbPlateList.map(plate => (
                <PlateSettingCard
                  handlePlateSelect={handlePlateSelect}
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
        <button onClick={() => setLocalSettings(initialSettingsState)}>default</button>
        <button onClick={handleSave}>save</button>
      </div>
    </div>

  );
}

// Input for equipment weights
const EquipmentSettingCard: React.FC<any> = ({ unit, equipment, currentValue, handleEquipmentInput }) => {
  return (
    <div className='equipment-card'>
      <div className='setting-input-container'>
        <input
          type='tel'
          value={currentValue.equipment[equipment][unit]}
          id={`${equipment}-${unit}`}
          onChange={handleEquipmentInput}
        />
      </div>
      {unit}
    </div>
  )
}

// Input with increment/decrement buttons for plates available
const PlateSettingCard: React.FC<any> = ({ handlePlateSelect, plateWeight, unit, currentValue }) => {
  const options = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '∞'];
  const values = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, Infinity];
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
      {plateWeight}
    </div>
  )
}

export default SettingsPanel;