const express = require("express");
const Teacher = require("../Models/Teacher");
const router = express.Router();

// ✅ GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({
      success: true,
      data: teachers,
      total: teachers.length,
      message: "Teachers fetched successfully"
    });
  } catch (error) {
    console.error('❌ GET Teachers Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch teachers" 
    });
  }
});

// ✅ CREATE new teacher - UPDATED WITH ALL FIELDS
router.post("/", async (req, res) => {
  try {
    console.log('📝 Creating new teacher:', req.body);
    
    // Extract ALL fields from request
    const { 
      name, 
      email, 
      subject, 
      phone, 
      experience = 0, 
      classes = 1, 
      totalStudents = 0,
      rating = 4.5,
      schedule = '', 
      status = 'active',
      joinDate
    } = req.body;
    
    if (!name || !email || !subject) {
      return res.status(400).json({ 
        success: false,
        error: "Name, email and subject are required"
      });
    }

    // Create teacher with ALL fields
    const teacher = await Teacher.create({
      name,
      email,
      subject,
      phone: phone || "",
      experience: parseInt(experience) || 0,
      classes: parseInt(classes) || 1,
      totalStudents: parseInt(totalStudents) || 0, // ✅ ADDED
      rating: parseFloat(rating) || 4.5, // ✅ ADDED
      schedule: schedule || '',
      status: status || 'active',
      joinDate: joinDate || new Date() // ✅ ADDED
    });

    console.log('✅ Teacher created successfully:', teacher.name);
    
    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher
    });
  } catch (error) {
    console.error('❌ CREATE Teacher Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "Email already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Failed to create teacher" 
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log('✏️ UPDATE Teacher Request:', req.body); // Debug log
    
    const updateData = {
      ...req.body,
      // Ensure numeric fields are numbers
      experience: parseInt(req.body.experience) || 0,
      classes: parseInt(req.body.classes) || 1,
      totalStudents: parseInt(req.body.totalStudents) || 0, // ✅ ADDED
      rating: parseFloat(req.body.rating) || 4.5 // ✅ ADDED
    };

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({ 
        success: false,
        error: "Teacher not found" 
      });
    }

    console.log('✅ Teacher updated:', teacher.name);
    console.log('📊 Updated data:', teacher);

    res.json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher
    });
  } catch (error) {
    console.error('❌ UPDATE Teacher Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update teacher" 
    });
  }
});

// ✅ DELETE teacher (same as before)
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ 
        success: false,
        error: "Teacher not found" 
      });
    }

    console.log('✅ Teacher deleted:', teacher.name);

    res.json({ 
      success: true,
      message: "Teacher deleted successfully", 
      data: teacher 
    });
  } catch (error) {
    console.error('❌ DELETE Teacher Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete teacher" 
    });
  }
});

module.exports = router;