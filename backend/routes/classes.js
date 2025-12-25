const express = require("express");
const Class = require("../models/Class");
const router = express.Router();

// ✅ GET all classes
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: classes,
      total: classes.length,
      message: "Classes fetched successfully"
    });
  } catch (error) {
    console.error('❌ GET Classes Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch classes" 
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log('📝 Creating new class - Request Body:', req.body);
    
    const { name, code, teacher, grade, subject, schedule, room, capacity, students } = req.body;
    
    // Detailed validation
    if (!name) return res.status(400).json({ success: false, error: "Class name is required" });
    if (!code) return res.status(400).json({ success: false, error: "Class code is required" });
    if (!teacher) return res.status(400).json({ success: false, error: "Teacher is required" });
    if (!grade) return res.status(400).json({ success: false, error: "Grade is required" });
    if (!subject) return res.status(400).json({ success: false, error: "Subject is required" });

    console.log('✅ Validation passed');

    // Check if class code already exists
    const existingClass = await Class.findOne({ code: code.toUpperCase() });
    if (existingClass) {
      console.log('❌ Class code already exists:', code);
      return res.status(400).json({ 
        success: false,
        error: "Class code already exists" 
      });
    }

    console.log('🔄 Creating class object...');
    
    
    const newClass = await Class.create({
      name,
      code: code.toUpperCase(),
      teacher,
      grade,
      subject,
      schedule: schedule || "",
      room: room || "",
      capacity: capacity || 30,
      students: students || 0
    });

    console.log('✅ Class created successfully:', newClass);
    
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass
    });
  } catch (error) {
    console.error('❌ CREATE Class Error Details:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: errors
      });
    }
    
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "Class code already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Failed to create class",
      details: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    console.log('🗑️ DELETE Request - ID:', classId);
    
    const classObj = await Class.findOneAndDelete({ _id: classId });
    
    if (!classObj) {
      console.log('❌ Class not found with ID:', classId);
      return res.status(404).json({ 
        success: false,
        error: "Class not found"
      });
    }

    console.log('✅ Class deleted:', classObj.name);

    res.json({ 
      success: true,
      message: "Class deleted successfully", 
      data: classObj 
    });
  } catch (error) {
    console.error('❌ DELETE Class Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete class"
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    console.log('✏️ UPDATE Request - ID:', classId);
    
    const classObj = await Class.findOneAndUpdate(
      { _id: classId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!classObj) {
      console.log('❌ Class not found for update:', classId);
      return res.status(404).json({ 
        success: false,
        error: "Class not found" 
      });
    }

    console.log('✅ Class updated:', classObj.name);

    res.json({
      success: true,
      message: "Class updated successfully",
      data: classObj
    });
  } catch (error) {
    console.error('❌ UPDATE Class Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update class" 
    });
  }
});

// ✅ GET single class
router.get("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    
    const classObj = await Class.findOne({ _id: classId });

    if (!classObj) {
      return res.status(404).json({ 
        success: false,
        error: "Class not found" 
      });
    }

    res.json({
      success: true,
      data: classObj,
      message: "Class fetched successfully"
    });
  } catch (error) {
    console.error('❌ GET Single Class Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch class" 
    });
  }
});

module.exports = router;