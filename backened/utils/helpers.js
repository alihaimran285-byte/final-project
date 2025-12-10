// ================================
// HELPER FUNCTIONS
// ================================

const { studentsData, teachersData } = require('../data/initialData');

function recalculateTeacherStudentCounts() {
  teachersData.forEach(teacher => {
    const studentCount = studentsData.filter(student => 
      student.assignedTeachers?.some(at => at.teacherId === teacher._id)
    ).length;
    teacher.totalStudents = studentCount;
  });
}

module.exports = {
  recalculateTeacherStudentCounts
};