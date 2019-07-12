import React, { useState, createContext } from 'react'

export enum WeightUnit {
  KG,
  LB
}
export enum Warning {
  NONE, // No warning
  OVERLOAD, // Plates exceed width of bar
  NOT_ENOUGH_PLATES, // Not enough plates for given plate or total plates to reach total
  ROUNDED_DOWN, // Total was rounded down to accomodate available plates
}

// Default state
export const defaultSettingsState = {
  equipment: {
    barbell: {
      kg: 20.41,
      lb: 45,
    },
    collar: {
      kg: 0,
      lb: 0,
    },
  },
  plates: {
    kg: {
      '50': 0,
      '25': Infinity,
      '15': Infinity,
      '10': Infinity,
      '5': Infinity,
      '2.5': Infinity,
      '1.25': Infinity,
      '0.5': 0,
      '0.25': 0,
    },
    lb: {
      '55': 0,
      '45': Infinity,
      '35': Infinity,
      '25': Infinity,
      '15': 0,
      '10': Infinity,
      '5': Infinity,
      '2.5': Infinity,
      '1': 0,
      '0.5': 0,
      '0.25': 0,
    },
  }
}

const initialSettingsState = {
  equipment: {
    barbell: {
      kg: 20.41,
      lb: 45,
    },
    collar: {
      kg: 0,
      lb: 0,
    },
  },
  plates: {
    kg: {
      '50': 0,
      '25': Infinity,
      '15': Infinity,
      '10': Infinity,
      '5': Infinity,
      '2.5': Infinity,
      '1.25': Infinity,
      '0.5': 0,
      '0.25': 0,
    },
    lb: {
      '55': 0,
      '45': Infinity,
      '35': Infinity,
      '25': Infinity,
      '15': 0,
      '10': Infinity,
      '5': Infinity,
      '2.5': Infinity,
      '1': 0,
      '0.5': 0,
      '0.25': 0,
    },
  }
}

type settingsStateType = typeof defaultSettingsState;

// Retrieves settings from local storage, otherwise inits from default.
const initializeSettings = (): settingsStateType => {
  const local = localStorage.getItem('settings');
  if (local) {
    return JSON.parse(local, (key, value) =>
      value === 'Infinity' ? Infinity : value
    );
  } else {
    return initialSettingsState;
  }
}

export const SettingsContext = createContext<settingsStateType | any>(undefined);

export const SettingsProvider = (props: any) => {
  const [settingsState, setSettingsState] = useState<settingsStateType | any>(initializeSettings());
  const [warning, setWarning] = useState<Warning>();
  const [currentWeightUnit, setCurrentWeightUnit] = useState(WeightUnit.LB);
  return (
    <SettingsContext.Provider
      value={
        [
          settingsState,
          setSettingsState,
          warning,
          setWarning,
          currentWeightUnit,
          setCurrentWeightUnit
        ]
      }>
      {props.children}
    </SettingsContext.Provider>
  );
}