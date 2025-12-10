// components/AssignmentManagement/AssignmentHeader.jsx
import React from 'react';
import { Plus, RefreshCw, Menu } from 'lucide-react';

const AssignmentHeader = ({ 
  stats, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  fetchAssignments, 
  setShowAddModal,
  isMobile 
}) => (
  <>
    {/* Mobile Header */}
    {isMobile && (
      <div className="md:hidden flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-3 p-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Assignments</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm"
        >
          <Plus size={18} />
          <span>New</span>
        </button>
      </div>
    )}

    {/* Main Header */}
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Assignment Management</h1>
          <p className="opacity-90 text-sm md:text-base">Create and manage assignments for students</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs md:text-sm">
              {stats.total} Total
            </div>
            <div className="bg-green-500 bg-opacity-20 px-3 py-1 rounded-full text-xs md:text-sm">
              {stats.active} Active
            </div>
            <div className="bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full text-xs md:text-sm">
              {stats.pending} Pending
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAssignments}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-colors text-sm"
            title="Refresh"
          >
            <RefreshCw size={18} />
            <span className="hidden md:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg text-sm md:text-base"
          >
            <Plus size={18} />
            <span className="hidden md:inline">New Assignment</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>
    </div>
  </>
);

export default AssignmentHeader;