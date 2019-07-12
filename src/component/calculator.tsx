import React, { ChangeEvent, useContext, useState, useEffect } from 'react';
import color from '../util/color'
import { CalculatorContext, plateCountType } from '../context/calculator-context';
import { SettingsContext, WeightUnit } from '../context/settings-context';

const Calculator: React.FC = () => {
  const kgInputColors: any = color.inputText.kg;
  const lbInputColors: any = color.inputText.lb;
  const [calculatorState, setCalculatorState, convertedTotal] = useContext(CalculatorContext);
  const [settingsState, , , , currentWeightUnit] = useContext(SettingsContext);
  let plateInputRefs: any[] = [];
  let totalRef: any;

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

  // Ensures string is a valid decimal
  const sanitizeDecimal = (input: string): string => input.replace(/[^0-9.]/g, '');

  // Checks if value is positive and numeric with no spaces
  const isPositiveNumeric = (value: any): boolean => {
    return !isNaN(value - parseFloat(value)) && parseFloat(value) > 0 && value === sanitizeDecimal(value)
  };

  // Initializes plates based on current weight unit and total.
  const initPlates = () => {
    const { lb, kg } = settingsState.plates;
    let plates: string[];
    if (currentWeightUnit === WeightUnit.KG) {
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
    let updatedPlateCount: plateCountType;
    const total = calculatorState.total;
    // Converts total and plate counts to appropriate unit.
    if (currentWeightUnit === WeightUnit.KG) {
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
  }, [settingsState]);

  // Triggered when convertedTotal changes
  useEffect(() => {
    let updatedPlateCount: plateCountType;
    // Converts total and plate counts to appropriate unit.
    if (currentWeightUnit === WeightUnit.KG) {
      const kg = settingsState.plates.kg;
      const plates = Object.keys(kg).filter(plate => kg[plate] > 0);
      updatedPlateCount = countPlatesFromTotal(plates, convertedTotal);
      setCurrentInputColors(kgInputColors);
    } else {
      const lb = settingsState.plates.lb;
      const plates = Object.keys(lb).filter(plate => lb[plate] > 0);
      updatedPlateCount = countPlatesFromTotal(plates, convertedTotal);
      setCurrentInputColors(lbInputColors);
    }
    setTotalDisplay(convertedTotal === 0 ? '' : convertedTotal.toString());
    setPlateDisplay(updatedPlateCount);
    setCalculatorState({ total: convertedTotal, plateCounts: updatedPlateCount });
  }, [convertedTotal, currentWeightUnit])

  // Sets warnings
  useEffect(() => {
    const unit = currentWeightUnit === WeightUnit.KG ? 'kg' : 'lb';
    // Sets background to red for plate inputs exceeding available plates
    for (let plate in plateInputRefs) {
      let availablePlates = settingsState.plates[unit][plate];
      let plateCount = plateDisplay[plate];
      let input = plateInputRefs[plate] as HTMLElement;
      if (plateCount > availablePlates) {
        input.style.background = 'rgba(255,0,0,0.1)';
      } else {
        input.style.background = 'none';
      }
    }
    // Sets total input background to red for totals exceeding max weight
    // determined by current settings
    let maxTotal: number = calculateTotalEquipmentWeight();
    for (let plate in plateDisplay) {
      maxTotal += parseFloat(plate) * settingsState.plates[unit][plate] * 2;
    }
    if (parseFloat(totalDisplay) > maxTotal) {
      (totalRef as HTMLElement).style.background = 'rgba(255,0,0,0.1)';
    } else {
      (totalRef as HTMLElement).style.background = 'none';
    }
  }, [plateDisplay, settingsState.plates, currentWeightUnit]);

  // handles plate count inputs
  const handlePlateInput = (event: ChangeEvent<HTMLInputElement>) => {
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

      // Creates a new copy of displayed plates and updates given count
      const updatedPlateCounts: plateCountType = { ...plateDisplay };
      updatedPlateCounts[weight] = platePairs.toString();

      // Calculates new displayed total based on updated plate pair counts and equipment
      let newTotal: number = 0;
      Object.keys(updatedPlateCounts).map(weight =>
        newTotal += parseFloat(weight) * parseInt(updatedPlateCounts[weight]) * 2
      );
      if (newTotal !== 0) {
        newTotal += calculateTotalEquipmentWeight();
      }
      newTotal = Math.round(newTotal * 100) / 100;

      // Updates local and context states
      setPlateDisplay(updatedPlateCounts);
      setTotalDisplay(newTotal === 0 ? '' : newTotal.toString());
      const currentPlateDisplay = { ...plateDisplay };
      currentPlateDisplay[weight] = platePairs.toString();
      setCalculatorState({ total: newTotal, plateCounts: currentPlateDisplay });
    }
  }

  // handles total weight input
  const handleTotalInput = (event: ChangeEvent<HTMLInputElement>) => {
    const plates = Object.keys(plateDisplay);
    let totalInput: string = event.target.value;
    // protects against double zero total
    if (totalInput !== '00') {
      // displays 0 when cleared
      if (totalInput === '' || totalInput === '0') {
        setTotalDisplay(totalInput);
        const newPlateCounts: plateCountType = countPlatesFromTotal(plates, 0);
        setPlateDisplay(newPlateCounts);
        setCalculatorState({ total: 0, plateCounts: newPlateCounts });
      }
      // prefixes 0 to decimal numbers < 0
      else if (totalInput === '.') {
        setTotalDisplay('0.');
      }
      // checks for valid decimal number input
      else if (isPositiveNumeric(totalInput)) {
        totalInput = event.target.value;
        setTotalDisplay(totalInput);
        const newPlateCounts: plateCountType = countPlatesFromTotal(plates, parseFloat(totalInput));
        setCalculatorState({ total: totalInput, plateCounts: newPlateCounts });
        setPlateDisplay(newPlateCounts);
      }
    }
  }

  return (
    <form className='weights-container' autoComplete="new-password">
      <div className='total-container'>
        <div className='total-input-card'>
          <input
            className='total-input'
            type='text'
            placeholder='0'
            value={totalDisplay}
            style={{ caretColor: 'black' }}
            onInput={handleTotalInput}
            id={'total-input'}
            ref={(ref) => totalRef = ref}
          />
          <label htmlFor='total-input'><span className='total-unit'>{currentWeightUnit === WeightUnit.KG ? 'kg' : 'lb'}</span></label>
        </div>
        <span className='plate-pairs-heading'>plates per side</span>
      </div>
      {
        Object.entries(plateDisplay).sort(([a,], [b,]) =>
          parseFloat(b) - parseFloat(a)).map(([weight, count]) => (
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
              plateInputRefs={plateInputRefs}
            />
          )
          )
      }
    </form>
  )
}

interface IInputCardProps {
  weight: number,
  color: string,
  count: number,
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void,
  plateInputRefs: any[],
};

const InputCard: React.FC<IInputCardProps> = ({ weight, color, count, handleInput, plateInputRefs }) => {
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
        id={`plate-${weight}${color}`}
        ref={(ref) => plateInputRefs[weight] = ref}
      />
      <label htmlFor={`plate-${weight}${color}`}><h3>{weight}<span className='input-unit'></span></h3></label>
    </div >
  )
}

export default Calculator;