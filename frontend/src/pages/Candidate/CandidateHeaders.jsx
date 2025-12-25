// import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Calendar,
  Shield,
  GraduationCap,
  Menu // ✅ Menu icon اضافی
} from 'lucide-react';

const CandidateHeader = ({ profile, onEdit, onRefresh, setSidebarOpen }) => { // ✅ setSidebarOpen prop شامل
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  
  const calculateCompletion = (profile) => {
    let completedFields = 0;
    const totalFields = 8;
    
    if (profile?.name) completedFields++;
    if (profile?.phone) completedFields++;
    if (profile?.address) completedFields++;
    if (profile?.parentName) completedFields++;
    if (profile?.parentPhone) completedFields++;
    if (profile?.gender) completedFields++;
    if (profile?.avatarUrl) completedFields++;
    if (profile?.status === 'active') completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const profileCompletion = calculateCompletion(profile);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/10 rounded-full -translate-y-32 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-orange-300/10 to-amber-200/10 rounded-full -translate-x-10 translate-y-10"></div>
      
      <div className="relative p-6 md:p-8">
      
        <div className="lg:hidden absolute top-6 right-6">
          <button 
            onClick={() => setSidebarOpen && setSidebarOpen(true)}
            className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {profile?.name?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              
              {/* Status indicator */}
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${getStatusColor(profile?.status)} text-white shadow-md border-2 border-white`}>
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              
              {/* Profile completion badge */}
              <div className="absolute -top-2 -right-2 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white">
                  <span className="text-lg font-bold text-orange-700">{profileCompletion}%</span>
                  <span className="text-[10px] text-orange-600 font-medium">Complete</span>
                </div>
              </div>
            </div>
            
            {/* Status tag */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200">
              <span className="flex items-center gap-1.5 text-sm font-medium text-orange-800">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(profile?.status)}`}></div>
                {profile?.status || 'Unknown'}
              </span>
            </div>

            {/* Student ID */}
            <div className="mt-3 px-3 py-1 bg-white/70 backdrop-blur-sm rounded-lg border border-orange-100">
              <span className="text-xs font-medium text-gray-600">ID: </span>
              <span className="text-sm font-bold text-orange-700">
                {profile?.rollNo || profile?._id?.slice(-6) || 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Candidate info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {profile?.name || 'Student Name'}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <GraduationCap className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg md:text-xl font-semibold text-orange-700">
                    {profile?.class || 'Class Not Assigned'} Student
                  </h2>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {profile?.isRegistered ? 'Registered' : 'Pending Registration'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      Enrolled: {formatDate(profile?.enrollmentDate)}
                    </span>
                  </div>
                  
                  {profile?.gender && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {profile.gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Desktop pe action buttons */}
              <div className="hidden lg:flex items-center gap-3">
                {onRefresh && (
                  <button 
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                    title="Refresh"
                  >
                
                  </button>
                )}
                
                {setSidebarOpen && (
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg transition-shadow lg:hidden"
                    title="Open Menu"
                  >
                    <Menu size={20} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100 min-w-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 break-words text-sm">
                    {profile?.email || 'email@example.com'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100 min-w-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800 text-sm">
                    {profile?.phone || '+92 300 1234567'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100 min-w-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-800 break-words text-sm">
                    {profile?.address || 'Address not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100 min-w-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Parent</p>
                  <p className="font-medium text-gray-800 break-words text-sm">
                    {profile?.parentName || 'Parent name'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="mt-8 pt-6 border-t border-orange-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {profile?.assignedTeachers?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Assigned Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {profile?.isRegistered ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-gray-600">Registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {profile?.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              <div className="text-sm text-gray-600">Account Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700 text-xs sm:text-base md:text-2xl">
                {profile?.registrationDate ? formatDate(profile.registrationDate) : 'Pending'}
              </div>
              <div className="text-sm text-gray-600">Registration Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHeader;