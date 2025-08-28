import React from 'react';
import './AlertModal.css';

const AlertModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <button onClick={onClose} className="modal-button">확인</button>
      </div>
    </div>
  );
};

export default AlertModal;