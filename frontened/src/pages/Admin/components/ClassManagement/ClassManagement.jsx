import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, BookOpen, Edit2, Trash2, BarChart3, Filter, X, User } from 'lucide-react';
import CreateClassModal from './CreateClassModal';
import EditClassModal from './EditClassModal';
import ClassCard from './ClassCard';
import Notification from '../../../Notification';
import ClassStatistics from './ClassStatistics';
import DeleteConfirmationModal from './DeleteConfirmModal';

const ClassManagement = ({ classes, students, teachers, searchTerm, onDataUpdate }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [searchText, setSearchText] = useState(searchTerm || '');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // Default to list view only
  
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    visible: false
  });

  const [localClasses, setLocalClasses] = useState([]);
  const [localStudents, setLocalStudents] = useState([]);

  useEffect(() => {
    if (classes && Array.isArray(classes)) {
      setLocalClasses(classes);
    } else {
      setLocalClasses([]);
    }
  }, [classes]);

  useEffect(() => {
    if (students && Array.isArray(students)) {
      setLocalStudents(students);
    } else {
      setLocalStudents([]);
    }
  }, [students]);

  useEffect(() => {
    if (searchTerm !== undefined) {
      setSearchText(searchTerm);
    }
  }, [searchTerm]);

  // ✅ Schedule formatting function
  const formatScheduleDisplay = (schedule) => {
    if (!schedule) return 'No schedule';
    
    if (typeof schedule === 'string') {
      return schedule.length > 30 ? schedule.substring(0, 27) + '...' : schedule;
    }
    
    if (typeof schedule === 'object') {
      try {
        // Check for weekdays schedule
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const hasWeekday = weekdays.some(day => schedule[day]);
        
        if (hasWeekday) {
          const daysWithClasses = weekdays.filter(day => 
            schedule[day] && 
            (Array.isArray(schedule[day]) ? schedule[day].length > 0 : schedule[day].toString().trim() !== '')
          );
          
          if (daysWithClasses.length > 0) {
            return `${daysWithClasses.length} days/week`;
          }
        }
        
        // For other objects, show simple message
        return 'Schedule set';
      } catch (error) {
        return 'Schedule available';
      }
    }
    
    return 'Schedule info';
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
  };

  const hideNotification = () => {
    setNotification({ ...notification, visible: false });
  };

  // ✅ STUDENT MANAGEMENT FUNCTIONS
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  // Open add student modal
  const openAddStudentModal = (classItem) => {
    setSelectedClass(classItem);
    
    // Filter students that are not already in this class
    const currentStudentIds = classItem.studentIds || [];
    const filteredStudents = localStudents.filter(student => 
      !currentStudentIds.includes(student._id || student.id)
    );
    
    setAvailableStudents(filteredStudents);
    setSelectedStudents([]);
    setShowAddStudentModal(true);
  };

  // Add students to class
  const handleAddStudents = async () => {
    if (!selectedClass || selectedStudents.length === 0) return;

    try {
      setLoading(true);
      
      const classId = selectedClass._id || selectedClass.id;
      const studentIds = selectedStudents.map(s => s._id || s.id);
      
      console.log('📤 Adding students to class:', {
        classId,
        studentIds,
        selectedStudents: selectedStudents.map(s => s.name)
      });

      // Update localStorage
      const storedClasses = JSON.parse(localStorage.getItem('schoolClasses') || '[]');
      const updatedClasses = storedClasses.map(cls => {
        if (cls._id === classId || cls.id === classId) {
          const currentStudentIds = cls.studentIds || [];
          const newStudentIds = [...new Set([...currentStudentIds, ...studentIds])];
          return {
            ...cls,
            studentIds: newStudentIds,
            students: newStudentIds.length, // Update student count
            updatedAt: new Date().toISOString()
          };
        }
        return cls;
      });
      localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));

      // Try to update API
      try {
        await fetch(`http://localhost:3000/api/classes/${classId}/students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentIds })
        });
      } catch (apiError) {
        console.log('API Update failed, using localStorage only');
      }

      showNotification(`${selectedStudents.length} student(s) added to class!`, "success");
      setShowAddStudentModal(false);
      setSelectedClass(null);
      setSelectedStudents([]);
      
      if (onDataUpdate) {
        onDataUpdate();
      }

    } catch (error) {
      console.error('Error adding students:', error);
      showNotification("Error adding students to class", "error");
    } finally {
      setLoading(false);
    }
  };

  // Remove student from class
  const handleRemoveStudent = async (classId, studentId) => {
    try {
      setLoading(true);
      
      console.log('🗑️ Removing student:', { classId, studentId });

      // Update localStorage
      const storedClasses = JSON.parse(localStorage.getItem('schoolClasses') || '[]');
      const updatedClasses = storedClasses.map(cls => {
        if (cls._id === classId || cls.id === classId) {
          const currentStudentIds = cls.studentIds || [];
          const newStudentIds = currentStudentIds.filter(id => id !== studentId);
          return {
            ...cls,
            studentIds: newStudentIds,
            students: newStudentIds.length,
            updatedAt: new Date().toISOString()
          };
        }
        return cls;
      });
      localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));

      // Try to update API
      try {
        await fetch(`http://localhost:3000/api/classes/${classId}/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (apiError) {
        console.log('API Update failed, using localStorage only');
      }

      showNotification("Student removed from class!", "success");
      
      if (onDataUpdate) {
        onDataUpdate();
      }

    } catch (error) {
      console.error('Error removing student:', error);
      showNotification("Error removing student from class", "error");
    } finally {
      setLoading(false);
    }
  };

  // View class students
  const [showViewStudentsModal, setShowViewStudentsModal] = useState(false);
  const [classStudents, setClassStudents] = useState([]);

  const openViewStudentsModal = (classItem) => {
    setSelectedClass(classItem);
    
    // Get student details for this class
    const studentIds = classItem.studentIds || [];
    const studentsInClass = localStudents.filter(student => 
      studentIds.includes(student._id || student.id)
    );
    
    setClassStudents(studentsInClass);
    setShowViewStudentsModal(true);
  };

  // ✅ CREATE CLASS FUNCTION
  const handleCreateClass = async (newClass) => {
    try {
      setLoading(true);

      // Prepare data WITHOUT _id - let backend handle it
      const classData = {
        name: newClass.name.trim(),
        code: newClass.code.trim().toUpperCase(),
        teacher: newClass.teacher,
        grade: newClass.grade,
        subject: newClass.subject,
        schedule: newClass.schedule || "",
        room: newClass.room || "",
        capacity: newClass.capacity || 30,
        students: newClass.students || 0,
        studentIds: [] // Initialize empty student array
      };

      console.log('📤 Sending data to backend:', classData);

      // Save to API
      const response = await fetch('http://localhost:3000/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData)
      });

      const result = await response.json();
      console.log('📥 Backend response:', result);

      if (response.ok && result.success) {
        // Save to localStorage as backup
        const storedClasses = JSON.parse(localStorage.getItem('schoolClasses') || '[]');
        storedClasses.push({
          ...result.data,
          createdAt: new Date().toISOString(),
          studentIds: [] // Initialize empty student array
        });
        localStorage.setItem('schoolClasses', JSON.stringify(storedClasses));

        showNotification("✅ Class created successfully!", "success");
        setShowCreateModal(false);
        
        if (onDataUpdate) {
          onDataUpdate();
        }
      } else {
        // Show backend error message
        showNotification(result.error || "Failed to create class", "error");
        console.error('Backend error:', result);
      }

    } catch (error) {
      console.error('❌ Create class error:', error);
      showNotification("Network error. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT CLASS FUNCTION
  const handleEditClass = async (updatedClass) => {
    try {
      setLoading(true);

      if (!selectedClass) return;

      const classId = selectedClass._id || selectedClass.id;
      
      // Update localStorage
      const storedClasses = JSON.parse(localStorage.getItem('schoolClasses') || '[]');
      const updatedClasses = storedClasses.map(cls => 
        (cls._id === classId || cls.id === classId) 
          ? { 
              ...cls, 
              ...updatedClass, 
              updatedAt: new Date().toISOString(),
              // Keep existing studentIds
              studentIds: cls.studentIds || []
            }
          : cls
      );
      localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));

      // Try to update API
      try {
        await fetch(`http://localhost:3000/api/classes/${classId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedClass)
        });
      } catch (apiError) {
        console.log('API Update failed, using localStorage only');
      }

      showNotification("Class updated successfully!", "success");
      setShowEditModal(false);
      setSelectedClass(null);
      
      if (onDataUpdate) {
        onDataUpdate();
      }

    } catch (error) {
      console.error('Edit class error:', error);
      showNotification("Error updating class", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE CLASS FUNCTION
  const handleDeleteClass = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      console.log('🗑️ Deleting class:', selectedClass);

      const classId = selectedClass._id || selectedClass.id;
      
      if (!classId) {
        showNotification("Class ID is missing", "error");
        return;
      }

      console.log('🔍 Deleting class with ID:', classId);

      const response = await fetch(`http://localhost:3000/api/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📥 Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete failed:', errorText);
        throw new Error(`Delete failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Delete result:', result);

      if (result.success) {
        showNotification("✅ Class deleted successfully!", "success");
        setShowDeleteModal(false);
        setSelectedClass(null);
        
        setLocalClasses(prev => prev.filter(cls => 
          cls._id !== classId && cls.id !== classId
        ));
        
        if (onDataUpdate) {
          onDataUpdate();
        }
      } else {
        showNotification(result.error || "Failed to delete class", "error");
      }

    } catch (error) {
      console.error('❌ Delete class error:', error);
      showNotification(`Error: ${error.message}`, "error");
      if (selectedClass) {
        const classId = selectedClass._id || selectedClass.id;
        setLocalClasses(prev => prev.filter(cls => 
          cls._id !== classId && cls.id !== classId
        ));
        showNotification("Class removed from view (backend pending)", "warning");
        setShowDeleteModal(false);
        setSelectedClass(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open edit modal
  const openEditModal = (classItem) => {
    setSelectedClass(classItem);
    setShowEditModal(true);
  };

  // ✅ Open delete confirmation modal
  const openDeleteModal = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  // ✅ Open statistics modal
  const openStatistics = (classItem) => {
    setSelectedClass(classItem);
    setShowStatistics(true);
  };

  // ✅ Reset filters
  const resetFilters = () => {
    setSearchText('');
    setSubjectFilter('All Subjects');
    setGradeFilter('All Grades');
  };

  const filteredClasses = localClasses.filter(classItem => {
    const matchesSearch = 
      (classItem.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      classItem.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      classItem.teacher?.toLowerCase().includes(searchText.toLowerCase()) ||
      classItem.grade?.toLowerCase().includes(searchText.toLowerCase())) ||
      !searchText;
    
    const matchesSubject = 
      subjectFilter === 'All Subjects' || classItem.subject === subjectFilter;
    
    const matchesGrade = 
      gradeFilter === 'All Grades' || classItem.grade === gradeFilter;
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const uniqueSubjects = ['All Subjects', ...new Set(localClasses.map(c => c.subject).filter(Boolean))];
  const uniqueGrades = ['All Grades', ...new Set(localClasses.map(c => c.grade).filter(Boolean))];

  // ✅ Calculate statistics for statistics modal
  const calculateClassStats = () => {
    if (!selectedClass) return null;
    
    return {
      totalStudents: selectedClass.students || 0,
      assignments: selectedClass.assignments || 0,
      averageGrade: selectedClass.averageGrade || 'N/A',
      attendanceRate: selectedClass.attendanceRate || 'N/A'
    };
  };

  // ✅ Calculate overall statistics
  const overallStats = {
    totalClasses: localClasses.length,
    totalStudents: localClasses.reduce((total, cls) => total + (cls.students || 0), 0),
    subjectsCount: new Set(localClasses.map(c => c.subject)).size,
    averageStudents: localClasses.length > 0 
      ? Math.round(localClasses.reduce((total, cls) => total + (cls.students || 0), 0) / localClasses.length) 
      : 0
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={hideNotification}
      />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing...</p>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateClass}
        loading={loading}
        teachers={teachers || []}
        students={students || []}
      />

      <EditClassModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClass(null);
        }}
        onSave={handleEditClass}
        loading={loading}
        classData={selectedClass}
        teachers={teachers || []}
        students={students || []}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedClass(null);
        }}
        onConfirm={handleDeleteClass}
        loading={loading}
        itemName={selectedClass?.name || 'Class'}
      />

      <ClassStatistics
        isOpen={showStatistics}
        onClose={() => {
          setShowStatistics(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        stats={calculateClassStats()}
      />

      {/* Add Students Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Add Students to Class</h3>
                  <p className="text-gray-600 text-sm">Select students to add to {selectedClass?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setSelectedClass(null);
                    setSelectedStudents([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Students ({availableStudents.length})
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableStudents.map(student => (
                    <div key={student._id || student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.grade || 'Grade not specified'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!selectedStudents.find(s => (s._id || s.id) === (student._id || student.id))) {
                            setSelectedStudents(prev => [...prev, student]);
                          }
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedStudents.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Students ({selectedStudents.length})
                  </label>
                  <div className="space-y-2">
                    {selectedStudents.map(student => (
                      <div key={student._id || student.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.grade || 'Grade not specified'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStudents(prev => prev.filter(s => 
                              (s._id || s.id) !== (student._id || student.id)
                            ));
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setSelectedClass(null);
                    setSelectedStudents([]);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudents}
                  disabled={selectedStudents.length === 0 || loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : `Add ${selectedStudents.length} Student(s)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Students Modal */}
      {showViewStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Students in {selectedClass?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Total: {classStudents.length} students
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowViewStudentsModal(false);
                    setSelectedClass(null);
                    setClassStudents([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {classStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classStudents.map(student => (
                    <div key={student._id || student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <div className="flex space-x-2 text-xs text-gray-500">
                            <span>{student.grade || 'Grade N/A'}</span>
                            <span>•</span>
                            <span>{student.rollNumber || 'Roll # N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(
                          selectedClass._id || selectedClass.id,
                          student._id || student.id
                        )}
                        className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No students in this class yet.</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowViewStudentsModal(false);
                    setSelectedClass(null);
                    setClassStudents([]);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewStudentsModal(false);
                    openAddStudentModal(selectedClass);
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add More Students
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-orange-800 mb-2">Class Management</h1>
            <p className="text-orange-600 text-sm md:text-base">Manage all classes in your school</p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
            className="bg-orange-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 w-fit"
          >
            <Plus size={20} />
            <span className="text-sm md:text-base">Create Class</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-orange-600">Total Classes</p>
                <p className="text-xl md:text-2xl font-bold text-orange-800">{overallStats.totalClasses}</p>
              </div>
              <BookOpen className="text-orange-500" size={20} />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-green-600">Total Students</p>
                <p className="text-xl md:text-2xl font-bold text-green-800">{overallStats.totalStudents}</p>
              </div>
              <Users className="text-green-500" size={20} />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-blue-600">Subjects</p>
                <p className="text-xl md:text-2xl font-bold text-blue-800">{overallStats.subjectsCount}</p>
              </div>
              <BookOpen className="text-blue-500" size={20} />
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-purple-600">Avg Students</p>
                <p className="text-xl md:text-2xl font-bold text-purple-800">{overallStats.averageStudents}</p>
              </div>
              <Users className="text-purple-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search classes by name, code, teacher, or grade..."
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-sm md:text-base"
              value={searchText} 
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-gray-800 text-sm"
                value={subjectFilter} 
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 text-gray-800 text-sm"
                value={gradeFilter} 
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            {(searchText || subjectFilter !== 'All Subjects' || gradeFilter !== 'All Grades') && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Classes ({filteredClasses.length})
        </h2>
        <div className="text-sm text-gray-500">
          Showing {filteredClasses.length} of {localClasses.length} classes
        </div>
      </div>

      {/* VIEW MODE TOGGLE (HIDDEN - ONLY LIST VIEW) */}
      
      {/* CLASSES LIST VIEW - WITHOUT ICONS */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-700">Class Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Subject</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Teacher</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Grade</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Students</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Code</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClasses.map((classItem) => (
                <tr key={classItem._id || classItem.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${classItem.color || 'bg-gray-400'}`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{classItem.name || classItem.className}</p>
                        <p className="text-xs text-gray-500">
                          {formatScheduleDisplay(classItem.schedule)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {classItem.subject}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-800">{classItem.teacher || classItem.classTeacherName}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{classItem.grade}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openViewStudentsModal(classItem)}
                        className="text-sm text-gray-700 hover:text-orange-600"
                      >
                        {classItem.students || classItem.totalStudents || 0}
                      </button>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(
                              (((classItem.students || classItem.totalStudents || 0) / (classItem.capacity || 30)) * 100), 
                              100
                            )}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {classItem.code}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      
                     
                      <button
                        onClick={() => openEditModal(classItem)}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(classItem)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NO CLASSES MESSAGE */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-orange-200">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg mb-2">
            {localClasses.length === 0 
              ? "No classes found. Create your first class!" 
              : "No classes match your search criteria."
            }
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Your First Class
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;