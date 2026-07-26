import React from 'react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, noteTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card small">
        <div className="modal-header">
          <h2>Delete Note</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <p className="delete-warning">
          Are you sure you want to delete <strong>"{noteTitle}"</strong>? This action cannot be undone.
        </p>

        <div className="modal-footer">
          <button type="button" className="btn outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Note'}
          </button>
        </div>
      </div>
    </div>
  );
};
