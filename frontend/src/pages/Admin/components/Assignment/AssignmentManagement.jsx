import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, X, Edit2, Trash2, Eye, 
  Users, BookOpen, Calendar, Clock, CheckCircle,
  AlertCircle, Download, FileText, Star, BarChart3
} from 'lucide-react';
import Notification from '../../../Notification';

const AssignmentManagement = ({ 
  students = [], 
  teachers = [], 
  onDataUpdate = () => {}, 
  searchTerm = '' 
}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    assignedTo: 'all',
    studentId: '',
    class: '',
    teacherId: '',
    dueDate: '',
    totalMarks: '100',
    instructions: ''
  });

  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    visible: false
  });

  // API Base URL
  const API_BASE = 'http://localhost:3000';
  
  // Get unique classes and subjects
  const uniqueClasses = ['All Classes', ...new Set(students.map(s => s.class).filter(Boolean))];
  const uniqueSubjects = ['All Subjects', 'Mathematics', 'Science', 'English', 'Urdu', 'Islamiat', 
                         'Biology', 'Physics', 'Chemistry', 'Social Studies', 'Computer Science'];

  // Fetch assignments from backend
  useEffect(() => {
    fetchAssignments();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ message: '', type: 'success', visible: false }), 3000);
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/assignments`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAssignments(data.data || []);
        } else {
          console.error('Failed to fetch assignments:', data.error);
          loadFromLocalStorage();
        }
      } else {
        console.error('HTTP error fetching assignments:', response.status);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAssignments(parsed);
      } else {
        const sampleAssignments = createSampleAssignments(students, teachers);
        setAssignments(sampleAssignments);
        localStorage.setItem('assignments', JSON.stringify(sampleAssignments));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setAssignments([]);
    }
  };

  
  const createSampleAssignments = (students, teachers) => {
    return [
      {
        _id: '1',
        title: 'Algebra Basics Assignment',
        description: 'Complete exercises 1-10 from chapter 3',
        subject: 'Mathematics',
        teacherId: teachers[0]?._id || '1',
        teacherName: teachers[0]?.name || 'Mr. Johnson',
        assignedTo: 'all',
        class: '5A',
        dueDate: '2024-12-30',
        totalMarks: 100,
        instructions: 'Show all calculations clearly',
        status: 'active',
        submittedCount: 2,
        totalStudents: students.filter(s => s.class === '5A').length,
        submissions: [
          {
            studentId: students[0]?._id || '1',
            studentName: students[0]?.name || 'Aarav Sharma',
            submittedAt: '2024-11-21T14:30:00Z',
            file: 'aarav_algebra.pdf',
            remarks: 'Completed all exercises',
            marks: 85,
            feedback: 'Good work, but show more steps',
            status: 'graded'
          },
          {
            studentId: students[1]?._id || '2',
            studentName: students[1]?.name || 'Diya Patel',
            submittedAt: '2024-11-22T10:15:00Z',
            file: 'diya_algebra.pdf',
            remarks: 'Need help with question 8',
            status: 'submitted'
          }
        ],
        createdAt: '2024-11-20T10:00:00Z',
        updatedAt: '2024-11-22T10:15:00Z'
      },
      {
        _id: '2',
        title: 'Science Project - Solar System',
        description: 'Create a model of the solar system',
        subject: 'Science',
        teacherId: teachers[1]?._id || '2',
        teacherName: teachers[1]?.name || 'Ms. Williams',
        assignedTo: 'specific-class',
        class: '5A',
        dueDate: '2024-12-25',
        totalMarks: 100,
        instructions: 'Include all planets and their characteristics',
        status: 'active',
        submittedCount: 1,
        totalStudents: students.filter(s => s.class === '5A').length,
        submissions: [
          {
            studentId: students[0]?._id || '1',
            studentName: students[0]?.name || 'Aarav Sharma',
            submittedAt: '2024-11-23T09:45:00Z',
            file: 'solar_system_model.pdf',
            remarks: 'Made a 3D model',
            status: 'submitted'
          }
        ],
        createdAt: '2024-11-18T09:00:00Z',
        updatedAt: '2024-11-23T09:45:00Z'
      }
    ];
  };

  // Handle Create Assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.title || !formData.subject || !formData.dueDate || !formData.teacherId) {
      showNotification('Please fill all required fields', 'error');
      setIsSubmitting(false);
      return;
    }

    const teacher = teachers.find(t => t._id === formData.teacherId);
    if (!teacher) {
      showNotification('Selected teacher not found', 'error');
      setIsSubmitting(false);
      return;
    }

    const assignmentData = {
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      teacherId: formData.teacherId,
      teacherName: teacher.name,
      assignedTo: formData.assignedTo,
      studentId: formData.assignedTo === 'specific-student' ? formData.studentId : null,
      studentName: formData.assignedTo === 'specific-student' 
        ? students.find(s => s._id === formData.studentId)?.name : null,
      class: formData.assignedTo === 'specific-class' ? formData.class : null,
      dueDate: formData.dueDate,
      totalMarks: parseInt(formData.totalMarks) || 100,
      instructions: formData.instructions,
      status: 'active',
      submittedCount: 0,
      submissions: []
    };

    try {
      const response = await fetch(`${API_BASE}/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newAssignment = data.data;
          setAssignments(prev => [...prev, newAssignment]);
          
          const currentAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          localStorage.setItem('assignments', JSON.stringify([...currentAssignments, newAssignment]));
          
          setShowAddModal(false);
          resetForm();
          showNotification('Assignment created successfully!', 'success');
          onDataUpdate();
        } else {
          throw new Error(data.error || 'Failed to create assignment');
        }
      } else {
        throw new Error('HTTP error: ' + response.status);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      
      const newAssignment = {
        _id: Date.now().toString(),
        ...assignmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAssignments(prev => [...prev, newAssignment]);
      
      const currentAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      localStorage.setItem('assignments', JSON.stringify([...currentAssignments, newAssignment]));
      
      setShowAddModal(false);
      resetForm();
      showNotification('Assignment created successfully!', 'success');
      onDataUpdate();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Assignment
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      subject: assignment.subject || '',
      assignedTo: assignment.assignedTo || 'all',
      studentId: assignment.studentId || '',
      class: assignment.class || '',
      teacherId: assignment.teacherId || '',
      dueDate: assignment.dueDate?.split('T')[0] || '',
      totalMarks: assignment.totalMarks?.toString() || '100',
      instructions: assignment.instructions || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        ...formData,
        totalMarks: parseInt(formData.totalMarks) || 100
      };

      const response = await fetch(`${API_BASE}/api/assignments/${editingAssignment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAssignments(prev => prev.map(a => 
            a._id === editingAssignment._id ? { ...data.data, submissions: a.submissions } : a
          ));
          
          const currentAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          const updatedAssignments = currentAssignments.map(a => 
            a._id === editingAssignment._id ? { ...data.data, submissions: a.submissions } : a
          );
          localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
          
          setShowEditModal(false);
          resetForm();
          showNotification('Assignment updated successfully!', 'success');
          onDataUpdate();
        } else {
          throw new Error(data.error || 'Failed to update assignment');
        }
      } else {
        throw new Error('HTTP error: ' + response.status);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      
      const updatedAssignment = {
        ...editingAssignment,
        ...formData,
        totalMarks: parseInt(formData.totalMarks) || 100,
        updatedAt: new Date().toISOString()
      };
      
      setAssignments(prev => prev.map(a => 
        a._id === editingAssignment._id ? updatedAssignment : a
      ));
      
      const currentAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      const updatedAssignments = currentAssignments.map(a => 
        a._id === editingAssignment._id ? updatedAssignment : a
      );
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      
      setShowEditModal(false);
      resetForm();
      showNotification('Assignment updated successfully!', 'success');
      onDataUpdate();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Assignment
  const handleDelete = async (id) => {
   
    try {
      const response = await fetch(`${API_BASE}/api/assignments/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAssignments(prev => prev.filter(a => a._id !== id));
          
          const currentAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          const updatedAssignments = currentAssignments.filter(a => a._id !== id);
          localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
          
          showNotification('Assignment deleted successfully!', 'success');
          onDataUpdate();
        } else {
          throw new Error(data.error || 'Failed to delete assignment');
        }
      } else {
        throw new Error('HTTP error: ' + response.status);
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      
      setAssignments(prev => prev.filter(a => a._id !== id));
      
      const currentAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      const updatedAssignments = currentAssignments.filter(a => a._id !== id);
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      
      showNotification('Assignment deleted successfully!', 'success');
      onDataUpdate();
    }
  };

  // View Assignment Details
  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  // View Submissions
  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentSubmissions(assignment.submissions || []);
    setShowSubmissionsModal(true);
  };

  // Grade Submission
  const handleGradeSubmission = async (submissionId, marks, feedback) => {
    if (!selectedAssignment) return;
    
    try {
      const response = await fetch(
        `${API_BASE}/api/assignments/${selectedAssignment._id}/submissions/${submissionId}/grade`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ marks, feedback })
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          const updatedSubmissions = assignmentSubmissions.map(sub => 
            sub.studentId === submissionId 
              ? { ...sub, marks, feedback, status: 'graded' } 
              : sub
          );
          setAssignmentSubmissions(updatedSubmissions);
          
          // Update assignments list
          setAssignments(prev => prev.map(a => 
            a._id === selectedAssignment._id 
              ? { 
                  ...a, 
                  submissions: updatedSubmissions,
                  submittedCount: updatedSubmissions.filter(s => s.status === 'graded' || s.status === 'submitted').length
                } 
              : a
          ));
          
          showNotification('Submission graded successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      showNotification('Error grading submission', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      assignedTo: 'all',
      studentId: '',
      class: '',
      teacherId: '',
      dueDate: '',
      totalMarks: '100',
      instructions: ''
    });
    setEditingAssignment(null);
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus !== 'all' && assignment.status !== filterStatus) return false;
    if (filterTeacher !== 'all' && assignment.teacherId !== filterTeacher) return false;
    if (filterClass !== 'all' && assignment.class !== filterClass) return false;
    if (filterSubject !== 'all' && assignment.subject !== filterSubject) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        assignment.title?.toLowerCase().includes(term) ||
        assignment.description?.toLowerCase().includes(term) ||
        assignment.subject?.toLowerCase().includes(term) ||
        assignment.teacherName?.toLowerCase().includes(term) ||
        (assignment.studentName && assignment.studentName.toLowerCase().includes(term))
      );
    }
    
    return true;
  });

  // Calculate statistics
  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    pending: assignments.filter(a => a.status === 'pending').length,
    totalSubmissions: assignments.reduce((sum, a) => sum + (a.submittedCount || 0), 0),
    gradedSubmissions: assignments.reduce((sum, a) => sum + 
      (a.submissions?.filter(s => s.status === 'graded').length || 0), 0),
    overdue: assignments.filter(a => {
      if (a.status === 'completed') return false;
      return new Date(a.dueDate) < new Date();
    }).length
  };

  const calculateSubmissionRate = (assignment) => {
    if (!assignment.totalStudents || assignment.totalStudents === 0) return 0;
    return Math.round(((assignment.submittedCount || 0) / assignment.totalStudents) * 100);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-orange-800 mb-2">Assignment Management</h1>
            <p className="text-orange-600 text-sm md:text-base">Create and manage assignments for students</p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span className="text-sm md:text-base">Create Assignment</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Total Assignments</p>
                <p className="text-2xl font-bold text-orange-800">{stats.total}</p>
              </div>
              <BookOpen className="text-orange-500" size={20} />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Submissions</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalSubmissions}</p>
              </div>
              <FileText className="text-green-500" size={20} />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Graded</p>
                <p className="text-2xl font-bold text-blue-800">{stats.gradedSubmissions}</p>
              </div>
              <CheckCircle className="text-blue-500" size={20} />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-800">{stats.overdue}</p>
              </div>
              <AlertCircle className="text-red-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assignments by title, subject, or teacher..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50"
              value={searchTerm}
              readOnly
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-gray-800 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-gray-800 text-sm"
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
            >
              <option value="all">All Teachers</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-gray-800 text-sm"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-gray-800 text-sm"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Assignments ({filteredAssignments.length})
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Showing {Math.min(indexOfFirstItem + 1, filteredAssignments.length)}-
            {Math.min(indexOfLastItem, filteredAssignments.length)} of {filteredAssignments.length}
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* ASSIGNMENTS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((assignment) => (
                <tr key={assignment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{assignment.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      {assignment.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{assignment.teacherName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <p className={`text-xs ${
                        new Date(assignment.dueDate) < new Date() 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}>
                        {new Date(assignment.dueDate) < new Date() 
                          ? 'Overdue' 
                          : `${Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      assignment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : assignment.status === 'completed' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {assignment.submittedCount || 0}/{assignment.totalStudents || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          {calculateSubmissionRate(assignment)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${calculateSubmissionRate(assignment)}%` }}
                        ></div>
                      </div>
                      {assignment.submissions && assignment.submissions.length > 0 && (
                        <button
                          onClick={() => handleViewSubmissions(assignment)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View {assignment.submissions.length} submission(s)
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewAssignment(assignment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NO ASSIGNMENTS MESSAGE */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-orange-200">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg mb-2">
            {assignments.length === 0 
              ? "No assignments found. Create your first assignment!" 
              : "No assignments match your search criteria."
            }
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Your First Assignment
          </button>
        </div>
      )}

      {/* ADD ASSIGNMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Plus className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Create New Assignment</h2>
                    <p className="text-gray-600 text-sm">Add a new assignment for students</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Algebra Homework"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe the assignment..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select Subject</option>
                      {uniqueSubjects.filter(s => s !== 'All Subjects').map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher *
                    </label>
                    <select
                      value={formData.teacherId}
                      onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="assign-all"
                        name="assignedTo"
                        value="all"
                        checked={formData.assignedTo === 'all'}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        className="text-orange-500"
                      />
                      <label htmlFor="assign-all" className="text-sm text-gray-700">
                        All Students
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="assign-class"
                        name="assignedTo"
                        value="specific-class"
                        checked={formData.assignedTo === 'specific-class'}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        className="text-orange-500"
                      />
                      <label htmlFor="assign-class" className="text-sm text-gray-700">
                        Specific Class
                      </label>
                    </div>
                    {formData.assignedTo === 'specific-class' && (
                      <select
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Class</option>
                        {uniqueClasses.filter(c => c !== 'All Classes').map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="assign-student"
                        name="assignedTo"
                        value="specific-student"
                        checked={formData.assignedTo === 'specific-student'}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        className="text-orange-500"
                      />
                      <label htmlFor="assign-student" className="text-sm text-gray-700">
                        Specific Student
                      </label>
                    </div>
                    {formData.assignedTo === 'specific-student' && (
                      <select
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Student</option>
                        {students.map(student => (
                          <option key={student._id} value={student._id}>
                            {student.name} - {student.class}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any specific instructions for students..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ASSIGNMENT MODAL */}
      {showEditModal && editingAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Edit2 className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Edit Assignment</h2>
                    <p className="text-gray-600 text-sm">Update assignment details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-6">
                {/* Same form fields as Add Modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      {uniqueSubjects.filter(s => s !== 'All Subjects').map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher *
                    </label>
                    <select
                      value={formData.teacherId}
                      onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      {teachers.map(teacher => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Rest of the form fields... */}
                {/* Same as Add Modal */}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ASSIGNMENT MODAL */}
      {showViewModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedAssignment.title}</h2>
                    <p className="text-gray-600 text-sm">{selectedAssignment.subject}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-800">{selectedAssignment.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teacher</p>
                    <p className="text-gray-800">{selectedAssignment.teacherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="text-gray-800">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Marks</p>
                    <p className="text-gray-800">{selectedAssignment.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedAssignment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedAssignment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submissions</p>
                    <p className="text-gray-800">
                      {selectedAssignment.submittedCount || 0}/{selectedAssignment.totalStudents || 0} students
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedAssignment.instructions && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions</h4>
                  <p className="text-gray-600">{selectedAssignment.instructions}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SUBMISSIONS MODAL */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Submissions for {selectedAssignment.title}</h2>
                  <p className="text-gray-600 text-sm">
                    Total: {assignmentSubmissions.length} submission(s)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmissionsModal(false);
                    setSelectedAssignment(null);
                    setAssignmentSubmissions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {assignmentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {assignmentSubmissions.map((submission, index) => (
                    <div key={submission.studentId || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-800">{submission.studentName}</p>
                          <p className="text-sm text-gray-500">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          submission.status === 'graded' 
                            ? 'bg-green-100 text-green-800' 
                            : submission.status === 'submitted' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">File:</span> 
                          <a 
                            href={submission.file} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline ml-2"
                          >
                            {submission.file}
                          </a>
                        </p>
                        {submission.remarks && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Remarks:</span> {submission.remarks}
                          </p>
                        )}
                      </div>
                      
                      {submission.status === 'submitted' && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Grade Submission</p>
                          <div className="flex items-center space-x-3">
                            <input
                              type="number"
                              id={`marks-${submission.studentId}`}
                              placeholder="Marks"
                              className="px-3 py-2 border border-gray-300 rounded-lg w-24"
                              max={selectedAssignment.totalMarks}
                              min="0"
                            />
                            <input
                              type="text"
                              id={`feedback-${submission.studentId}`}
                              placeholder="Feedback"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                              onClick={() => {
                                const marks = parseInt(document.getElementById(`marks-${submission.studentId}`).value);
                                const feedback = document.getElementById(`feedback-${submission.studentId}`).value;
                                if (marks && marks >= 0 && marks <= selectedAssignment.totalMarks) {
                                  handleGradeSubmission(submission.studentId, marks, feedback);
                                } else {
                                  alert('Please enter valid marks');
                                }
                              }}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              Grade
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {submission.status === 'graded' && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Marks: <span className="text-green-600 font-bold">{submission.marks}</span> / {selectedAssignment.totalMarks}
                              </p>
                              {submission.feedback && (
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Feedback:</span> {submission.feedback}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                document.getElementById(`marks-${submission.studentId}`).value = '';
                                document.getElementById(`feedback-${submission.studentId}`).value = '';
                                submission.status = 'submitted';
                                handleGradeSubmission(submission.studentId, null, '');
                              }}
                              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                            >
                              Regrade
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No submissions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;