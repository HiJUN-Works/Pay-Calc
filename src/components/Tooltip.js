import React, { useState } from 'react';
import './Tooltip.css';
import { HelpCircle } from 'react-feather';

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="tooltip-container" 
         onMouseEnter={() => setShow(true)}
         onMouseLeave={() => setShow(false)}>
      {children ? children : <HelpCircle size={16} className="tooltip-icon" />}
      {show && (
        <div className="tooltip-box">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;