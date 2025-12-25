

const { attendanceData } = require('../data/initialData');

const getAllAttendance = (req, res) => {
  try {
    const { date, class: className, studentId } = req.query;
    
    let filteredData = [...attendanceData];
    
    
    if (date) {
      filteredData = filteredData.filter(record => 
        record.date && record.date.split('T')[0] === date
      );
    }
    
    if (className) {
      filteredData = filteredData.filter(record => 
        record.class && record.class.includes(className)
      );
    }
    
    if (studentId) {
      filteredData = filteredData.filter(record => {
        if (record.records && Array.isArray(record.records)) {
          return record.records.some(r => r.studentId === studentId);
        }
        return record.studentId === studentId;
      });
    }
    
    res.json({
      success: true,
      count: filteredData.length,
      data: filteredData
    });
  } catch (error) {
    console.error('Error in getAllAttendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance records'
    });
  }
};

// ✅ GET ATTENDANCE BY DATE AND CLASS
const getAttendanceByDateClass = (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in getAttendanceByDateClass:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance record'
    });
  }
};

// ✅ MARK ATTENDANCE (CREATE NEW RECORD)
const markAttendance = (req, res) => {
  try {
    const { date, class: className, subject, teacherId, teacherName, records } = req.body;
    
    // Validate required fields
    if (!date || !className || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, class, and records are required'
      });
    }
    
    
    const existingIndex = attendanceData.findIndex(
      a => a.date === date && a.class === className && a.subject === subject
    );
    
    const attendanceRecord = {
      _id: existingIndex > -1 ? attendanceData[existingIndex]._id : Date.now().toString(),
      date,
      class: className,
      subject: subject || 'General',
      teacherId: teacherId || '1',
      teacherName: teacherName || 'Admin',
      records: records.map(record => ({
        studentId: record.studentId,
        studentName: record.studentName,
        status: record.status || 'absent',
        remarks: record.remarks || '',
        checkInTime: record.checkInTime || '',
        checkOutTime: record.checkOutTime || ''
      })),
      createdAt: existingIndex > -1 ? attendanceData[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (existingIndex > -1) {
      // Update existing record
      attendanceData[existingIndex] = attendanceRecord;
    
    } else {
      // Add new record
      attendanceData.push(attendanceRecord);
      
    }
    
    res.status(201).json({
      success: true,
      message: existingIndex > -1 ? 'Attendance updated successfully' : 'Attendance marked successfully',
      data: attendanceRecord
    });
  } catch (error) {
    console.error('Error in markAttendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark attendance'
    });
  }
};

// ✅ UPDATE ATTENDANCE RECORD
const updateAttendance = (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const attendanceIndex = attendanceData.findIndex(a => a._id === id);
    
    if (attendanceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Attendance record not found"
      });
    }
    
    
    attendanceData[attendanceIndex] = {
      ...attendanceData[attendanceIndex],
      ...updateData,
      _id: id, 
      updatedAt: new Date().toISOString()
    };
    
    
    
    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendanceData[attendanceIndex]
    });
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update attendance'
    });
  }
};


const deleteAttendance = (req, res) => {
  try {
    const { id } = req.params;
    
    const attendanceIndex = attendanceData.findIndex(a => a._id === id);
    
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
  } catch (error) {
    console.error('Error in deleteAttendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete attendance'
    });
  }
};


const getTodayAttendanceStats = (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAttendance = attendanceData.filter(record => {
      const recordDate = record.date ? record.date.split('T')[0] : '';
      return recordDate === today;
    });
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalStudents = 0;
    
    todayAttendance.forEach(record => {
      if (record.records && Array.isArray(record.records)) {
        record.records.forEach(studentRecord => {
          totalStudents++;
          if (studentRecord.status === 'present') totalPresent++;
          else if (studentRecord.status === 'absent') totalAbsent++;
          else if (studentRecord.status === 'late') totalLate++;
        });
      }
    });
    
    const attendancePercentage = totalStudents > 0 
      ? Math.round((totalPresent / totalStudents) * 100) 
      : 0;
    
    res.json({
      success: true,
      data: {
        date: today,
        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,
        attendancePercentage
      }
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s attendance stats'
    });
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceByDateClass,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getTodayAttendanceStats
};