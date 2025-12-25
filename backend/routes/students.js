// routes/students.js - FINAL VERSION (100% WORKING)
const express = require("express");
const router = express.Router();

// In-memory storage (for demo)
let students = [
  {
    _id: "1",
    name: "Aliha Imran Bhatti",
    email: "aliha123@email.com",
    rollNo: "101",
    class: "5th Grade",
    phone: "01274602494",
    parentName: "Imran Bhatti",
    parentPhone: "03001234567",
    status: "active",
    assignedTeachers: [
      { teacherId: "1", teacherName: "Mr. Johnson", subject: "Mathematics" },
      { teacherId: "2", teacherName: "Ms. Williams", subject: "Science" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET all students
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: students,
    total: students.length,
    message: "Students fetched successfully"
  });
});

// ADD new student
router.post("/", (req, res) => {
  try {
    const {
      name, email, rollNo, class: studentClass, phone,
      parentName, parentPhone, status = "active", assignedTeachers = []
    } = req.body;

    if (!name || !email || !rollNo || !studentClass) {
      return res.status(400).json({
        success: false,
        error: "Name, Email, Roll No & Class are required!"
      });
    }

    const exists = students.find(s => s.email === email || s.rollNo === rollNo);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Student with this email or roll number already exists!"
      });
    }

    const newStudent = {
      _id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      rollNo: rollNo.trim(),
      class: studentClass.trim(),
      grade: studentClass.trim(),
      phone: phone || "Not provided",
      parentName: parentName || "Not provided",
      parentPhone: parentPhone || "Not provided",
      status,
      assignedTeachers: assignedTeachers.map(t => ({
        teacherId: t.teacherId || t._id,
        teacherName: t.teacherName || t.name,
        subject: t.subject || "General"
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    students.push(newStudent);

    res.status(201).json({
      success: true,
      message: "Student added successfully!",
      data: newStudent
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE student
router.put("/:id", (req, res) => {
  const index = students.findIndex(s => s._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const { assignedTeachers = [], ...rest } = req.body;

  students[index] = {
    ...students[index],
    ...rest,
    rollNo: rest.rollNo || students[index].rollNo,
    class: rest.class || students[index].class,
    assignedTeachers: assignedTeachers.map(t => ({
      teacherId: t.teacherId || t._id,
      teacherName: t.teacherName || t.name,
      subject: t.subject || "General"
    })),
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: "Student updated successfully",
    data: students[index]
  });
});

// DELETE student
router.delete("/:id", (req, res) => {
  const index = students.findIndex(s => s._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }

  const deleted = students[index];
  students.splice(index, 1);

  res.json({
    success: true,
    message: "Student deleted successfully",
    data: deleted
  });
});

module.exports = router;