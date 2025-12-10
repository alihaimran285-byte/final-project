// components/students/StudentModals.jsx - COMPLETE VERSION
import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Book, Users, UserCheck, Hash, Pencil, Calendar, Lock, FileText } from 'lucide-react';

// ======================= ADD STUDENT MODAL =======================
export const AddStudentModalUI = ({
  setShowAddModal,
  newStudent,
  setNewStudent,
  addStudent,
  teachers = [],
  loading = false
}) => {
  const [errors, setErrors] = useState({});
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Initialize newStudent properly
  useEffect(() => {
    if (!newStudent || Object.keys(newStudent).length === 0) {
      const today = new Date().toISOString().split('T')[0];
      setNewStudent({
        name: '',
        email: '',
        rollNo: '',
        class: '',
        phone: '',
        parentName: '',
        parentPhone: '',
        address: '',
        gender: 'Male',
        enrollmentDate: today,
        status: 'active',
        isRegistered: false,
        password: '',
        assignedTeachers: []
      });
    }
  }, []);

  // ✅ Initialize selectedTeachers from newStudent
  useEffect(() => {
    if (newStudent?.assignedTeachers && newStudent.assignedTeachers.length > 0) {
      const teacherIds = newStudent.assignedTeachers.map(t => t.teacherId);
      const matchedTeachers = teachers.filter(t => 
        teacherIds.includes(t._id) || teacherIds.includes(t.id)
      );
      setSelectedTeachers(matchedTeachers);
    }
  }, [teachers, newStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTeacherSelect = (teacher) => {
    if (loading) return;
    
    if (!teacher || (!teacher._id && !teacher.id)) {
      console.warn('Invalid teacher object:', teacher);
      return;
    }

    const teacherId = teacher._id || teacher.id;
    const isSelected = selectedTeachers.some(t => 
      (t._id === teacherId || t.id === teacherId)
    );
    
    let updatedTeachers;
    if (isSelected) {
      updatedTeachers = selectedTeachers.filter(t => 
        t._id !== teacherId && t.id !== teacherId
      );
    } else {
      updatedTeachers = [...selectedTeachers, teacher];
    }
    
    setSelectedTeachers(updatedTeachers);

    // ✅ Update assignedTeachers correctly
    const assignedTeachersData = updatedTeachers.map(t => ({
      teacherId: t._id || t.id,
      teacherName: t.name || 'Unknown Teacher',
      subject: t.subject || 'General'
    }));

    setNewStudent(prev => ({
      ...prev,
      assignedTeachers: assignedTeachersData
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newStudent?.name?.trim()) newErrors.name = 'Name is required';
    if (!newStudent?.email?.trim()) newErrors.email = 'Email is required';
    if (!newStudent?.rollNo?.trim()) newErrors.rollNo = 'Roll number is required';
    if (!newStudent?.class?.trim()) newErrors.class = 'Class is required';
    if (newStudent?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      newErrors.email = 'Invalid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ Final check before submitting
    const finalStudentData = {
      ...newStudent,
      assignedTeachers: selectedTeachers.map(t => ({
        teacherId: t._id || t.id,
        teacherName: t.name || 'Unknown Teacher',
        subject: t.subject || 'General'
      }))
    };
    
    console.log('Submitting student with all data:', finalStudentData);
    
    if (!validateForm()) return;
    addStudent(finalStudentData);
  };

  const grades = [
    "12th Grade", "11th Grade", "10th Grade", "9th Grade", 
    "8th Grade", "7th Grade", "6th Grade", "5th Grade", 
    "4th Grade", "3rd Grade", "2nd Grade", "1st Grade"
  ];

  const genders = ["Male", "Female", "Other"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Add New Student</h2>
            <button 
              onClick={() => setShowAddModal(false)} 
              disabled={loading}
              className="hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="text-white" size={28} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-700">
              <User size={20} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Full Name *</label>
                <input 
                  name="name" 
                  value={newStudent?.name || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                  required 
                  disabled={loading}
                  placeholder="Enter student name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-1">Email *</label>
                <input 
                  name="email" 
                  type="email" 
                  value={newStudent?.email || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                  required 
                  disabled={loading}
                  placeholder="student@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-1">Roll Number *</label>
                <input 
                  name="rollNo" 
                  value={newStudent?.rollNo || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                  required 
                  disabled={loading}
                  placeholder="e.g., 101"
                />
                {errors.rollNo && <p className="text-red-500 text-sm mt-1">{errors.rollNo}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-1">Class *</label>
                <select 
                  name="class" 
                  value={newStudent?.class || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                  required 
                  disabled={loading}
                >
                  <option value="">Select Class</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-1">Phone</label>
                <input 
                  name="phone" 
                  value={newStudent?.phone || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                  disabled={loading}
                  placeholder="03001234567"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={newStudent?.gender || 'Male'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                  disabled={loading}
                >
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-700">
              <Book size={20} />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Enrollment Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    name="enrollmentDate" 
                    type="date" 
                    value={newStudent?.enrollmentDate || ''} 
                    onChange={handleChange} 
                    className="w-full pl-12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    required 
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Status</label>
                <select 
                  name="status" 
                  value={newStudent?.status || 'active'} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700">
              <UserCheck size={20} />
              Parent Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                name="parentName" 
                value={newStudent?.parentName || ''} 
                onChange={handleChange} 
                placeholder="Parent Name" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                disabled={loading}
              />
              <input 
                name="parentPhone" 
                value={newStudent?.parentPhone || ''} 
                onChange={handleChange} 
                placeholder="Parent Phone" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                disabled={loading}
              />
              <input 
                name="address" 
                value={newStudent?.address || ''} 
                onChange={handleChange} 
                placeholder="Address" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                disabled={loading}
              />
            </div>
          </div>

          {/* Registration Information */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-purple-700">
              <FileText size={20} />
              Registration Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Registration Status</label>
                <select 
                  name="isRegistered" 
                  value={newStudent?.isRegistered ? 'true' : 'false'} 
                  onChange={(e) => setNewStudent(prev => ({ 
                    ...prev, 
                    isRegistered: e.target.value === 'true' 
                  }))} 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="false">Not Registered</option>
                  <option value="true">Registered</option>
                </select>
              </div>
              
              {newStudent?.isRegistered && (
                <div>
                  <label className="block font-medium mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={newStudent?.password || ''} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" 
                      placeholder="Set password for student"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teachers Assignment */}
          {Array.isArray(teachers) && teachers.length > 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-yellow-700">
                <Users size={20} />
                Assign Teachers ({selectedTeachers.length} selected)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teachers.map(teacher => {
                  if (!teacher || (!teacher._id && !teacher.id)) return null;
                  
                  const teacherId = teacher._id || teacher.id;
                  const isSelected = selectedTeachers.some(t => 
                    (t._id === teacherId || t.id === teacherId)
                  );
                  
                  return (
                    <div
                      key={teacherId}
                      onClick={() => handleTeacherSelect(teacher)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-yellow-100 border-yellow-500 shadow-md' 
                          : 'border-gray-300 hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                    >
                      <strong className="block text-gray-800">
                        {teacher.name || 'Unknown Teacher'}
                      </strong>
                      <small className="text-gray-600">
                        {teacher.subject || 'General'}
                      </small>
                      <div className="mt-1 text-xs text-gray-500">
                        {isSelected ? '✓ Selected' : 'Click to select'}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Show selected teachers summary */}
              {selectedTeachers.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                  <p className="font-medium text-sm text-yellow-800 mb-2">
                    Selected Teachers ({selectedTeachers.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeachers.map(teacher => (
                      <span 
                        key={teacher._id || teacher.id}
                        className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <Users size={12} />
                        {teacher.name} ({teacher.subject || 'General'})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-gray-300 rounded-lg text-center text-gray-500">
              <Users className="mx-auto mb-2" size={24} />
              <p>No teachers available to assign</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)} 
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg transition" 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================= EDIT MODAL =======================
export const EditModalUI = ({ 
  activeModal, 
  students, 
  teachers = [], 
  setActiveModal, 
  editStudent, 
  loading = false 
}) => {
  const student = students.find(s => 
    s._id === activeModal.data || s.id === activeModal.data
  );
  
  if (!student) {
    console.error('Student not found for editing');
    return null;
  }

  const [editData, setEditData] = useState({ 
    ...student, 
    class: student.class || student.grade,
    assignedTeachers: student.assignedTeachers || [],
    isRegistered: student.isRegistered || false,
    password: student.password || ''
  });
  
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (student?.assignedTeachers && teachers.length > 0) {
      const matchedTeachers = teachers.filter(t => 
        student.assignedTeachers.some(st => 
          st.teacherId === t._id || st.teacherId === t.id
        )
      );
      setSelectedTeachers(matchedTeachers);
    }
  }, [student, teachers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeacherToggle = (teacher) => {
    if (!teacher || (!teacher._id && !teacher.id)) return;
    
    const teacherId = teacher._id || teacher.id;
    const isSelected = selectedTeachers.some(t => 
      (t._id === teacherId || t.id === teacherId)
    );
    
    let updatedTeachers;
    if (isSelected) {
      updatedTeachers = selectedTeachers.filter(t => 
        t._id !== teacherId && t.id !== teacherId
      );
    } else {
      updatedTeachers = [...selectedTeachers, teacher];
    }
    
    setSelectedTeachers(updatedTeachers);
    
    // Update assignedTeachers in editData
    const assignedTeachersData = updatedTeachers.map(t => ({
      teacherId: t._id || t.id,
      teacherName: t.name || 'Unknown Teacher',
      subject: t.subject || 'General'
    }));
    
    setEditData(prev => ({
      ...prev,
      assignedTeachers: assignedTeachersData
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalData = {
      ...editData,
      assignedTeachers: selectedTeachers.map(t => ({
        teacherId: t._id || t.id,
        teacherName: t.name || 'Unknown Teacher',
        subject: t.subject || 'General'
      }))
    };
    
    console.log('Editing student with all data:', finalData);
    editStudent(finalData);
  };

  const grades = [
    "12th Grade", "11th Grade", "10th Grade", "9th Grade", 
    "8th Grade", "7th Grade", "6th Grade", "5th Grade", 
    "4th Grade", "3rd Grade", "2nd Grade", "1st Grade"
  ];

  const genders = ["Male", "Female", "Other"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-600 p-6 text-white rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Student</h2>
          <button 
            onClick={() => setActiveModal({ type: null })}
            className="hover:bg-white/20 p-2 rounded-full transition"
            disabled={loading}
          >
            <X size={28}/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-green-700">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Full Name *</label>
                <input 
                  name="name" 
                  value={editData.name || ''} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  required 
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Email *</label>
                <input 
                  name="email" 
                  type="email" 
                  value={editData.email || ''} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  required 
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Roll Number *</label>
                <input 
                  name="rollNo" 
                  value={editData.rollNo || ''} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  required 
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Class *</label>
                <select 
                  value={editData.class || ''} 
                  onChange={e => handleChange({target: {name: 'class', value: e.target.value}})} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                >
                  <option value="">Select Class</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Phone</label>
                <input 
                  name="phone" 
                  value={editData.phone || ''} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={editData.gender || 'Male'} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                >
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-blue-700">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Enrollment Date</label>
                <input 
                  name="enrollmentDate" 
                  type="date" 
                  value={editData.enrollmentDate || ''} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Status</label>
                <select 
                  name="status" 
                  value={editData.status || 'active'} 
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                name="parentName" 
                value={editData.parentName || ''} 
                onChange={handleChange} 
                placeholder="Parent Name" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                disabled={loading}
              />
              <input 
                name="parentPhone" 
                value={editData.parentPhone || ''} 
                onChange={handleChange} 
                placeholder="Parent Phone" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                disabled={loading}
              />
              <input 
                name="address" 
                value={editData.address || ''} 
                onChange={handleChange} 
                placeholder="Address" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Registration Information */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-purple-700">Registration Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Registration Status</label>
                <select 
                  value={editData.isRegistered ? 'true' : 'false'} 
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    isRegistered: e.target.value === 'true' 
                  }))} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="false">Not Registered</option>
                  <option value="true">Registered</option>
                </select>
              </div>
              
              {editData.isRegistered && (
                <div>
                  <label className="block font-medium mb-1">Password</label>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={editData.password || ''} 
                      onChange={handleChange} 
                      className="w-full p-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Update password"
                    />
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teachers Assignment */}
          {Array.isArray(teachers) && teachers.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-orange-700">
                Assign Teachers ({selectedTeachers.length} selected)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teachers.map(teacher => {
                  if (!teacher || (!teacher._id && !teacher.id)) return null;
                  
                  const teacherId = teacher._id || teacher.id;
                  const isSelected = selectedTeachers.some(t => 
                    (t._id === teacherId || t.id === teacherId)
                  );
                  
                  return (
                    <div
                      key={teacherId}
                      onClick={() => !loading && handleTeacherToggle(teacher)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-orange-100 border-orange-500 shadow-md' 
                          : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <strong className="block text-gray-800">
                        {teacher.name || 'Unknown Teacher'}
                      </strong>
                      <small className="text-gray-600">
                        {teacher.subject || 'General'}
                      </small>
                      <div className="mt-1 text-xs text-gray-500">
                        {isSelected ? '✓ Selected' : 'Click to select'}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedTeachers.length > 0 && (
                <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <p className="font-medium text-sm text-orange-800 mb-2">
                    Selected Teachers ({selectedTeachers.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeachers.map(teacher => (
                      <span 
                        key={teacher._id || teacher.id}
                        className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <Users size={12} />
                        {teacher.name} ({teacher.subject || 'General'})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={() => setActiveModal({ type: null })} 
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Rest of the code (DeleteModalUI and StudentModals) remains the same...
// ======================= DELETE MODAL =======================
export const DeleteModalUI = ({ 
  activeModal, 
  students, 
  deleteStudent, 
  setActiveModal, 
  loading 
}) => {
  const student = students.find(s => 
    s._id === activeModal.data || s.id === activeModal.data
  );
  
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="text-red-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Delete Student?</h2>
        <p className="text-gray-600 mb-2">Are you sure you want to delete:</p>
        <p className="font-bold text-lg mb-4">{student.name}?</p>
        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setActiveModal({ type: null })} 
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={() => deleteStudent(student._id || student.id)} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================= MAIN EXPORT =======================
const StudentModals = (props) => {
  return (
    <>
      {props.showAddModal && <AddStudentModalUI {...props} />}
      {props.activeModal?.type === 'edit' && <EditModalUI {...props} />}
      {props.activeModal?.type === 'delete' && <DeleteModalUI {...props} />}
    </>
  );
};

export default StudentModals;