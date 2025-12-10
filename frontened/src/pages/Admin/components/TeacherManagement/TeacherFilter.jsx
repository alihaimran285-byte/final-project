import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const TeacherFilters = ({ 
  searchTerm, 
  subjectFilter, 
  statusFilter,
  teachers,
  onSearchChange,
  onSubjectFilterChange,
  onStatusFilterChange,
  onResetFilters 
}) => {
  // Get unique subjects from teachers
  const uniqueSubjects = ['All', ...new Set(teachers.map(t => t.subject).filter(Boolean))];
  const uniqueStatuses = ['All', 'Active', 'Inactive', 'On Leave'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Subject Filter */}
          <div className="relative">
            <select
              value={subjectFilter}
              onChange={(e) => onSubjectFilterChange(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
            >
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'All' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
            >
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Reset Button */}
          {(searchTerm || subjectFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || subjectFilter !== 'All' || statusFilter !== 'All') && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
              Search: "{searchTerm}"
              <button onClick={() => onSearchChange('')} className="text-orange-600 hover:text-orange-800">
                <X size={14} />
              </button>
            </span>
          )}
          {subjectFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Subject: {subjectFilter}
              <button onClick={() => onSubjectFilterChange('All')} className="text-blue-600 hover:text-blue-800">
                <X size={14} />
              </button>
            </span>
          )}
          {statusFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Status: {statusFilter}
              <button onClick={() => onStatusFilterChange('All')} className="text-green-600 hover:text-green-800">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherFilters;