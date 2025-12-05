
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: () => Date.now().toString()
  },
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Class code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  teacher: {
    type: String,
    required: [true, 'Teacher is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  schedule: {
    type: String,
    default: ""
  },
  room: {
    type: String,
    default: ""
  },
  capacity: {
    type: Number,
    default: 30,
    min: 1,
    max: 100
  },
  students: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true // createdAt اور updatedAt automatically add ہو جائیں گے
});

module.exports = mongoose.model('Class', classSchema);