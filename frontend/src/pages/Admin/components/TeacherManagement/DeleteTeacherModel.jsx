import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteTeacherModal = ({ isOpen, teacher, onClose, onConfirm, loading }) => {
  if (!isOpen || !teacher) return null;

  const getClassCount = () => {
    return teacher.classes || 1;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900">Delete Teacher</h3>
              <p className="text-red-700 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Teacher Info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 rounded-lg">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=fdba74&color=fff`}
              alt={teacher.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-bold text-red-900">{teacher.name}</p>
              <p className="text-sm text-red-700">{teacher.email}</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Warning: This will permanently delete:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Teacher: {teacher.name}</li>
                  <li>• {getClassCount()} classes assigned</li>
                  <li>• All teacher records</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Check */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </p>
            <input
              type="text"
              placeholder="Type DELETE here"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              id="deleteConfirm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-red-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const input = document.getElementById('deleteConfirm');
              if (input.value === 'DELETE') {
                onConfirm();
              } else {
                alert('Please type DELETE to confirm');
              }
            }}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-red-300 font-medium transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete Teacher
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeacherModal;