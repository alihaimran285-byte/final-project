
const { studentsData, teachersData, assignmentsData } = require('./initialData');

class DatabaseHelper {
  constructor() {
    this.useMongoDB = true;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const mongoose = require('mongoose');
      this.useMongoDB = mongoose.connection.readyState === 1;
    } catch (error) {
      this.useMongoDB = false;
    }
  }

  
  async getStudents() {
    if (this.useMongoDB) {
      const Student = require('../models/Tstudent');
      return await Student.find().lean();
    } else {
      return studentsData;
    }
  }

  async addStudent(studentData) {
    if (this.useMongoDB) {
      const Student = require('../models/Tstudent');
      const student = new Student(studentData);
      return await student.save();
    } else {
      const newStudent = {
        _id: Date.now().toString(),
        ...studentData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      studentsData.push(newStudent);
      return newStudent;
    }
  }
  async getTeachers() {
    if (this.useMongoDB) {
      const Teacher = require('../models/Tteacher');
      return await Teacher.find().lean();
    } else {
      return teachersData;
    }
  }

  async addTeacher(teacherData) {
    if (this.useMongoDB) {
      const Teacher = require('../models/Tteacher');
      const teacher = new Teacher(teacherData);
      return await teacher.save();
    } else {
      const newTeacher = {
        _id: Date.now().toString(),
        ...teacherData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      teachersData.push(newTeacher);
      return newTeacher;
    }
  }
}

module.exports = new DatabaseHelper();