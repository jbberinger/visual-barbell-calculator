import React, { useContext } from 'react';
import { SettingsContext, WeightUnit } from '../context/settings-context';

const SettingsPanel: React.FC<any> = () => {

  const [optionsState, setOptionsState] = useContext(SettingsContext);

  return (
    <div className='settings-panel'>
      {JSON.stringify(optionsState.plates.kg)}
    </div>
  );
}

export default SettingsPanel;