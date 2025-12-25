// models/assignmentModel.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  teacherId: {
    type: String,
    required: [true, 'Teacher ID is required']
  },
  teacherName: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    enum: ['all', 'specific-class', 'specific-student'],
    default: 'all'
  },
  studentId: String,
  studentName: String,
  class: String,
  studentIds: [String],
  studentNames: [String],
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  instructions: String,
  attachment: String,
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'overdue'],
    default: 'active'
  },
  submittedCount: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  submissions: [{
    studentId: String,
    studentName: String,
    submittedAt: Date,
    marks: Number,
    remarks: String,
    fileUrl: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update status based on due date before saving
assignmentSchema.pre('save', function(next) {
  if (this.dueDate < new Date() && this.status !== 'completed') {
    this.status = 'overdue';
  }
  this.updatedAt = new Date();
  next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;