const express = require('express');
const router = express.Router();
const Application = require("../models/Application")
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

// GET DASHBOARD STATS
router.get('/stats', async (req, res) => {
    try {
        // SAFELY FETCH DATA WITH ERROR HANDLING
        const applications = await Application.find().catch(err => []);
        const students = await Student.find().catch(err => []);
        const teachers = await Teacher.find().catch(err => []);
        const classes = await Class.find().catch(err => []);
        const attendanceRecords = await Attendance.find().catch(err => []);

        // ENSURE DATA IS ARRAY BEFORE USING FILTER
        const applicationsArray = Array.isArray(applications) ? applications : [];
        const studentsArray = Array.isArray(students) ? students : [];
        const teachersArray = Array.isArray(teachers) ? teachers : [];
        const classesArray = Array.isArray(classes) ? classes : [];
        const attendanceArray = Array.isArray(attendanceRecords) ? attendanceRecords : [];

        // NOW SAFELY USE FILTER
        const pendingApplications = applicationsArray.filter(app => 
            app.status === 'pending'
        ).length;

        const approvedApplications = applicationsArray.filter(app => 
            app.status === 'approved'
        ).length;

        const totalStudents = studentsArray.length;
        const totalTeachers = teachersArray.length;
        const totalClasses = classesArray.length;

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceArray.filter(record => {
            const recordDate = new Date(record.date).toISOString().split('T')[0];
            return recordDate === today;
        });

        const presentToday = todayAttendance.filter(record => 
            record.status === 'present'
        ).length;

        res.json({
            success: true,
            data: {
                applications: {
                    pending: pendingApplications,
                    approved: approvedApplications,
                    total: applicationsArray.length
                },
                students: {
                    total: totalStudents
                },
                teachers: {
                    total: totalTeachers
                },
                classes: {
                    total: totalClasses
                },
                attendance: {
                    presentToday: presentToday,
                    totalRecords: attendanceArray.length
                }
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
});

module.exports = router;