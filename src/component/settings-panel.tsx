import React, { useContext } from 'react';
import { SettingsContext, WeightUnit } from '../context/settings-context';

// Settings drawer to control plates available and barbell/collar weights
const SettingsPanel: React.FC<any> = () => {

  const [optionsState, setOptionsState] = useContext(SettingsContext);

  return (
    <div className='settings-panel'>
      Settings Panel
    </div>
  );
}

export default SettingsPanel;