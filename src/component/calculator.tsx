import React, { ChangeEvent, useContext, useState, useEffect, useRef } from 'react';
import color from '../util/color'
import { CalculatorContext, plateCountType } from '../context/calculator-context';
import { SettingsContext, WeightUnit } from '../context/settings-context';

const Calculator: React.FC = () => {
  const kgToLbFactor = 2.20462262;
  const kgInputColors: any = color.inputText.kg;
  const lbInputColors: any = color.inputText.lb;
  const [, setCalculatorState] = useContext(CalculatorContext);
  const [optionsState, setOptionsState, warning, setWarning, currentWeightUnit, setCurrentWeightUnit] = useContext(SettingsContext);

  // Calculates total equipment weight from collar and barbell
  const calculateTotalEquipmentWeight = (): number => {
    const { barbell, collar } = optionsState.equipment;
    let barbellWeight = 0;
    let collarWeight = 0;
    if (currentWeightUnit == WeightUnit.KG) {
      barbellWeight = barbell.weights.kg;
      collarWeight = collar.weights.kg;
    } else {
      barbellWeight = barbell.weights.lb;
      collarWeight = collar.weights.lb;
    }
    return barbellWeight + collarWeight;
  }

  // Calculates plates with a greedy algorithm restricted to even multiples
  const countPlatesFromTotal = (plateWeights: string[], total: number): plateCountType => {
    console.log('--- enter countPlatesFromTotal ---')
    let plateCounts: plateCountType = {};
    console.log(`total argument: ${total}`)
    console.log(`total equip weight: ${calculateTotalEquipmentWeight()}`)
    let remainingWeight = total - calculateTotalEquipmentWeight();
    // Makes sure weight is never negative
    remainingWeight = remainingWeight >= 0 ? remainingWeight : 0;
    console.log(`remainingWeight: ${remainingWeight}`);
    const plates = plateWeights.sort((a, b) => parseFloat(b) - parseFloat(a));
    console.log(`sorted plates: ${plates}`);
    // Iterates through plates and determines plate counts
    for (let plateIndex = 0; plateIndex < plates.length; plateIndex += 1) {
      const currentPlate = parseFloat(plates[plateIndex]);
      console.log(`currentPlate: ${currentPlate}`)
      let currentPlateCount = Math.floor(remainingWeight / currentPlate);
      // Barbell can only be loaded with even numbers of plates
      if (!isEven(currentPlateCount)) {
        currentPlateCount -= 1;
      }
      remainingWeight -= currentPlateCount * currentPlate;
      plateCounts[currentPlate] = currentPlateCount.toString();
    }
    console.log(`plateCounts: ${JSON.stringify(plateCounts)}`)
    console.log('--- exit countPlatesFromTotal ---');
    return plateCounts;
  }

  const isEven = (value: number): boolean => value % 2 === 0;

  // Ensures string is a valid decimal
  const sanitizeDecimal = (input: string): string => `${parseFloat(input.replace(/[^0-9.]/g, ''))}`;

  // Initializes plates based on starting weight unit.
  const initPlates = () => {
    console.log('---enter init plates---');
    const { lbPlates, kgPlates } = optionsState.plates;
    let plates: string[];
    if (currentWeightUnit == WeightUnit.KG) {
      plates = Object.keys(kgPlates).filter(plate => kgPlates[plate] > 0);
    } else {
      plates = Object.keys(lbPlates).filter(plate => lbPlates[plate] > 0);
    }
    const initPlateCount = countPlatesFromTotal(plates, 0);
    console.log('---exit init plates---');
    return initPlateCount;
  }


  // Holds local state for inputs.
  const [totalDisplay, setTotalDisplay] = useState('');
  const [plateDisplay, setPlateDisplay] = useState(initPlates());

  // Updates inputs when weight unit is changed but
  // skips initial render
  const firstUpdate = useRef(false);
  useEffect(() => {
    console.log('-- enter useEffect --');
    console.log('current weight unit:' + currentWeightUnit);
    // Only runs if initial render has already occured.
    if (firstUpdate.current) {
      let convertedTotal: number;
      let convertedPlateCount: plateCountType;

      // Converts total and plate counts to appropriate unit.
      if (currentWeightUnit == WeightUnit.KG) {
        console.log('current weight unit is KG')
        if (totalDisplay !== '') {
          convertedTotal = Math.round(parseFloat(totalDisplay) / kgToLbFactor * 100) / 100;
        } else {
          convertedTotal = 0
        }
        const kgPlates = optionsState.plates.kgPlates;
        const plates = Object.keys(kgPlates).filter(plate => kgPlates[plate] > 0);
        console.log(`kg plates: ${plates} `)
        convertedPlateCount = countPlatesFromTotal(plates, convertedTotal);
        console.log(`converted total: ${convertedTotal} \nconverted kg plate count: ${convertedPlateCount} `)
      } else {
        console.log('current weight unit is LB')
        if (totalDisplay !== '') {
          convertedTotal = Math.round(parseFloat(totalDisplay) * kgToLbFactor * 100) / 100;
        } else {
          convertedTotal = 0
        }
        const lbPlates = optionsState.plates.lbPlates;
        const plates = Object.keys(lbPlates).filter(plate => lbPlates[plate] > 0);
        console.log(`lb plates: ${plates} `)
        convertedPlateCount = countPlatesFromTotal(plates, convertedTotal);
        console.log(`converted total: ${convertedTotal} \nconverted lb plate count: ${JSON.stringify(convertedPlateCount)} `)
      }

      setTotalDisplay(convertedTotal === 0 ? '' : convertedTotal.toString());
      setPlateDisplay(convertedPlateCount);
      setCalculatorState({ total: convertedTotal, plateCounts: { ...convertedPlateCount } });
    } else {
      firstUpdate.current = true;
    }
    console.log('-- exit useEffect --');
  }, [currentWeightUnit, optionsState.plates.kgPlates, optionsState.plates.lbPlates]);

  // handles plate count inputs
  const handlePlateInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('--- enter handlePlateInput ---');
    const name: string | null = event.target.getAttribute('name');
    // ensures name attribute exists
    if (name) {
      let count: number;
      const weight: number = parseFloat(name);
      // properly clears plate count
      if (event.target.value === '') {
        count = 0;
        // else sanitizes input
      } else {
        count = parseInt(event.target.value.replace(/[^\d]/g, ''));
        if (!count) {
          count = 0;
        }
      }

      // creates a new copy of displayed plates and updates given count
      const updatedPlateCounts: plateCountType = { ...plateDisplay };
      updatedPlateCounts[weight] = count.toString();

      // calculates new displayed total based on updated plate counts and sets disply state
      const currentTotalDisplay: number = totalDisplay ? parseFloat(totalDisplay) : 0;
      const currentPlateCount: number = plateDisplay[weight] ? parseInt(plateDisplay[weight]) : 0;
      const newTotal: number = currentTotalDisplay + (count - currentPlateCount) * weight;

      setPlateDisplay({ ...updatedPlateCounts });
      setTotalDisplay(newTotal === 0 ? '' : newTotal.toString());

      // if given plate count is even, sets total and plate count context states
      if (isEven(count)) {
        const currentPlateDisplay = { ...plateDisplay };
        currentPlateDisplay[weight] = count.toString();
        setCalculatorState({ total: newTotal, plateCounts: { ...currentPlateDisplay } });
      }
    }
    console.log('--- exit handlePlateInput ---');
  }

  // handles total weight input
  const handleTotalInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('--- enter handleTotalInput ---');
    const plates = Object.keys(plateDisplay);
    let totalInput: string = event.target.value;
    // protects against double zero total
    if (totalInput !== '00') {
      // displays 0 when cleared
      if (totalInput === '' || totalInput === '0') {
        setTotalDisplay('');
        const newPlateCounts: plateCountType = countPlatesFromTotal(plates, 0);
        setPlateDisplay({ ...newPlateCounts });
        setCalculatorState({ total: 0, plateCounts: { ...newPlateCounts } });
      }
      // prefixes 0 to decimal numbers < 0
      else if (totalInput === '.') {
        setTotalDisplay('0.');
        // setPlateDisplay({ ...plateCounts });
        // setCalculatorState({ total: 0, plateCounts: { ...plateCounts } });
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
        setCalculatorState({ total: sanitizedTotalInput, plateCounts: { ...newPlateCounts } });
        setPlateDisplay({ ...newPlateCounts });
      }
    }
    console.log('--- exit handleTotalInput ---');
  }

  return (
    <form className='weights-container' autoComplete='off'>
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
      {
        Object.entries(plateDisplay).sort(([a,], [b,]) => parseFloat(b) - parseFloat(a)).map(([weight, count]) => (
          <InputCard
            weight={parseFloat(weight)}
            color={
              parseInt(plateDisplay[weight]) <= 0
                ? ''
                : currentWeightUnit == WeightUnit.KG
                  ? kgInputColors[weight.toString()]
                  : lbInputColors[weight.toString()]
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