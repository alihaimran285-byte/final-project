import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, Users, Award, BookOpen, Clock } from 'lucide-react';
import Notification from '../../../Notification';

// Import components
import TeacherCard from './TeacherCard';
import AddTeacherModal from './AddTeacherModel';
import EditTeacherModal from './EditTeacherModel';
import DeleteTeacherModal from './DeleteTeacherModel';

const TeacherManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [notification, setNotification] = useState({
    message: '', type: 'success', visible: false
  });

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/teachers");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setTeachers(result.data);
      } else {
        throw new Error(result.error || 'Failed to load teachers');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showNotification("Failed to load teachers: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      setLoading(true);
      const teacherRequestData = {
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        subject: teacherData.subject,
        classes: teacherData.classes || 1,
        experience: teacherData.experience || 0,
        totalStudents: teacherData.totalStudents || 0,
        rating: teacherData.rating || 4.5,
        schedule: teacherData.schedule || '',
        status: teacherData.status || 'active',
        joinDate: teacherData.joinDate || new Date().toISOString()
      };

      const response = await fetch('http://localhost:3000/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherRequestData)
      });

      const result = await response.json();
      if (result.success) {
        setShowAddModal(false);
        showNotification("Teacher added successfully!", "success");
        await fetchTeachers();
      } else {
        showNotification(result.error || "Failed to add teacher", "error");
      }
    } catch (error) {
      showNotification("Network error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = async (teacherData) => {
    try {
      setLoading(true);
      const updatedTeacherData = {
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        subject: teacherData.subject,
        classes: teacherData.classes || 1,
        experience: teacherData.experience || 0,
        schedule: teacherData.schedule || '',
        status: teacherData.status || 'active'
      };

      const response = await fetch(`http://localhost:3000/api/teachers/${selectedTeacher._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTeacherData)
      });

      const result = await response.json();
      if (result.success) {
        setShowEditModal(false);
        setSelectedTeacher(null);
        showNotification("Teacher updated successfully!", "success");
        await fetchTeachers();
      } else {
        showNotification(result.error || "Failed to update teacher", "error");
      }
    } catch (error) {
      showNotification("Error updating teacher: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/teachers/${selectedTeacher._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setShowDeleteModal(false);
        setSelectedTeacher(null);
        showNotification("Teacher deleted successfully!", "success");
        fetchTeachers();
      } else {
        showNotification(result.error || "Delete failed", "error");
      }
    } catch (error) {
      showNotification("Error deleting teacher", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher({ ...teacher });
    setShowEditModal(true);
  };

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSubjectFilter('All');
    setStatusFilter('All');
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'All' || teacher.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || teacher.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const uniqueSubjects = ['All', ...new Set(teachers.map(t => t.subject).filter(Boolean))];
  const uniqueStatuses = ['All', 'Active', 'Inactive', 'On Leave'];

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-6">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />

      {/* Header & Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-orange-800">Teacher Management</h1>
            <p className="text-orange-600">Manage all teachers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <button onClick={fetchTeachers} disabled={loading} className="flex items-center gap-2 px-4 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 disabled:opacity-50">
              <RefreshCw size={18} /> Refresh
            </button>
            <button onClick={() => setShowAddModal(true)} disabled={loading} className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50">
              <Plus size={18} /> Add Teacher
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-sm text-orange-600">Total Teachers</p><p className="text-2xl font-bold text-orange-800">{teachers.length}</p></div>
            <Users className="text-orange-600" size={32} />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-sm text-green-600">Active</p><p className="text-2xl font-bold text-green-800">{teachers.filter(t => t.status === 'active').length}</p></div>
            <Award className="text-green-600" size={32} />
          </div>

          {/* YEHI SIRF FIX KIYA HAI - AB BEHAR NAHI JAYEGA */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Unique Classes</p>
              <p className="text-2xl font-bold text-blue-800">
                {new Set(teachers.flatMap(t => Array.isArray(t.classes) ? t.classes : [])).size}
              </p>
            </div>
            <BookOpen className="text-blue-600" size={32} />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-sm text-purple-600">Avg Experience</p><p className="text-2xl font-bold text-purple-800">{teachers.length > 0 ? (teachers.reduce((t, c) => t + (c.experience || 0), 0) / teachers.length).toFixed(1) : '0.0'} yrs</p></div>
            <Clock className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none">
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none">
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={16} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[1fr]">
        {filteredTeachers.map((teacher) => (
          <div key={teacher._id} className="h-full">
            <TeacherCard
              teacher={teacher}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-orange-200 mt-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-orange-500" />
          </div>
          <p className="text-gray-500 text-lg mb-2">
            {teachers.length === 0 
              ? "No teachers found. Add your first teacher!" 
              : "No teachers match your search criteria."
            }
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add Your First Teacher
          </button>
        </div>
      )}

      {/* Modals */}
      <AddTeacherModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddTeacher} loading={loading} />
      <EditTeacherModal isOpen={showEditModal} teacher={selectedTeacher} onClose={() => { setShowEditModal(false); setSelectedTeacher(null); }} onSave={handleEditTeacher} loading={loading} />
      <DeleteTeacherModal isOpen={showDeleteModal} teacher={selectedTeacher} onClose={() => { setShowDeleteModal(false); setSelectedTeacher(null); }} onConfirm={handleDeleteTeacher} loading={loading} />

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;