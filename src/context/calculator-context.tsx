import React, { useState, createContext } from 'react'
import { WeightUnit } from './settings-context';

// This context stores the calculator's total weight and plate counts

export const kgPlateWeights: string[] = ['50', '25', '20', '15', '10', '5', '2.5', '1.25', '0.5', '0.25'];
export const lbPlateWeights: string[] = ['55', '45', '35', '25', '15', '10', '5', '2.5', '1', '0.75', '0.5', '0.25'];

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
type initialCalculatorStateType = typeof initialCalculatorState;

export const CalculatorContext = createContext<initialCalculatorStateType | any>(undefined);

export const CalculatorProvider = (props: any) => {
  const [calculatorState, setCalculatorState] = useState<initialCalculatorStateType>(initialCalculatorState);
  const [currentWeightUnit, setCurrentWeightUnit] = useState(WeightUnit.KG);

  return (
    <CalculatorContext.Provider
      value={[calculatorState, setCalculatorState, currentWeightUnit, setCurrentWeightUnit]}>
      {props.children}
    </CalculatorContext.Provider>
  );
}