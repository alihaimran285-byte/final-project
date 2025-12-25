
// 
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');


const { studentsData } = require('../data/initialData');

const getAllStudents = async (req, res) => {
  try {
    
    const mongoose = require('mongoose');
    
    if (mongoose.connection.readyState === 1) {
      
      const students = await Student.find()
        .populate('assignedTeachers.teacherId', 'name email subject')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: students.length,
        data: students,
        source: 'mongodb'
      });
    } else {
      
      return res.json({
        success: true,
        count: studentsData.length,
        data: studentsData,
        source: 'in-memory'
      });
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    
    return res.json({
      success: true,
      count: studentsData.length,
      data: studentsData,
      source: 'in-memory (fallback)'
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    if (mongoose.connection.readyState === 1) {
    
      const student = await Student.findById(req.params.id)
        .populate('assignedTeachers.teacherId', 'name email subject');
      
      if (!student) {
        return res.status(404).json({
          success: false,
          error: "Student not found"
        });
      }
      
      return res.json({
        success: true,
        data: student,
        source: 'mongodb'
      });
    } else {
      
      const student = studentsData.find(s => s._id === req.params.id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          error: "Student not found"
        });
      }
      
      return res.json({
        success: true,
        data: student,
        source: 'in-memory'
      });
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch student'
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    
    const {
      name,
      email,
      rollNo,
      class: className,
      phone,
      parentName,
      parentPhone,
      address,
      gender,
      enrollmentDate,
      status,
      isRegistered = false,
      password = null,
      assignedTeachers = []
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      
      const existingStudent = await Student.findOne({
        $or: [{ email }, { rollNo }]
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          error: 'Student with this email or roll number already exists'
        });
      }

    
      let hashedPassword = null;
      if (isRegistered && password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

 
      const newStudent = new Student({
        name,
        email,
        rollNo,
        class: className,
        phone: phone || '',
        parentName: parentName || '',
        parentPhone: parentPhone || '',
        address: address || '',
        gender: gender || 'Male',
        enrollmentDate: enrollmentDate || new Date(),
        status: status || 'active',
        isRegistered: isRegistered || false,
        password: hashedPassword,
        registrationDate: isRegistered ? new Date() : null,
        assignedTeachers: assignedTeachers || []
      });

      await newStudent.save();
      if (assignedTeachers && assignedTeachers.length > 0) {
        for (const teacher of assignedTeachers) {
          await Teacher.findByIdAndUpdate(teacher.teacherId, {
            $inc: { totalStudents: 1 }
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Student added successfully',
        data: newStudent,
        source: 'mongodb'
      });
    } else {
      
      const newStudent = {
        _id: Date.now().toString(),
        name: name || '',
        email: email || '',
        rollNo: rollNo || '',
        class: className || 'all',
        phone: phone || '',
        parentName: parentName || '',
        parentPhone: parentPhone || '',
        address: address || '',
        gender: gender || 'Male',
        enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
        status: status || 'active',
        isRegistered: isRegistered === true || isRegistered === 'true',
        password: password || null,
        registrationDate: isRegistered ? new Date().toISOString() : null,
        assignedTeachers: assignedTeachers || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      studentsData.push(newStudent);
      const { recalculateTeacherStudentCounts } = require('../utils/helpers');
      recalculateTeacherStudentCounts();

      return res.status(201).json({
        success: true,
        message: 'Student added successfully',
        data: newStudent,
        source: 'in-memory'
      });
    }
  } catch (error) {
    console.error('Error adding student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add student'
    });
  }
};



const updateStudent = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const studentId = req.params.id;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB میں اپ ڈیٹ کریں
      const student = await Student.findById(studentId);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          error: "Student not found"
        });
      }

      const updateData = { ...req.body };
      
      // پاسورڈ ہیش کریں اگر چاہیے
      if (updateData.password) {
        const bcrypt = require('bcryptjs');
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent,
        source: 'mongodb'
      });
    } else {
      // ان-میموری ڈیٹا میں اپ ڈیٹ کریں
      const studentIndex = studentsData.findIndex(s => s._id === studentId);
      
      if (studentIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Student not found"
        });
      }

      const {
        isRegistered,
        password,
        ...otherData
      } = req.body;

      const registrationStatus = isRegistered === true || isRegistered === 'true';

      let finalPassword = studentsData[studentIndex].password;
      if (password !== undefined && password !== null && password !== '') {
        finalPassword = password;
      }

      let finalRegistrationDate = studentsData[studentIndex].registrationDate;
      if (registrationStatus && !studentsData[studentIndex].registrationDate) {
        finalRegistrationDate = new Date().toISOString();
        if (!finalPassword) finalPassword = 'student123';
      } else if (!registrationStatus) {
        finalRegistrationDate = null;
        finalPassword = null;
      }

      studentsData[studentIndex] = {
        ...studentsData[studentIndex],
        ...otherData,
        isRegistered: isRegistered !== undefined ? registrationStatus : studentsData[studentIndex].isRegistered,
        password: finalPassword,
        registrationDate: finalRegistrationDate,
        updatedAt: new Date().toISOString()
      };

      const { recalculateTeacherStudentCounts } = require('../utils/helpers');
      recalculateTeacherStudentCounts();

      return res.json({
        success: true,
        message: 'Student updated successfully',
        data: studentsData[studentIndex],
        source: 'in-memory'
      });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update student'
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const studentId = req.params.id;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB سے ڈیلیٹ کریں
      const student = await Student.findById(studentId);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          error: "Student not found"
        });
      }

      // پہلے اسائنڈ ٹیچرز کے studentCount کم کریں
      if (student.assignedTeachers.length > 0) {
        for (const teacher of student.assignedTeachers) {
          await Teacher.findByIdAndUpdate(teacher.teacherId, {
            $inc: { totalStudents: -1 }
          });
        }
      }

      await Student.findByIdAndDelete(studentId);

      return res.json({
        success: true,
        message: 'Student deleted successfully',
        source: 'mongodb'
      });
    } else {
      // ان-میموری ڈیٹا سے ڈیلیٹ کریں
      const studentIndex = studentsData.findIndex(s => s._id === studentId);
      
      if (studentIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Student not found"
        });
      }
      
      const deleted = studentsData.splice(studentIndex, 1);
      
      const { recalculateTeacherStudentCounts } = require('../utils/helpers');
      recalculateTeacherStudentCounts();
      
      return res.json({
        success: true,
        message: 'Student deleted successfully',
        data: deleted[0],
        source: 'in-memory'
      });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete student'
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};