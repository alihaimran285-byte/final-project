// components/AssignmentManagement/AssignmentTableRow.jsx
import React from 'react';
import { User, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

const AssignmentTableRow = ({ 
  assignment, 
  calculateSubmissionRate, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed';
  const submissionRate = calculateSubmissionRate(assignment);
  
  return (
    <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
      <td className="p-4">
        <div>
          <p className="font-medium text-gray-800">{assignment.title}</p>
          <p className="text-sm text-gray-600">{assignment.subject}</p>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
            <User size={14} className="text-orange-600" />
          </div>
          <span className="text-sm font-medium">{assignment.teacherName}</span>
        </div>
      </td>
      <td className="p-4">
        {assignment.assignedTo === 'all' ? (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">All Students</span>
        ) : assignment.assignedTo === 'specific-class' ? (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Class {assignment.class}</span>
        ) : (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{assignment.studentName}</span>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center">
          <Calendar size={14} className="text-gray-400 mr-1" />
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            {new Date(assignment.dueDate).toLocaleDateString()}
            {isOverdue && <span className="ml-1 text-xs">⚠️ Overdue</span>}
          </span>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          assignment.status === 'active' ? 'bg-green-100 text-green-800' :
          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          assignment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {assignment.status}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${submissionRate}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {assignment.submittedCount}/{assignment.totalStudents}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AssignmentTableRow;