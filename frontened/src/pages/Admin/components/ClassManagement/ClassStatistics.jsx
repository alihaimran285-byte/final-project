import React from 'react';
import { BarChart3, Users, FileText, TrendingUp, Calendar, X } from 'lucide-react';

const ClassStatistics = ({ isOpen, onClose, classData, stats }) => {
  if (!isOpen || !classData || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Class Statistics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{classData.name}</h3>
          <p className="text-gray-600">Code: {classData.code} • Teacher: {classData.teacher}</p>
          <p className="text-gray-600">Subject: {classData.subject} • Grade: {classData.grade}</p>
          {classData.schedule && (
            <p className="text-gray-600 mt-1 flex items-center">
              <Calendar size={16} className="mr-2" />
              Schedule: {classData.schedule}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <Users className="text-blue-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-blue-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <FileText className="text-green-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-green-600">Assignments</p>
                <p className="text-2xl font-bold text-green-800">{stats.assignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <TrendingUp className="text-purple-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-purple-600">Average Grade</p>
                <p className="text-2xl font-bold text-purple-800">{stats.averageGrade}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center">
              <BarChart3 className="text-orange-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-orange-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-orange-800">{stats.attendanceRate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassStatistics;