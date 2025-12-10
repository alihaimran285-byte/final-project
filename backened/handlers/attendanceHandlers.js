// ================================
// ATTENDANCE HANDLERS
// ================================

const { attendanceData } = require('../data/initialData');

const getAllAttendance = (req, res) => {
  res.json({
    success: true,
    count: attendanceData.length,
    data: attendanceData
  });
};

const getAttendanceByDateClass = (req, res) => {
  const { date, class: className } = req.params;
  
  const attendanceRecord = attendanceData.find(
    a => a.date === date && a.class === className
  );
  
  if (!attendanceRecord) {
    return res.status(404).json({
      success: false,
      error: "Attendance record not found"
    });
  }
  
  res.json({
    success: true,
    data: attendanceRecord
  });
};

const markAttendance = (req, res) => {
  const { date, class: className, subject, teacherId, teacherName, records } = req.body;
  
  const existingIndex = attendanceData.findIndex(
    a => a.date === date && a.class === className && a.subject === subject
  );
  
  const attendanceRecord = {
    _id: Date.now().toString(),
    date,
    class: className,
    subject,
    teacherId,
    teacherName,
    records,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (existingIndex > -1) {
    attendanceData[existingIndex] = attendanceRecord;
  } else {
    attendanceData.push(attendanceRecord);
  }
  
  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: attendanceRecord
  });
};

const updateAttendance = (req, res) => {
  const attendanceIndex = attendanceData.findIndex(a => a._id === req.params.id);
  
  if (attendanceIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Attendance record not found"
    });
  }
  
  attendanceData[attendanceIndex] = {
    ...attendanceData[attendanceIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Attendance updated successfully',
    data: attendanceData[attendanceIndex]
  });
};

const deleteAttendance = (req, res) => {
  const attendanceIndex = attendanceData.findIndex(a => a._id === req.params.id);
  
  if (attendanceIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Attendance record not found"
    });
  }
  
  const deleted = attendanceData.splice(attendanceIndex, 1);
  
  res.json({
    success: true,
    message: 'Attendance record deleted successfully',
    data: deleted[0]
  });
};

module.exports = {
  getAllAttendance,
  getAttendanceByDateClass,
  markAttendance,
  updateAttendance,
  deleteAttendance
};