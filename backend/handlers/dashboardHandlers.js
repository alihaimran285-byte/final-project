

const { studentsData, teachersData, classesData, assignmentsData, eventsData, attendanceData, adminsData } = require('../data/initialData');

const getAdminDashboard = (req, res) => {
  const totalAttendanceRecords = attendanceData.length;
  let totalPresent = 0;
  let totalAbsent = 0;
  
  attendanceData.forEach(record => {
    record.records.forEach(studentRecord => {
      if (studentRecord.status === 'present') {
        totalPresent++;
      } else if (studentRecord.status === 'absent') {
        totalAbsent++;
      }
    });
  });
  
  const attendanceRate = totalAttendanceRecords > 0 ? 
    Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0;
  
  const totalSubmissions = assignmentsData.reduce((sum, assignment) => {
    return sum + assignment.submissions.length;
  }, 0);
  
  const totalPossibleSubmissions = assignmentsData.length * studentsData.length;
  const submissionRate = totalPossibleSubmissions > 0 ? 
    Math.round((totalSubmissions / totalPossibleSubmissions) * 100) : 0;
  
  res.json({
    success: true,
    data: {
      stats: {
        totalStudents: studentsData.length,
        totalTeachers: teachersData.length,
        totalClasses: classesData.length,
        totalAssignments: assignmentsData.length,
        totalEvents: eventsData.length,
        registeredCandidates: studentsData.filter(s => s.isRegistered).length,
        activeStudents: studentsData.filter(s => s.status === 'active').length,
        activeTeachers: teachersData.filter(t => t.status === 'active').length,
        attendanceRecords: totalAttendanceRecords,
        attendanceRate: attendanceRate,
        submissionRate: submissionRate
      },
      recentActivities: [
        {
          type: 'student_registered',
          message: `${studentsData.filter(s => s.isRegistered).length} students registered online`,
          time: 'Just now'
        },
        {
          type: 'assignment_submitted',
          message: `${totalSubmissions} assignments submitted`,
          time: 'Today'
        },
        {
          type: 'attendance_marked',
          message: `${totalAttendanceRecords} attendance records`,
          time: 'This week'
        }
      ]
    }
  });
};

const getApiInfo = (req, res) => {
  res.json({
    message: "🎓 Panda School Management System API",
    version: "8.0 - Complete System with Assignment Fixes",
    status: "running",
    endpoints: {
      auth: ["POST /auth/register", "POST /auth/login"],
      candidates: [
        "POST /api/candidates/check-email",
        "POST /api/candidates/register", 
        "POST /api/candidates/login",
        "GET /api/candidates/:id/dashboard",
        "GET /api/candidates/:id/assignments",
        "POST /api/candidates/:id/assignments/:assignmentId/submit"
      ],
      admin: {
        students: ["GET /api/students", "POST /api/students", "PUT /api/students/:id", "DELETE /api/students/:id"],
        teachers: ["GET /api/teachers", "POST /api/teachers", "PUT /api/teachers/:id", "DELETE /api/teachers/:id"],
        classes: ["GET /api/classes", "POST /api/classes", "PUT /api/classes/:id", "DELETE /api/classes/:id"],
        assignments: [
          "GET /api/assignments", 
          "GET /api/assignments/details",
          "GET /api/assignments/:id/submissions",
          "POST /api/assignments", 
          "PUT /api/assignments/:id", 
          "DELETE /api/assignments/:id",
          "POST /api/assignments/:id/grade-bulk",
          "GET /api/assignments/:id/submissions/download"
        ],
        events: ["GET /api/events", "POST /api/events", "PUT /api/events/:id", "DELETE /api/events/:id"],
        attendance: ["GET /api/attendance", "POST /api/attendance", "PUT /api/attendance/:id", "DELETE /api/attendance/:id"],
        dashboard: ["GET /api/admin/dashboard"]
      }
    },
    data: {
      totalStudents: studentsData.length,
      registeredStudents: studentsData.filter(s => s.isRegistered).length,
      totalAdmins: adminsData.length,
      totalTeachers: teachersData.length,
      totalClasses: classesData.length,
      totalAssignments: assignmentsData.length,
      totalEvents: eventsData.length,
      totalAttendanceRecords: attendanceData.length
    }
  });
};

const getHealthCheck = (req, res) => {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "8.0",
    dataCounts: {
      students: studentsData.length,
      teachers: teachersData.length,
      classes: classesData.length,
      assignments: assignmentsData.length,
      events: eventsData.length,
      attendance: attendanceData.length,
      admins: adminsData.length
    },
    assignmentStats: {
      totalAssignments: assignmentsData.length,
      totalSubmissions: assignmentsData.reduce((sum, a) => sum + a.submissions.length, 0),
      averageSubmissions: assignmentsData.length > 0 
        ? (assignmentsData.reduce((sum, a) => sum + a.submissions.length, 0) / assignmentsData.length).toFixed(2)
        : 0
    }
  };

  res.json(healthStatus);
};

module.exports = {
  getAdminDashboard,
  getApiInfo,
  getHealthCheck
};

