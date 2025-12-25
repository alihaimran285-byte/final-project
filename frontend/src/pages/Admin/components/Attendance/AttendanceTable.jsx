import React from 'react';
import { Edit3, Trash2, Eye, Plus, Users, RefreshCw } from 'lucide-react';

const AttendanceTable = ({ 
  filteredAttendance, 
  loading, 
  openViewModal, 
  openEditModal, 
  openDeleteModal,
  getDateDisplay,
  getStatusDisplay,
  setShowAddModal 
}) => {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="mx-auto text-orange-500 mb-4 animate-spin" size={32} />
        <p className="text-orange-600">Loading attendance records...</p>
      </div>
    );
  }

  if (filteredAttendance.length === 0) {
    return (
      <div className="p-12 text-center">
        <Users className="mx-auto text-orange-300 mb-4" size={48} />
        <h3 className="text-lg font-medium text-orange-800 mb-2">No attendance records found</h3>
        <p className="text-orange-600 mb-4">Add your first attendance record or adjust your filters</p>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          <Plus size={20} className="inline mr-2" />
          Add First Record
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-orange-50">
          <tr>
            <th className="p-4 text-left text-orange-700 font-semibold">Student</th>
            <th className="p-4 text-left text-orange-700 font-semibold">Date</th>
            <th className="p-4 text-left text-orange-700 font-semibold">Class</th>
            <th className="p-4 text-left text-orange-700 font-semibold">Status</th>
            <th className="p-4 text-left text-orange-700 font-semibold">Remarks</th>
            <th className="p-4 text-left text-orange-700 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-100">
          {filteredAttendance.map((record) => (
            <tr key={record._id} className="hover:bg-orange-50 transition-colors">
              <td className="p-4">
                <div>
                  <div className="font-medium text-orange-800">{record.studentName}</div>
                  <div className="text-sm text-orange-600">Roll No: {record.rollNo}</div>
                </div>
              </td>
              <td className="p-4 text-orange-700">{getDateDisplay(record.date)}</td>
              <td className="p-4 text-orange-700">{record.class}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  record.status === 'present' ? 'bg-green-100 text-green-800' :
                  record.status === 'absent' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusDisplay(record.status)}
                </span>
              </td>
              <td className="p-4 text-orange-600 max-w-xs truncate">
                {record.remarks || '-'}
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openViewModal(record)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  
                  <button 
                    onClick={() => openEditModal(record)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="Edit Record"
                  >
                    <Edit3 size={16} />
                  </button>
                  
                  <button 
                    onClick={() => openDeleteModal(record)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;