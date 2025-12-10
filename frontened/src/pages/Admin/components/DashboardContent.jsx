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
  
  // ✅ Local storage se attendance data load karo
  const [localAttendance, setLocalAttendance] = useState([]);
  
  useEffect(() => {
    // Load attendance from local storage
    const savedAttendance = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
    setLocalAttendance(savedAttendance);
    
    // Listen for attendance updates
    const handleAttendanceUpdate = (event) => {
      const updatedAttendance = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
      setLocalAttendance(updatedAttendance);
      
      // Force re-render for stats update
      if (event.detail) {
        console.log('📊 Dashboard received attendance update:', event.detail);
      }
    };
    
    window.addEventListener('attendanceUpdated', handleAttendanceUpdate);
    
    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate);
    };
  }, []);
  
  // ✅ Combine API attendance with local storage attendance
  const allAttendance = [...attendance, ...localAttendance];
  
  // ✅ REAL DATA CALCULATIONS
  const totalStudents = students?.length || 0;
  const totalTeachers = teachers?.length || 0;
  const totalEvents = events?.length || 0;
  const totalClasses = classes?.length || 0;
  const pendingApplications = applications?.filter(app => 
    app.status === 'Pending' || app.status === 'pending'
  )?.length || 0;

  // ✅ TODAY'S ATTENDANCE CALCULATION - Use combined data
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = allAttendance.filter(record => {
    const recordDate = record.date ? record.date.split('T')[0] : record.date;
    return recordDate === today;
  }) || [];
  
  console.log('📅 Today\'s attendance stats:', {
    today,
    totalAttendance: allAttendance.length,
    localAttendance: localAttendance.length,
    apiAttendance: attendance.length,
    todayAttendance: todayAttendance.length,
    todayAttendanceData: todayAttendance
  });

  const presentCount = todayAttendance.filter(record => 
    record.status === 'present' || record.status === 'Present'
  ).length;
  
  const absentCount = todayAttendance.filter(record => 
    record.status === 'absent' || record.status === 'Absent'
  ).length;
  
  const lateCount = todayAttendance.filter(record => 
    record.status === 'late' || record.status === 'Late'
  ).length;
  
  const totalMarked = todayAttendance.length;
  const attendancePercentage = totalStudents > 0 ? Math.round((totalMarked / totalStudents) * 100) : 0;

  // ✅ REFRESH FUNCTION WITH 2-SECOND LOADING
  const handleRefresh = () => {
    onDataUpdate(); // Call parent refresh
    // The parent will handle the 2-second loading state
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
      change: `${presentCount} present, ${absentCount} absent, ${lateCount} late`,
      trend: presentCount > 0 ? 'up' : 'down',
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      id: 5,
      title: 'Pending Applications',
      value: pendingApplications.toString(),
      change: 'Need review',
      trend: pendingApplications > 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-orange-300 to-orange-400'
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

  // ✅ REAL RECENT ACTIVITIES
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
    ...(todayAttendance.slice(-3).map(record => ({
      id: `attendance-${record._id || record.id}`,
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
      status: 'Marked',
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

  // ✅ Debug information
  if (process.env.NODE_ENV === 'development') {
    console.log('📈 Dashboard Stats:', {
      totalStudents,
      totalTeachers,
      totalAttendance: allAttendance.length,
      todayAttendance: todayAttendance.length,
      presentCount,
      absentCount,
      lateCount,
      localAttendanceCount: localAttendance.length,
      apiAttendanceCount: attendance.length
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="opacity-90">
              {totalStudents} students, {totalTeachers} teachers, {totalClasses} classes, and {totalEvents} events in your school
            </p>
            <p className="opacity-90 text-sm mt-1">
              Today's attendance: <span className="font-semibold">{presentCount} present</span>, <span className="font-semibold">{absentCount} absent</span>, <span className="font-semibold">{lateCount} late</span> 
              ({totalMarked}/{totalStudents} marked)
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
            >
              <RefreshCw size={20} className={statsLoading ? 'animate-spin' : ''} />
              <span>{statsLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
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

      {/* Attendance Summary - Always show, even if no data */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-orange-800">Today's Attendance Summary</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              {today}
            </span>
            {totalMarked > 0 && (
              <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                {attendancePercentage}% marked
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
                <div className="text-xs text-gray-500 mt-1">{item.percentage}%</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No attendance marked for today yet</p>
            <p className="text-sm mt-1">
              Go to <a href="#attendance" className="text-orange-600 hover:text-orange-800 font-medium">Attendance Management</a> to mark attendance
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-orange-800">Recent Activities</h3>
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              {recentActivities.length} activities
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'student' ? 'bg-orange-100 text-orange-600' :
                    activity.type === 'teacher' ? 'bg-amber-100 text-amber-600' :
                    activity.type === 'event' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-orange-600">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
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
                {totalStudents + totalTeachers + totalEvents + totalClasses + allAttendance.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendance Records</span>
              <span className="text-sm font-medium text-orange-600">
                {allAttendance.length} (Today: {totalMarked})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendance Today</span>
              <span className="text-sm font-medium text-orange-600">
                {totalMarked}/{totalStudents}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Storage Status</span>
              <span className="text-sm font-medium text-green-600">
                Local Data Saved ✓
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>ℹ️ Attendance data is saved locally and won't be lost on refresh.</p>
              <p className="mt-1">Click "Refresh" to update stats (2 seconds only).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;