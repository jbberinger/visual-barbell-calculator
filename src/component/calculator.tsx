import React, { ChangeEvent, useContext, useState } from 'react';
import color from '../util/color'
import { CalculatorContext, plateCountType, kgPlateWeights, lbPlateWeights } from '../context/calculator-context';
import { SettingsContext, WeightUnit } from '../context/settings-context';

const Calculator: React.FC = () => {
  const kgInputColors: string[] = Object.values(color.inputText.kg);
  const lbInputColors: string[] = Object.values(color.inputText.lb);
  const [calculatorState, setCalculatorState] = useContext(CalculatorContext);
  const [optionsState, setOptionsState, warning, setWarning] = useContext(SettingsContext);

  // holds local state for inputs
  const [totalDisplay, setTotalDisplay] = useState('');
  const [plateDisplay, setPlateDisplay] = useState({ ...calculatorState.plateCounts });
  const [weightUnitDisplay, setWeightUnitDisplay] = useState(WeightUnit.KG);

  // handles plate count inputs
  const handlePlateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { total, plateCounts } = calculatorState;
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

      console.log(`plate: ${name}`);
      console.log(`input: ${event.target.value}`);
      console.log(`state total before: ${total}`);
      console.log(plateDisplay);
      console.log(`display total before: ${totalDisplay}\n----------`);

      // creates a new copy of displayed plates and updates given count
      const updatedPlateCounts: plateCountType = { ...plateDisplay };
      updatedPlateCounts[weight] = count.toString();

      // calculates new displayed total based on updated plate counts and sets disply state
      const currentTotalDisplay: number = totalDisplay ? parseFloat(totalDisplay) : 0;
      console.log(`currentTotalDisplay: ${currentTotalDisplay}`);
      const currentPlateCount: number = plateDisplay[weight] ? parseInt(plateDisplay[weight]) : 0;
      console.log(`currentPlateCount: ${currentPlateCount}`);
      const newTotal: number = currentTotalDisplay + (count - currentPlateCount) * weight;
      console.log(`newTotal from \\/: ${newTotal}`);
      console.log(`cD: ${currentTotalDisplay} ct: ${count} upPlCt: ${parseInt(updatedPlateCounts[weight])} wt: ${weight}`)
      setPlateDisplay({ ...updatedPlateCounts });
      setTotalDisplay(newTotal === 0 ? '' : newTotal.toString());

      // if given plate count is even, sets total and plate count context states
      if (isEven(count)) {
        plateCounts[weight] = count;
        setCalculatorState({ total: newTotal, plateCounts: { ...plateCounts } });
      }
    }
  }

  // handles total weight input
  const handleTotalInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(plateDisplay);
    console.log(event.target.value);
    const { plateCounts } = calculatorState;
    let totalInput: string = event.target.value;
    // protects against double zero total
    if (totalInput !== '00') {
      // displays 0 when cleared
      if (totalInput === '' || totalInput === '0') {
        setTotalDisplay('');
        const newPlateCounts: plateCountType = countPlatesFromTotal(kgPlateWeights, 0);
        setPlateDisplay({ ...newPlateCounts });
        setCalculatorState({ total: 0, plateCounts: { ...newPlateCounts } });
      }
      // prefixes 0 to decimal numbers < 0
      else if (totalInput === '.') {
        setTotalDisplay('0.');
        setPlateDisplay({ ...plateCounts });
        setCalculatorState({ total: 0, plateCounts: { ...plateCounts } });
      }
      // checks for trailing decimal
      else if (/^\d+\.$/.test(totalInput)) {
        setTotalDisplay(totalInput);
      }
      // checks for valid decimal input (eg. only one decimal point)
      else {
        const sanitizedTotalInput = sanitizeDecimal(totalInput);
        console.log('san: ' + sanitizedTotalInput + '\n-----------');
        setTotalDisplay(sanitizedTotalInput);
        const newPlateCounts: plateCountType = countPlatesFromTotal(kgPlateWeights, parseFloat(sanitizedTotalInput));
        setCalculatorState({ total: sanitizedTotalInput, plateCounts: { ...newPlateCounts } });
        setPlateDisplay({ ...newPlateCounts });
      }
    }
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
        {/* <span className='total-unit'>kg</span> */}
      </div>
      {
        kgPlateWeights.map((w: string, i: number) => (
          <InputCard
            weight={parseFloat(w)}
            color={plateDisplay[w] > 0 ? kgInputColors[i] : ''}
            count={plateDisplay[w]}
            handleInput={handlePlateInput}
            key={w}
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
        style={{ color: `${color}`, caretColor: `${color}` }}
        onChange={handleInput}
        name={`${weight}`}
      />
      <h3>{weight}<span className='input-unit'></span></h3>
    </div >
  )
}

// Calculates plates with a greedy algorithm restricted to even multiples
const countPlatesFromTotal = (plateWeights: string[], total: number): plateCountType => {
  let plateCounts: plateCountType = {};
  let remainingWeight = total;
  for (let plateIndex = 0; plateIndex < plateWeights.length; plateIndex += 1) {
    const currentPlate = parseFloat(plateWeights[plateIndex]);
    let currentPlateCount = Math.floor(remainingWeight / currentPlate);
    // Barbell can only be loaded with even numbers of plates
    if (!isEven(currentPlateCount)) {
      currentPlateCount -= 1;
    }
    remainingWeight -= currentPlateCount * currentPlate;
    plateCounts[currentPlate] = currentPlateCount.toString();
  }
  return plateCounts;
}

const isEven = (value: number): boolean => value % 2 === 0;

const sanitizeDecimal = (input: string): string => `${parseFloat(input.replace(/[^0-9.]/g, ''))}`;

export default Calculator;