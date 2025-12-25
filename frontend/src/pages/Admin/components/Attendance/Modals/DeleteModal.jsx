import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

const DeleteModal = ({ 
  showDeleteModal, 
  setShowDeleteModal, 
  selectedRecord,
  handleDeleteAttendance,
  loading,
  getDateDisplay,
  getStatusDisplay
}) => {
  if (!showDeleteModal || !selectedRecord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-orange-100">
          <h3 className="text-lg font-bold text-orange-800">Delete Attendance Record</h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg mb-3">
              <Trash2 className="text-red-500" size={24} />
              <div>
                <p className="font-medium text-red-800">Warning: This action cannot be undone</p>
              </div>
            </div>
            <p className="text-orange-700 mb-2">
              Are you sure you want to delete attendance record for:
            </p>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p><strong>Student:</strong> {selectedRecord.studentName}</p>
              <p><strong>Date:</strong> {getDateDisplay(selectedRecord.date)}</p>
              <p><strong>Class:</strong> {selectedRecord.class}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
                selectedRecord.status === 'present' ? 'bg-green-100 text-green-800' :
                selectedRecord.status === 'absent' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>{getStatusDisplay(selectedRecord.status)}</span></p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => !loading && setShowDeleteModal(false)}
              className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteAttendance}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              <span>{loading ? 'Deleting...' : 'Delete Record'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;