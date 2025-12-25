import React from 'react';

const CandidateDashboardContent = ({ assignments, events, profile, stats, teachers, onRefresh, searchTerm }) => {
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher => 
    teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <h3 className="text-gray-600 text-sm font-medium">Total Assignments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAssignments || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.submittedAssignments || 0} submitted • {stats?.pendingAssignments || 0} pending
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <h3 className="text-gray-600 text-sm font-medium">Completion Rate</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.completionRate || 0}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-amber-500 h-2.5 rounded-full" 
              style={{ width: `${stats?.completionRate || 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-peach-400">
          <h3 className="text-gray-600 text-sm font-medium">Average Score</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.averageScore || 0}%</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.gradedAssignments || 0} assignments graded
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-400">
          <h3 className="text-gray-600 text-sm font-medium">Assigned Teachers</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{teachers?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Your subject teachers</p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
        <div className="lg:col-span-2 space-y-6">
      
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Assignments</h2>
              <p className="text-sm text-gray-600">Your pending and upcoming assignments</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.slice(0, 5).map(assignment => (
                    <tr key={assignment._id} className="hover:bg-orange-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-sm text-gray-500">{assignment.subject} • {assignment.teacherName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${
                            assignment.daysRemaining <= 3 ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {assignment.daysRemaining > 0 
                              ? `${assignment.daysRemaining} days left`
                              : 'Overdue'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            assignment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              <p className="text-sm text-gray-600">School events and activities</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredEvents.slice(0, 5).map(event => (
                <div key={event._id} className="px-6 py-4 hover:bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.venue}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      event.isUpcoming 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {profile?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile?.name}</h3>
                  <p className="text-sm text-gray-600">{profile?.class} Student</p>
                  <p className="text-sm text-gray-500">Roll No: {profile?.rollNo}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    profile?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile?.status || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrollment Date</span>
                  <span className="font-medium">{profile?.enrollmentDate || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{profile?.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{profile?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Teachers Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">My Teachers</h2>
              <p className="text-sm text-gray-600">Subject teachers assigned to you</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredTeachers.map(teacher => (
                <div key={teacher.teacherId} className="px-6 py-4 hover:bg-orange-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {teacher.teacherName?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{teacher.teacherName}</h3>
                      <p className="text-sm text-gray-600">{teacher.subject}</p>
                      <p className="text-xs text-gray-500">{teacher.schedule}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTeachers.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-2 text-gray-600">No teachers assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboardContent;