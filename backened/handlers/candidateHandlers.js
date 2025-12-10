// ================================
// CANDIDATE HANDLERS
// ================================

const { studentsData, assignmentsData, eventsData, teachersData } = require('../data/initialData');

const checkEmail = (req, res) => {
  const { email } = req.body;
  
  const student = studentsData.find(s => s.email === email);
  
  if (!student) {
    return res.json({
      success: false,
      message: 'Email not found in system. Please contact admin.'
    });
  }

  if (student.isRegistered && student.password) {
    return res.json({
      success: false,
      message: 'You are already registered. Please login.',
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
};

const register = (req, res) => {
  const { email, password, name, phone } = req.body;
  
  const studentIndex = studentsData.findIndex(s => s.email === email);
  
  if (studentIndex === -1) {
    return res.status(400).json({
      success: false,
      message: 'Student not found in system'
    });
  }

  if (studentsData[studentIndex].isRegistered) {
    return res.status(400).json({
      success: false,
      message: 'Already registered. Please login.'
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
};

const login = (req, res) => {
  const { email, password } = req.body;

  const student = studentsData.find(s => s.email === email);
  
  if (!student) {
    return res.status(401).json({
      success: false,
      message: 'Email not found in system. Please contact admin.'
    });
  }

  if (!student.isRegistered || !student.password) {
    return res.status(401).json({
      success: false,
      message: 'Please register first. Go to registration page.'
    });
  }

  if (student.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password'
    });
  }
  
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
};

const getDashboard = (req, res) => {
  const candidateId = req.params.id;
  
  const student = studentsData.find(s => s._id === candidateId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Candidate not found"
    });
  }

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

  const candidateEvents = eventsData
    .filter(event => {
      if (event.targetAudience && event.targetAudience.includes('all')) {
        return true;
      }
      if (event.class && (event.class === 'all' || event.class === student.class)) {
        return true;
      }
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
};

const getAssignments = (req, res) => {
  const studentId = req.params.id;
  
  const student = studentsData.find(s => s._id === studentId);
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }

  const candidateAssignments = assignmentsData
    .filter(assignment => {
      return assignment.class === student.class || assignment.assignedTo === 'all';
    })
    .map(assignment => {
      const submission = assignment.submissions.find(
        sub => sub.studentId === studentId
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
        submissionType: assignment.submissionType || 'online',
        attachments: assignment.attachments || [],
        submission: submission || null,
        status: status,
        isSubmitted: !!submission,
        isGraded: submission?.status === 'graded',
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        studentId: studentId,
        studentName: student.name
      };
    });
  
  res.json({
    success: true,
    data: candidateAssignments,
    stats: {
      total: candidateAssignments.length,
      submitted: candidateAssignments.filter(a => a.isSubmitted).length,
      graded: candidateAssignments.filter(a => a.isGraded).length,
      pending: candidateAssignments.filter(a => !a.isSubmitted).length
    }
  });
};

const submitAssignment = (req, res) => {
  const { id: studentId, assignmentId } = req.params;
  const { file, fileName, fileSize, remarks } = req.body;

  const student = studentsData.find(s => s._id === studentId);
  if (!student) {
    return res.status(404).json({ 
      success: false, 
      message: 'Student not found' 
    });
  }
  
  const assignmentIndex = assignmentsData.findIndex(a => a._id === assignmentId);
  if (assignmentIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Assignment not found' 
    });
  }

  const assignment = assignmentsData[assignmentIndex];
  if (assignment.class !== student.class && assignment.assignedTo !== 'all') {
    return res.status(403).json({
      success: false,
      message: 'This assignment is not for your class'
    });
  }

  const submissionData = {
    studentId: studentId,
    studentName: student.name,
    submittedAt: new Date().toISOString(),
    file: file || '',
    fileName: fileName || 'assignment_file.pdf',
    fileSize: fileSize || 'N/A',
    remarks: remarks || '',
    marks: null,
    feedback: '',
    status: 'submitted'
  };

  const existingSubmissionIndex = assignmentsData[assignmentIndex].submissions.findIndex(
    sub => sub.studentId === studentId
  );
  
  if (existingSubmissionIndex > -1) {
    assignmentsData[assignmentIndex].submissions[existingSubmissionIndex] = submissionData;
  } else {
    assignmentsData[assignmentIndex].submissions.push(submissionData);
  }

  assignmentsData[assignmentIndex].submittedCount = 
    assignmentsData[assignmentIndex].submissions.length;
  assignmentsData[assignmentIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Assignment submitted successfully!',
    submission: submissionData,
    assignment: {
      id: assignment._id,
      title: assignment.title,
      totalSubmissions: assignmentsData[assignmentIndex].submissions.length
    }
  });
};

const updateProfile = (req, res) => {
  const candidateId = req.params.id;
  const updates = req.body;
  
  const studentIndex = studentsData.findIndex(s => s._id === candidateId);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Candidate not found"
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
};

module.exports = {
  checkEmail,
  register,
  login,
  getDashboard,
  getAssignments,
  submitAssignment,
  updateProfile
};