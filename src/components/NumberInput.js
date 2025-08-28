import React from 'react';
import { Minus, Plus } from 'react-feather';
import './NumberInput.css';

const NumberInput = ({ value, onChange, min = 0, max = 11 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="number-input">  
      <button onClick={handleDecrement} disabled={value <= min}>
        <Minus size={16} />
      </button>
      <span>{value}</span>
      <button onClick={handleIncrement} disabled={value >= max}>
        <Plus size={16} />
      </button>
    </div>
  );
};

export default NumberInput;