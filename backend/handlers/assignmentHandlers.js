// ================================
// ASSIGNMENT HANDLERS
// ================================

const { assignmentsData, studentsData } = require('../data/initialData');

const getAllAssignments = (req, res) => {
  res.json({
    success: true,
    count: assignmentsData.length,
    data: assignmentsData
  });
};

const getAssignmentsWithDetails = (req, res) => {
  const assignmentsWithDetails = assignmentsData.map(assignment => {
    const totalStudents = studentsData.filter(s => s.class === assignment.class).length;
    const submittedCount = assignment.submissions.length;
    const gradedCount = assignment.submissions.filter(s => s.status === 'graded').length;
    
    return {
      ...assignment,
      totalStudents,
      submittedCount,
      gradedCount,
      submissionRate: totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0,
      gradingRate: submittedCount > 0 ? Math.round((gradedCount / submittedCount) * 100) : 0
    };
  });

  res.json({
    success: true,
    count: assignmentsData.length,
    data: assignmentsWithDetails
  });
};

const getAssignmentById = (req, res) => {
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
};

const getSubmissions = (req, res) => {
  const assignmentId = req.params.id;
  
  const assignment = assignmentsData.find(a => a._id === assignmentId);
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }

  const detailedSubmissions = assignment.submissions.map(submission => {
    const student = studentsData.find(s => s._id === submission.studentId);
    return {
      ...submission,
      studentClass: student?.class || 'N/A',
      studentRollNo: student?.rollNo || 'N/A',
      studentEmail: student?.email || 'N/A'
    };
  });

  res.json({
    success: true,
    data: {
      assignment: {
        id: assignment._id,
        title: assignment.title,
        subject: assignment.subject,
        totalMarks: assignment.totalMarks
      },
      submissions: detailedSubmissions,
      stats: {
        total: assignment.submissions.length,
        submitted: assignment.submissions.filter(s => s.status === 'submitted').length,
        graded: assignment.submissions.filter(s => s.status === 'graded').length,
        pending: assignment.submissions.filter(s => s.status === 'pending').length
      }
    }
  });
};

const addAssignment = (req, res) => {
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
};

const updateAssignment = (req, res) => {
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
};

const deleteAssignment = (req, res) => {
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
};

const gradeSubmission = (req, res) => {
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
};

const bulkGrade = (req, res) => {
  const assignmentId = req.params.id;
  const { grades } = req.body;
  
  const assignmentIndex = assignmentsData.findIndex(a => a._id === assignmentId);
  if (assignmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }

  let updatedCount = 0;
  
  grades.forEach(grade => {
    const submissionIndex = assignmentsData[assignmentIndex].submissions.findIndex(
      sub => sub.studentId === grade.studentId
    );
    
    if (submissionIndex > -1) {
      assignmentsData[assignmentIndex].submissions[submissionIndex] = {
        ...assignmentsData[assignmentIndex].submissions[submissionIndex],
        marks: grade.marks,
        feedback: grade.feedback || '',
        status: 'graded'
      };
      updatedCount++;
    }
  });

  assignmentsData[assignmentIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: `${updatedCount} submissions graded successfully`,
    data: {
      graded: updatedCount,
      total: grades.length
    }
  });
};

const downloadSubmissions = (req, res) => {
  const assignmentId = req.params.id;
  
  const assignment = assignmentsData.find(a => a._id === assignmentId);
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: "Assignment not found"
    });
  }

  if (assignment.submissions.length === 0) {
    return res.status(400).json({
      success: false,
      error: "No submissions to download"
    });
  }

  const downloadData = {
    assignment: assignment.title,
    totalSubmissions: assignment.submissions.length,
    downloadUrl: `/downloads/assignments/${assignmentId}.zip`,
    files: assignment.submissions.map(sub => ({
      studentName: sub.studentName,
      fileName: sub.fileName || 'assignment.pdf',
      fileSize: sub.fileSize || 'Unknown'
    }))
  };

  res.json({
    success: true,
    message: 'Download prepared successfully',
    data: downloadData
  });
};

const submitAssignmentDirect = (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId, file, fileName, fileSize, remarks, studentName } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
        receivedData: req.body
      });
    }

    const student = studentsData.find(s => s._id === studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found',
        requestedId: studentId,
        availableIds: studentsData.map(s => s._id)
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
      studentName: student.name || studentName,
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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentsWithDetails,
  getAssignmentById,
  getSubmissions,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  gradeSubmission,
  bulkGrade,
  downloadSubmissions,
  submitAssignmentDirect
};