import React, { useState, createContext } from 'react'

// This context stores the settings state

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

// Default state for settings. Also used to reset settings.
//
// weightUnit: current calculator weight unit
// equipment: barbell/collar weights and if collar is used
// plates: plate pairs available
export const initialSettingsState = {
  equipment: {
    barbell: {
      kg: 20,
      lb: 45,
    },
    collar: {
      kg: 5,
      lb: 11.0231,
    },
  },
  plates: {
    kg: {
      '50': 0,
      '25': 10,
      '15': 10,
      '10': 10,
      '5': 10,
      '2.5': 10,
      '1.25': 10,
      '0.5': 0,
      '0.25': 0,
    },
    lb: {
      '55': 0,
      '45': 10,
      '35': 10,
      '25': 10,
      '10': 10,
      '5': 10,
      '2.5': 10,
      '1': 0,
      '0.5': 0,
      '0.25': 0,
    },
  }
}

type settingsStateType = typeof initialSettingsState;

export const SettingsContext = createContext<settingsStateType | any>(undefined);

export const SettingsProvider = (props: any) => {
  const [settingsState, setSettingsState] = useState<settingsStateType>(initialSettingsState);
  const [warning, setWarning] = useState<Warning>();
  const [currentWeightUnit, setCurrentWeightUnit] = useState(WeightUnit.KG);
  return (
    <SettingsContext.Provider
      value={[settingsState, setSettingsState, warning, setWarning, currentWeightUnit, setCurrentWeightUnit]}>
      {props.children}
    </SettingsContext.Provider>
  );
}