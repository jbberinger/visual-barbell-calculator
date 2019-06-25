import React from 'react';
import color from '../util/color'

const kgPlateWeights: string[] = ['25', '20', '15', '10', '5', '2.5', '1.25', '0.5', '0.25']
const kgColors: string[] = Object.values(color.plates.kg);

const WeightInput: React.FC = () => {

  return (
    <form className='weights-container'>
      <h1 className='total-weight'>225kg</h1>
      {kgPlateWeights.map((w, i) => <InputCard weight={w} color={kgColors[i]} />)}
    </form>

  )
}

const InputCard: React.FC<{ weight: string, color: string }> = ({ weight, color }) => {
  return (
    <div className='input-card'>
      <input
        className='input'
        type='number'
        placeholder='0'
        style={{ border: 0, color: `${color}`, caretColor: `${color}` }} />
      <h3>{weight}<span className='input-unit'>kg</span></h3>
    </div>
  )
}

export default WeightInput;