// components/students/StudentManagement.jsx - FINAL VERSION
import React, { useState, useEffect } from 'react';
import { Plus } from "lucide-react";
import Notification from '../../../Notification';
import StudentHeader from "./StudentHeader";
import StudentFilters from './StudentFilters';
import StudentsList from './StudentsList';
import StudentModals from './StudentModel';

const StudentManagement = ({ students, teachers = [], onDataUpdate, searchTerm }) => {
  const [localStudents, setLocalStudents] = useState([]);
  const [localTeachers, setLocalTeachers] = useState([]);
  const [searchText, setSearchText] = useState(searchTerm || "");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeModal, setActiveModal] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(false);

  // ✅ Complete newStudent state with all backend fields
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    class: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: '',
    gender: 'Male',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active',
    isRegistered: false,
    password: '',
    assignedTeachers: []
  });

  const [notification, setNotification] = useState({ 
    message: '', 
    type: 'success', 
    visible: false 
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  useEffect(() => {
    if (students) setLocalStudents(students);
    if (teachers) setLocalTeachers(teachers);
    if (searchTerm !== undefined) setSearchText(searchTerm);
  }, [students, teachers, searchTerm]);

  // ✅ Reset newStudent when modal opens
  useEffect(() => {
    if (showAddModal) {
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
  }, [showAddModal]);

  // ✅ ADD STUDENT - Complete with all backend fields
  const addStudent = async (studentData) => {
    try {
      setLoading(true);

      // Format assignedTeachers correctly
      const assignedTeachersFormatted = (studentData.assignedTeachers || []).map(t => ({
        teacherId: t.teacherId || t._id,
        teacherName: t.teacherName || t.name,
        subject: t.subject || "General"
      }));

      // Create complete payload matching backend structure
      const payload = {
        name: studentData.name,
        email: studentData.email,
        rollNo: studentData.rollNo,
        class: studentData.class,
        phone: studentData.phone || "",
        parentName: studentData.parentName || "",
        parentPhone: studentData.parentPhone || "",
        address: studentData.address || "",
        gender: studentData.gender || "Male",
        enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
        status: studentData.status || "active",
        isRegistered: studentData.isRegistered || false,
        password: studentData.password || null,
        registrationDate: studentData.isRegistered ? new Date().toISOString() : null,
        assignedTeachers: assignedTeachersFormatted
      };

      console.log('📤 Sending complete student data:', payload);

      const res = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to add student");
      }

      console.log('✅ Student added successfully:', result.data);

      showNotification("Student added successfully!", "success");
      setShowAddModal(false);
      setLocalStudents(prev => [...prev, result.data]);
      
      // Reset form
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
      
      if (onDataUpdate) onDataUpdate();

    } catch (err) {
      console.error('❌ Add student error:', err);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT STUDENT - Complete with all backend fields
  const editStudent = async (studentData) => {
    try {
      setLoading(true);

      // Format assignedTeachers correctly
      const assignedTeachersFormatted = (studentData.assignedTeachers || []).map(t => ({
        teacherId: t.teacherId || t._id,
        teacherName: t.teacherName || t.name,
        subject: t.subject || "General"
      }));

      // Create complete payload
      const payload = {
        name: studentData.name,
        email: studentData.email,
        rollNo: studentData.rollNo,
        class: studentData.class,
        phone: studentData.phone || "",
        parentName: studentData.parentName || "",
        parentPhone: studentData.parentPhone || "",
        address: studentData.address || "",
        gender: studentData.gender || "Male",
        enrollmentDate: studentData.enrollmentDate,
        status: studentData.status || "active",
        isRegistered: studentData.isRegistered || false,
        password: studentData.password || null,
        registrationDate: studentData.isRegistered ? (studentData.registrationDate || new Date().toISOString()) : null,
        assignedTeachers: assignedTeachersFormatted
      };

      console.log('📤 Updating student with complete data:', payload);

      const res = await fetch(`http://localhost:3000/api/students/${studentData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Update failed");
      }

      console.log('✅ Student updated successfully:', result.data);

      showNotification("Student updated successfully!", "success");
      setActiveModal({ type: null, data: null });
      setLocalStudents(prev => 
        prev.map(s => s._id === studentData._id ? result.data : s)
      );
      
      if (onDataUpdate) onDataUpdate();

    } catch (err) {
      console.error('❌ Edit student error:', err);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE STUDENT
  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      
      console.log('🗑️ Deleting student:', id);
      
      const res = await fetch(`http://localhost:3000/api/students/${id}`, { 
        method: 'DELETE' 
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Delete failed");
      }
      
      console.log('✅ Student deleted successfully');
      
      showNotification("Student deleted successfully!", "success");
      setActiveModal({ type: null, data: null });
      setLocalStudents(prev => prev.filter(s => s._id !== id));
      
      if (onDataUpdate) onDataUpdate();
      
    } catch (err) {
      console.error('❌ Delete student error:', err);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter students
  const filteredStudents = localStudents.filter(s => {
    const search = searchText.toLowerCase();
    return (
      (!searchText || 
        s.name?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search) ||
        s.rollNo?.toLowerCase().includes(search) ||
        s.parentName?.toLowerCase().includes(search) ||
        s.address?.toLowerCase().includes(search)
      ) && 
      (selectedGrade === "All Grades" || s.class === selectedGrade)
    );
  });

  return (
    <div className="w-full p-6">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        isVisible={notification.visible} 
      />

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-lg font-medium">Please wait...</p>
          </div>
        </div>
      )}

      <StudentHeader students={localStudents} />
      
      <StudentFilters 
        searchText={searchText} 
        setSearchText={setSearchText} 
        selectedGrade={selectedGrade} 
        setSelectedGrade={setSelectedGrade} 
        students={localStudents} 
      />
      
      <StudentsList 
        students={filteredStudents} 
        setActiveModal={setActiveModal} 
      />
      
      <div className="mt-8 flex justify-end">
        <button 
          onClick={() => setShowAddModal(true)} 
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={24} /> 
          Add New Student
        </button>
      </div>

      {/* Pass all required props */}
      <StudentModals
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        students={filteredStudents}
        teachers={localTeachers}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        addStudent={addStudent}
        editStudent={editStudent}
        deleteStudent={deleteStudent}
        loading={loading}
      />
    </div>
  );
};

export default StudentManagement;