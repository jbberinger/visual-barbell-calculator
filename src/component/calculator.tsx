import React, { ChangeEvent, useContext, useState } from 'react';
import color from '../util/color'
import { CalculatorContext, plateCountType } from '../context/calculator-context'

const Calculator: React.FC = () => {
  const kgInputColors: string[] = Object.values(color.inputText.kg);
  const [kgPlateWeights, calculatorState, setCalculatorState] = useContext(CalculatorContext);
  const [totalDisplay, setTotalDisplay] = useState('');

  const handlePlateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { total, plateCounts } = calculatorState;
    const name = event.target.getAttribute('name');
    console.log(name);
    // ensures name attribute exists
    if (name) {
      // properly clears plate count
      let count: number;
      const weight: number = parseFloat(name);
      if (event.target.value === '') {
        count = 0;
      } else {
        count = parseInt(event.target.value.replace(/[^\d]/g, ''));
      }

      if (isEven(count)) {
        const newTotal = parseFloat(total) + (count - plateCounts[weight]) * weight;
        plateCounts[weight] = count;
        setTotalDisplay(newTotal.toString());
        setCalculatorState({ total: newTotal, plateCounts: { ...plateCounts } });
      }
    }
  }

  const handleTotalInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { plateCounts } = calculatorState;
    let totalInput: string = event.target.value;
    // protects against double zero total
    if (totalInput !== '00') {
      // displays 0 when cleared
      if (totalInput === '') {
        setTotalDisplay('0');
        const newPlateCounts: plateCountType = countPlatesFromTotal(kgPlateWeights, parseFloat(totalInput));
        setCalculatorState({ total: 0, plateCounts: { ...newPlateCounts } });
      }
      // prefixes 0 to decimal numbers < 0
      else if (totalInput === '.') {
        setTotalDisplay('0.');
        setCalculatorState({ total: 0, plateCounts: { ...plateCounts } });
      }
      // checks for trailing decimal
      else if (/^\d+\.$/.test(totalInput)) {
        setTotalDisplay(totalInput);
      }
      // checks for valid decimal input (eg. only one decimal point)
      else {
        const sanitizedTotalInput = sanitizeDecimal(totalInput);
        setTotalDisplay(sanitizedTotalInput);
        const newPlateCounts: plateCountType = countPlatesFromTotal(kgPlateWeights, parseFloat(sanitizedTotalInput));
        setCalculatorState({ total: sanitizedTotalInput, plateCounts: { ...newPlateCounts } });
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
        <span className='total-unit'>kg</span>
      </div>
      {
        kgPlateWeights.map((w: number, i: number) => (
          <InputCard
            weight={w}
            color={calculatorState.plateCounts[w] > 0 ? kgInputColors[i] : ''}
            count={calculatorState.plateCounts[w]}
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