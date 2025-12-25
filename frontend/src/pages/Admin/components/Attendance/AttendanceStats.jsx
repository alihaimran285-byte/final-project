import React from 'react';
import { CheckCircle, XCircle, Clock, UserPlus } from 'lucide-react';

const AttendanceStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700">Present</p>
            <p className="text-2xl font-bold text-green-800">{stats.present}</p>
          </div>
          <CheckCircle className="text-green-500" size={24} />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700">Absent</p>
            <p className="text-2xl font-bold text-red-800">{stats.absent}</p>
          </div>
          <XCircle className="text-red-500" size={24} />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-700">Late</p>
            <p className="text-2xl font-bold text-yellow-800">{stats.late}</p>
          </div>
          <Clock className="text-yellow-500" size={24} />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-700">Attendance Rate</p>
            <p className="text-2xl font-bold text-orange-800">{stats.attendanceRate}%</p>
          </div>
          <UserPlus className="text-orange-500" size={24} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;