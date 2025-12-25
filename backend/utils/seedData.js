// utils/seedData.js
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const Event = require('../models/Event');
const Class = require('../models/Class');
const Admin = require('../models/User');
const bcrypt = require('bcryptjs');

async function seedInitialData() {
  try {
    console.log('🌱 Seeding initial data...');

    
    const adminExists = await Admin.findOne({ email: 'admin@school.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await Admin.create({
        name: 'Admin User',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    
    const teachers = [
      {
        name: "Mr. Johnson",
        email: "johnson@school.com",
        password: "teacher123",
        subject: "Mathematics",
        phone: "123-456-7890",
        experience: 5,
        classes: 2,
        totalStudents: 2,
        rating: 4.5,
        status: "active"
      },
      {
        name: "Ms. Williams",
        email: "williams@school.com",
        password: "teacher123",
        subject: "Science",
        phone: "123-456-7891",
        experience: 8,
        classes: 2,
        totalStudents: 2,
        rating: 4.8,
        status: "active"
      }
    ];

    let createdTeachers = [];
    for (const teacherData of teachers) {
      const exists = await Teacher.findOne({ email: teacherData.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(teacherData.password, 10);
        const teacher = await Teacher.create({
          ...teacherData,
          password: hashedPassword
        });
        createdTeachers.push(teacher);
      }
    }

    console.log(`✅ ${createdTeachers.length} teachers created`);
    const students = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@school.com',
        password: 'student123',
        rollNo: '101',
        class: '5A',
        phone: '+91 98765 43210',
        parentName: 'Raj Sharma',
        parentPhone: '+91 98765 43219',
        address: '123 Main Street, Mumbai',
        gender: 'Male',
        status: 'active',
        isRegistered: true,
        registrationDate: new Date(),
        assignedTeachers: createdTeachers.map(t => ({
          teacherId: t._id,
          teacherName: t.name,
          subject: t.subject
        }))
      },
      {
        name: 'Diya Patel',
        email: 'diya.patel@school.com',
        password: 'student123',
        rollNo: '102',
        class: '5A',
        phone: '+91 98765 43211',
        parentName: 'Priya Patel',
        parentPhone: '+91 98765 43218',
        address: '456 Oak Avenue, Delhi',
        gender: 'Female',
        status: 'active',
        isRegistered: true,
        registrationDate: new Date(),
        assignedTeachers: createdTeachers.map(t => ({
          teacherId: t._id,
          teacherName: t.name,
          subject: t.subject
        }))
      }
    ];

    let createdStudents = [];
    for (const studentData of students) {
      const exists = await Student.findOne({ 
        $or: [
          { email: studentData.email },
          { rollNo: studentData.rollNo }
        ]
      });
      
      if (!exists) {
        const hashedPassword = await bcrypt.hash(studentData.password, 10);
        const student = await Student.create({
          ...studentData,
          password: hashedPassword
        });
        createdStudents.push(student);
      }
    }

    console.log(`✅ ${createdStudents.length} students created`);

    const classes = [
      {
        name: "Class 5A",
        code: "5A",
        teacher: "Mr. Johnson",
        grade: "5",
        subject: "Multiple",
        capacity: 40,
        students: 2
      },
      {
        name: "Class 6B",
        code: "6B",
        teacher: "Ms. Williams",
        grade: "6",
        subject: "Multiple",
        capacity: 40,
        students: 0
      }
    ];

    for (const classData of classes) {
      const exists = await Class.findOne({ code: classData.code });
      if (!exists) {
        await Class.create(classData);
      }
    }

    console.log('✅ Classes created');

    console.log('🎉 Initial data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

module.exports = { seedInitialData };