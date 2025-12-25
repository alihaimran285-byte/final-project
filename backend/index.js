

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import configurations and handlers
const { studentsData, teachersData, classesData, assignmentsData, eventsData, attendanceData, adminsData } = require('./data/initialData');
const { recalculateTeacherStudentCounts } = require('./utils/helpers');
const authHandlers = require('./handlers/authHandlers');
const candidateHandlers = require('./handlers/candidateHandlers');
const studentHandlers = require('./handlers/studentHandlers');
const teacherHandlers = require('./handlers/teacherHandlers');
const classHandlers = require('./handlers/classHandlers');
const assignmentHandlers = require('./handlers/assignmentHandlers');
const eventHandlers = require('./handlers/eventHandlers');
const attendanceHandlers = require('./handlers/attendanceHandlers');
const dashboardHandlers = require('./handlers/dashboardHandlers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connect
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/panda_school")
  .then(() => {})
  .catch((error) => {});


recalculateTeacherStudentCounts();

// ========== AUTH ROUTES ==========
app.post("/auth/register", authHandlers.adminRegister);
app.post("/auth/login", authHandlers.adminLogin);

// ========== CANDIDATE ROUTES ==========
app.post("/api/candidates/check-email", candidateHandlers.checkEmail);
app.post("/api/candidates/register", candidateHandlers.register);
app.post("/api/candidates/login", candidateHandlers.login);
app.get("/api/candidates/:id/dashboard", candidateHandlers.getDashboard);
app.get("/api/candidates/:id/assignments", candidateHandlers.getAssignments);
app.post("/api/candidates/:id/assignments/:assignmentId/submit", candidateHandlers.submitAssignment);
app.put("/api/candidates/:id/profile", candidateHandlers.updateProfile);

// ========== STUDENT MANAGEMENT ==========
app.get("/api/students", studentHandlers.getAllStudents);
app.get("/api/students/:id", studentHandlers.getStudentById);
app.post("/api/students", studentHandlers.addStudent);
app.put("/api/students/:id", studentHandlers.updateStudent);
app.delete("/api/students/:id", studentHandlers.deleteStudent);

// ========== TEACHER MANAGEMENT ==========
app.get("/api/teachers", teacherHandlers.getAllTeachers);
app.get("/api/teachers/:id", teacherHandlers.getTeacherById);
app.post("/api/teachers", teacherHandlers.addTeacher);
app.put("/api/teachers/:id", teacherHandlers.updateTeacher);
app.delete("/api/teachers/:id", teacherHandlers.deleteTeacher);

// ========== CLASS MANAGEMENT ==========
app.get("/api/classes", classHandlers.getAllClasses);
app.get("/api/classes/:id", classHandlers.getClassById);
app.post("/api/classes", classHandlers.addClass);
app.put("/api/classes/:id", classHandlers.updateClass);
app.delete("/api/classes/:id", classHandlers.deleteClass);

// ========== ASSIGNMENT MANAGEMENT ==========
app.get("/api/assignments", assignmentHandlers.getAllAssignments);
app.get("/api/assignments/details", assignmentHandlers.getAssignmentsWithDetails);
app.get("/api/assignments/:id", assignmentHandlers.getAssignmentById);
app.get("/api/assignments/:id/submissions", assignmentHandlers.getSubmissions);
app.post("/api/assignments", assignmentHandlers.addAssignment);
app.put("/api/assignments/:id", assignmentHandlers.updateAssignment);
app.delete("/api/assignments/:id", assignmentHandlers.deleteAssignment);
app.put("/api/assignments/:assignmentId/submissions/:studentId/grade", assignmentHandlers.gradeSubmission);
app.post("/api/assignments/:id/grade-bulk", assignmentHandlers.bulkGrade);
app.get("/api/assignments/:id/submissions/download", assignmentHandlers.downloadSubmissions);
app.post("/api/assignments/:assignmentId/submit", assignmentHandlers.submitAssignmentDirect);

// ========== EVENT MANAGEMENT ==========
app.get("/api/events", eventHandlers.getAllEvents);
app.get("/api/events/:id", eventHandlers.getEventById);
app.post("/api/events", eventHandlers.addEvent);
app.put("/api/events/:id", eventHandlers.updateEvent);
app.delete("/api/events/:id", eventHandlers.deleteEvent);

// ========== ATTENDANCE MANAGEMENT ==========
app.get("/api/attendance", attendanceHandlers.getAllAttendance);
app.get("/api/attendance/:date/:class", attendanceHandlers.getAttendanceByDateClass);
app.post("/api/attendance", attendanceHandlers.markAttendance);
app.put("/api/attendance/:id", attendanceHandlers.updateAttendance);
app.delete("/api/attendance/:id", attendanceHandlers.deleteAttendance);
// ========== ADMIN DASHBOARD ==========
app.get("/api/admin/dashboard", dashboardHandlers.getAdminDashboard);

// ========== HEALTH CHECK ==========
app.get("/", dashboardHandlers.getApiInfo);
app.get("/health", dashboardHandlers.getHealthCheck);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {});
