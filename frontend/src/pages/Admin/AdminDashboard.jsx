
import React, { useState, useEffect } from 'react';
import DashboardContent from './components/DashboardContent';
import StudentManagement from './components/StudentManagement/StudentManagement';
import TeacherManagement from './components/TeacherManagement/TeacherManagement';
import ClassManagement from './components/ClassManagement/ClassManagement';
import EventManagement from "./components/Event/EventManagement";
import ViewApplication from './components/ViewApplication';
import AttendanceManagement from './components/Attendance/AttendanceManagement'; 
import AssignmentManagement from './components/Assignment/AssignmentManagement'; 
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  
  const [sharedData, setSharedData] = useState({
    students: [],
    teachers: [],
    events: [],
    applications: [],
    classes: [],
    attendance: [],
    assignments: [] 
  });

  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  
  const API_BASE = 'http://localhost:3000';

  // Check authentication and fetch data
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    
    if (currentUser.role !== 'admin') {
      alert('Access denied. Admin only.');
      window.location.href = '/login';
      return;
    }
    
    fetchSharedData();
    fetchDashboardStats();
  }, []);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  
  const getFilteredData = () => {
    if (!searchTerm.trim()) {
      return sharedData;
    }

    const term = searchTerm.toLowerCase();
    
    const result = { ...sharedData };
    
    switch (activeTab) {
      case 'students':
        result.students = sharedData.students.filter(student =>
          student.name?.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term) ||
          student.class?.toLowerCase().includes(term)
        );
        break;
        
      case 'teachers':
        result.teachers = sharedData.teachers.filter(teacher =>
          teacher.name?.toLowerCase().includes(term) ||
          teacher.email?.toLowerCase().includes(term) ||
          teacher.subject?.toLowerCase().includes(term)
        );
        break;
        
      case 'classes':
        result.classes = sharedData.classes.filter(classItem =>
          classItem.name?.toLowerCase().includes(term) ||
          classItem.subject?.toLowerCase().includes(term) ||
          classItem.teacher?.toLowerCase().includes(term)
        );
        break;
        
      case 'event':
        result.events = sharedData.events.filter(event =>
          event.title?.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term)
        );
        break;
        
      case 'viewapplication':
        result.applications = sharedData.applications.filter(app =>
          app.studentName?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term)
        );
        break;
        
      case 'attendance':
        result.attendance = sharedData.attendance.filter(record =>
          record.studentName?.toLowerCase().includes(term) ||
          record.class?.toLowerCase().includes(term) ||
          record.date?.includes(term)
        );
        break;
        
      case 'assignments': 
        result.assignments = sharedData.assignments.filter(assignment =>
          assignment.title?.toLowerCase().includes(term) ||
          assignment.subject?.toLowerCase().includes(term) ||
          assignment.teacherName?.toLowerCase().includes(term) ||
          assignment.description?.toLowerCase().includes(term)
        );
        break;
    }
    
    return result;
  };

  const filteredData = getFilteredData();

  
  const fetchSharedData = async () => {
    try {
      const endpoints = [
        { key: 'students', url: `${API_BASE}/api/students` },
        { key: 'teachers', url: `${API_BASE}/api/teachers` },
        { key: 'events', url: `${API_BASE}/api/events` },
        { key: 'applications', url: `${API_BASE}/api/applications` },
        { key: 'classes', url: `${API_BASE}/api/classes` },
        { key: 'attendance', url: `${API_BASE}/api/attendance` },
        { key: 'assignments', url: `${API_BASE}/api/assignments` } 
      ];

      const results = {};

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url);
          
          if (response.ok) {
            const data = await response.json();
            
            if (Array.isArray(data)) {
              results[endpoint.key] = data;
            } else if (data.data && Array.isArray(data.data)) {
              results[endpoint.key] = data.data;
            } else if (data.success && Array.isArray(data.data)) {
              results[endpoint.key] = data.data;
            } else {
              results[endpoint.key] = [];
            }
          } else {
            results[endpoint.key] = [];
          }
        } catch (error) {
          console.error(`❌ Error fetching ${endpoint.key}:`, error);
          try {
            const stored = JSON.parse(localStorage.getItem(endpoint.key)) || [];
            results[endpoint.key] = stored;
          } catch (e) {
            results[endpoint.key] = [];
          }
        }
      }

      setSharedData({
        students: results.students || [],
        teachers: results.teachers || [],
        events: results.events || [],
        applications: results.applications || [],
        classes: results.classes || [],
        attendance: results.attendance || [],
        assignments: results.assignments || [] 
      });

      // Save to localStorage
      Object.keys(results).forEach(key => {
        try {
          localStorage.setItem(key, JSON.stringify(results[key] || []));
        } catch (e) {
          console.error(`Error saving ${key} to localStorage:`, e);
        }
      });

    } catch (error) {
      console.error('❌ Error loading shared data:', error);
      
      
      try {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const classes = JSON.parse(localStorage.getItem('classes')) || [];
        const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        const assignments = JSON.parse(localStorage.getItem('assignments')) || []; 

        setSharedData({ 
          students, 
          teachers, 
          events, 
          applications, 
          classes, 
          attendance,
          assignments 
        });
      } catch (e) {
        console.error('❌ Error parsing localStorage data:', e);
        setSharedData({
          students: [],
          teachers: [],
          events: [],
          applications: [],
          classes: [],
          attendance: [],
          assignments: [] 
        });
      }
    }
  };

  
  const updateSharedData = async (key, newData) => {
    try {
      
      
      let endpoint = '';
      let method = 'POST';

      switch (key) {
        case 'students':
          endpoint = '/api/students';
          break;
        case 'teachers':
          endpoint = '/api/teachers';
          break;
        case 'events':
          endpoint = '/api/events';
          break;
        case 'applications':
          endpoint = '/api/applications';
          break;
        case 'classes':
          endpoint = '/api/classes';
          break;
        case 'attendance':
          endpoint = '/api/attendance';
          break;
        case 'assignments': 
          endpoint = '/api/assignments';
          break;
        default:
          console.error(`Unknown key: ${key}`);
          return false;
      }

      if (newData._id || newData.id) {
        method = 'PUT';
        const id = newData._id || newData.id;
        endpoint += `/${id}`;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData)
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Update local state
        const currentData = [...sharedData[key]];
        let updatedData;
        
        if (newData._id || newData.id) {
          updatedData = currentData.map(item => 
            (item._id === (newData._id || newData.id) || item.id === (newData._id || newData.id)) 
              ? { ...item, ...newData } 
              : item
          );
        } else {
          const newItem = { 
            ...newData, 
            _id: responseData.data?._id || Date.now().toString() 
          };
          updatedData = [...currentData, newItem];
        }
        
        setSharedData(prev => ({
          ...prev,
          [key]: updatedData
        }));
        
        localStorage.setItem(key, JSON.stringify(updatedData));
        await fetchDashboardStats();
        
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API update failed');
      }
    } catch (error) {
      console.error(`❌ Error updating ${key} via API:`, error);
      
      
      try {
        const currentData = JSON.parse(localStorage.getItem(key)) || [];
        let updatedData;
        
        if (newData._id || newData.id) {
          updatedData = currentData.map(item => 
            (item._id === (newData._id || newData.id) || item.id === (newData._id || newData.id)) 
              ? { ...item, ...newData } 
              : item
          );
        } else {
          updatedData = [...currentData, { ...newData, _id: Date.now().toString() }];
        }
        
        localStorage.setItem(key, JSON.stringify(updatedData));
        setSharedData(prev => ({
          ...prev,
          [key]: updatedData
        }));
        
        await fetchDashboardStats();
        
        return true;
      } catch (localError) {
        
        return false;
      }
    }
  };

  
  const deleteData = async (key, id) => {
    try {
      
      
      let endpoint = '';
      
      switch (key) {
        case 'students':
          endpoint = `/api/students/${id}`;
          break;
        case 'teachers':
          endpoint = `/api/teachers/${id}`;
          break;
        case 'events':
          endpoint = `/api/events/${id}`;
          break;
        case 'applications':
          endpoint = `/api/applications/${id}`;
          break;
        case 'classes':
          endpoint = `/api/classes/${id}`;
          break;
        case 'attendance':
          endpoint = `/api/attendance/${id}`;
          break;
        case 'assignments': 
          endpoint = `/api/assignments/${id}`;
          break;
        default:
          console.error(`Unknown key: ${key}`);
          return false;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log(`✅ ${key} deleted successfully`);
        
        const currentData = [...sharedData[key]];
        const updatedData = currentData.filter(item => 
          item._id !== id && item.id !== id
        );
        
        setSharedData(prev => ({
          ...prev,
          [key]: updatedData
        }));
        
        localStorage.setItem(key, JSON.stringify(updatedData));
        await fetchDashboardStats();
        
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API delete failed');
      }
    } catch (error) {
      console.error(`❌ Error deleting ${key} via API:`, error);
      
      
      try {
        const currentData = JSON.parse(localStorage.getItem(key)) || [];
        const updatedData = currentData.filter(item => 
          item._id !== id && item.id !== id
        );
        
        localStorage.setItem(key, JSON.stringify(updatedData));
        setSharedData(prev => ({
          ...prev,
          [key]: updatedData
        }));
        
        await fetchDashboardStats();
        
        return true;
      } catch (localError) {
        
        return false;
      }
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/dashboard`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardStats(data);
        }
      }
    } catch (error) {
      
      // Fallback stats
      setDashboardStats({
        stats: {
          totalStudents: sharedData.students.length,
          totalTeachers: sharedData.teachers.length,
          totalAssignments: sharedData.assignments.length,
          activeAssignments: sharedData.assignments.filter(a => a.status === 'active').length,
          attendancePercentage: 85
        }
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const renderContent = () => {
    
    const getFlatAttendance = (attendanceData) => {
      const flatAttendance = [];
      
      attendanceData.forEach(record => {
        if (record.records && Array.isArray(record.records)) {
          
          record.records.forEach(studentRecord => {
            flatAttendance.push({
              ...studentRecord,
              date: record.date,
              class: record.class,
              teacherName: record.teacherName,
              subject: record.subject
            });
          });
        } else {
          
          flatAttendance.push(record);
        }
      });
      
      return flatAttendance;
    };

    const flatAttendanceData = getFlatAttendance(filteredData.attendance);
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContent 
            students={filteredData.students}
            teachers={filteredData.teachers}
            events={filteredData.events}
            applications={filteredData.applications}
            classes={filteredData.classes}
            attendance={flatAttendanceData}  
            assignments={filteredData.assignments}
            dashboardStats={dashboardStats}
            statsLoading={statsLoading}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
          />
        );
      case 'students':
        return (
          <StudentManagement 
            students={filteredData.students}
            teachers={filteredData.teachers}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      case 'teachers':
        return (
          <TeacherManagement 
            teachers={filteredData.teachers}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      case 'classes':
        return (
          <ClassManagement 
            classes={filteredData.classes}
            students={filteredData.students}
            teachers={filteredData.teachers}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      case 'event':
        return (
          <EventManagement 
            events={filteredData.events}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      case 'attendance':
        return (
          <AttendanceManagement 
            students={filteredData.students}
            attendance={filteredData.attendance}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      case 'viewapplication':
        return (
          <ViewApplication 
            applications={filteredData.applications}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      case 'assignments': 
        return (
          <AssignmentManagement 
            students={filteredData.students}
            teachers={filteredData.teachers}
            assignments={filteredData.assignments}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
            updateData={updateSharedData}
            deleteData={deleteData}
          />
        );
      default:
        return (
          <DashboardContent 
            students={filteredData.students}
            teachers={filteredData.teachers}
            events={filteredData.events}
            applications={filteredData.applications}
            classes={filteredData.classes}
            attendance={flatAttendanceData}  
            assignments={filteredData.assignments}
            dashboardStats={dashboardStats}
            statsLoading={statsLoading}
            onDataUpdate={fetchSharedData}
            searchTerm={searchTerm}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    
      <div className="flex-1 flex flex-col min-w-0">
        <Header setSidebarOpen={setSidebarOpen} onSearch={handleSearch} />
        
        
        {searchTerm && (
          <div className="bg-orange-50 border-b border-orange-200 px-6 py-2">
            <p className="text-orange-700 text-sm">
              Showing results for: <span className="font-semibold">"{searchTerm}"</span>
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-4 text-orange-500 hover:text-orange-700 text-xs underline"
              >
                Clear search
              </button>
            </p>
          </div>
        )}
        
        <main className="flex-1 p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;