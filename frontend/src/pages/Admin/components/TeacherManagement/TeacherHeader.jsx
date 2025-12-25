import React from 'react';
import { Plus, RefreshCw, Users, Filter, Search, BookOpen, Clock } from 'lucide-react';

const TeacherHeader = ({ teachers, filteredTeachers, loading, onRefresh, onAddTeacher }) => {
  // Sahi calculations
  const activeTeachers = teachers.filter(t => t.status === 'active').length;

  // Total UNIQUE classes (5A, 6B, 7C → 3)
  const totalUniqueClasses = new Set(
    teachers.flatMap(t => Array.isArray(t.classes) ? t.classes : [])
  ).size;

  // Optional: Total class assignments (ek teacher ko 3 classes → 3 count)
  // const totalAssignments = teachers.reduce((sum, t) => sum + (Array.isArray(t.classes) ? t.classes.length : 0), 0);

  const avgExperience = teachers.length > 0
    ? (teachers.reduce((sum, t) => sum + (t.experience || 0), 0) / teachers.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      icon: Users,
      label: 'Total Teachers',
      value: teachers.length,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      ringColor: 'ring-orange-200'
    },
    {
      icon: Filter,
      label: 'Active Teachers',
      value: activeTeachers,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      ringColor: 'ring-green-200'
    },
    {
      icon: BookOpen,
      label: 'Unique Classes',
      value: totalUniqueClasses,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      ringColor: 'ring-blue-200'
    },
    {
      icon: Clock,
      label: 'Avg Experience',
      value: `${avgExperience} yrs`,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      ringColor: 'ring-purple-200'
    }
  ];

  return (
    <div className="mb-8">
      {/* Header + Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Teacher Management</h1>
          <p className="text-orange-700 mt-1">Manage all teachers in your institution</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50 transition-all disabled:opacity-50 font-medium shadow-sm"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            onClick={onAddTeacher}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Plus size={22} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} ${stat.ringColor} ring-8 ring-opacity-30 rounded-full`}>
                <stat.icon size={28} className={stat.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Showing X of Y */}
      <div className="mt-6 text-sm text-gray-600">
        Showing <span className="font-semibold text-orange-700">{filteredTeachers.length}</span> of{' '}
        <span className="font-semibold text-orange-700">{teachers.length}</span> teachers
      </div>
    </div>
  );
};

export default TeacherHeader;