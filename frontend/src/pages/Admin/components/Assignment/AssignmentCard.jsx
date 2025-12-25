
import React from 'react';
import { User, Calendar, Edit, Trash2, Eye } from 'lucide-react';

const AssignmentCard = ({ 
  assignment, 
  calculateSubmissionRate, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed';
  const submissionRate = calculateSubmissionRate(assignment);
  
  return (
    <div className="border border-orange-200 rounded-2xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800">{assignment.title}</h4>
          <p className="text-sm text-gray-600">{assignment.subject}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          assignment.status === 'active' ? 'bg-green-100 text-green-800' :
          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {assignment.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <User size={14} className="mr-2" />
          <span>{assignment.teacherName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-2" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="text-sm">
          {assignment.assignedTo === 'all' ? (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">All Students</span>
          ) : assignment.assignedTo === 'specific-class' ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Class {assignment.class}</span>
          ) : (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{assignment.studentName}</span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Submission:</span>
          <span className="font-medium">{assignment.submittedCount}/{assignment.totalStudents}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${submissionRate}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <Eye size={14} className="mr-1" />
          View
        </button>
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="text-orange-600 hover:text-orange-800 p-1 hover:bg-orange-50 rounded"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;