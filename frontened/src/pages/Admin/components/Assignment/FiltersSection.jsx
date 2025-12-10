// components/AssignmentManagement/FiltersSection.jsx
import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';

const FiltersSection = ({
  isMobileMenuOpen,
  filterStatus,
  setFilterStatus,
  filterTeacher,
  setFilterTeacher,
  filterClass,
  setFilterClass,
  teachers,
  uniqueClasses,
  setCurrentPage,
  isMobile
}) => (
  <>
    {/* Mobile Filters Button */}
    {isMobile && (
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-orange-200"
        >
          <span className="font-medium text-gray-700">Filters</span>
          <Filter size={18} />
        </button>
      </div>
    )}

    {/* Filters Panel */}
    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block bg-white rounded-2xl shadow-sm border border-orange-200 p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FilterSelect
          label="Status"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
            { value: 'overdue', label: 'Overdue' }
          ]}
        />
        
        <FilterSelect
          label="Teacher"
          value={filterTeacher}
          onChange={setFilterTeacher}
          options={[
            { value: 'all', label: 'All Teachers' },
            ...teachers.map(teacher => ({
              value: teacher._id,
              label: teacher.name
            }))
          ]}
        />
        
        <FilterSelect
          label="Class"
          value={filterClass}
          onChange={setFilterClass}
          options={[
            { value: 'all', label: 'All Classes' },
            ...uniqueClasses.map(cls => ({
              value: cls,
              label: cls
            }))
          ]}
        />
        
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterStatus('all');
              setFilterTeacher('all');
              setFilterClass('all');
              setCurrentPage(1);
            }}
            className="w-full border border-orange-500 text-orange-600 px-3 md:px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw size={16} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  </>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-orange-200 rounded-xl px-3 md:px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default FiltersSection;