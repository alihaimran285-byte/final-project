// components/students/StudentsList.jsx - UPDATED VERSION
import React from 'react';
import { Eye, Pencil, Trash2, Mail, Users, UserCheck, Hash, Calendar, Lock, MapPin } from "lucide-react";

const StudentsList = ({ students, setActiveModal }) => {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-12 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="text-orange-500" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No students found</h3>
        <p className="text-gray-500">Try adjusting your search or add new students.</p>
        <button
          onClick={() => setActiveModal({ type: 'add' })}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Add First Student
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="p-6 border-b border-orange-100 bg-orange-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-orange-800">STUDENTS LIST</h2>
          <span className="text-orange-600 font-medium">
            {students.length} student{students.length > 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      <div className="divide-y divide-orange-100">
        {students.map((student) => {
          // Safely get roll number
          const rollNo = student.rollNo || student.roll_no || 'N/A';
          
          // Safely get assigned teachers
          const assignedTeachers = student.assignedTeachers || student.assignedTeachersData || [];
          const teacherNames = assignedTeachers.length > 0
            ? assignedTeachers.map(t => t.teacherName || t.name || 'Unknown').join(', ')
            : 'Not assigned';

          // Check parent info
          const hasParentInfo = student.parentName && 
                                student.parentName.trim() && 
                                student.parentName !== "Not provided";

          // Get initials safely
          const getInitials = (name) => {
            if (!name) return '?';
            const parts = name.trim().split(' ');
            if (parts.length >= 2) {
              return parts[0][0] + parts[1][0];
            }
            return parts[0][0];
          };

          const initials = getInitials(student.name);

          // Format enrollment date
          const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
              const date = new Date(dateString);
              return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
            } catch {
              return dateString;
            }
          };

          return (
            <div key={student._id || student.id} className="p-6 hover:bg-orange-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {initials}
                  </div>

                  <div className="flex-1">
                    {/* Name & Status */}
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-orange-800 text-lg">
                        {student.name || 'Unknown Student'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status?.charAt(0).toUpperCase() + student.status?.slice(1) || 'Active'}
                      </span>
                      {student.isRegistered && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Registered
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {student.gender || 'N/A'}
                      </span>
                    </div>

                    {/* Roll No, Class, Email */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-orange-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Hash size={14} />
                        <strong>Roll:</strong> {rollNo}
                      </span>
                      <span>•</span>
                      <span className="bg-orange-100 px-2 py-1 rounded font-medium">
                        {student.class || student.grade || 'N/A'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {student.email || 'No email'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(student.enrollmentDate)}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                      {student.phone && student.phone !== 'Not provided' && (
                        <>
                          <span>📱 {student.phone}</span>
                          <span>•</span>
                        </>
                      )}
                      {student.address && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {student.address}
                        </span>
                      )}
                    </div>

                    {/* Teachers Display */}
                    {assignedTeachers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 mt-2 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
                        <Users size={14} />
                        <span>
                          <strong>Teachers:</strong> {teacherNames}
                        </span>
                      </div>
                    )}

                    {/* Parent Info */}
                    {hasParentInfo && (
                      <div className="flex items-center gap-2 text-sm text-purple-600 mt-1 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">
                        <UserCheck size={14} />
                        <span>
                          <strong>Parent:</strong> {student.parentName}
                          {student.parentPhone && student.parentPhone !== "Not provided" && (
                            <span> • {student.parentPhone}</span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Registration Status */}
                    {student.isRegistered && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mt-1 bg-green-50 px-3 py-1.5 rounded-lg inline-block">
                        <Lock size={14} />
                        <span>
                          <strong>Registered:</strong> Password Set
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                 
                  <button
                    onClick={() => setActiveModal({ type: 'edit', data: student._id || student.id })}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    title="Edit Student"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setActiveModal({ type: 'delete', data: student._id || student.id })}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentsList;