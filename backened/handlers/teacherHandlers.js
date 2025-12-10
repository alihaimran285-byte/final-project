// ================================
// TEACHER HANDLERS
// ================================

const { teachersData, studentsData } = require('../data/initialData');
const { recalculateTeacherStudentCounts } = require('../utils/helpers');

const getAllTeachers = (req, res) => {
  recalculateTeacherStudentCounts();
  
  res.json({
    success: true,
    count: teachersData.length,
    data: teachersData
  });
};

const getTeacherById = (req, res) => {
  const teacher = teachersData.find(t => t._id === req.params.id);
  
  if (!teacher) {
    return res.status(404).json({
      success: false,
      error: "Teacher not found"
    });
  }
  
  const studentCount = studentsData.filter(student => 
    student.assignedTeachers?.some(at => at.teacherId === teacher._id)
  ).length;
  teacher.totalStudents = studentCount;
  
  res.json({
    success: true,
    data: teacher
  });
};

const addTeacher = (req, res) => {
  const newTeacher = {
    _id: Date.now().toString(),
    ...req.body,
    totalStudents: req.body.totalStudents || 0,
    status: req.body.status || 'active',
    joinDate: req.body.joinDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  teachersData.push(newTeacher);
  
  res.status(201).json({
    success: true,
    message: 'Teacher added successfully',
    data: newTeacher
  });
};

const updateTeacher = (req, res) => {
  const teacherIndex = teachersData.findIndex(t => t._id === req.params.id);
  
  if (teacherIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Teacher not found"
    });
  }
  
  const studentCount = studentsData.filter(student => 
    student.assignedTeachers?.some(at => at.teacherId === req.params.id)
  ).length;
  
  teachersData[teacherIndex] = {
    ...teachersData[teacherIndex],
    ...req.body,
    totalStudents: studentCount,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Teacher updated successfully',
    data: teachersData[teacherIndex]
  });
};

const deleteTeacher = (req, res) => {
  const teacherIndex = teachersData.findIndex(t => t._id === req.params.id);
  
  if (teacherIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Teacher not found"
    });
  }
  
  const deleted = teachersData.splice(teacherIndex, 1);
  
  res.json({
    success: true,
    message: 'Teacher deleted successfully',
    data: deleted[0]
  });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher
};