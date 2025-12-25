
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Import components
import AttendanceStats from './AttendanceStats';
import AttendanceTable from './AttendanceTable';
import AddModal from './Modals/AddModal';
import EditModal from './Modals/EditModal';
import DeleteModal from './Modals/DeleteModal';
import ViewModal from './Modals/ViewModal';


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
  
  // Attendance data from backend ONLY
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  
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

  // ✅ BACKEND SE ATTENDANCE DATA LE AYEIN
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
        const transformedData = transformAttendanceData(response.data.data || []);
        setAttendance(transformedData);
        setSuccessMessage(`Loaded ${transformedData.length} records`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to fetch attendance');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to connect to server. Please check your backend.');
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ BACKEND KE DATA KO TABLE KE LIYE TAYYAR KAREIN
  const transformAttendanceData = (backendData) => {
    const flatAttendance = [];
    
    backendData.forEach(record => {
      if (record.records && Array.isArray(record.records)) {
        record.records.forEach(studentRecord => {
          const student = students.find(s => s._id === studentRecord.studentId);
          const studentName = student ? student.name : studentRecord.studentName || 'Unknown Student';
          
          flatAttendance.push({
            _id: `${record._id || 'temp'}-${studentRecord.studentId || 'temp'}`,
            originalId: record._id,
            studentId: studentRecord.studentId || '',
            studentName: studentName,
            rollNo: student ? student.rollNo : 'N/A',
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
        const student = students.find(s => s._id === record.studentId);
        const studentName = student ? student.name : record.studentName || 'Unknown Student';
        
        flatAttendance.push({
          _id: record._id || `temp-${Date.now()}`,
          originalId: record._id,
          studentId: record.studentId || '',
          studentName: studentName,
          rollNo: student ? student.rollNo : 'N/A',
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

  // ✅ STUDENTS KI LIST LE AYEIN
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      if (response.data.success) {
        const studentsData = response.data.data || [];
        setStudents(studentsData);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    }
  };

  // ✅ PEHLI BAR PAGE LOAD HONE PAR DATA LE AYEIN
  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  // ✅ FILTERS LAGAEIN
  const applyFilters = () => {
    fetchAttendance();
  };

  // ✅ FILTERS HATAYEIN
  const resetFilters = () => {
    setFilters({
      date: '',
      class: '',
      studentId: '',
      searchTerm: ''
    });
    fetchAttendance();
  };

  // ✅ NAYA ATTENDANCE ADD KAREIN
  const handleAddAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
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
        resetAddForm();
        
        // ✅ DASHBOARD UPDATE KE LIYE EVENT
        window.dispatchEvent(new CustomEvent('attendanceUpdated'));
        
        // Naya data le ayein
        await fetchAttendance();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to add attendance');
      }
    } catch (err) {
      console.error('Error adding attendance:', err);
      setError('Failed to add attendance. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ATTENDANCE EDIT KAREIN - YEH THEEK KAR DIYA
  const handleEditAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // ✅ IMPORTANT: Backend ko nested structure chahiye
      const updateData = {
        date: editForm.date,
        class: editForm.class,
        subject: 'General',
        teacherId: '1',
        teacherName: 'Mr. Johnson',
        records: [{
          studentId: editForm.studentId,
          studentName: editForm.studentName,
          status: editForm.status,
          remarks: editForm.remarks,
          checkInTime: selectedRecord.checkInTime || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          checkOutTime: selectedRecord.checkOutTime || ''
        }]
      };
      
      const response = await api.put(`/attendance/${selectedRecord.originalId || selectedRecord._id}`, updateData);
      if (response.data.success) {
        setSuccessMessage('Attendance record updated successfully!');
        setShowEditModal(false);
        
        // ✅ DASHBOARD UPDATE KE LIYE EVENT
        window.dispatchEvent(new CustomEvent('attendanceUpdated'));
        
        // Naya data le ayein
        await fetchAttendance();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to update attendance');
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError('Failed to update attendance. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ATTENDANCE DELETE KAREIN
  const handleDeleteAttendance = async () => {
    if (!selectedRecord) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/attendance/${selectedRecord.originalId || selectedRecord._id}`);
      if (response.data.success) {
        setSuccessMessage('Attendance record deleted successfully!');
        setShowDeleteModal(false);
        setSelectedRecord(null);
        
        // ✅ DASHBOARD UPDATE KE LIYE EVENT
        window.dispatchEvent(new CustomEvent('attendanceUpdated'));
        
        // Naya data le ayein
        await fetchAttendance();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to delete attendance');
      }
    } catch (err) {
      console.error('Error deleting attendance:', err);
      setError('Failed to delete attendance. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD FORM RESET KAREIN
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

  // ✅ STUDENT SELECT KAREIN ADD FORM MEIN
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

  // ✅ EDIT MODAL KHOLEN
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

  // ✅ DELETE MODAL KHOLEN
  const openDeleteModal = (record) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  // ✅ VIEW MODAL KHOLEN
  const openViewModal = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // ✅ STATISTICS CALCULATE KAREIN
  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(r => r.status === 'present').length;
    const absent = attendance.filter(r => r.status === 'absent').length;
    const late = attendance.filter(r => r.status === 'late').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, late, attendanceRate };
  };

  const stats = calculateStats();

  // ✅ STATUS DISPLAY KAREIN
  const getStatusDisplay = (status) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // ✅ DATE DISPLAY KAREIN
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
      <AttendanceStats stats={stats} />

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
        
        <AttendanceTable 
          filteredAttendance={filteredAttendance}
          loading={loading}
          openViewModal={openViewModal}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
          getDateDisplay={getDateDisplay}
          getStatusDisplay={getStatusDisplay}
          setShowAddModal={setShowAddModal}
        />
      </div>

      {/* Modals */}
      <AddModal 
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newAttendance={newAttendance}
        setNewAttendance={setNewAttendance}
        handleStudentSelect={handleStudentSelect}
        handleAddAttendance={handleAddAttendance}
        loading={loading}
        students={students}
      />

      <EditModal 
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditAttendance={handleEditAttendance}
        loading={loading}
        selectedRecord={selectedRecord}
      />

      <DeleteModal 
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedRecord={selectedRecord}
        handleDeleteAttendance={handleDeleteAttendance}
        loading={loading}
        getDateDisplay={getDateDisplay}
        getStatusDisplay={getStatusDisplay}
      />

      <ViewModal 
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        selectedRecord={selectedRecord}
        getDateDisplay={getDateDisplay}
        getStatusDisplay={getStatusDisplay}
      />
    </div>
  );
};

export default AttendanceManagement;