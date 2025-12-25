import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateDashboardContent from './CandidateDashboardContent';
import CandidateProfile from './CandidateProfile';
import CandidateAssignments from './CandidatesAssignments';
import CandidateEvents from './CandidateEvents';
import CandidateHeader from './CandidateHeaders';
import CandidateSidebar from './CandidateSidebar';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [dashboardData, setDashboardData] = useState({
    assignments: [],
    events: [],
    profile: null,
    stats: null,
    teachers: [] 
  });

  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:3000';

  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'candidate') {
      console.log('❌ No candidate user found, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('✅ Candidate user found:', currentUser);
    fetchDashboardData(currentUser.id);
  }, [refreshTrigger, navigate]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  
  const fetchDashboardData = async (candidateId) => {
    try {
      setLoading(true);
      
      if (!candidateId) {
        console.log('❌ No candidate ID provided');
        navigate('/login');
        return;
      }

      console.log('📡 Fetching dashboard data for candidate ID:', candidateId);
      
      const response = await fetch(`${API_BASE}/api/candidates/${candidateId}/dashboard`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Dashboard data received:', data);
      
      if (data.success && data.data) {
        setDashboardData(data.data);
        localStorage.setItem('candidateDashboardData', JSON.stringify(data.data));
      } else {
        throw new Error(data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('❌ Error loading candidate dashboard:', error);
      
  
      const savedData = JSON.parse(localStorage.getItem('candidateDashboardData'));
      if (savedData) {
        console.log('🔄 Using saved data from localStorage');
        setDashboardData(savedData);
      } else {
        
        console.log('⚠️ No saved data found, showing empty dashboard');
        setDashboardData({
          assignments: [],
          events: [],
          profile: null,
          stats: {
            totalAssignments: 0,
            submittedAssignments: 0,
            pendingAssignments: 0,
            gradedAssignments: 0,
            upcomingEvents: 0,
            completionRate: 0,
            averageScore: 0
          },
          teachers: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('candidateDashboardData');
    navigate('/login');
  };


const submitAssignment = async (assignmentId, submissionData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    console.log('📤 Submitting assignment - Current User:', currentUser);

    if (!currentUser) {
      console.error('❌ No user logged in');
      return { 
        success: false, 
        message: 'Please login first' 
      };
    }

    const studentId = dashboardData.profile?.id || currentUser?.id || currentUser?._id;
    
    if (!studentId) {
      console.error('❌ No student ID found');
      console.log('Dashboard data:', dashboardData);
      return { 
        success: false, 
        message: 'Student information not found. Please refresh the page.' 
      };
    }

    console.log('📤 Submitting assignment with:', {
      assignmentId,
      studentId,
      studentName: currentUser?.name || dashboardData.profile?.name
    });


    const payload = {
      ...submissionData,
      studentId: studentId,  
      studentName: currentUser?.name || dashboardData.profile?.name
    };

    console.log('📦 Sending payload:', payload);

    const response = await fetch(
      `${API_BASE}/api/assignments/${assignmentId}/submit`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error:', errorText);
      return { 
        success: false, 
        message: 'Server error. Please try again.' 
      };
    }

    const data = await response.json();
    console.log('📝 Submission response:', data);

    if (data.success) {
    
      setRefreshTrigger(prev => prev + 1);
      return { 
        success: true, 
        message: 'Assignment submitted successfully!' 
      };
    } else {
      return { 
        success: false, 
        message: data.message || 'Failed to submit assignment' 
      };
    }
  } catch (error) {
    console.error('❌ Error submitting assignment:', error);
    return { 
      success: false, 
      message: 'Network error. Please check your connection.' 
    };
  }
};

  const updateProfile = async (profileData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      console.log('✏️ Updating profile for:', currentUser.id);
      console.log('📦 Profile data:', profileData);

      const response = await fetch(
        `${API_BASE}/api/candidates/${currentUser.id}/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        }
      );

      const data = await response.json();
      console.log('📝 Profile update response:', data);

      if (response.ok && data.success) {
        // Update local data
        const updatedDashboardData = {
          ...dashboardData,
          profile: data.data
        };
        setDashboardData(updatedDashboardData);
        localStorage.setItem('candidateDashboardData', JSON.stringify(updatedDashboardData));
        
        // Update currentUser in localStorage
        const updatedUser = { ...currentUser, name: data.data.name };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        return { success: true, message: 'Profile updated successfully!' };
      } else {
        return { success: false, message: data.error || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      return { success: false, message: 'Error updating profile' };
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing dashboard data...');
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    if (loading && activeTab === 'dashboard') {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <CandidateDashboardContent 
            assignments={dashboardData.assignments || []}
            events={dashboardData.events || []}
            profile={dashboardData.profile}
            stats={dashboardData.stats}
            teachers={dashboardData.teachers || []} 
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
          />
        );
      case 'profile':
        return (
          <CandidateProfile 
            profile={dashboardData.profile}
            onUpdate={updateProfile}
            onRefresh={handleRefresh}
          />
        );
      case 'assignments':
        return (
          <CandidateAssignments 
            assignments={dashboardData.assignments || []}
            onSubmitAssignment={submitAssignment}
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
          />
        );
      case 'events':
        return (
          <CandidateEvents 
            events={dashboardData.events || []}
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
          />
        );
      default:
        return (
          <CandidateDashboardContent 
            assignments={dashboardData.assignments || []}
            events={dashboardData.events || []}
            profile={dashboardData.profile}
            stats={dashboardData.stats}
            teachers={dashboardData.teachers || []}
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
          />
        );
    }
  };

 
return (
  <div className="min-h-screen bg-gradient-to-br from-[#fcd4ab] via-[#f8b6a3] to-[#f9a887] flex">
    {/* Sidebar */}
    <CandidateSidebar 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      profile={dashboardData.profile}
      onLogout={handleLogout}
    />

    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Main Content Area */}
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="p-4 lg:p-6">
        <CandidateHeader 
          profile={dashboardData.profile}
          onEdit={() => setActiveTab('profile')}
          onRefresh={handleRefresh}
          setSidebarOpen={setSidebarOpen} // ✅ یہ prop pass کریں
        />
      </div>
      
      {/* Search results info */}
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

export default CandidateDashboard;
