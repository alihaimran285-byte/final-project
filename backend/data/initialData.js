// ================================
// INITIAL DATA STORAGE (UPDATED)
// ================================

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
    type: 'sports',
    status: 'upcoming',
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
    type: 'academic',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Cultural Fest',
    description: 'Annual cultural festival',
    date: '2024-12-25',
    time: '5:00 PM',
    venue: 'Auditorium',
    organizer: 'Cultural Committee',
    targetAudience: ['all'],
    class: 'all',
    type: 'cultural',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Parents Meeting',
    description: 'Quarterly parents-teacher meeting',
    date: '2024-12-10',
    time: '2:00 PM',
    venue: 'Conference Hall',
    organizer: 'Administration',
    targetAudience: ['all'],
    class: 'all',
    type: 'meeting',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    title: 'Workshop on AI',
    description: 'Artificial Intelligence workshop',
    date: '2024-11-30',
    time: '11:00 AM',
    venue: 'Computer Lab',
    organizer: 'IT Department',
    targetAudience: ['6B'],
    class: '6B',
    type: 'workshop',
    status: 'completed',
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

module.exports = {
  studentsData,
  teachersData,
  classesData,
  assignmentsData,
  eventsData,
  attendanceData,
  adminsData
};