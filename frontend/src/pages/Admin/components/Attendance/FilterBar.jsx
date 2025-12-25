import React from 'react';

const FilterBar = ({ 
  filters, 
  setFilters, 
  students, 
  loading, 
  applyFilters, 
  resetFilters,
  fetchAttendance 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
        />
        
        <select
          value={filters.class}
          onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
          className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
        >
          <option value="">All Classes</option>
          <option value="5A">Class 5A</option>
          <option value="6B">Class 6B</option>
          <option value="7C">Class 7C</option>
          <option value="8D">Class 8D</option>
        </select>
        
        <select
          value={filters.studentId}
          onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
          className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
        >
          <option value="">All Students</option>
          {students.map(student => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.rollNo})
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search by student name..."
          value={filters.searchTerm}
          onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
        />
      </div>
      
      <div className="flex justify-between">
        <div className="flex space-x-3">
          <button 
            onClick={applyFilters}
            disabled={loading}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply Filters'}
          </button>
          
          <button 
            onClick={resetFilters}
            className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
        
        <span className="text-sm text-orange-600 self-center">
          Showing {filteredAttendance.length} of {attendance.length} records
        </span>
      </div>
    </div>
  );
};

export default FilterBar;