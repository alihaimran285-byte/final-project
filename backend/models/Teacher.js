const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"],
    match: [/^[0-9+\-\s]{10,}$/, "Please enter a valid phone number"]
  },
  subject: { 
    type: String, 
    required: [true, "Subject is required"],
    enum: [
      'Mathematics', 'Science', 'English', 'History', 
      'Urdu', 'Islamiat', 'Biology', 'Physics', 
      'Chemistry', 'Computer Science', 'General'
    ],
    default: 'General'
  },
  
  experience: { 
    type: Number, 
    default: 0,
    min: [0, "Experience cannot be negative"],
    max: [50, "Experience cannot exceed 50 years"]
  },
  
  classes: { 
    type: Number, 
    default: 1,
    min: [1, "At least 1 class is required"],
    max: [10, "Cannot exceed 10 classes"]
  },
  
  // ✅ UPDATED: Added totalStudents field
  totalStudents: { 
    type: Number, 
    default: 0,
    min: [0, "Students count cannot be negative"],
    max: [1000, "Students count cannot exceed 1000"]
  },
  
  // ✅ UPDATED: Added rating field
  rating: { 
    type: Number, 
    default: 0,
    min: [0, "Rating cannot be negative"],
    max: [5, "Rating cannot exceed 5"]
  },
  
  schedule: { type: String, default: "" },
  
  status: { 
    type: String, 
    enum: ["active", "inactive", "on leave"], 
    default: "active" 
  },
  
  // ✅ UPDATED: Added joinDate field
  joinDate: { 
    type: Date, 
    default: Date.now 
  }
  
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);