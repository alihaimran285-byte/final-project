import React from 'react';
import { X, Save } from 'lucide-react';

const TeacherFormModal = ({ 
  isOpen, 
  onClose, 
  teacher, 
  onTeacherChange, 
  onSave, 
  loading = false,
  mode = 'add'
}) => {
  if (!isOpen || !teacher) return null;

  const subjects = ["Mathematics", "Science", "English", "History", "Physics", "Chemistry", "Biology", "Computer Science"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {mode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {mode === 'edit' && (
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={teacher.avatar} 
                alt={teacher.name} 
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-lg">{teacher.name}</h4>
                <p className="text-gray-600">{teacher.subject}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={teacher.name}
              onChange={(e) => onTeacherChange({...teacher, name: e.target.value})}
              placeholder="Enter teacher name"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={teacher.email}
              onChange={(e) => onTeacherChange({...teacher, email: e.target.value})}
              placeholder="Enter email address"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={teacher.phone}
              onChange={(e) => onTeacherChange({...teacher, phone: e.target.value})}
              placeholder="Enter phone number"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={teacher.subject}
              onChange={(e) => onTeacherChange({...teacher, subject: e.target.value})}
              disabled={loading}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={teacher.classes}
              onChange={(e) => onTeacherChange({...teacher, classes: parseInt(e.target.value) || 1})}
              min="1"
              max="10"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Number of classes assigned</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={teacher.status}
              onChange={(e) => onTeacherChange({...teacher, status: e.target.value})}
              disabled={loading}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{mode === 'add' ? 'Add Teacher' : 'Update Teacher'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherFormModal;