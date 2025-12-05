const express = require('express');
const router = express.Router();

// ✅ CANDIDATE AUTHENTICATION
router.post('/check-email', (req, res) => {
  const { email } = req.body;
  const studentsData = req.app.locals.studentsData || [];
  
  const existingStudent = studentsData.find(s => s.email === email);
  
  if (!existingStudent) {
    return res.json({
      success: false,
      message: 'Email system mein nahi mila. Admin se contact karein.'
    });
  }

  if (existingStudent.password) {
    return res.json({
      success: false,
      message: 'Already registered hain. Please login.',
      isRegistered: true
    });
  }

  res.json({
    success: true,
    message: 'Email verified! Aap register kar sakte hain.',
    student: {
      id: existingStudent._id,
      name: existingStudent.name,
      email: existingStudent.email,
      course: existingStudent.class || 'General',
      class: existingStudent.class || 'Not Assigned',
      rollNo: existingStudent.rollNo || 'N/A'
    }
  });
});

router.post('/register', (req, res) => {
  const { email, password, name, phone } = req.body;

  const studentsData = req.app.locals.studentsData || [];
  const studentIndex = studentsData.findIndex(s => s.email === email);
  
  if (studentIndex === -1) {
    return res.status(400).json({
      success: false,
      message: 'Student system mein nahi mila'
    });
  }

  if (studentsData[studentIndex].password) {
    return res.status(400).json({
      success: false,
      message: 'Already registered hain. Please login.'
    });
  }

  studentsData[studentIndex] = {
    ...studentsData[studentIndex],
    password: password,
    phone: phone || studentsData[studentIndex].phone,
    name: name || studentsData[studentIndex].name,
    isRegistered: true,
    registrationDate: new Date().toISOString()
  };

  req.app.locals.studentsData = studentsData;

  res.json({
    success: true,
    message: 'Registration successful!',
    candidate: {
      id: studentsData[studentIndex]._id,
      name: studentsData[studentIndex].name,
      email: studentsData[studentIndex].email,
      role: 'candidate',
      course: studentsData[studentIndex].class,
      class: studentsData[studentIndex].class,
      rollNo: studentsData[studentIndex].rollNo
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const studentsData = req.app.locals.studentsData || [];
  const student = studentsData.find(s => 
    s.email === email && 
    s.password === password
  );
  
  if (!student) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email ya password'
    });
  }

  if (!student.isRegistered) {
    return res.status(401).json({
      success: false,
      message: 'Pehle registration complete karein'
    });
  }

  res.json({
    success: true,
    message: 'Login successful!',
    token: 'candidate-token-' + Date.now(),
    user: {
      id: student._id,
      name: student.name,
      email: student.email,
      role: 'candidate',
      course: student.class,
      class: student.class,
      rollNo: student.rollNo
    }
  });
});

// ✅ CANDIDATE DASHBOARD ROUTES
router.get('/:id/dashboard', (req, res) => {
  const candidateId = req.params.id;
  
  const studentsData = req.app.locals.studentsData || [];
  const assignmentsData = req.app.locals.assignmentsData || [];
  const eventsData = req.app.locals.eventsData || [];
  const teachersData = req.app.locals.teachersData || [];
  
  const student = studentsData.find(s => s._id === candidateId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
    });
  }

  // Assignments
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

  // Events
  const candidateEvents = eventsData
    .filter(event => 
      (event.targetAudience && (event.targetAudience.includes(student.class) || event.targetAudience.includes('all'))) ||
      (event.class && event.class === student.class)
    )
    .map(event => ({
      ...event,
      isUpcoming: new Date(event.date) > new Date()
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  // Stats
  const totalAssignments = candidateAssignments.length;
  const submittedAssignments = candidateAssignments.filter(a => a.isSubmitted).length;
  const gradedAssignments = candidateAssignments.filter(a => a.isGraded).length;
  const upcomingEvents = candidateEvents.filter(e => e.isUpcoming).length;

  // Teachers
  const assignedTeachers = student.assignedTeachers || [];
  const detailedTeachers = assignedTeachers.map(at => {
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
        status: student.status
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

router.get('/:id/profile', (req, res) => {
  const candidateId = req.params.id;
  const studentsData = req.app.locals.studentsData || [];
  const student = studentsData.find(s => s._id === candidateId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
    });
  }

  const { password, ...profileData } = student;
  
  res.json({
    success: true,
    data: profileData
  });
});

router.put('/:id/profile', (req, res) => {
  const candidateId = req.params.id;
  const { name, phone, address } = req.body;

  const studentsData = req.app.locals.studentsData || [];
  const studentIndex = studentsData.findIndex(s => s._id === candidateId);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
    });
  }

  studentsData[studentIndex] = {
    ...studentsData[studentIndex],
    name: name || studentsData[studentIndex].name,
    phone: phone || studentsData[studentIndex].phone,
    address: address || studentsData[studentIndex].address,
    updatedAt: new Date().toISOString()
  };

  req.app.locals.studentsData = studentsData;

  const { password, ...updatedProfile } = studentsData[studentIndex];

  res.json({
    success: true,
    message: "Profile update ho gaya",
    data: updatedProfile
  });
});

router.get('/:id/assignments', (req, res) => {
  const candidateId = req.params.id;
  const studentsData = req.app.locals.studentsData || [];
  const assignmentsData = req.app.locals.assignmentsData || [];
  
  const student = studentsData.find(s => s._id === candidateId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
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
        ...assignment,
        submission: submission || null,
        status: status,
        isSubmitted: !!submission,
        isGraded: submission?.status === 'graded',
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0
      };
    });

  res.json({
    success: true,
    data: candidateAssignments
  });
});

router.get('/:id/events', (req, res) => {
  const candidateId = req.params.id;
  const studentsData = req.app.locals.studentsData || [];
  const eventsData = req.app.locals.eventsData || [];
  
  const student = studentsData.find(s => s._id === candidateId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Candidate nahi mila"
    });
  }

  const candidateEvents = eventsData
    .filter(event => 
      (event.targetAudience && (event.targetAudience.includes(student.class) || event.targetAudience.includes('all'))) ||
      (event.class && event.class === student.class)
    )
    .map(event => ({
      ...event,
      isUpcoming: new Date(event.date) > new Date()
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({
    success: true,
    data: candidateEvents
  });
});

module.exports = router;