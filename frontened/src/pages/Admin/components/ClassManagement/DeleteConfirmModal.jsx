import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-500" size={48} />
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Confirmation</h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete <span className="font-semibold">{itemName}</span>? 
          This action cannot be undone.
        </p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Delete confirmed for:', itemName);
              onConfirm();
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;