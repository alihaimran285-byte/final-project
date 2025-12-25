const express = require('express');
const router = express.Router();
const Tstudent = require('../models/Tstudent');
const Teacher = require('../models/Tteacher');
const bcrypt = require('bcryptjs');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// ✅ GET all students (Admin only)
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const students = await Tstudent.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTeachers.teacherId', 'name subject');

    res.json({
      success: true,
      students,
      total: students.length
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ CREATE new student (Admin only)
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNo,
      class: studentClass,
      section,
      parentName,
      parentPhone,
      parentEmail,
      address,
      dateOfBirth,
      gender,
      bloodGroup
    } = req.body;

    // Check if student exists
    const existingStudent = await Tstudent.findOne({ 
      $or: [{ email }, { rollNo }] 
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = new Tstudent({
      name,
      email,
      password: hashedPassword,
      rollNo,
      class: studentClass,
      section: section || 'A',
      parentName,
      parentPhone,
      parentEmail,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || 'Male',
      bloodGroup,
      status: 'active',
      createdBy: req.user.id
    });

    await student.save();

    // Remove password from response
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      student: studentResponse
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ UPDATE student (Admin only)
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const student = await Tstudent.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ DELETE student (Admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const student = await Tstudent.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ Assign teacher to student (Admin only)
router.post('/:id/assign-teacher', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { teacherId, subject } = req.body;
    const studentId = req.params.id;

    // Check if student exists
    const student = await Tstudent.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Check if already assigned
    const alreadyAssigned = student.assignedTeachers.some(
      t => t.teacherId.toString() === teacherId
    );

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Teacher already assigned to this student'
      });
    }

    // Add teacher assignment
    student.assignedTeachers.push({
      teacherId,
      teacherName: teacher.name,
      subject: subject || teacher.subject,
      assignedBy: req.user.id
    });

    await student.save();

    res.json({
      success: true,
      message: 'Teacher assigned successfully',
      student
    });
  } catch (error) {
    console.error('Assign teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ Remove teacher from student (Admin only)
router.delete('/:id/remove-teacher/:teacherId', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const teacherId = req.params.teacherId;

    const student = await Tstudent.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Remove teacher assignment
    student.assignedTeachers = student.assignedTeachers.filter(
      t => t.teacherId.toString() !== teacherId
    );

    await student.save();

    res.json({
      success: true,
      message: 'Teacher removed successfully',
      student
    });
  } catch (error) {
    console.error('Remove teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ Get students by class (Admin/Teacher)
router.get('/class/:className', authMiddleware, async (req, res) => {
  try {
    const { className } = req.params;
    const user = req.user;

    let students;
    
    if (user.role === 'admin') {
      // Admin can see all students in class
      students = await Tstudent.find({ 
        class: className,
        status: 'active'
      }).sort({ rollNo: 1 });
    } else if (user.role === 'teacher') {
      // Teacher can only see students assigned to them in that class
      const teacherClasses = user.assignedClasses.map(ac => ac.class);
      
      if (!teacherClasses.includes(className)) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to this class'
        });
      }

      students = await Tstudent.find({
        class: className,
        status: 'active',
        'assignedTeachers.teacherId': user._id
      }).sort({ rollNo: 1 });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      students: students.map(s => ({
        _id: s._id,
        name: s.name,
        email: s.email,
        rollNo: s.rollNo,
        class: s.class,
        section: s.section,
        parentName: s.parentName,
        parentPhone: s.parentPhone
      })),
      total: students.length
    });
  } catch (error) {
    console.error('Get students by class error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ✅ Get student statistics (Admin only)
router.get('/stats', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const totalStudents = await Tstudent.countDocuments();
    const activeStudents = await Tstudent.countDocuments({ status: 'active' });
    const inactiveStudents = await Tstudent.countDocuments({ status: 'inactive' });
    
    // Students by class
    const studentsByClass = await Tstudent.aggregate([
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Recent enrollments
    const recentEnrollments = await Tstudent.find()
      .sort({ enrollmentDate: -1 })
      .limit(5)
      .select('name class enrollmentDate');

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        studentsByClass,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Student stats error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;