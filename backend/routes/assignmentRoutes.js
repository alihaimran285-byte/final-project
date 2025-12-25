// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();

// In-memory assignments data (if MongoDB not connected)
let assignments = [
  {
    _id: '1',
    title: 'Mathematics Homework - Chapter 1',
    description: 'Solve all problems from Chapter 1',
    subject: 'Mathematics',
    teacherId: '1',
    teacherName: 'Mr. Johnson',
    assignedTo: 'specific-class',
    class: '5A',
    studentIds: ['1', '2'],
    studentNames: ['Aarav Sharma', 'Diya Patel'],
    dueDate: '2024-03-20',
    totalMarks: 100,
    instructions: 'Submit handwritten solutions',
    status: 'active',
    submittedCount: 1,
    totalStudents: 2,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
  {
    _id: '2',
    title: 'Science Project - Solar System',
    description: 'Create a model of the solar system',
    subject: 'Science',
    teacherId: '2',
    teacherName: 'Ms. Williams',
    assignedTo: 'specific-student',
    studentId: '1',
    studentName: 'Aarav Sharma',
    class: '5A',
    dueDate: '2024-03-25',
    totalMarks: 50,
    instructions: 'Use recyclable materials',
    status: 'pending',
    submittedCount: 0,
    totalStudents: 1,
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12'
  }
];

// ✅ GET all assignments
router.get('/', (req, res) => {
  console.log('📚 GET /api/assignments - Fetching all assignments');
  
  const { teacherId, class: className, status, search } = req.query;
  
  let filteredAssignments = [...assignments];
  
  // Apply filters
  if (teacherId) {
    filteredAssignments = filteredAssignments.filter(a => a.teacherId === teacherId);
  }
  
  if (className) {
    filteredAssignments = filteredAssignments.filter(a => a.class === className);
  }
  
  if (status) {
    filteredAssignments = filteredAssignments.filter(a => a.status === status);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredAssignments = filteredAssignments.filter(a =>
      a.title.toLowerCase().includes(searchLower) ||
      a.subject.toLowerCase().includes(searchLower) ||
      a.teacherName.toLowerCase().includes(searchLower) ||
      a.description.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    data: filteredAssignments,
    total: filteredAssignments.length,
    message: "Assignments fetched successfully"
  });
});

// ✅ GET assignment by ID
router.get('/:id', (req, res) => {
  console.log('📚 GET /api/assignments/:id', req.params.id);
  
  const assignment = assignments.find(a => a._id === req.params.id);
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  res.json({
    success: true,
    data: assignment,
    message: "Assignment fetched successfully"
  });
});

// ✅ GET assignments for specific student
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  console.log('🎓 GET /api/assignments/student/:studentId', studentId);
  
  const studentAssignments = assignments.filter(assignment => {
    return assignment.assignedTo === 'all' ||
           (assignment.assignedTo === 'specific-class' && 
            assignment.class === '5A') || // Replace with actual student class
           (assignment.assignedTo === 'specific-student' && assignment.studentId === studentId);
  });
  
  res.json({
    success: true,
    data: studentAssignments,
    total: studentAssignments.length,
    message: "Student assignments fetched successfully"
  });
});

