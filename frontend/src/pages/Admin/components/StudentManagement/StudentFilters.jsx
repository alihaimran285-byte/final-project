import React from 'react';
import { Search } from 'lucide-react';

const StudentFilters = ({ 
  searchText, 
  setSearchText, 
  selectedGrade, 
  setSelectedGrade,
  students = [] 
}) => {
  // Get unique classes from students
  const uniqueClasses = [...new Set(students
    .map(s => s.class || s.grade)
    .filter(Boolean)
  )];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search students by name, email, roll number, or parent..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition min-w-[150px]"
          >
            <option value="All Grades">All Classes</option>
            {uniqueClasses.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;