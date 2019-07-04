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
// plates: number of plates available and if plate is used
const initialOptionsState = {
  equipment: {
    barbell: {
      weights: {
        kg: 20,
        lb: 45,
      },
    },
    collar: {
      weights: {
        kg: 5,
        lb: 11.0231,
      },
    },
  },
  plates: {
    kgPlates: {
      '50': 0,
      '25': 20,
      '15': 20,
      '10': 20,
      '5': 20,
      '2.5': 20,
      '1.25': 20,
      '0.5': 0,
      '0.25': 0,
    },
    lbPlates: {
      '55': 0,
      '45': 20,
      '35': 20,
      '25': 20,
      '10': 20,
      '5': 20,
      '2.5': 20,
      '1': 0,
      '0.5': 0,
      '0.25': 0,
    },
  }
}

type initialOptionsStateType = typeof initialOptionsState;

export const SettingsContext = createContext<initialOptionsStateType | any>(undefined);

export const SettingsProvider = (props: any) => {
  const [optionsState, setOptionsState] = useState<initialOptionsStateType>(initialOptionsState);
  const [warning, setWarning] = useState<Warning>();
  const [currentWeightUnit, setCurrentWeightUnit] = useState(WeightUnit.KG);

  return (
    <SettingsContext.Provider
      value={[optionsState, setOptionsState, warning, setWarning, currentWeightUnit, setCurrentWeightUnit]}>
      {props.children}
    </SettingsContext.Provider>
  );
}