// components/AssignmentManagement/AssignmentModals.jsx
import React from 'react';
import { X, Save, Loader2, User, Calendar } from 'lucide-react';

// View Assignment Modal
export const ViewAssignmentModal = ({ showViewModal, selectedAssignment, setShowViewModal, calculateSubmissionRate }) => {
  if (!showViewModal || !selectedAssignment) return null;

  return (
    <ModalWrapper>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-orange-800">Assignment Details</h3>
          <button
            onClick={() => setShowViewModal(false)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>
        
        <AssignmentDetailsContent 
          assignment={selectedAssignment} 
          calculateSubmissionRate={calculateSubmissionRate} 
          onClose={() => setShowViewModal(false)}
        />
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Assignment Modal
export const AssignmentFormModal = ({ 
  isOpen, 
  isEdit, 
  assignment,
  formData, 
  setFormData, 
  teachers, 
  students, 
  uniqueClasses, 
  isSubmitting, 
  onClose, 
  onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-orange-800">
            {isEdit ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <AssignmentForm
          formData={formData}
          setFormData={setFormData}
          teachers={teachers}
          students={students}
          uniqueClasses={uniqueClasses}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEdit={isEdit}
        />
      </div>
    </ModalWrapper>
  );
};

// Common Modal Wrapper
const ModalWrapper = ({ children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
      {children}
    </div>
  </div>
);

// Assignment Details Content
const AssignmentDetailsContent = ({ assignment, calculateSubmissionRate, onClose }) => (
  <div className="space-y-4 md:space-y-6">
    <div>
      <h4 className="text-lg font-bold text-gray-800 mb-2">{assignment.title}</h4>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
          {assignment.subject}
        </span>
        <span className="flex items-center">
          <Calendar size={14} className="mr-1" />
          Due: {new Date(assignment.dueDate).toLocaleDateString()}
        </span>
        <span>Total Marks: {assignment.totalMarks}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          assignment.status === 'active' ? 'bg-green-100 text-green-800' :
          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {assignment.status}
        </span>
      </div>
    </div>
    
    <AssignmentDetailSection title="Description" content={assignment.description || 'No description provided'} />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <AssignedBySection teacherName={assignment.teacherName} />
      <AssignedToSection assignment={assignment} />
    </div>
    
    <SubmissionStatusSection 
      assignment={assignment} 
      calculateSubmissionRate={calculateSubmissionRate} 
    />
    
    {assignment.instructions && (
      <AssignmentDetailSection title="Instructions" content={assignment.instructions} />
    )}
    
    <div className="flex justify-end pt-4 md:pt-6">
      <button
        onClick={onClose}
        className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors text-sm md:text-base"
      >
        Close
      </button>
    </div>
  </div>
);

const AssignmentDetailSection = ({ title, content }) => (
  <div>
    <h5 className="font-medium text-gray-700 mb-2">{title}</h5>
    <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
      {content}
    </p>
  </div>
);

const AssignedBySection = ({ teacherName }) => (
  <div>
    <h5 className="font-medium text-gray-700 mb-2">Assigned By</h5>
    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <User size={18} className="text-orange-600" />
      </div>
      <div>
        <p className="font-medium">{teacherName}</p>
        <p className="text-sm text-gray-600">Teacher</p>
      </div>
    </div>
  </div>
);

const AssignedToSection = ({ assignment }) => (
  <div>
    <h5 className="font-medium text-gray-700 mb-2">Assigned To</h5>
    {assignment.assignedTo === 'all' ? (
      <div className="p-3 bg-blue-50 rounded-xl">
        <p className="font-medium">All Students</p>
        <p className="text-sm text-gray-600">Total: {assignment.totalStudents} students</p>
      </div>
    ) : assignment.assignedTo === 'specific-class' ? (
      <div className="p-3 bg-green-50 rounded-xl">
        <p className="font-medium">Class {assignment.class}</p>
        <p className="text-sm text-gray-600">{assignment.totalStudents} students</p>
      </div>
    ) : (
      <div className="p-3 bg-purple-50 rounded-xl">
        <p className="font-medium">{assignment.studentName}</p>
        <p className="text-sm text-gray-600">Class: {assignment.class}</p>
      </div>
    )}
  </div>
);

const SubmissionStatusSection = ({ assignment, calculateSubmissionRate }) => (
  <div>
    <h5 className="font-medium text-gray-700 mb-2">Submission Status</h5>
    <div className="bg-gray-100 rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 space-y-2 md:space-y-0">
        <span className="text-sm text-gray-600">Submitted: {assignment.submittedCount}/{assignment.totalStudents}</span>
        <span className="font-medium text-green-600">
          {calculateSubmissionRate(assignment)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full" 
          style={{ 
            width: `${calculateSubmissionRate(assignment)}%` 
          }}
        ></div>
      </div>
    </div>
  </div>
);

// Assignment Form Component
const AssignmentForm = ({
  formData,
  setFormData,
  teachers,
  students,
  uniqueClasses,
  isSubmitting,
  onSubmit,
  onCancel,
  isEdit
}) => (
  <form onSubmit={onSubmit}>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Assignment Title *"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter assignment title"
          required
          disabled={isSubmitting}
        />
        
        <FormInput
          label="Subject *"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          placeholder="e.g., Mathematics, Science"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <FormTextarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Describe the assignment..."
        rows="3"
        disabled={isSubmitting}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Assigning Teacher *"
          value={formData.teacherId}
          onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
          options={[
            { value: '', label: 'Select Teacher' },
            ...teachers.map(teacher => ({
              value: teacher._id,
              label: `${teacher.name} - ${teacher.subject}`
            }))
          ]}
          required
          disabled={isSubmitting}
        />
        
        <FormSelect
          label="Assign To *"
          value={formData.assignedTo}
          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
          options={[
            { value: 'all', label: 'All Students' },
            { value: 'specific-class', label: 'Specific Class' },
            { value: 'specific-student', label: 'Specific Student' }
          ]}
          required
          disabled={isSubmitting}
        />
      </div>
      
      {formData.assignedTo === 'specific-class' && (
        <FormSelect
          label="Select Class"
          value={formData.class}
          onChange={(e) => setFormData({...formData, class: e.target.value})}
          options={[
            { value: '', label: 'Select Class' },
            ...uniqueClasses.map(cls => ({
              value: cls,
              label: cls
            }))
          ]}
          disabled={isSubmitting}
        />
      )}
      
      {formData.assignedTo === 'specific-student' && (
        <FormSelect
          label="Select Student"
          value={formData.studentId}
          onChange={(e) => setFormData({...formData, studentId: e.target.value})}
          options={[
            { value: '', label: 'Select Student' },
            ...students.map(student => ({
              value: student._id,
              label: `${student.name} - ${student.class} - ${student.rollNo}`
            }))
          ]}
          disabled={isSubmitting}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Due Date *"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          required
          disabled={isSubmitting}
        />
        
        <FormInput
          label="Total Marks"
          type="number"
          value={formData.totalMarks}
          onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
          placeholder="e.g., 100"
          disabled={isSubmitting}
        />
      </div>
      
      <FormTextarea
        label="Instructions"
        value={formData.instructions}
        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
        placeholder="Provide instructions for students..."
        rows="3"
        disabled={isSubmitting}
      />
      
      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        submitText={isEdit ? 'Update Assignment' : 'Create Assignment'}
      />
    </div>
  </form>
);

const FormInput = ({ label, type, value, onChange, placeholder, required, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-orange-200 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder, rows, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full border border-orange-200 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options, required, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-orange-200 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      required={required}
      disabled={disabled}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FormActions = ({ isSubmitting, onCancel, submitText }) => (
  <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4 pt-6">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 md:px-6 py-2 md:py-3 border border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors text-sm md:text-base"
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Save size={18} />
          <span>{submitText}</span>
        </>
      )}
    </button>
  </div>
);