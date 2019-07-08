import React, { ChangeEvent, useContext, useState, useEffect, useRef } from 'react';
import color from '../util/color'
import { CalculatorContext, plateCountType } from '../context/calculator-context';
import { SettingsContext, WeightUnit, Warning } from '../context/settings-context';
import { CanvasContext } from '../context/canvas-context';

const Calculator: React.FC = () => {
  const kgInputColors: any = color.inputText.kg;
  const lbInputColors: any = color.inputText.lb;
  const [calculatorState, setCalculatorState] = useContext(CalculatorContext);
  const [settingsState, setSettingsState, warning, setWarning, currentWeightUnit, setCurrentWeightUnit] = useContext(SettingsContext);
  const [shouldRedraw, setShouldRedraw] = useContext(CanvasContext);

  // Calculates total equipment weight from collar and barbell
  const calculateTotalEquipmentWeight = (): number => {
    const { barbell, collar } = settingsState.equipment;
    let barbellWeight: number = 0;
    let collarWeight: number = 0;
    if (currentWeightUnit === WeightUnit.KG) {
      barbellWeight = barbell.kg;
      collarWeight = collar.kg;
    } else {
      barbellWeight = barbell.lb;
      collarWeight = collar.lb;
    }
    return barbellWeight + collarWeight;
  }

  // Greedy algorithm for calculating plate pair counts from heaviest to lightest
  const countPlatesFromTotal = (plateWeights: string[], total: number): plateCountType => {
    console.log(`recalculated plates with total: ${total} and equipmentWeight: ${calculateTotalEquipmentWeight()}`);
    let plateCounts: plateCountType = {};
    const unit = currentWeightUnit === WeightUnit.KG ? 'kg' : 'lb';
    let remainingWeight = total - calculateTotalEquipmentWeight();
    // Makes sure weight is never negative
    remainingWeight = remainingWeight >= 0 ? remainingWeight : 0;
    const plates = plateWeights.sort((a, b) => parseFloat(b) - parseFloat(a));
    // Iterates through plates and determines plate pair counts
    for (let plateIndex = 0; plateIndex < plates.length; plateIndex += 1) {
      const currentPlateWeight = parseFloat(plates[plateIndex]);
      let currentPlatePairCount = Math.floor(remainingWeight / (currentPlateWeight * 2));
      // Barbell can only be loaded with even numbers of plates and 
      // plates can not exceed total plates available
      if (currentPlatePairCount > settingsState.plates[unit][currentPlateWeight]) {
        currentPlatePairCount = settingsState.plates[unit][currentPlateWeight];
      }
      remainingWeight -= currentPlatePairCount * currentPlateWeight * 2;
      plateCounts[currentPlateWeight] = currentPlatePairCount.toString();
    }
    return plateCounts;
  }

  // Returns true if value is even
  const isEven = (value: number): boolean => value % 2 === 0;

  // Ensures string is a valid decimal
  const sanitizeDecimal = (input: string): string => `${parseFloat(input.replace(/[^0-9.]/g, ''))}`;

  // Initializes plates based on current weight unit and total.
  const initPlates = () => {
    console.log('init plates');
    const { lb, kg } = settingsState.plates;
    let plates: string[];
    if (currentWeightUnit == WeightUnit.KG) {
      plates = Object.keys(kg).filter(plate => kg[plate] > 0);
    } else {
      plates = Object.keys(lb).filter(plate => lb[plate] > 0);
    }
    const initPlateCount = countPlatesFromTotal(plates, calculatorState.total);
    return initPlateCount;
  }

  // Holds local state for inputs.
  const [totalDisplay, setTotalDisplay] = useState('');
  const [plateDisplay, setPlateDisplay] = useState(initPlates());
  const [currentInputColors, setCurrentInputColors] = useState((
    currentWeightUnit === WeightUnit.KG
      ? kgInputColors
      : lbInputColors
  ));

  // Triggered when settings change
  useEffect(() => {
    console.log('use effect triggered')
    let updatedPlateCount: plateCountType;
    const total = calculatorState.total;
    // Converts total and plate counts to appropriate unit.
    if (currentWeightUnit == WeightUnit.KG) {
      const kg = settingsState.plates.kg;
      const plates = Object.keys(kg).filter(plate => kg[plate] > 0);
      updatedPlateCount = countPlatesFromTotal(plates, total);
      setCurrentInputColors(kgInputColors);
    } else {
      const lb = settingsState.plates.lb;
      const plates = Object.keys(lb).filter(plate => lb[plate] > 0);
      updatedPlateCount = countPlatesFromTotal(plates, total);
      setCurrentInputColors(lbInputColors);
    }
    setTotalDisplay(total === 0 ? '' : total.toString());
    setPlateDisplay(updatedPlateCount);
    setCalculatorState({ total: total, plateCounts: updatedPlateCount });
    setShouldRedraw(true);
  }, [settingsState, currentWeightUnit]);

  // handles plate count inputs
  const handlePlateInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('handle plate input');
    const name: string | null = event.target.getAttribute('name');

    // ensures name attribute exists
    if (name) {
      let platePairs: number;
      const weight: number = parseFloat(name);
      // properly clears plate count
      if (event.target.value === '') {
        platePairs = 0;
        // else sanitizes input
      } else {
        platePairs = parseInt(event.target.value.replace(/[^\d]/g, ''));
        if (!platePairs) {
          platePairs = 0;
        }
      }

      // If plate pairs available are exceeded, user is warned.
      const unit = currentWeightUnit === WeightUnit.KG ? 'kg' : 'lb';
      if (platePairs > settingsState.plates[unit][weight]) {
        setWarning(Warning.NOT_ENOUGH_PLATES);
        event.target.style.background = 'rgba(255,0,0,0.1)';
      } else {
        event.target.style.background = 'none';
      }

      // Creates a new copy of displayed plates and updates given count
      const updatedPlateCounts: plateCountType = { ...plateDisplay };
      updatedPlateCounts[weight] = platePairs.toString();

      // Calculates new displayed total based on updated plate pair counts and sets disply state
      const currentTotalDisplay: number = totalDisplay ? parseFloat(totalDisplay) : 0;
      const currentPlatePairs: number = plateDisplay[weight] ? parseInt(plateDisplay[weight]) : 0;
      const newTotal: number = currentTotalDisplay + ((platePairs - currentPlatePairs) * weight * 2);

      // Updates local and context states
      setPlateDisplay(updatedPlateCounts);
      setTotalDisplay(newTotal === 0 ? '' : newTotal.toString());
      const currentPlateDisplay = { ...plateDisplay };
      currentPlateDisplay[weight] = platePairs.toString();
      setCalculatorState({ total: newTotal, plateCounts: currentPlateDisplay });
    }
    setShouldRedraw(true);
  }

  // handles total weight input
  const handleTotalInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('handle total input');
    const plates = Object.keys(plateDisplay);
    let totalInput: string = event.target.value;
    // protects against double zero total
    if (totalInput !== '00') {
      // displays 0 when cleared
      if (totalInput === '' || totalInput === '0') {
        setTotalDisplay('');
        const newPlateCounts: plateCountType = countPlatesFromTotal(plates, 0);
        setPlateDisplay(newPlateCounts);
        setCalculatorState({ total: 0, plateCounts: newPlateCounts });
      }
      // prefixes 0 to decimal numbers < 0
      else if (totalInput === '.') {
        setTotalDisplay('0.');
      }
      // checks for trailing decimal
      else if (/^\d+\.$/.test(totalInput)) {
        setTotalDisplay(totalInput);
      }
      // checks for valid decimal input (eg. only one decimal point)
      else {
        const sanitizedTotalInput = sanitizeDecimal(totalInput);
        setTotalDisplay(sanitizedTotalInput);
        const newPlateCounts: plateCountType = countPlatesFromTotal(plates, parseFloat(sanitizedTotalInput));
        setCalculatorState({ total: sanitizedTotalInput, plateCounts: newPlateCounts });
        setPlateDisplay(newPlateCounts);
      }
    }
    setShouldRedraw(true);
  }

  return (
    <form className='weights-container' autoComplete='off'>
      <div className='total-container'>
        <div className='total-input-card'>
          <input
            className='total-input'
            type='tel'
            placeholder='0'
            value={totalDisplay}
            style={{ caretColor: 'black' }}
            onChange={handleTotalInput}
          />
          <span className='total-unit'>{currentWeightUnit == WeightUnit.KG ? 'kg' : 'lb'}</span>
        </div>
        <span className='plate-pairs-heading'>plate pairs</span>
      </div>
      {
        Object.entries(plateDisplay).sort(([a,], [b,]) => parseFloat(b) - parseFloat(a)).map(([weight, count]) => (
          <InputCard
            weight={parseFloat(weight)}
            color={
              parseInt(plateDisplay[weight]) <= 0
                ? ''
                : currentInputColors[weight.toString()]
            }
            count={parseInt(plateDisplay[weight])}
            handleInput={handlePlateInput}
            key={weight}
          />
        ))
      }
    </form>
  )
}

interface IInputCardProps {
  weight: number,
  color: string,
  count: number
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputCard: React.FC<IInputCardProps> = ({ weight, color, count, handleInput }) => {
  return (
    <div className='input-card'>
      <input
        className='input'
        type='tel'
        placeholder='0'
        value={count > 0 ? count : ''}
        style={{ color: `${color} `, caretColor: `${color} ` }}
        onChange={handleInput}
        name={`${weight} `}
      />
      <h3>{weight}<span className='input-unit'></span></h3>
    </div >
  )
}

export default Calculator;