
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  UserPlus,
  TrendingUp,
  Shield,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const DashboardContent = ({ 
  students = [], 
  teachers = [], 
  events = [], 
  applications = [], 
  classes = [], 
  attendance = [],
  assignments = [],
  dashboardStats = null, 
  statsLoading = false, 
  onDataUpdate = () => {}, 
  searchTerm = '' 
}) => {
  
  
  
  
  const totalStudents = students?.length || 0;
  const totalTeachers = teachers?.length || 0;
  const totalEvents = events?.length || 0;
  const totalClasses = classes?.length || 0;
  const pendingApplications = applications?.filter(app => 
    app.status === 'Pending' || app.status === 'pending'
  )?.length || 0;

  
  const today = new Date().toISOString().split('T')[0];
  
  
  const todayAttendance = attendance.filter(record => {
    if (!record.date) return false;
    const recordDate = record.date.split('T')[0];
    return recordDate === today;
  }) || [];
  
  console.log('📅 Today\'s attendance from API:', {
    today,
    todayAttendanceCount: todayAttendance.length,
    present: todayAttendance.filter(r => r.status === 'present').length,
    absent: todayAttendance.filter(r => r.status === 'absent').length,
    late: todayAttendance.filter(r => r.status === 'late').length
  });

  const presentCount = todayAttendance.filter(record => 
    record.status === 'present'
  ).length;
  
  const absentCount = todayAttendance.filter(record => 
    record.status === 'absent'
  ).length;
  
  const lateCount = todayAttendance.filter(record => 
    record.status === 'late'
  ).length;
  
  const totalMarked = presentCount + absentCount + lateCount;
  const attendancePercentage = totalStudents > 0 ? Math.round((totalMarked / totalStudents) * 100) : 0;

  
  const handleRefresh = () => {
    onDataUpdate();
  };

  const stats = [
    {
      id: 1,
      title: 'Total Students',
      value: totalStudents.toString(),
      change: `${totalStudents} enrolled`,
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      id: 2,
      title: 'Total Teachers',
      value: totalTeachers.toString(),
      change: `${totalTeachers} teaching staff`,
      trend: 'up',
      icon: UserPlus,
      color: 'bg-gradient-to-r from-orange-400 to-orange-500'
    },
    {
      id: 3,
      title: 'Active Classes',
      value: totalClasses.toString(),
      change: `${totalClasses} running`,
      trend: 'up',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-amber-500 to-amber-600'
    },
    {
      id: 4,
      title: 'Today\'s Attendance',
      value: `${attendancePercentage}%`,
      change: totalMarked > 0 ? `${presentCount} present, ${absentCount} absent, ${lateCount} late` : 'No attendance marked',
      trend: presentCount > 0 ? 'up' : 'down',
      icon: CheckCircle,
      color: totalMarked > 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'
    },
   
    {
      id: 6,
      title: 'Active Events',
      value: totalEvents.toString(),
      change: `${totalEvents} scheduled`,
      trend: 'up',
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    }
  ];

  
  const recentActivities = [
    ...(students?.slice(-3).map(student => ({
      id: `student-${student._id || student.id}`,
      action: `New student: ${student.name || 'Unknown'}`,
      time: 'Recently',
      type: 'student',
      icon: Users
    })) || []),
    ...(teachers?.slice(-2).map(teacher => ({
      id: `teacher-${teacher._id || teacher.id}`,
      action: `New teacher: ${teacher.name || 'Unknown'}`,
      time: 'Recently', 
      type: 'teacher',
      icon: UserPlus
    })) || []),
    ...(events?.slice(-2).map(event => ({
      id: `event-${event._id || event.id}`,
      action: `New event: ${event.title || 'Untitled'}`,
      time: 'Recently',
      type: 'event',
      icon: Calendar
    })) || []),
    ...(todayAttendance.slice(-3).map((record, index) => ({
      id: `attendance-${record._id || `temp-${index}`}`,
      action: `${record.studentName || 'Student'} marked ${record.status || 'unknown'}`,
      time: 'Just now',
      type: 'attendance',
      icon: record.status === 'present' ? CheckCircle : 
            record.status === 'absent' ? XCircle : Clock
    })) || [])
  ]
  .sort((a, b) => {
    // Sort by time (recent first)
    if (a.time === 'Just now') return -1;
    if (b.time === 'Just now') return 1;
    return 0;
  })
  .slice(-6);

  // ✅ ATTENDANCE SUMMARY DATA
  const attendanceSummary = [
    {
      id: 1,
      status: 'Present',
      count: presentCount,
      percentage: totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle
    },
    {
      id: 2,
      status: 'Absent',
      count: absentCount,
      percentage: totalMarked > 0 ? Math.round((absentCount / totalMarked) * 100) : 0,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: XCircle
    },
    {
      id: 3,
      status: 'Late',
      count: lateCount,
      percentage: totalMarked > 0 ? Math.round((lateCount / totalMarked) * 100) : 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: Clock
    },
    {
      id: 4,
      status: 'Marked Today',
      count: totalMarked,
      percentage: attendancePercentage,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: Users
    }
  ];

  // ✅ Loading State
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Refreshing dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">This will only take 2 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="opacity-90">
              {totalStudents} students, {totalTeachers} teachers, {totalClasses} classes, and {totalEvents} events in your school
            </p>
            <p className="opacity-90 text-sm mt-1">
              Today's attendance: <span className="font-semibold">{presentCount} present</span>, 
              <span className="font-semibold"> {absentCount} absent</span>, 
              <span className="font-semibold"> {lateCount} late</span> 
              ({totalMarked}/{totalStudents} marked - {attendancePercentage}%)
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className={`rounded-2xl shadow-lg ${stat.color} text-white p-4 transform hover:scale-105 transition-transform duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium opacity-90">{stat.title}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-orange-800">Today's Attendance Summary</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              {today}
            </span>
            {totalMarked > 0 && (
              <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                {attendancePercentage}% attendance
              </span>
            )}
          </div>
        </div>
        
        {totalMarked > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {attendanceSummary.map((item) => (
              <div key={item.id} className="text-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className={item.color} size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-800">{item.count}</div>
                <div className="text-sm font-medium text-gray-600">{item.status}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.count > 0 ? `${item.percentage}%` : '0%'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No attendance marked for today yet</p>
            <p className="text-sm mt-1">
              Go to <span className="text-orange-600 font-medium">Attendance Management</span> to mark attendance
            </p>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
        <h3 className="text-lg font-bold text-orange-800 mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Data Last Updated</span>
            <span className="text-sm font-medium text-orange-600">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Records</span>
            <span className="text-sm font-medium text-orange-600">
              {totalStudents + totalTeachers + totalEvents + totalClasses + attendance.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Attendance Records</span>
            <span className="text-sm font-medium text-orange-600">
              {attendance.length} (Today: {totalMarked})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Attendance Today</span>
            <span className="text-sm font-medium text-orange-600">
              {totalMarked}/{totalStudents}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Data Source</span>
            <span className="text-sm font-medium text-green-600">
              Backend Database ✓
            </span>
          </div>
        </div>
      
         
      </div>
    </div>
  );
};

export default DashboardContent;
