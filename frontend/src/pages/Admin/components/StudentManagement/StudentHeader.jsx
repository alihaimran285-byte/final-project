import React from 'react';

const StudentHeader = ({ students = [] }) => {
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // ✅ FIXED: Statistics calculation with correct field names
  const statistics = {
    totalStudents: students.length,
    
    // ✅ FIX: Use lowercase 'active' to match backend
    activeStudents: students.filter(student => 
      student.status === 'active' || student.status === 'Active'
    ).length,
    
    // ✅ FIX: Use 'enrollmentDate' field
    newThisMonth: students.filter(student => {
      if (!student.enrollmentDate) return false;
      try {
        const enrollmentDate = new Date(student.enrollmentDate);
        return enrollmentDate.getMonth() === currentMonth && 
               enrollmentDate.getFullYear() === currentYear;
      } catch (err) {
        return false;
      }
    }).length,
    
    // Attendance calculation
    attendanceRate: students.length > 0 ? 
      Math.round(students.reduce((sum, student) => {
        const attendance = student.attendance ? 
          parseInt(student.attendance) || 0 : 85; // Default 85% if not available
        return sum + attendance;
      }, 0) / students.length) : 0
  };

  console.log('📊 Student Statistics:', statistics);

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
          <div className="text-sm text-green-200 mt-1">
            {students.length > 0 ? 
              `${Math.round((statistics.activeStudents / students.length) * 100)}% of total` : 
              'No students'}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{statistics.newThisMonth}</div>
          <div className="text-blue-100">New This Month</div>
          <div className="text-sm text-blue-200 mt-1">
            {new Date().toLocaleString('default', { month: 'long' })} enrollments
          </div>
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