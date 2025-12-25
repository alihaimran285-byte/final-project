const express = require("express");
const router = express.Router();

let applications = [
  {
    _id: "1",
    studentName: "Rahul Kumar",
    parentName: "Rajesh Kumar",
    email: "rahul@email.com",
    phone: "9876543210",
    class: "Grade 5",
    address: "123 Main Street, City",
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET all applications
router.get("/", (req, res) => {
  try {
    console.log('📥 GET /api/applications - Fetching all applications');
    res.json({
      success: true,
      data: applications,
      total: applications.length
    });
  } catch (error) {
    console.error('❌ GET Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch applications" 
    });
  }
});

// CREATE new application
router.post("/", (req, res) => {
  try {
    console.log('📥 POST /api/applications - Body:', req.body);
    
    if (!req.body.studentName || !req.body.email) {
      return res.status(400).json({ 
        success: false,
        error: "Student name and email are required" 
      });
    }

    const newApplication = {
      _id: Date.now().toString(),
      studentName: req.body.studentName,
      parentName: req.body.parentName || "",
      email: req.body.email,
      phone: req.body.phone || "",
      class: req.body.class || "",
      address: req.body.address || "",
      status: req.body.status || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    applications.push(newApplication);
    
    console.log('✅ Application created for:', newApplication.studentName);
    
    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: newApplication
    });
  } catch (error) {
    console.error('❌ POST Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create application" 
    });
  }
});

// UPDATE application
router.put("/:id", (req, res) => {
  try {
    const applicationId = req.params.id;
    const applicationIndex = applications.findIndex(a => a._id === applicationId);
    
    if (applicationIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: "Application not found" 
      });
    }

    applications[applicationIndex] = {
      ...applications[applicationIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: "Application updated successfully",
      data: applications[applicationIndex]
    });
  } catch (error) {
    console.error('❌ PUT Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update application" 
    });
  }
});

// DELETE application
router.delete("/:id", (req, res) => {
  try {
    const applicationId = req.params.id;
    const applicationIndex = applications.findIndex(a => a._id === applicationId);
    
    if (applicationIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: "Application not found" 
      });
    }

    const deletedApplication = applications[applicationIndex];
    applications.splice(applicationIndex, 1);
    
    res.json({ 
      success: true,
      message: "Application deleted successfully", 
      data: deletedApplication 
    });
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete application" 
    });
  }
});

module.exports = router;