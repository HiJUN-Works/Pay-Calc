import React from 'react';
import './SegmentedControl.css';

const SegmentedControl = ({ name, options, selected, onChange }) => {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <label key={option.value} className={selected === option.value ? 'active' : ''}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default SegmentedControl;