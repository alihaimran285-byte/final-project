import React from 'react';
import { X } from 'lucide-react';

const ViewModal = ({ 
  showViewModal, 
  setShowViewModal, 
  selectedRecord,
  getDateDisplay,
  getStatusDisplay
}) => {
  if (!showViewModal || !selectedRecord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] flex flex-col">
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-6 border-b border-orange-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-orange-800">Attendance Details</h3>
          <button 
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Student Name</label>
              <p className="text-orange-800 font-medium">{selectedRecord.studentName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Roll Number</label>
              <p className="text-orange-800">{selectedRecord.rollNo}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Date</label>
              <p className="text-orange-800">{getDateDisplay(selectedRecord.date)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Class</label>
              <p className="text-orange-800">{selectedRecord.class}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Status</label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedRecord.status === 'present' ? 'bg-green-100 text-green-800' :
                selectedRecord.status === 'absent' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {getStatusDisplay(selectedRecord.status)}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Remarks</label>
              <p className="text-orange-800">{selectedRecord.remarks || 'No remarks'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Check-in Time</label>
              <p className="text-orange-800">{selectedRecord.checkInTime || 'N/A'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Check-out Time</label>
              <p className="text-orange-800">{selectedRecord.checkOutTime || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* Footer - Fixed at bottom */}
        <div className="flex justify-end p-6 border-t border-orange-100 flex-shrink-0">
          <button 
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;