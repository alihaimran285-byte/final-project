const express = require("express");
const router = express.Router();

// Temporary in-memory storage for attendance
let attendanceRecords = [
  {
    _id: "1",
    studentId: "1",
    studentName: "Aliha Imran Bhatti",
    date: "2024-01-15",
    status: "present",
    class: "English 101 Creative Writing",
    remarks: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET all attendance records
router.get("/", (req, res) => {
  try {
    const { date, class: className, studentId } = req.query;
    console.log('📥 GET /api/attendance - Query:', req.query);

    let filteredRecords = [...attendanceRecords];

    // Filter by date
    if (date) {
      filteredRecords = filteredRecords.filter(record => record.date === date);
    }

    // Filter by class
    if (className) {
      filteredRecords = filteredRecords.filter(record => record.class === className);
    }

    // Filter by student ID
    if (studentId) {
      filteredRecords = filteredRecords.filter(record => record.studentId === studentId);
    }

    res.json({
      success: true,
      data: filteredRecords,
      total: filteredRecords.length
    });
  } catch (error) {
    console.error('❌ GET Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch attendance records" 
    });
  }
});

// CREATE new attendance record
router.post("/", (req, res) => {
  try {
    console.log('📥 POST /api/attendance - Body:', req.body);
    
    // Validation
    if (!req.body.studentId || !req.body.date || !req.body.status) {
      return res.status(400).json({ 
        success: false,
        error: "Student ID, date and status are required" 
      });
    }

    const newRecord = {
      _id: Date.now().toString(),
      studentId: req.body.studentId,
      studentName: req.body.studentName || "",
      date: req.body.date,
      status: req.body.status,
      class: req.body.class || "",
      remarks: req.body.remarks || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    attendanceRecords.push(newRecord);
    
    console.log('✅ Attendance record created for student:', newRecord.studentName);
    
    res.status(201).json({
      success: true,
      message: "Attendance record created successfully",
      data: newRecord
    });
  } catch (error) {
    console.error('❌ POST Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create attendance record" 
    });
  }
});

// UPDATE attendance record
router.put("/:id", (req, res) => {
  try {
    const recordId = req.params.id;
    console.log(`📥 PUT /api/attendance/${recordId} - Body:`, req.body);
    
    const recordIndex = attendanceRecords.findIndex(r => r._id === recordId);
    
    if (recordIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: "Attendance record not found" 
      });
    }

    // Update record
    attendanceRecords[recordIndex] = {
      ...attendanceRecords[recordIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    console.log('✅ Attendance record updated for:', attendanceRecords[recordIndex].studentName);

    res.json({
      success: true,
      message: "Attendance record updated successfully",
      data: attendanceRecords[recordIndex]
    });
  } catch (error) {
    console.error('❌ PUT Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update attendance record" 
    });
  }
});

// DELETE attendance record
router.delete("/:id", (req, res) => {
  try {
    const recordId = req.params.id;
    console.log(`🗑️ DELETE /api/attendance/${recordId}`);
    
    const recordIndex = attendanceRecords.findIndex(r => r._id === recordId);
    
    if (recordIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: "Attendance record not found" 
      });
    }

    const deletedRecord = attendanceRecords[recordIndex];
    attendanceRecords.splice(recordIndex, 1);
    
    console.log('✅ Attendance record deleted for:', deletedRecord.studentName);

    res.json({ 
      success: true,
      message: "Attendance record deleted successfully", 
      data: deletedRecord 
    });
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete attendance record" 
    });
  }
});

module.exports = router;