// ✅ CREATE new assignment
router.post('/', (req, res) => {
  console.log('📝 POST /api/assignments:', req.body);
  
  const { 
    title, description, subject, teacherId, teacherName,
    assignedTo, studentId, class: className, dueDate, 
    totalMarks, instructions 
  } = req.body;
  
  // Validation
  if (!title || !subject || !teacherId || !dueDate) {
    return res.status(400).json({
      success: false,
      error: "Title, subject, teacher and due date are required"
    });
  }
  
  // Create new assignment
  const newAssignment = {
    _id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
    title: title.trim(),
    description: description || '',
    subject: subject.trim(),
    teacherId,
    teacherName: teacherName || 'Unknown Teacher',
    assignedTo: assignedTo || 'all',
    studentId: assignedTo === 'specific-student' ? studentId : null,
    studentName: assignedTo === 'specific-student' ? req.body.studentName : null,
    class: className || null,
    studentIds: [],
    studentNames: [],
    dueDate,
    totalMarks: totalMarks || 100,
    instructions: instructions || '',
    status: 'active',
    submittedCount: 0,
    totalStudents: 0,
    submissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Calculate total students based on assignment type
  // This would need actual student data - for now using sample
  if (assignedTo === 'all') {
    newAssignment.totalStudents = 2; // Total students
    newAssignment.studentIds = ['1', '2'];
    newAssignment.studentNames = ['Aarav Sharma', 'Diya Patel'];
  } else if (assignedTo === 'specific-class' && className === '5A') {
    newAssignment.totalStudents = 2; // Students in class 5A
    newAssignment.studentIds = ['1', '2'];
    newAssignment.studentNames = ['Aarav Sharma', 'Diya Patel'];
  } else if (assignedTo === 'specific-student' && studentId) {
    newAssignment.totalStudents = 1;
    newAssignment.studentIds = [studentId];
    newAssignment.studentNames = [req.body.studentName || 'Student'];
  }
  
  assignments.push(newAssignment);
  
  console.log('✅ Assignment created:', newAssignment.title);
  
  res.status(201).json({
    success: true,
    message: "Assignment created successfully!",
    data: newAssignment
  });
});

// ✅ UPDATE assignment
router.put('/:id', (req, res) => {
  console.log('✏️ PUT /api/assignments/:id', req.params.id);
  console.log('Update data:', req.body);
  
  const index = assignments.findIndex(a => a._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  assignments[index] = {
    ...assignments[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: "Assignment updated successfully",
    data: assignments[index]
  });
});

// ✅ DELETE assignment
router.delete('/:id', (req, res) => {
  console.log('🗑️ DELETE /api/assignments/:id', req.params.id);
  
  const index = assignments.findIndex(a => a._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  const deletedAssignment = assignments[index];
  assignments.splice(index, 1);
  
  res.json({
    success: true,
    message: "Assignment deleted successfully",
    data: deletedAssignment
  });
});

// ✅ SUBMIT assignment (for students)
router.post('/:id/submit', (req, res) => {
  const { id } = req.params;
  const { studentId, studentName, marks, remarks } = req.body;
  
  console.log('📤 POST /api/assignments/:id/submit', { id, studentId });
  
  const assignmentIndex = assignments.findIndex(a => a._id === id);
  
  if (assignmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }
  
  const assignment = assignments[assignmentIndex];
  
  // Check if student is assigned this assignment
  if (!assignment.studentIds.includes(studentId) && 
      assignment.assignedTo !== 'all' && 
      (assignment.assignedTo !== 'specific-class' || assignment.class !== '5A')) {
    return res.status(403).json({
      success: false,
      error: "You are not assigned this assignment"
    });
  }
  
  // Check if already submitted
  const alreadySubmitted = assignment.submissions?.some(s => s.studentId === studentId);
  
  if (alreadySubmitted) {
    return res.status(400).json({
      success: false,
      error: "Assignment already submitted"
    });
  }
  
  // Add submission
  if (!assignment.submissions) {
    assignment.submissions = [];
  }
  
  assignment.submissions.push({
    studentId,
    studentName: studentName || 'Student',
    submittedAt: new Date().toISOString(),
    marks: marks || null,
    remarks: remarks || '',
    fileUrl: req.body.fileUrl || null
  });
  
  assignment.submittedCount += 1;
  
  // Update status if all students have submitted
  if (assignment.submittedCount >= assignment.totalStudents) {
    assignment.status = 'completed';
  }
  
  assignment.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: "Assignment submitted successfully",
    data: assignment
  });
});

// ✅ Health check
router.get('/health/status', (req, res) => {
  res.json({
    success: true,
    message: "Assignment API is working!",
    timestamp: new Date().toISOString(),
    totalAssignments: assignments.length
  });
});

module.exports = router;