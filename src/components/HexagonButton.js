import React from 'react';
import './HexagonButton.css';

const HexagonButton = ({ icon, label }) => {
  return (
    <div className="hexagon-wrapper">
      <div className="hexagon">
        <div className="hexagon-icon">{icon}</div>
        <span className="hexagon-label">{label}</span>
      </div>
    </div>
  );
};

export default HexagonButton;