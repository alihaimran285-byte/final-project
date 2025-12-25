import React, { useState, useRef } from 'react';
import { Upload, Paperclip, File, X, Download } from 'lucide-react';

const CandidateAssignments = ({ assignments, onSubmitAssignment, onRefresh, searchTerm }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    remarks: '',
    file: '',
    fileName: '',
    fileSize: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open file manager
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Simulate file upload (you can replace this with actual upload)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, create a fake URL
      const fileUrl = URL.createObjectURL(file);
      
      setSubmissionData(prev => ({
        ...prev,
        file: fileUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size)
      }));
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Remove selected file
  const removeFile = () => {
    setSubmissionData(prev => ({
      ...prev,
      file: '',
      fileName: '',
      fileSize: ''
    }));
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;
    
    if (!submissionData.file) {
      alert('Please attach a file');
      return;
    }
    
    setSubmitting(true);
    try {
      // Prepare submission data
      const submissionPayload = {
        assignmentId: selectedAssignment._id,
        studentId: selectedAssignment.studentId,
        studentName: selectedAssignment.studentName,
        file: submissionData.file,
        fileName: submissionData.fileName,
        fileSize: submissionData.fileSize,
        remarks: submissionData.remarks,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };

      console.log('📤 Submitting assignment:', submissionPayload);
      
      const result = await onSubmitAssignment(selectedAssignment._id, submissionPayload);
      
      if (result.success) {
        
        setSelectedAssignment(null);
        setSubmissionData({ remarks: '', file: '', fileName: '', fileSize: '' });
        onRefresh();
      } else {
        alert(result.message || 'Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assignment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-6">
          <h3 className="text-sm font-medium opacity-90">Total Assignments</h3>
          <p className="text-3xl font-bold mt-2">{filteredAssignments.length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6">
          <h3 className="text-sm font-medium opacity-90">Submitted</h3>
          <p className="text-3xl font-bold mt-2">
            {filteredAssignments.filter(a => a.isSubmitted).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6">
          <h3 className="text-sm font-medium opacity-90">Graded</h3>
          <p className="text-3xl font-bold mt-2">
            {filteredAssignments.filter(a => a.isGraded).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6">
          <h3 className="text-sm font-medium opacity-90">Pending</h3>
          <p className="text-3xl font-bold mt-2">
            {filteredAssignments.filter(a => !a.isSubmitted).length}
          </p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Assignments</h2>
          <p className="text-sm text-gray-600">View and submit your assignments</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map(assignment => (
                <tr key={assignment._id} className="hover:bg-orange-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">{assignment.teacherName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      {assignment.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        assignment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {assignment.isGraded ? (
                      <span className="text-lg font-bold text-green-600">
                        {assignment.submission?.marks}/{assignment.totalMarks}
                      </span>
                    ) : assignment.isSubmitted ? (
                      <span className="text-gray-500">Grading...</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {!assignment.isSubmitted ? (
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 text-sm flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Submit
                      </button>
                    ) : assignment.isGraded ? (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-2">
                        <File size={16} />
                        View Feedback
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-2">
                        <Download size={16} />
                        View Submission
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.ppt,.pptx,.xls,.xlsx"
      />

      
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"> {/* ✅ Added max height and scroll */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Submit Assignment</h3>
                  <p className="text-sm text-gray-600">{selectedAssignment.title}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setSubmissionData({ remarks: '', file: '', fileName: '', fileSize: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4"> 
              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"> 
                  Attach Assignment File *
                </label>
                
                {!submissionData.file ? (
                  <div 
                    onClick={handleFileSelect}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors" // ✅ Reduced padding
                  >
                    {uploading ? (
                      <div className="space-y-2"> {/* ✅ Reduced spacing */}
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div> {/* ✅ Smaller spinner */}
                        <p className="text-sm text-gray-600">Uploading file...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-10 w-10 text-gray-400" /> {/* ✅ Smaller icon */}
                        <p className="mt-1 text-sm text-gray-600"> {/* ✅ Reduced margin */}
                          Click to browse files
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, TXT, JPG, PNG, PPT, XLS (Max: 10MB)
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50"> {/* ✅ Reduced padding */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2"> {/* ✅ Reduced spacing */}
                        <div className="bg-orange-100 p-1.5 rounded-lg"> {/* ✅ Reduced padding */}
                          <File className="text-orange-600" size={18} /> {/* ✅ Smaller icon */}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{submissionData.fileName}</p>
                          <p className="text-xs text-gray-500">{submissionData.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1"> {/* ✅ Reduced spacing */}
                        <button
                          onClick={() => window.open(submissionData.file, '_blank')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" // ✅ Smaller button
                          title="Preview"
                        >
                          <File size={14} /> {/* ✅ Smaller icon */}
                        </button>
                        <button
                          onClick={removeFile}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" // ✅ Smaller button
                          title="Remove"
                        >
                          <X size={14} /> {/* ✅ Smaller icon */}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-2 flex justify-center"> {/* ✅ Reduced margin */}
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1" // ✅ Smaller button
                  >
                    <Paperclip size={12} /> 
                    {submissionData.file ? 'Change File' : 'Browse Files'}
                  </button>
                </div>
              </div>

              {/* Remarks Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"> 
                  Remarks (Optional)
                </label>
                <textarea
                  value={submissionData.remarks}
                  onChange={(e) => setSubmissionData({
                    ...submissionData,
                    remarks: e.target.value
                  })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm" // ✅ Smaller padding and font
                  placeholder="Any comments for the teacher..."
                />
                <p className="text-xs text-gray-500 mt-0.5"> 
                  Add any notes or comments about your submission
                </p>
              </div>

              {/* Assignment Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3"> {/* ✅ Reduced padding */}
                <h4 className="text-sm font-medium text-gray-700 mb-1">Assignment Details</h4> {/* ✅ Reduced margin */}
                <div className="grid grid-cols-2 gap-2 text-xs"> {/* ✅ Smaller font */}
                  <div>
                    <span className="text-gray-500">Subject:</span>
                    <span className="ml-1 text-gray-800">{selectedAssignment.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Teacher:</span>
                    <span className="ml-1 text-gray-800">{selectedAssignment.teacherName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <span className="ml-1 text-gray-800">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Marks:</span>
                    <span className="ml-1 text-gray-800">{selectedAssignment.totalMarks}</span>
                  </div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200"> {/* ✅ Reduced spacing and margin */}
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setSubmissionData({ remarks: '', file: '', fileName: '', fileSize: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm" // ✅ Smaller button
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  disabled={submitting || !submissionData.file}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-sm flex items-center gap-1" // ✅ Smaller button
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> {/* ✅ Smaller spinner */}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> 
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateAssignments;