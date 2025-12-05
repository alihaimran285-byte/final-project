// ================================
// COMPLETE SCHOOL MANAGEMENT SYSTEM BACKEND - FIXED VERSION
// ================================

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connect
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/panda_school")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => {
    console.log("❌ MongoDB connection error:", error.message);
  });

// ========== DATA INITIALIZATION ==========
let studentsData = [
  {
    _id: '1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@school.com',
    rollNo: '101',
    class: '5A',
    phone: '+91 98765 43210',
    parentName: 'Raj Sharma',
    parentPhone: '+91 98765 43219',
    address: '123 Main Street, Mumbai',
    gender: 'Male',
    enrollmentDate: '2024-01-15',
    status: 'active',
    assignedTeachers: [
      {
        teacherId: '1',
        teacherName: 'Mr. Johnson',
        subject: 'Mathematics'
      }
    ],
    isRegistered: false,
    password: null,
    registrationDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Diya Patel',
    email: 'diya.patel@school.com',
    rollNo: '102',
    class: '5A',
    phone: '+91 98765 43211',
    parentName: 'Priya Patel',
    parentPhone: '+91 98765 43218',
    address: '456 Oak Avenue, Delhi',
    gender: 'Female',
    enrollmentDate: '2024-01-10',
    status: 'active',
    assignedTeachers: [
      {
        teacherId: '1',
        teacherName: 'Mr. Johnson',
        subject: 'Mathematics'
      },
      {
        teacherId: '2',
        teacherName: 'Ms. Williams',
        subject: 'Science'
      }
    ],
    isRegistered: false,
    password: null,
    registrationDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@school.com',
    rollNo: '103',
    class: '6B',
    phone: '+91 98765 43212',
    parentName: 'Sanjay Mehta',
    parentPhone: '+91 98765 43217',
    address: '789 Pine Road, Bangalore',
    gender: 'Male',
    enrollmentDate: '2024-01-20',
    status: 'active',
    assignedTeachers: [
      {
        teacherId: '2',
        teacherName: 'Ms. Williams',
        subject: 'Science'
      }
    ],
    isRegistered: false,
    password: null,
    registrationDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let teachersData = [
  {
    _id: "1",
    name: "Mr. Johnson",
    email: "johnson@school.com",
    subject: "Mathematics",
    phone: "123-456-7890",
    experience: 5,
    classes: ["5A", "6B"],
    schedule: "Mon-Wed-Fri 9:00-11:00",
    totalStudents: 2,
    rating: 4.5,
    status: "active",
    joinDate: "2024-01-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "2",
    name: "Ms. Williams",
    email: "williams@school.com",
    subject: "Science",
    phone: "123-456-7891",
    experience: 8,
    classes: ["5A", "6B"],
    schedule: "Tue-Thu 10:00-12:00",
    totalStudents: 2,
    rating: 4.8,
    status: "active",
    joinDate: "2024-01-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let classesData = [
  {
    _id: "1",
    className: "5A",
    grade: "5",
    section: "A",
    classTeacherId: "1",
    classTeacherName: "Mr. Johnson",
    totalStudents: 2,
    capacity: 40,
    subjects: ["Mathematics", "Science", "English", "Social Studies"],
    schedule: {
      Monday: ["9:00-10:00 Math", "10:00-11:00 Science"],
      Tuesday: ["9:00-10:00 English", "10:00-11:00 Social Studies"],
      Wednesday: ["9:00-10:00 Math", "10:00-11:00 Science"],
      Thursday: ["9:00-10:00 English", "10:00-11:00 Social Studies"],
      Friday: ["9:00-10:00 Math", "10:00-11:00 Science"]
    },
    roomNo: "Room 101",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "2",
    className: "6B",
    grade: "6",
    section: "B",
    classTeacherId: "2",
    classTeacherName: "Ms. Williams",
    totalStudents: 1,
    capacity: 40,
    subjects: ["Mathematics", "Science", "English", "Social Studies"],
    schedule: {
      Monday: ["10:00-11:00 Science", "11:00-12:00 Math"],
      Tuesday: ["10:00-11:00 Social Studies", "11:00-12:00 English"],
      Wednesday: ["10:00-11:00 Science", "11:00-12:00 Math"],
      Thursday: ["10:00-11:00 Social Studies", "11:00-12:00 English"],
      Friday: ["10:00-11:00 Science", "11:00-12:00 Math"]
    },
    roomNo: "Room 102",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let assignmentsData = [
  {
    _id: '1',
    title: 'Algebra Basics Assignment',
    description: 'Complete exercises 1-10 from chapter 3',
    subject: 'Mathematics',
    teacherId: '1',
    teacherName: 'Mr. Johnson',
    class: '5A',
    dueDate: '2024-12-30',
    totalMarks: 100,
    submissionType: 'online',
    attachments: ['worksheet.pdf'],
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-11-20T10:00:00Z',
    submissions: [
      {
        studentId: '1',
        studentName: 'Aarav Sharma',
        submittedAt: '2024-11-21T14:30:00Z',
        file: 'aarav_algebra.pdf',
        marks: 85,
        feedback: 'Good work, but show more steps',
        status: 'graded'
      }
    ]
  },
  {
    _id: '2',
    title: 'Science Project - Solar System',
    description: 'Create a model of the solar system',
    subject: 'Science',
    teacherId: '2',
    teacherName: 'Ms. Williams',
    class: '5A',
    dueDate: '2024-12-25',
    totalMarks: 100,
    submissionType: 'offline',
    attachments: [],
    createdAt: '2024-11-18T09:00:00Z',
    updatedAt: '2024-11-18T09:00:00Z',
    submissions: []
  }
];

let eventsData = [
  {
    _id: '1',
    title: 'Annual Sports Day',
    description: 'Annual sports competition for all classes',
    date: '2024-12-20',
    time: '9:00 AM',
    venue: 'School Ground',
    organizer: 'Sports Department',
    targetAudience: ['all'],
    class: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Science Exhibition',
    description: 'Students science projects exhibition',
    date: '2024-12-15',
    time: '10:00 AM',
    venue: 'Science Lab',
    organizer: 'Science Department',
    targetAudience: ['5A'],
    class: '5A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let attendanceData = [
  {
    _id: '1',
    date: '2024-11-01',
    class: '5A',
    subject: 'Mathematics',
    teacherId: '1',
    teacherName: 'Mr. Johnson',
    records: [
      {
        studentId: '1',
        studentName: 'Aarav Sharma',
        status: 'present',
        checkInTime: '9:00 AM',
        checkOutTime: '11:00 AM'
      },
      {
        studentId: '2',
        studentName: 'Diya Patel',
        status: 'present',
        checkInTime: '9:05 AM',
        checkOutTime: '11:00 AM'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ✅ FIX: Persistent admin storage with default admins
let adminsData = [
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@school.com',
    password: 'password123',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'admin2',
    name: 'Super Admin',
    email: 'superadmin@school.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ✅ FIX: Calculate teacher student counts on startup
function recalculateTeacherStudentCounts() {
  teachersData.forEach(teacher => {
    const studentCount = studentsData.filter(student => 
      student.assignedTeachers?.some(at => at.teacherId === teacher._id)
    ).length;
    teacher.totalStudents = studentCount;
  });
  console.log('✅ Teacher student counts recalculated');
}

// Recalculate on server start
recalculateTeacherStudentCounts();

// ========== AUTH ROUTES ==========

// ✅ Admin Registration
app.post("/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  
  console.log('👑 Admin registration attempt:', email);
  
  if (!name || !email || !password || role !== 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Sab fields zaroori hain aur role "admin" hona chahiye'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password kam se kam 6 characters ka hona chahiye'
    });
  }

  const existingAdmin = adminsData.find(a => a.email === email);
  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: 'Is email se admin pehle se registered hai'
    });
  }
  
  const adminData = {
    _id: Date.now().toString(),
    name,
    email,
    password,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  adminsData.push(adminData);
  console.log('✅ Admin registered:', name);
  
  res.json({
    success: true,
    message: 'Admin registration successful!',
    admin: {
      id: adminData._id,
      name: adminData.name,
      email: adminData.email,
      role: adminData.role
    }
  });
});

// ✅ FIX: Admin Login - Check persistent admins first
app.post("/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  
  console.log('🔐 Admin login attempt:', email);

  // Find admin in persistent storage
  let admin = adminsData.find(a => a.email === email);

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Admin nahi mila. Registered admins: admin@school.com or superadmin@school.com'
    });
  }

  if (admin.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Password galat hai'
    });
  }

  if (role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Admin role select karein'
    });
  }

  console.log('✅ Admin login successful:', admin.name);

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: admin._id,
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    },
    token: 'admin-token-' + Date.now()
  });
});

// ========== CANDIDATE ROUTES ==========

// 1. Check Email
app.post("/api/candidates/check-email", (req, res) => {
  const { email } = req.body;
  
  console.log('📧 Checking candidate email:', email);
  
  const student = studentsData.find(s => s.email === email);
  
  if (!student) {
    return res.json({
      success: false,
      message: 'Email system mein nahi mila. Admin se contact karein.'
    });
  }

  if (student.isRegistered && student.password) {
    return res.json({
      success: false,
      message: 'Aap pehle se registered hain. Please login karein.',
      isRegistered: true
    });
  }

  res.json({
    success: true,
    message: 'Email verified!',
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
      class: student.class,
      rollNo: student.rollNo
    }
  });
});

// 2. Candidate Registration
app.post("/api/candidates/register", (req, res) => {
  const { email, password, name, phone } = req.body;

  console.log('👨‍🎓 Candidate registration:', email);
  
  const studentIndex = studentsData.findIndex(s => s.email === email);
  
  if (studentIndex === -1) {
    return res.status(400).json({
      success: false,
      message: 'Student system mein nahi mila'
    });
  }

  if (studentsData[studentIndex].isRegistered) {
    return res.status(400).json({
      success: false,
      message: 'Pehle se registered hain. Login karein.'
    });
  }

  studentsData[studentIndex] = {
    ...studentsData[studentIndex],
    password: password,
    phone: phone || studentsData[studentIndex].phone,
    name: name || studentsData[studentIndex].name,
    isRegistered: true,
    registrationDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  console.log('✅ Candidate registered:', studentsData[studentIndex].name);
  
  res.json({
    success: true,
    message: 'Registration successful!',
    candidate: {
      id: studentsData[studentIndex]._id,
      name: studentsData[studentIndex].name,
      email: studentsData[studentIndex].email,
      role: 'candidate'
    }
  });
});

// 3. Candidate Login
app.post("/api/candidates/login", (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Candidate login:', email);

  const student = studentsData.find(s => s.email === email);
  
  if (!student) {
    return res.status(401).json({
      success: false,
      message: 'Email system mein nahi mila. Admin se contact karein.'
    });
  }

  if (!student.isRegistered || !student.password) {
    return res.status(401).json({
      success: false,
      message: 'Pehle register karein. Registration page pe jayen.'
    });
  }

  if (student.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Password galat hai'
    });
  }

  console.log('✅ Candidate login successful:', student.name);
  
  res.json({
    success: true,
    message: 'Login successful!',
    token: 'candidate-token-' + Date.now(),
    user: {
      id: student._id,
      _id: student._id,
      name: student.name,
      email: student.email,
      role: 'candidate',
      class: student.class,
      rollNo: student.rollNo,
      phone: student.phone
    }
  });
});

// ========== CANDIDATE DASHBOARD ==========
// ========== CANDIDATE DASHBOARD ==========
app.get("/api/candidates/:id/dashboard", (req, res) => {
  const candidateId = req.params.id;
  
  const student = studentsData.find(s => s._id === candidateId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
    });
  }

  // Get assignments for student's class
  const candidateAssignments = assignmentsData
    .filter(a => a.class === student.class)
    .map(assignment => {
      const submission = assignment.submissions.find(
        sub => sub.studentId === candidateId
      );
      
      const dueDate = new Date(assignment.dueDate);
      const today = new Date();
      let status = 'pending';
      let daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      if (submission) {
        status = submission.status;
      } else if (dueDate < today) {
        status = 'overdue';
        daysRemaining = 0;
      }
      
      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        teacherName: assignment.teacherName,
        class: assignment.class,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        submissionType: assignment.submissionType,
        attachments: assignment.attachments || [],
        submission: submission || null,
        status: status,
        isSubmitted: !!submission,
        isGraded: submission?.status === 'graded',
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0
      };
    });
// ✅ FIX: Get events for student's class - UPDATED LOGIC
const candidateEvents = eventsData
  .filter(event => {
    // Check if event is for "all" classes
    if (event.targetAudience && event.targetAudience.includes('all')) {
      return true;
    }
    // Check if event is for student's specific class
    if (event.class && (event.class === 'all' || event.class === student.class)) {
      return true;
    }
    // Check if event has targetAudience array containing student's class
    if (event.targetAudience && Array.isArray(event.targetAudience) && 
        event.targetAudience.includes(student.class)) {
      return true;
    }
    return false;
  })
  .map(event => ({
    ...event,
    isUpcoming: new Date(event.date) > new Date()
  }))
  .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get teachers
  const teachers = student.assignedTeachers || [];
  const detailedTeachers = teachers.map(at => {
    const teacher = teachersData.find(t => t._id === at.teacherId);
    return {
      teacherId: at.teacherId,
      teacherName: at.teacherName,
      subject: at.subject,
      phone: teacher?.phone || 'N/A',
      email: teacher?.email || 'N/A',
      schedule: teacher?.schedule || 'Not scheduled'
    };
  });

  // Calculate stats
  const totalAssignments = candidateAssignments.length;
  const submittedAssignments = candidateAssignments.filter(a => a.isSubmitted).length;
  const gradedAssignments = candidateAssignments.filter(a => a.isGraded).length;
  const upcomingEvents = candidateEvents.filter(e => e.isUpcoming).length;

  res.json({
    success: true,
    data: {
      profile: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNo: student.rollNo,
        class: student.class,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        address: student.address,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
        isRegistered: student.isRegistered
      },
      assignments: candidateAssignments,
      events: candidateEvents,
      teachers: detailedTeachers,
      stats: {
        totalAssignments,
        submittedAssignments,
        pendingAssignments: totalAssignments - submittedAssignments,
        gradedAssignments,
        upcomingEvents,
        completionRate: totalAssignments > 0 ? 
          Math.round((submittedAssignments / totalAssignments) * 100) : 0,
        averageScore: gradedAssignments > 0 ? 
          Math.round(candidateAssignments
            .filter(a => a.isGraded && a.submission?.marks)
            .reduce((sum, a) => sum + a.submission.marks, 0) / gradedAssignments) : 0
      }
    }
  });
});

// Submit assignment
app.post("/api/candidates/:id/assignments/:assignmentId/submit", (req, res) => {
  const { id, assignmentId } = req.params;
  const { file, notes } = req.body;
  
  const student = studentsData.find(s => s._id === id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  
  const assignmentIndex = assignmentsData.findIndex(a => a._id === assignmentId);
  if (assignmentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Assignment not found' });
  }
  
  const submissionData = {
    studentId: id,
    studentName: student.name,
    submittedAt: new Date().toISOString(),
    file: file || 'uploaded_file.pdf',
    notes: notes || '',
    status: 'submitted'
  };
  
  const existingIndex = assignmentsData[assignmentIndex].submissions.findIndex(
    sub => sub.studentId === id
  );
  
  if (existingIndex > -1) {
    assignmentsData[assignmentIndex].submissions[existingIndex] = submissionData;
  } else {
    assignmentsData[assignmentIndex].submissions.push(submissionData);
  }
  
  assignmentsData[assignmentIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Assignment submitted successfully!',
    submission: submissionData
  });
});

// Profile update
app.put("/api/candidates/:id/profile", (req, res) => {
  const candidateId = req.params.id;
  const updates = req.body;
  
  const studentIndex = studentsData.findIndex(s => s._id === candidateId);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
    });
  }
  
  studentsData[studentIndex] = {
    ...studentsData[studentIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Profile updated',
    data: studentsData[studentIndex]
  });
});

// ========== ADMIN ROUTES ==========

// ========== STUDENT MANAGEMENT ==========
// Get all students
app.get("/api/students", (req, res) => {
  res.json({
    success: true,
    count: studentsData.length,
    data: studentsData
  });
});

// Get single student
app.get("/api/students/:id", (req, res) => {
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
});

// Add student
app.post("/api/students", (req, res) => {
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
  
  // Recalculate teacher student counts
  recalculateTeacherStudentCounts();
  
  res.status(201).json({
    success: true,
    message: 'Student added successfully',
    data: newStudent
  });
});

// Update student
app.put("/api/students/:id", (req, res) => {
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
  
  // Recalculate teacher student counts
  recalculateTeacherStudentCounts();
  
  res.json({
    success: true,
    message: 'Student updated successfully',
    data: studentsData[studentIndex]
  });
});

// Delete student
app.delete("/api/students/:id", (req, res) => {
  const studentIndex = studentsData.findIndex(s => s._id === req.params.id);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }
  
  const deleted = studentsData.splice(studentIndex, 1);
  
  // Recalculate teacher student counts
  recalculateTeacherStudentCounts();
  
  res.json({
    success: true,
    message: 'Student deleted successfully',
    data: deleted[0]
  });
});

// ========== TEACHER MANAGEMENT ==========
// Get all teachers
app.get("/api/teachers", (req, res) => {
  // ✅ FIX: Recalculate student counts before sending
  recalculateTeacherStudentCounts();
  
  res.json({
    success: true,
    count: teachersData.length,
    data: teachersData
  });
});

// Get single teacher
app.get("/api/teachers/:id", (req, res) => {
  const teacher = teachersData.find(t => t._id === req.params.id);
  
  if (!teacher) {
    return res.status(404).json({
      success: false,
      error: "Teacher not found"
    });
  }
  
  // ✅ FIX: Calculate current student count
  const studentCount = studentsData.filter(student => 
    student.assignedTeachers?.some(at => at.teacherId === teacher._id)
  ).length;
  teacher.totalStudents = studentCount;
  
  res.json({
    success: true,
    data: teacher
  });
});

// Add teacher
app.post("/api/teachers", (req, res) => {
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
  
  console.log('✅ Teacher added:', newTeacher.name);
  
  res.status(201).json({
    success: true,
    message: 'Teacher added successfully',
    data: newTeacher
  });
});

// Update teacher
app.put("/api/teachers/:id", (req, res) => {
  const teacherIndex = teachersData.findIndex(t => t._id === req.params.id);
  
  if (teacherIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Teacher not found"
    });
  }
  
  // ✅ FIX: Calculate current student count
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
});

// Delete teacher
app.delete("/api/teachers/:id", (req, res) => {
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
});

// ========== CLASS MANAGEMENT ==========
// Get all classes
app.get("/api/classes", (req, res) => {
  res.json({
    success: true,
    count: classesData.length,
    data: classesData
  });
});

// Get single class
app.get("/api/classes/:id", (req, res) => {
  const classItem = classesData.find(c => c._id === req.params.id);
  
  if (!classItem) {
    return res.status(404).json({
      success: false,
      error: "Class not found"
    });
  }
  
  // Get students in this class
  const classStudents = studentsData.filter(s => s.class === classItem.className);
  
  res.json({
    success: true,
    data: {
      ...classItem,
      students: classStudents
    }
  });
});

// Add class
app.post("/api/classes", (req, res) => {
  const newClass = {
    _id: Date.now().toString(),
    ...req.body,
    totalStudents: 0,
    status: req.body.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  classesData.push(newClass);
  
  res.status(201).json({
    success: true,
    message: 'Class added successfully',
    data: newClass
  });
});

// Update class
app.put("/api/classes/:id", (req, res) => {
  const classIndex = classesData.findIndex(c => c._id === req.params.id);
  
  if (classIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Class not found"
    });
  }
  
  classesData[classIndex] = {
    ...classesData[classIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Class updated successfully',
    data: classesData[classIndex]
  });
});

// Delete class
app.delete("/api/classes/:id", (req, res) => {
  const classIndex = classesData.findIndex(c => c._id === req.params.id);
  
  if (classIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Class not found"
    });
  }
  
  const deleted = classesData.splice(classIndex, 1);
  
  res.json({
    success: true,
    message: 'Class deleted successfully',
    data: deleted[0]
  });
});

// ========== ASSIGNMENT MANAGEMENT ==========
// Get all assignments
app.get("/api/assignments", (req, res) => {
  res.json({
    success: true,
    count: assignmentsData.length,
    data: assignmentsData
  });
});

// Get single assignment
app.get("/api/assignments/:id", (req, res) => {
  const assignment = assignmentsData.find(a => a._id === req.params.id);
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  res.json({
    success: true,
    data: assignment
  });
});

// Add assignment
app.post("/api/assignments", (req, res) => {
  const newAssignment = {
    _id: Date.now().toString(),
    ...req.body,
    submissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  assignmentsData.push(newAssignment);
  
  res.status(201).json({
    success: true,
    message: 'Assignment added successfully',
    data: newAssignment
  });
});

// Update assignment
app.put("/api/assignments/:id", (req, res) => {
  const assignmentIndex = assignmentsData.findIndex(a => a._id === req.params.id);
  
  if (assignmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  assignmentsData[assignmentIndex] = {
    ...assignmentsData[assignmentIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Assignment updated successfully',
    data: assignmentsData[assignmentIndex]
  });
});

// Delete assignment
app.delete("/api/assignments/:id", (req, res) => {
  const assignmentIndex = assignmentsData.findIndex(a => a._id === req.params.id);
  
  if (assignmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  const deleted = assignmentsData.splice(assignmentIndex, 1);
  
  res.json({
    success: true,
    message: 'Assignment deleted successfully',
    data: deleted[0]
  });
});

// Grade assignment submission
app.put("/api/assignments/:assignmentId/submissions/:studentId/grade", (req, res) => {
  const { assignmentId, studentId } = req.params;
  const { marks, feedback } = req.body;
  
  const assignmentIndex = assignmentsData.findIndex(a => a._id === assignmentId);
  
  if (assignmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  const submissionIndex = assignmentsData[assignmentIndex].submissions.findIndex(
    sub => sub.studentId === studentId
  );
  
  if (submissionIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Submission not found"
    });
  }
  
  assignmentsData[assignmentIndex].submissions[submissionIndex] = {
    ...assignmentsData[assignmentIndex].submissions[submissionIndex],
    marks: marks,
    feedback: feedback || '',
    status: 'graded'
  };
  
  assignmentsData[assignmentIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Assignment graded successfully',
    data: assignmentsData[assignmentIndex].submissions[submissionIndex]
  });
});

// ========== EVENT MANAGEMENT ==========
// Get all events
app.get("/api/events", (req, res) => {
  res.json({
    success: true,
    count: eventsData.length,
    data: eventsData
  });
});

// Get single event
app.get("/api/events/:id", (req, res) => {
  const event = eventsData.find(e => e._id === req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  res.json({
    success: true,
    data: event
  });
});

// Add event
// Add event - UPDATED VERSION
app.post("/api/events", (req, res) => {
  const { title, description, date, time, venue, organizer, targetAudience, className } = req.body;
  
  // ✅ FIX: Ensure targetAudience is properly set
  const eventTargetAudience = targetAudience || 
                              (className === 'all' ? ['all'] : [className]);
  
  const newEvent = {
    _id: Date.now().toString(),
    title,
    description,
    date,
    time,
    venue,
    organizer,
    class: className || 'all',
    targetAudience: eventTargetAudience,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  eventsData.push(newEvent);
  
  res.status(201).json({
    success: true,
    message: 'Event added successfully',
    data: newEvent
  });
});

// Update event - UPDATED VERSION
app.put("/api/events/:id", (req, res) => {
  const eventIndex = eventsData.findIndex(e => e._id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  const { className, targetAudience } = req.body;
  
  // ✅ FIX: Ensure targetAudience is properly updated
  if (className) {
    req.body.class = className;
    if (!targetAudience) {
      req.body.targetAudience = className === 'all' ? ['all'] : [className];
    }
  }
  
  eventsData[eventIndex] = {
    ...eventsData[eventIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Event updated successfully',
    data: eventsData[eventIndex]
  });
});

// Update event
app.put("/api/events/:id", (req, res) => {
  const eventIndex = eventsData.findIndex(e => e._id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  eventsData[eventIndex] = {
    ...eventsData[eventIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Event updated successfully',
    data: eventsData[eventIndex]
  });
});

// Delete event
app.delete("/api/events/:id", (req, res) => {
  const eventIndex = eventsData.findIndex(e => e._id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  const deleted = eventsData.splice(eventIndex, 1);
  
  res.json({
    success: true,
    message: 'Event deleted successfully',
    data: deleted[0]
  });
});

// ========== ATTENDANCE MANAGEMENT ==========
// Get all attendance records
app.get("/api/attendance", (req, res) => {
  res.json({
    success: true,
    count: attendanceData.length,
    data: attendanceData
  });
});

// Get attendance by date and class
app.get("/api/attendance/:date/:class", (req, res) => {
  const { date, class: className } = req.params;
  
  const attendanceRecord = attendanceData.find(
    a => a.date === date && a.class === className
  );
  
  if (!attendanceRecord) {
    return res.status(404).json({
      success: false,
      error: "Attendance record not found"
    });
  }
  
  res.json({
    success: true,
    data: attendanceRecord
  });
});

// Mark attendance
app.post("/api/attendance", (req, res) => {
  const { date, class: className, subject, teacherId, teacherName, records } = req.body;
  
  // Check if attendance already exists for this date and class
  const existingIndex = attendanceData.findIndex(
    a => a.date === date && a.class === className && a.subject === subject
  );
  
  const attendanceRecord = {
    _id: Date.now().toString(),
    date,
    class: className,
    subject,
    teacherId,
    teacherName,
    records,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (existingIndex > -1) {
    // Update existing record
    attendanceData[existingIndex] = attendanceRecord;
  } else {
    // Add new record
    attendanceData.push(attendanceRecord);
  }
  
  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: attendanceRecord
  });
});

// Update attendance
app.put("/api/attendance/:id", (req, res) => {
  const attendanceIndex = attendanceData.findIndex(a => a._id === req.params.id);
  
  if (attendanceIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Attendance record not found"
    });
  }
  
  attendanceData[attendanceIndex] = {
    ...attendanceData[attendanceIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Attendance updated successfully',
    data: attendanceData[attendanceIndex]
  });
});

// Delete attendance
app.delete("/api/attendance/:id", (req, res) => {
  const attendanceIndex = attendanceData.findIndex(a => a._id === req.params.id);
  
  if (attendanceIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Attendance record not found"
    });
  }
  
  const deleted = attendanceData.splice(attendanceIndex, 1);
  
  res.json({
    success: true,
    message: 'Attendance record deleted successfully',
    data: deleted[0]
  });
});

// ========== ADMIN DASHBOARD ==========
app.get("/api/admin/dashboard", (req, res) => {
  // Calculate attendance stats
  const totalAttendanceRecords = attendanceData.length;
  let totalPresent = 0;
  let totalAbsent = 0;
  
  attendanceData.forEach(record => {
    record.records.forEach(studentRecord => {
      if (studentRecord.status === 'present') {
        totalPresent++;
      } else if (studentRecord.status === 'absent') {
        totalAbsent++;
      }
    });
  });
  
  const attendanceRate = totalAttendanceRecords > 0 ? 
    Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0;
  
  // Calculate assignment submission rate
  const totalSubmissions = assignmentsData.reduce((sum, assignment) => {
    return sum + assignment.submissions.length;
  }, 0);
  
  const totalPossibleSubmissions = assignmentsData.length * studentsData.length;
  const submissionRate = totalPossibleSubmissions > 0 ? 
    Math.round((totalSubmissions / totalPossibleSubmissions) * 100) : 0;
  
  res.json({
    success: true,
    data: {
      stats: {
        totalStudents: studentsData.length,
        totalTeachers: teachersData.length,
        totalClasses: classesData.length,
        totalAssignments: assignmentsData.length,
        totalEvents: eventsData.length,
        registeredCandidates: studentsData.filter(s => s.isRegistered).length,
        activeStudents: studentsData.filter(s => s.status === 'active').length,
        activeTeachers: teachersData.filter(t => t.status === 'active').length,
        attendanceRecords: totalAttendanceRecords,
        attendanceRate: attendanceRate,
        submissionRate: submissionRate
      },
      recentActivities: [
        {
          type: 'student_registered',
          message: `${studentsData.filter(s => s.isRegistered).length} students registered online`,
          time: 'Just now'
        },
        {
          type: 'assignment_submitted',
          message: `${totalSubmissions} assignments submitted`,
          time: 'Today'
        },
        {
          type: 'attendance_marked',
          message: `${totalAttendanceRecords} attendance records`,
          time: 'This week'
        }
      ]
    }
  });
});

// ========== HEALTH CHECK ==========
app.get("/", (req, res) => {
  res.json({
    message: "🎓 Panda School Management System API",
    version: "7.0 - Complete FIXED System",
    status: "running",
    endpoints: {
      auth: ["POST /auth/register", "POST /auth/login"],
      candidates: [
        "POST /api/candidates/check-email",
        "POST /api/candidates/register", 
        "POST /api/candidates/login",
        "GET /api/candidates/:id/dashboard"
      ],
      admin: {
        students: ["GET /api/students", "POST /api/students", "PUT /api/students/:id", "DELETE /api/students/:id"],
        teachers: ["GET /api/teachers", "POST /api/teachers", "PUT /api/teachers/:id", "DELETE /api/teachers/:id"],
        classes: ["GET /api/classes", "POST /api/classes", "PUT /api/classes/:id", "DELETE /api/classes/:id"],
        assignments: ["GET /api/assignments", "POST /api/assignments", "PUT /api/assignments/:id", "DELETE /api/assignments/:id"],
        events: ["GET /api/events", "POST /api/events", "PUT /api/events/:id", "DELETE /api/events/:id"],
        attendance: ["GET /api/attendance", "POST /api/attendance", "PUT /api/attendance/:id", "DELETE /api/attendance/:id"],
        dashboard: ["GET /api/admin/dashboard"]
      }
    },
    data: {
      totalStudents: studentsData.length,
      registeredStudents: studentsData.filter(s => s.isRegistered).length,
      totalAdmins: adminsData.length,
      totalTeachers: teachersData.length,
      totalClasses: classesData.length,
      totalAssignments: assignmentsData.length,
      totalEvents: eventsData.length,
      totalAttendanceRecords: attendanceData.length
    }
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 ==========================================`);
  console.log(`   Panda School Management System v7.0`);
  console.log(`   Complete FIXED System`);
  console.log(`   Server: http://localhost:${PORT}/`);
  console.log(`==========================================`);
  console.log(`\n✅ FIXES APPLIED:`);
  console.log(`   1. ✅ Admin login persistent (no data loss)`);
  console.log(`   2. ✅ Teacher student count auto-calculated`);
  console.log(`   3. ✅ All data persists during session`);
  console.log(`   4. ✅ Schedule text properly wrapped`);
  console.log(`   5. ✅ Contact boxes responsive sizing`);
  console.log(`\n📋 Test Credentials:`);
  console.log(`   👑 Admin: admin@school.com / password123`);
  console.log(`   👑 Admin: superadmin@school.com / password123`);
  console.log(`   👨‍🎓 Candidate Emails (Register first):`);
  console.log(`       • aarav.sharma@school.com`);
  console.log(`       • diya.patel@school.com`);
  console.log(`       • rohan.mehta@school.com`);
  console.log(`\n📊 Current Data:`);
  console.log(`   • Students: ${studentsData.length}`);
  console.log(`   • Registered: ${studentsData.filter(s => s.isRegistered).length}`);
  console.log(`   • Teachers: ${teachersData.length}`);
  console.log(`   • Classes: ${classesData.length}`);
  console.log(`   • Assignments: ${assignmentsData.length}`);
  console.log(`   • Events: ${eventsData.length}`);
  console.log(`   • Attendance Records: ${attendanceData.length}`);
  console.log(`   • Admins: ${adminsData.length}`);
  console.log(`==========================================\n`);
});