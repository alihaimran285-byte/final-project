import React from 'react';
import { X, RefreshCw } from 'lucide-react';

const AddModal = ({ 
  showAddModal, 
  setShowAddModal, 
  newAttendance, 
  setNewAttendance, 
  handleStudentSelect,
  handleAddAttendance,
  loading,
  students 
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-orange-100">
          <h3 className="text-lg font-bold text-orange-800">Add Attendance Record</h3>
          <button 
            onClick={() => !loading && setShowAddModal(false)}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleAddAttendance} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Student *
            </label>
            <select
              required
              value={newAttendance.studentId}
              onChange={handleStudentSelect}
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
              disabled={loading}
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} (Roll: {student.rollNo}, Class: {student.class})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              required
              value={newAttendance.date}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Class *
            </label>
            <input
              type="text"
              required
              value={newAttendance.class}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, class: e.target.value }))}
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
              disabled={loading}
              placeholder="Class will auto-fill when student is selected"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Status *
            </label>
            <select
              required
              value={newAttendance.status}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
              disabled={loading}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Remarks
            </label>
            <textarea
              value={newAttendance.remarks}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, remarks: e.target.value }))}
              rows="3"
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors resize-none"
              disabled={loading}
              placeholder="Optional remarks..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => !loading && setShowAddModal(false)}
              className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              <span>{loading ? 'Adding...' : 'Mark Attendance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;