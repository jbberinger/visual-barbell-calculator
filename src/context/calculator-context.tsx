import React, { useState, createContext } from 'react'

const kgPlateWeights: string[] = ['25', '20', '15', '10', '5', '2.5', '1.25', '0.5', '0.25'];

export type plateCountType = { [index: string]: string };

let initial: plateCountType = {};

const initialCalculatorState = {
  total: 0,
  plateCounts: {
    // initializes object to 0's with reducer function
    ...kgPlateWeights.reduce((stateObj, weight) => {
      stateObj[weight] = '0';
      return stateObj;
    }, initial)
  }
}

type initialStateType = typeof initialCalculatorState;

export const CalculatorContext = createContext<initialStateType | any>(undefined);

export const CalculatorProvider = (props: any) => {
  const [calculatorState, setCalculatorState] = useState<initialStateType>(initialCalculatorState);

  return (
    <CalculatorContext.Provider
      value={[kgPlateWeights, calculatorState, setCalculatorState]}>
      {props.children}
    </CalculatorContext.Provider>
  );
}