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

// Default state for settings. Also used to reset settings.
//
// weightUnit: current calculator weight unit
// equipment: barbell/collar weights and if collar is used
// plates: number of plates available and if plate is used
const initialOptionsState = {
  weightUnit: WeightUnit.KG,
  equipment: {
    barbell: {
      weights: {
        kg: 20,
        lb: 45,
      },
    },
    collar: {
      use: true,
      weights: {
        kg: 5,
        lb: 11.0231,
      }
    }
  },
  plates: {
    kgPlates: {
      '50': {
        use: false,
        count: 20
      },
      '25': {
        use: true,
        count: 20
      },
      '15': {
        use: true,
        count: 20
      },
      '10': {
        use: true,
        count: 20
      },
      '5': {
        use: true,
        count: 20
      },
      '2.5': {
        use: true,
        count: 20
      },
      '1.25': {
        use: true,
        count: 20
      },
      '0.5': {
        use: false,
        count: 20
      },
      '0.25': {
        use: false,
        count: 20
      },
    },
    lbPlates: {
      '55': {
        use: false,
        count: 20
      },
      '45': {
        use: true,
        count: 20
      },
      '35': {
        use: true,
        count: 20
      },
      '25': {
        use: true,
        count: 20
      },
      '10': {
        use: true,
        count: 20
      },
      '5': {
        use: true,
        count: 20
      },
      '2.5': {
        use: true,
        count: 20
      },
      '1.25': {
        use: true,
        count: 20
      },
      '0.75': {
        use: false,
        count: 20
      },
      '0.5': {
        use: false,
        count: 20
      },
      '0.25': {
        use: false,
        count: 20
      },
    },
  }
}

type initialOptionsStateType = typeof initialOptionsState;

export const SettingsContext = createContext<initialOptionsStateType | any>(undefined);

export const SettingsProvider = (props: any) => {
  const [optionsState, setOptionsState] = useState<initialOptionsStateType>(initialOptionsState);
  const [warning, setWarning] = useState<Warning>();

  return (
    <SettingsContext.Provider
      value={[optionsState, setOptionsState, warning, setWarning]}>
      {props.children}
    </SettingsContext.Provider>
  );
}