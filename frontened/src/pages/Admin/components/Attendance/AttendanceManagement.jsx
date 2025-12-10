import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, Plus, X, Users, CheckCircle, XCircle, Clock, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const AttendanceManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState({
    date: '',
    class: '',
    studentId: '',
    searchTerm: ''
  });
  
  // Attendance data from backend
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]); // For student dropdown
  
  // Add form state
  const [newAttendance, setNewAttendance] = useState({
    studentId: '',
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    class: '',
    remarks: ''
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    studentId: '',
    studentName: '',
    date: '',
    status: 'present',
    class: '',
    remarks: ''
  });

  // ✅ FETCH ATTENDANCE DATA FROM BACKEND
  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.date) params.date = filters.date;
      if (filters.class) params.class = filters.class;
      if (filters.studentId) params.studentId = filters.studentId;
      
      const response = await api.get('/attendance', { params });
      if (response.data.success) {
        // Transform backend data to match frontend structure
        const transformedData = await transformAttendanceData(response.data.data || []);
        setAttendance(transformedData);
        
        // ✅ Save to local storage for dashboard
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = transformedData.filter(record => {
          const recordDate = record.date ? record.date.split('T')[0] : record.date;
          return recordDate === today;
        });
        
        // Merge with existing local storage data
        const existingLocalData = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
        const mergedAttendance = [...todayAttendance];
        
        // Keep local storage data that's from today
        existingLocalData.forEach(localRecord => {
          const localDate = localRecord.date ? localRecord.date.split('T')[0] : localRecord.date;
          if (localDate === today) {
            const exists = mergedAttendance.some(record => 
              record.studentId === localRecord.studentId
            );
            if (!exists) {
              mergedAttendance.push(localRecord);
            }
          }
        });
        
        localStorage.setItem('attendance_dashboard', JSON.stringify(mergedAttendance));
        
        setSuccessMessage(`Loaded ${transformedData.length} records`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to fetch attendance');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      // Use dummy data for testing
      const dummyData = getDummyAttendanceData();
      setAttendance(dummyData);
      
      // ✅ Save dummy data to local storage for dashboard
      const today = new Date().toISOString().split('T')[0];
      const todayDummyData = dummyData.filter(record => 
        record.date === today || !record.date
      );
      localStorage.setItem('attendance_dashboard', JSON.stringify(todayDummyData));
      
      setSuccessMessage('Loaded demo attendance records');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET DUMMY DATA FOR TESTING
  const getDummyAttendanceData = () => {
    return [
      {
        _id: '1',
        studentId: '1',
        studentName: 'Aarav Sharma',
        date: new Date().toISOString().split('T')[0], // Today's date
        class: '5A',
        status: 'present',
        remarks: 'On time',
        checkInTime: '9:00 AM',
        checkOutTime: '11:00 AM'
      },
      {
        _id: '2',
        studentId: '2',
        studentName: 'Diya Patel',
        date: new Date().toISOString().split('T')[0], // Today's date
        class: '5A',
        status: 'absent',
        remarks: 'Sick leave',
        checkInTime: '',
        checkOutTime: ''
      },
      {
        _id: '3',
        studentId: '3',
        studentName: 'Rohan Mehta',
        date: new Date().toISOString().split('T')[0], // Today's date
        class: '6B',
        status: 'late',
        remarks: 'Traffic delay',
        checkInTime: '10:15 AM',
        checkOutTime: '12:00 PM'
      }
    ];
  };

  // ✅ FIX: Transform backend data structure with proper student mapping
  const transformAttendanceData = async (backendData) => {
    const flatAttendance = [];
    
    // First, fetch students to get their names
    await fetchStudents();
    
    backendData.forEach(record => {
      // If record has nested 'records' array (backend structure)
      if (record.records && Array.isArray(record.records)) {
        record.records.forEach(studentRecord => {
          // Find student name from students array
          const student = students.find(s => s._id === studentRecord.studentId);
          const studentName = student ? student.name : studentRecord.studentName || 'Unknown Student';
          
          flatAttendance.push({
            _id: `${record._id || 'temp'}-${studentRecord.studentId || 'temp'}`,
            studentId: studentRecord.studentId || '',
            studentName: studentName,
            date: record.date || new Date().toISOString().split('T')[0],
            class: record.class || 'Not Assigned',
            status: studentRecord.status || 'absent',
            remarks: studentRecord.remarks || '',
            checkInTime: studentRecord.checkInTime || '',
            checkOutTime: studentRecord.checkOutTime || '',
            teacherName: record.teacherName || '',
            subject: record.subject || ''
          });
        });
      } else {
        // If record is already flat
        const student = students.find(s => s._id === record.studentId);
        const studentName = student ? student.name : record.studentName || 'Unknown Student';
        
        flatAttendance.push({
          _id: record._id || `temp-${Date.now()}`,
          studentId: record.studentId || '',
          studentName: studentName,
          date: record.date || new Date().toISOString().split('T')[0],
          class: record.class || 'Not Assigned',
          status: record.status || 'absent',
          remarks: record.remarks || '',
          checkInTime: record.checkInTime || '',
          checkOutTime: record.checkOutTime || '',
          teacherName: record.teacherName || '',
          subject: record.subject || ''
        });
      }
    });
    
    return flatAttendance;
  };

  // ✅ FETCH STUDENTS FOR DROPDOWN
  const fetchStudents = async () => {
    try {
      // Use correct endpoint to get students
      const response = await api.get('/students');
      if (response.data.success) {
        const studentsData = response.data.data || [];
        setStudents(studentsData);
        
        // If no students from API, use hardcoded data
        if (studentsData.length === 0) {
          setStudents(getHardcodedStudents());
        }
      } else {
        setStudents(getHardcodedStudents());
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      // Use hardcoded students data
      setStudents(getHardcodedStudents());
    }
  };

  // ✅ HARDCODED STUDENTS DATA
  const getHardcodedStudents = () => {
    return [
      { _id: '1', name: 'Aarav Sharma', rollNo: '101', class: '5A' },
      { _id: '2', name: 'Diya Patel', rollNo: '102', class: '5A' },
      { _id: '3', name: 'Rohan Mehta', rollNo: '103', class: '6B' },
      { _id: '4', name: 'Aliha Imran Bhatti', rollNo: '104', class: '5A' },
      { _id: '5', name: 'John Doe', rollNo: '105', class: '6B' },
      { _id: '6', name: 'Jane Smith', rollNo: '106', class: '5A' }
    ];
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  // ✅ APPLY FILTERS
  const applyFilters = () => {
    fetchAttendance();
  };

  // ✅ RESET FILTERS
  const resetFilters = () => {
    setFilters({
      date: '',
      class: '',
      studentId: '',
      searchTerm: ''
    });
    fetchAttendance();
  };

  // ✅ HANDLE ADD ATTENDANCE
  const handleAddAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Local storage me save karo pehle
      const today = new Date().toISOString().split('T')[0];
      const existingAttendance = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
      
      // Check if student already has attendance for today
      const existingIndex = existingAttendance.findIndex(item => 
        item.studentId === newAttendance.studentId && 
        (item.date === today || item.date === newAttendance.date)
      );
      
      const newAttendanceRecord = {
        _id: `attendance-${Date.now()}`,
        studentId: newAttendance.studentId,
        studentName: newAttendance.studentName,
        date: today, // ✅ Always use today's date for dashboard
        class: newAttendance.class,
        status: newAttendance.status,
        remarks: newAttendance.remarks,
        checkInTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        checkOutTime: '',
        createdAt: new Date().toISOString(),
        source: 'local' // Mark as locally saved
      };
      
      if (existingIndex !== -1) {
        // Update existing record
        existingAttendance[existingIndex] = newAttendanceRecord;
      } else {
        // Add new record
        existingAttendance.push(newAttendanceRecord);
      }
      
      // ✅ Save to local storage for dashboard (IMMEDIATE)
      localStorage.setItem('attendance_dashboard', JSON.stringify(existingAttendance));
      
      // ✅ Dashboard ko refresh karne ke liye event trigger karo
      window.dispatchEvent(new CustomEvent('attendanceUpdated', { 
        detail: newAttendanceRecord 
      }));
      
      // Prepare data for backend
      const attendanceData = {
        date: newAttendance.date,
        class: newAttendance.class,
        subject: 'General',
        teacherId: '1',
        teacherName: 'Mr. Johnson',
        records: [{
          studentId: newAttendance.studentId,
          studentName: newAttendance.studentName,
          status: newAttendance.status,
          remarks: newAttendance.remarks,
          checkInTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          checkOutTime: ''
        }]
      };
      
      const response = await api.post('/attendance', attendanceData);
      if (response.data.success) {
        setSuccessMessage('Attendance marked successfully!');
        setShowAddModal(false);
        fetchAttendance(); // Refresh data from API
        resetAddForm();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error('Error adding attendance:', err);
      // ✅ Even if API fails, local storage me save ho chuka hai
      setSuccessMessage('Attendance marked successfully! (Saved locally)');
      setShowAddModal(false);
      resetAddForm();
      
      // Refresh local data
      fetchAttendance();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE EDIT ATTENDANCE
  const handleEditAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Update local storage me bhi
      const today = new Date().toISOString().split('T')[0];
      const existingAttendance = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
      
      const updatedLocalRecord = {
        _id: selectedRecord._id,
        studentId: editForm.studentId,
        studentName: editForm.studentName,
        date: today,
        class: editForm.class,
        status: editForm.status,
        remarks: editForm.remarks,
        checkInTime: selectedRecord.checkInTime || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        checkOutTime: selectedRecord.checkOutTime || '',
        createdAt: selectedRecord.createdAt || new Date().toISOString(),
        source: 'local'
      };
      
      const existingIndex = existingAttendance.findIndex(item => 
        item._id === selectedRecord._id
      );
      
      if (existingIndex !== -1) {
        existingAttendance[existingIndex] = updatedLocalRecord;
      } else {
        existingAttendance.push(updatedLocalRecord);
      }
      
      localStorage.setItem('attendance_dashboard', JSON.stringify(existingAttendance));
      
      // ✅ Dashboard update event
      window.dispatchEvent(new CustomEvent('attendanceUpdated', { 
        detail: updatedLocalRecord 
      }));
      
      const response = await api.put(`/attendance/${selectedRecord._id}`, editForm);
      if (response.data.success) {
        setSuccessMessage('Attendance record updated successfully!');
        setShowEditModal(false);
        fetchAttendance(); // Refresh data
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      setSuccessMessage('Attendance record updated successfully! (Saved locally)');
      setShowEditModal(false);
      
      // Update local state
      setAttendance(prev => 
        prev.map(record => 
          record._id === selectedRecord._id ? { ...record, ...editForm } : record
        )
      );
      setSelectedRecord(null);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE DELETE ATTENDANCE
  const handleDeleteAttendance = async () => {
    if (!selectedRecord) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Remove from local storage
      const existingAttendance = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
      const updatedLocalAttendance = existingAttendance.filter(item => 
        !(item._id === selectedRecord._id || 
          (item.studentId === selectedRecord.studentId && item.date === selectedRecord.date))
      );
      
      localStorage.setItem('attendance_dashboard', JSON.stringify(updatedLocalAttendance));
      
      // ✅ Dashboard update event
      window.dispatchEvent(new CustomEvent('attendanceUpdated'));
      
      const response = await api.delete(`/attendance/${selectedRecord._id}`);
      if (response.data.success) {
        setSuccessMessage('Attendance record deleted successfully!');
        setShowDeleteModal(false);
        setSelectedRecord(null);
        fetchAttendance(); // Refresh data
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error('Error deleting attendance:', err);
      setSuccessMessage('Attendance record deleted successfully! (From local storage)');
      setShowDeleteModal(false);
      
      // Remove from local state
      setAttendance(prev => prev.filter(record => record._id !== selectedRecord._id));
      
      // Remove from local storage array
      const existingAttendance = JSON.parse(localStorage.getItem('attendance_dashboard')) || [];
      const updatedAttendance = existingAttendance.filter(item => item._id !== selectedRecord._id);
      localStorage.setItem('attendance_dashboard', JSON.stringify(updatedAttendance));
      
      setSelectedRecord(null);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESET ADD FORM
  const resetAddForm = () => {
    setNewAttendance({
      studentId: '',
      studentName: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      class: '',
      remarks: ''
    });
  };

  // ✅ HANDLE STUDENT SELECTION IN ADD FORM
  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const selectedStudent = students.find(s => s._id === studentId);
    
    if (selectedStudent) {
      setNewAttendance(prev => ({
        ...prev,
        studentId: selectedStudent._id,
        studentName: selectedStudent.name,
        class: selectedStudent.class || ''
      }));
    }
  };

  // ✅ HANDLE STUDENT SELECTION IN EDIT FORM
  const handleStudentSelectEdit = (e) => {
    const studentId = e.target.value;
    const selectedStudent = students.find(s => s._id === studentId);
    
    if (selectedStudent) {
      setEditForm(prev => ({
        ...prev,
        studentId: selectedStudent._id,
        studentName: selectedStudent.name
      }));
    }
  };

  // ✅ OPEN EDIT MODAL
  const openEditModal = (record) => {
    setSelectedRecord(record);
    setEditForm({
      studentId: record.studentId,
      studentName: record.studentName,
      date: record.date ? record.date.split('T')[0] : new Date().toISOString().split('T')[0],
      status: record.status || 'present',
      class: record.class || '',
      remarks: record.remarks || ''
    });
    setShowEditModal(true);
  };

  // ✅ OPEN DELETE MODAL
  const openDeleteModal = (record) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  // ✅ OPEN VIEW MODAL
  const openViewModal = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // ✅ CALCULATE STATISTICS
  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(r => r.status === 'present').length;
    const absent = attendance.filter(r => r.status === 'absent').length;
    const late = attendance.filter(r => r.status === 'late').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, late, attendanceRate };
  };

  const stats = calculateStats();

  // ✅ SAFE STATUS DISPLAY FUNCTION
  const getStatusDisplay = (status) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // ✅ SAFE DATE DISPLAY FUNCTION
  const getDateDisplay = (date) => {
    if (!date) return 'N/A';
    return date.split('T')[0];
  };

  // ✅ FILTERED ATTENDANCE
  const filteredAttendance = attendance.filter(record => {
    const matchesDate = !filters.date || record.date === filters.date;
    const matchesClass = !filters.class || record.class.includes(filters.class);
    const matchesStudentId = !filters.studentId || record.studentId === filters.studentId;
    const matchesSearch = !filters.searchTerm || 
      record.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.class.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesDate && matchesClass && matchesStudentId && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-orange-800 mb-2">Attendance Management</h1>
            <p className="text-orange-600">Track and manage student attendance</p>
          </div>
          <button 
            onClick={fetchAttendance}
            disabled={loading}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Present</p>
              <p className="text-2xl font-bold text-green-800">{stats.present}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Absent</p>
              <p className="text-2xl font-bold text-red-800">{stats.absent}</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Late</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.late}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Attendance Rate</p>
              <p className="text-2xl font-bold text-orange-800">{stats.attendanceRate}%</p>
            </div>
            <UserPlus className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
          />
          
          <select
            value={filters.class}
            onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
            className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
          >
            <option value="">All Classes</option>
            <option value="5A">Class 5A</option>
            <option value="6B">Class 6B</option>
            <option value="7C">Class 7C</option>
            <option value="8D">Class 8D</option>
          </select>
          
          <select
            value={filters.studentId}
            onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
            className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.rollNo})
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Search by student name..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
          />
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <button 
              onClick={applyFilters}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Applying...' : 'Apply Filters'}
            </button>
            
            <button 
              onClick={resetFilters}
              className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
          
          <span className="text-sm text-orange-600 self-center">
            Showing {filteredAttendance.length} of {attendance.length} records
          </span>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="p-6 border-b border-orange-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-orange-800">ATTENDANCE RECORDS</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Plus size={20} />
            <span>Add Record</span>
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="mx-auto text-orange-500 mb-4 animate-spin" size={32} />
            <p className="text-orange-600">Loading attendance records...</p>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-orange-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-orange-800 mb-2">No attendance records found</h3>
            <p className="text-orange-600 mb-4">Add your first attendance record or adjust your filters</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Record
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="p-4 text-left text-orange-700 font-semibold">Student</th>
                  <th className="p-4 text-left text-orange-700 font-semibold">Date</th>
                  <th className="p-4 text-left text-orange-700 font-semibold">Class</th>
                  <th className="p-4 text-left text-orange-700 font-semibold">Status</th>
                  <th className="p-4 text-left text-orange-700 font-semibold">Remarks</th>
                  <th className="p-4 text-left text-orange-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {filteredAttendance.map((record) => (
                  <tr key={record._id} className="hover:bg-orange-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-orange-800">{record.studentName}</div>
                        <div className="text-sm text-orange-600">Roll No: {record.studentId}</div>
                      </div>
                    </td>
                    <td className="p-4 text-orange-700">{getDateDisplay(record.date)}</td>
                    <td className="p-4 text-orange-700">{record.class}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusDisplay(record.status)}
                      </span>
                    </td>
                    <td className="p-4 text-orange-600 max-w-xs truncate">
                      {record.remarks || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openViewModal(record)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button 
                          onClick={() => openEditModal(record)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Edit Record"
                        >
                          <Edit3 size={16} />
                        </button>
                        
                        <button 
                          onClick={() => openDeleteModal(record)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ ADD ATTENDANCE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-orange-100">
              <h3 className="text-lg font-bold text-orange-800">Add Attendance Record</h3>
              <button 
                onClick={() => !loading && setShowAddModal(false)}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddAttendance} className="p-6 space-y-4">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Student *
                </label>
                <select
                  required
                  value={newAttendance.studentId}
                  onChange={handleStudentSelect}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} (Roll: {student.rollNo}, Class: {student.class})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={newAttendance.date}
                  onChange={(e) => setNewAttendance(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                />
              </div>

              {/* Class (Auto-filled from student selection) */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Class *
                </label>
                <input
                  type="text"
                  required
                  value={newAttendance.class}
                  onChange={(e) => setNewAttendance(prev => ({ ...prev, class: e.target.value }))}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                  placeholder="Class will auto-fill when student is selected"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={newAttendance.status}
                  onChange={(e) => setNewAttendance(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={newAttendance.remarks}
                  onChange={(e) => setNewAttendance(prev => ({ ...prev, remarks: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors resize-none"
                  disabled={loading}
                  placeholder="Optional remarks..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => !loading && setShowAddModal(false)}
                  className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  <span>{loading ? 'Adding...' : 'Mark Attendance'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ EDIT MODAL */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-orange-100">
              <h3 className="text-lg font-bold text-orange-800">Edit Attendance Record</h3>
              <button 
                onClick={() => !loading && setShowEditModal(false)}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditAttendance} className="p-6 space-y-4">
              {/* Student Info (Read-only in edit) */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Student
                </label>
                <input
                  type="text"
                  value={editForm.studentName}
                  readOnly
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-orange-50 text-orange-800"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Class *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.class}
                  onChange={(e) => setEditForm(prev => ({ ...prev, class: e.target.value }))}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
                  disabled={loading}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={editForm.remarks}
                  onChange={(e) => setEditForm(prev => ({ ...prev, remarks: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors resize-none"
                  disabled={loading}
                  placeholder="Optional remarks..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => !loading && setShowEditModal(false)}
                  className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-orange-100">
              <h3 className="text-lg font-bold text-orange-800">Delete Attendance Record</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg mb-3">
                  <Trash2 className="text-red-500" size={24} />
                  <div>
                    <p className="font-medium text-red-800">Warning: This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-orange-700 mb-2">
                  Are you sure you want to delete attendance record for:
                </p>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p><strong>Student:</strong> {selectedRecord.studentName}</p>
                  <p><strong>Date:</strong> {getDateDisplay(selectedRecord.date)}</p>
                  <p><strong>Class:</strong> {selectedRecord.class}</p>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
                    selectedRecord.status === 'present' ? 'bg-green-100 text-green-800' :
                    selectedRecord.status === 'absent' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{getStatusDisplay(selectedRecord.status)}</span></p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => !loading && setShowDeleteModal(false)}
                  className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAttendance}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  <span>{loading ? 'Deleting...' : 'Delete Record'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ VIEW MODAL */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-orange-100">
              <h3 className="text-lg font-bold text-orange-800">Attendance Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Student Name</label>
                  <p className="text-orange-800 font-medium">{selectedRecord.studentName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Student ID</label>
                  <p className="text-orange-800">{selectedRecord.studentId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Date</label>
                  <p className="text-orange-800">{getDateDisplay(selectedRecord.date)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Class</label>
                  <p className="text-orange-800">{selectedRecord.class}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedRecord.status === 'present' ? 'bg-green-100 text-green-800' :
                    selectedRecord.status === 'absent' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStatusDisplay(selectedRecord.status)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Remarks</label>
                  <p className="text-orange-800">{selectedRecord.remarks || 'No remarks'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Check-in Time</label>
                  <p className="text-orange-800">{selectedRecord.checkInTime || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">Check-out Time</label>
                  <p className="text-orange-800">{selectedRecord.checkOutTime || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;