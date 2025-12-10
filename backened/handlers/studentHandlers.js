// ================================
// STUDENT HANDLERS
// ================================

const { studentsData } = require('../data/initialData');
const { recalculateTeacherStudentCounts } = require('../utils/helpers');

const getAllStudents = (req, res) => {
  res.json({
    success: true,
    count: studentsData.length,
    data: studentsData
  });
};

const getStudentById = (req, res) => {
  const student = studentsData.find(s => s._id === req.params.id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }
  
  res.json({
    success: true,
    data: student
  });
};

const addStudent = (req, res) => {
  const newStudent = {
    _id: Date.now().toString(),
    ...req.body,
    isRegistered: false,
    password: null,
    registrationDate: null,
    assignedTeachers: req.body.assignedTeachers || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  studentsData.push(newStudent);
  
  recalculateTeacherStudentCounts();
  
  res.status(201).json({
    success: true,
    message: 'Student added successfully',
    data: newStudent
  });
};

const updateStudent = (req, res) => {
  const studentIndex = studentsData.findIndex(s => s._id === req.params.id);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }
  
  studentsData[studentIndex] = {
    ...studentsData[studentIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  recalculateTeacherStudentCounts();
  
  res.json({
    success: true,
    message: 'Student updated successfully',
    data: studentsData[studentIndex]
  });
};

const deleteStudent = (req, res) => {
  const studentIndex = studentsData.findIndex(s => s._id === req.params.id);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }
  
  const deleted = studentsData.splice(studentIndex, 1);
  
  recalculateTeacherStudentCounts();
  
  res.json({
    success: true,
    message: 'Student deleted successfully',
    data: deleted[0]
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};