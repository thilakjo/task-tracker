// src/components/ConfirmationModal.js
import React from "react";
import "./../styles/ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-cancel-button">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="modal-confirm-button danger-button"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
