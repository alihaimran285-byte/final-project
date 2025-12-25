
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, Phone, Calendar, User, BookOpen, Trash2, Eye, RefreshCw, FileText, X } from 'lucide-react';
import { db } from '../../../firebase';
import { collection, getDocs, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const ViewApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  
  const [notification, setNotification] = useState({ 
    message: '', 
    type: 'success', 
    visible: false 
  });

  // Notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Notification component
  const Notification = ({ message, type, isVisible }) => {
    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                    type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
                    'bg-blue-100 border-blue-400 text-blue-700';

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} shadow-lg flex items-center space-x-3 animate-fade-in`}>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'admissionApplications'), 
      (snapshot) => {
        const apps = [];
        snapshot.forEach((doc) => {
          apps.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by date (newest first)
        apps.sort((a, b) => new Date(b.submittedAt?.toDate()) - new Date(a.submittedAt?.toDate()));
        
        setApplications(apps);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching applications:', error);
        showNotification('Error fetching applications', 'error');
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateDoc(doc(db, 'admissionApplications', appId), {
        status: newStatus,
        lastUpdated: new Date()
      });
      showNotification(`Application status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating application status:', error);
      showNotification('Error updating application status', 'error');
    }
  };

  const handleDeleteApplication = async (appId, appNumber) => {
    try {
      await deleteDoc(doc(db, 'admissionApplications', appId));
      showNotification(`Application ${appNumber} deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting application:', error);
      showNotification('Error deleting application', 'error');
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, application }) => {
    if (!isOpen || !application) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Application?
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete application <span className="font-semibold">{application.applicationNumber}</span>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm(application.id, application.applicationNumber);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    application: null 
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  const refreshData = () => {
    setLoading(true);
    showNotification('Refreshing data...', 'success');
  };

  const exportToCSV = () => {
    try {
      const headers = ['Application No.', 'Student Name', 'Grade', 'Email', 'Phone', 'Parent Name', 'Status', 'Submitted Date'];
      const csvData = filteredApplications.map(app => [
        app.applicationNumber,
        `${app.studentInfo?.firstName} ${app.studentInfo?.lastName}`,
        app.studentInfo?.gradeApplying,
        app.contactInfo?.email,
        app.contactInfo?.phone,
        app.parentInfo?.name,
        app.status,
        app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleDateString() : 'N/A'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admission-applications-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showNotification('Data exported to CSV successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Error exporting data', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Component */}
      <Notification 
        message={notification.message} 
        type={notification.type} 
        isVisible={notification.visible} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, application: null })}
        onConfirm={handleDeleteApplication}
        application={deleteModal.application}
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admission Applications</h1>
          <p className="text-gray-600 mt-1">
            Manage and review all student admission applications • {applications.length} total
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={refreshData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{getStatusCount('pending')}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{getStatusCount('approved')}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{getStatusCount('rejected')}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="text-red-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or application number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicationNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.submittedAt ? 
                          new Date(application.submittedAt.toDate()).toLocaleDateString() : 
                          'N/A'
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.studentInfo?.firstName} {application.studentInfo?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.studentInfo?.gradeApplying} • {application.studentInfo?.dateOfBirth}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.contactInfo?.email}</div>
                    <div className="text-sm text-gray-500">{application.contactInfo?.phone}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.parentInfo?.name}</div>
                    <div className="text-sm text-gray-500">{application.parentInfo?.phone}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      value={application.status}
                      onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                      className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(application.status)} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ 
                          isOpen: true, 
                          application: application 
                        })}
                        className="text-red-600 hover:text-red-900 transition-colors p-1"
                        title="Delete Application"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try changing your search or filter criteria'
                : 'No admission applications have been submitted yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details - {selectedApplication.applicationNumber}
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.studentInfo?.firstName} {selectedApplication.studentInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.studentInfo?.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade Applying</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.studentInfo?.gradeApplying}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.studentInfo?.gender}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.contactInfo?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.contactInfo?.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.contactInfo?.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.contactInfo?.city}</p>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.parentInfo?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.parentInfo?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.parentInfo?.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Occupation</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.parentInfo?.occupation}</p>
                  </div>
                </div>
              </div>

              {/* Application Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Number</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedApplication.applicationNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted On</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.submittedAt ? 
                        new Date(selectedApplication.submittedAt.toDate()).toLocaleString() : 
                        'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.lastUpdated ? 
                        new Date(selectedApplication.lastUpdated.toDate()).toLocaleString() : 
                        'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplication;