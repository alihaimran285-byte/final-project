// components/AssignmentManagement/AssignmentList.jsx
import React, { useState } from 'react';
import { 
  RefreshCw, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  FileSpreadsheet,
  FileJson,
  Printer,
  ChevronDown
} from 'lucide-react';
import AssignmentCard from './AssignmentCard';
import AssignmentTableRow from "./AssignmentTableRow";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AssignmentList = ({
  assignments,
  loading,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  filteredAssignments,
  fetchAssignments,
  handleViewAssignment,
  handleEdit,
  handleDelete,
  calculateSubmissionRate,
  students = [],
  teachers = []
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssignments = filteredAssignments.slice(startIndex, endIndex);

  // ✅ CSV Export Function
  const exportToCSV = () => {
    if (filteredAssignments.length === 0) {
      alert('No assignments to export!');
      return;
    }

    const csvData = filteredAssignments.map(assignment => ({
      'Assignment ID': assignment._id,
      'Title': assignment.title,
      'Subject': assignment.subject,
      'Description': assignment.description || '',
      'Teacher': assignment.teacherName,
      'Teacher ID': assignment.teacherId,
      'Assigned To': assignment.assignedTo === 'all' 
        ? 'All Students' 
        : assignment.assignedTo === 'specific-class' 
          ? `Class ${assignment.class}` 
          : assignment.studentName,
      'Student ID': assignment.studentId || '',
      'Class': assignment.class || '',
      'Due Date': new Date(assignment.dueDate).toLocaleDateString(),
      'Total Marks': assignment.totalMarks,
      'Submitted': assignment.submittedCount,
      'Total Students': assignment.totalStudents,
      'Submission Rate': `${calculateSubmissionRate(assignment)}%`,
      'Status': assignment.status,
      'Instructions': assignment.instructions || '',
      'Created At': new Date(assignment.createdAt).toLocaleDateString(),
      'Updated At': assignment.updatedAt ? new Date(assignment.updatedAt).toLocaleDateString() : ''
    }));

    const csvHeaders = Object.keys(csvData[0]).join(',');
    const csvRows = csvData.map(row => 
      Object.values(row).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n');
    
    const csvContent = `${csvHeaders}\n${csvRows}`;
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `assignments_${new Date().toISOString().split('T')[0]}.csv`);
    setShowExportOptions(false);
    alert(`Exported ${filteredAssignments.length} assignments to CSV!`);
  };

  // ✅ Excel Export Function
  const exportToExcel = () => {
    if (filteredAssignments.length === 0) {
      alert('No assignments to export!');
      return;
    }

    const worksheetData = filteredAssignments.map(assignment => ({
      'Assignment ID': assignment._id,
      'Title': assignment.title,
      'Subject': assignment.subject,
      'Description': assignment.description || '',
      'Teacher': assignment.teacherName,
      'Teacher ID': assignment.teacherId,
      'Assigned To': assignment.assignedTo === 'all' 
        ? 'All Students' 
        : assignment.assignedTo === 'specific-class' 
          ? `Class ${assignment.class}` 
          : assignment.studentName,
      'Student ID': assignment.studentId || '',
      'Class': assignment.class || '',
      'Due Date': new Date(assignment.dueDate).toLocaleDateString(),
      'Total Marks': assignment.totalMarks,
      'Submitted': assignment.submittedCount,
      'Total Students': assignment.totalStudents,
      'Submission Rate': `${calculateSubmissionRate(assignment)}%`,
      'Status': assignment.status,
      'Instructions': assignment.instructions || '',
      'Created At': new Date(assignment.createdAt).toLocaleDateString(),
      'Updated At': assignment.updatedAt ? new Date(assignment.updatedAt).toLocaleDateString() : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");
    
    // Auto-size columns
    const wscols = [
      { wch: 20 }, // Assignment ID
      { wch: 30 }, // Title
      { wch: 15 }, // Subject
      { wch: 40 }, // Description
      { wch: 20 }, // Teacher
      { wch: 15 }, // Teacher ID
      { wch: 20 }, // Assigned To
      { wch: 15 }, // Student ID
      { wch: 10 }, // Class
      { wch: 12 }, // Due Date
      { wch: 12 }, // Total Marks
      { wch: 10 }, // Submitted
      { wch: 15 }, // Total Students
      { wch: 15 }, // Submission Rate
      { wch: 12 }, // Status
      { wch: 40 }, // Instructions
      { wch: 12 }, // Created At
      { wch: 12 }  // Updated At
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `assignments_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportOptions(false);
    alert(`Exported ${filteredAssignments.length} assignments to Excel!`);
  };

  // ✅ JSON Export Function
  const exportToJSON = () => {
    if (filteredAssignments.length === 0) {
      alert('No assignments to export!');
      return;
    }

    const jsonData = {
      exportDate: new Date().toISOString(),
      totalAssignments: filteredAssignments.length,
      assignments: filteredAssignments.map(assignment => ({
        id: assignment._id,
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description,
        teacher: {
          id: assignment.teacherId,
          name: assignment.teacherName
        },
        assignedTo: {
          type: assignment.assignedTo,
          value: assignment.assignedTo === 'all' 
            ? 'All Students' 
            : assignment.assignedTo === 'specific-class' 
              ? `Class ${assignment.class}` 
              : {
                  studentId: assignment.studentId,
                  studentName: assignment.studentName,
                  class: assignment.class
                }
        },
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        submission: {
          submitted: assignment.submittedCount,
          total: assignment.totalStudents,
          rate: calculateSubmissionRate(assignment)
        },
        status: assignment.status,
        instructions: assignment.instructions,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt
      }))
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `assignments_${new Date().toISOString().split('T')[0]}.json`);
    setShowExportOptions(false);
    alert(`Exported ${filteredAssignments.length} assignments to JSON!`);
  };

  // ✅ Print Function
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Assignments Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
            .summary { background: #fff7ed; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #fed7aa; color: #9a3412; padding: 12px; text-align: left; border: 1px solid #fdba74; }
            td { padding: 10px; border: 1px solid #fdba74; }
            .status-active { color: #16a34a; }
            .status-pending { color: #ca8a04; }
            .status-overdue { color: #dc2626; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Assignments Report</h1>
          <div class="summary">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Assignments:</strong> ${filteredAssignments.length}</p>
            <p><strong>Active:</strong> ${filteredAssignments.filter(a => a.status === 'active').length}</p>
            <p><strong>Pending:</strong> ${filteredAssignments.filter(a => a.status === 'pending').length}</p>
            <p><strong>Overdue:</strong> ${filteredAssignments.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'completed').length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Submission</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAssignments.map(assignment => `
                <tr>
                  <td>${assignment.title}</td>
                  <td>${assignment.subject}</td>
                  <td>${assignment.teacherName}</td>
                  <td>${
                    assignment.assignedTo === 'all' ? 'All Students' :
                    assignment.assignedTo === 'specific-class' ? `Class ${assignment.class}` :
                    assignment.studentName
                  }</td>
                  <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
                  <td class="status-${assignment.status}">${assignment.status}</td>
                  <td>${assignment.submittedCount}/${assignment.totalStudents} (${calculateSubmissionRate(assignment)}%)</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Report generated from Assignment Management System</p>
            <p>${window.location.origin}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    setShowExportOptions(false);
  };

  // ✅ Export Dropdown Component
  const ExportDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowExportOptions(!showExportOptions)}
        className="hidden md:flex items-center space-x-2 px-4 py-2 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
      >
        <Download size={16} />
        <span>Export</span>
        <ChevronDown size={16} className={`transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
      </button>

      {showExportOptions && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowExportOptions(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-orange-200 z-20">
            <div className="p-3">
              <h4 className="font-medium text-gray-800 mb-3 text-sm">Export Options</h4>
              <div className="space-y-1">
                <ExportOption
                  icon={<FileSpreadsheet size={16} />}
                  label="Excel (.xlsx)"
                  description="Best for analysis"
                  onClick={exportToExcel}
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <ExportOption
                  icon={<FileText size={16} />}
                  label="CSV (.csv)"
                  description="Universal format"
                  onClick={exportToCSV}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />
                <ExportOption
                  icon={<FileJson size={16} />}
                  label="JSON (.json)"
                  description="For developers"
                  onClick={exportToJSON}
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
                <ExportOption
                  icon={<Printer size={16} />}
                  label="Print Report"
                  description="Print-friendly"
                  onClick={handlePrint}
                  color="text-gray-600"
                  bgColor="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const ExportOption = ({ icon, label, description, onClick, color, bgColor }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 hover:bg-orange-50 rounded-lg transition-colors group"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
          <span className={color}>{icon}</span>
        </div>
        <div className="text-left">
          <p className="font-medium text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <span className="text-gray-400 group-hover:text-orange-600">→</span>
    </button>
  );

  // ✅ Mobile Export Button
  const MobileExportButton = () => (
    <button
      onClick={exportToCSV}
      className="md:hidden flex items-center space-x-2 px-3 py-2 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 text-sm"
    >
      <Download size={16} />
      <span>Export CSV</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-orange-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Mobile Export Button */}
        <div className="md:hidden mb-4 flex justify-end">
          <MobileExportButton />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-bold text-orange-800">
            All Assignments ({filteredAssignments.length})
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 hidden md:block">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-orange-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <button 
              onClick={fetchAssignments}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1 md:py-2 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 text-sm transition-colors"
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <ExportDropdown />
          </div>
        </div>
        
        {currentAssignments.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <FileText size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No assignments found</p>
            <p className="text-sm text-gray-400 mt-2">
              {filteredAssignments.length === 0 && assignments.length > 0 
                ? 'Try changing your filters' 
                : 'Create your first assignment to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {currentAssignments.map(assignment => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  calculateSubmissionRate={calculateSubmissionRate}
                  onView={() => handleViewAssignment(assignment)}
                  onEdit={() => handleEdit(assignment)}
                  onDelete={() => handleDelete(assignment._id)}
                />
              ))}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Assignment</th>
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Teacher</th>
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Assigned To</th>
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Due Date</th>
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Submission</th>
                    <th className="text-left p-4 text-sm font-medium text-orange-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssignments.map(assignment => (
                    <AssignmentTableRow
                      key={assignment._id}
                      assignment={assignment}
                      calculateSubmissionRate={calculateSubmissionRate}
                      onView={() => handleViewAssignment(assignment)}
                      onEdit={() => handleEdit(assignment)}
                      onDelete={() => handleDelete(assignment._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredAssignments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredAssignments.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

const Pagination = ({ 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems, 
  onPageChange 
}) => (
  <div className="flex flex-col md:flex-row items-center justify-between pt-4 md:pt-6 mt-4 md:mt-6 border-t border-orange-100">
    <div className="text-sm text-gray-600 mb-4 md:mb-0">
      Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} assignments
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 border border-orange-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      
      {/* Page Numbers */}
      {(() => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        if (totalPages <= 5) {
          startPage = 1;
          endPage = totalPages;
        } else if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage >= totalPages - 2) {
          startPage = totalPages - 4;
          endPage = totalPages;
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === i
                  ? 'bg-orange-500 text-white'
                  : 'border border-orange-200 hover:bg-orange-50 text-gray-700'
              }`}
              aria-label={`Page ${i}`}
              aria-current={currentPage === i ? 'page' : undefined}
            >
              {i}
            </button>
          );
        }
        
        return pages;
      })()}
      
      <button
        onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 border border-orange-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

export default AssignmentList;