import React, { useState, ChangeEvent } from 'react';
import color from '../util/color'

const WeightInput: React.FC = () => {
  const kgPlateWeights: number[] = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25];
  const kgColors: string[] = Object.values(color.plates.kg);
  kgColors[2] = color.adjustLuminosity(kgColors[2], -5);
  kgColors[4] = 'white'
  kgColors[6] = color.adjustLuminosity(kgColors[6], -15);
  kgColors[7] = color.adjustLuminosity(kgColors[7], -15);
  kgColors[8] = color.adjustLuminosity(kgColors[8], -15);

  let initialState: { [index: number]: number } = {};

  const [weightCount, setWeightCount] = useState({
    ...kgPlateWeights.reduce((stateObj, weight) => {
      stateObj[weight] = 0;
      return stateObj;
    }, initialState)
  })
  const [totalWeight, setTotalWeight] = useState(0);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.getAttribute('name');
    if (name) {
      const count = event.target.value.replace('/[^0-9]/g', '');
      setWeightCount({ ...weightCount, [name]: count });
    }
  }

  const handleTotalInput = (event: ChangeEvent<HTMLInputElement>) => {
    const totalWeightInput: number = parseInt(event.target.value.replace('/[^0-9]/g', ''));
    setTotalWeight(totalWeightInput);
  }

  return (
    <form className='weights-container'>
      <div className='total-input-card'>
        <input
          className='total-input'
          type='tel'
          placeholder='0'
          value={totalWeight > 0 ? totalWeight : ''}
          style={{ caretColor: 'black' }}
          onChange={handleTotalInput}
        />
        <span className='total-unit'>kg</span>
      </div>

      {
        kgPlateWeights.map((w, i) => <InputCard weight={w} color={kgColors[i]} count={weightCount[w]} handleInput={handleInput} key={w} />)
      }
    </form>
  )
}

type InputCardPropsType = {
  weight: number;
  color: string;
  count: number;
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputCard: React.FC<InputCardPropsType> = ({ weight, color, count, handleInput }) => {

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

export default WeightInput;