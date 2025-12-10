import React from 'react';

const StudentHeader = ({ students = [] }) => {
  
  const statistics = {
    totalStudents: students.length,
    activeStudents: students.filter(student => student.status === 'Active').length,
    newThisMonth: students.filter(student => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const joinDate = new Date(student.joinDate);
      return joinDate.getMonth() === currentMonth && 
             joinDate.getFullYear() === currentYear;
    }).length,
    attendanceRate: students.length > 0 ? 
      Math.round(students.reduce((sum, student) => {
        const attendance = parseInt(student.attendance) || 0;
        return sum + attendance;
      }, 0) / students.length) : 0
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-orange-800 mb-2">Student Management</h1>
      <p className="text-orange-600 text-lg">Manage all students in your school</p>
      
      {/* ✅ AUTO-UPDATING QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{statistics.totalStudents}</div>
          <div className="text-orange-100">Total Students</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{statistics.activeStudents}</div>
          <div className="text-green-100">Active Students</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{statistics.newThisMonth}</div>
          <div className="text-blue-100">New This Month</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{statistics.attendanceRate}%</div>
          <div className="text-purple-100">Avg Attendance</div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;