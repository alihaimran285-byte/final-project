import React, { useState, useEffect } from 'react';
import { X, UserPlus, BookOpen, Mail, Phone, Hash, Calendar, Clock, Users } from 'lucide-react'; // Star ہٹا دیا

const AddTeacherModal = ({ isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Mathematics',
    classes: 1,
    experience: 0,
    schedule: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  // Available subjects
  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 
    'Urdu', 'Islamiat', 'Biology', 'Physics', 
    'Chemistry', 'Computer Science', 'General'
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Mathematics',
        classes: 1,
        experience: 0,
        schedule: '',
        status: 'active',
        joinDate: today
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (formData.classes < 1 || formData.classes > 10) {
      newErrors.classes = 'Classes must be between 1-10';
    }

    if (formData.experience < 0 || formData.experience > 50) {
      newErrors.experience = 'Experience must be between 0-50 years';
    }

    // Validate join date
    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    } else {
      const joinDate = new Date(formData.joinDate);
      const today = new Date();
      if (joinDate > today) {
        newErrors.joinDate = 'Join date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const teacherData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      classes: parseInt(formData.classes) || 1,
      experience: parseInt(formData.experience) || 0,
      schedule: formData.schedule.trim(),
      joinDate: new Date(formData.joinDate).toISOString(),
      createdAt: new Date().toISOString()
    };

    console.log('📤 Sending data to server:', teacherData); 
    onSave(teacherData);
  };

  const handleClose = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Mathematics',
      classes: 1,
      experience: 0,
      schedule: '',
      status: 'active',
      joinDate: today
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <UserPlus className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900">Add New Teacher</h3>
                <p className="text-orange-700 text-sm">Add teacher details</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-orange-500 hover:text-orange-700 transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Basic Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-800 mb-2">Basic Information</h4>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <UserPlus size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  placeholder="Enter teacher's full name"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  placeholder="teacher@school.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  placeholder="+92 300 1234567"
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <BookOpen size={16} />
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.subject ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>
            </div>

            {/* Column 2: Professional Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-800 mb-2">Professional Information</h4>

              {/* Number of Classes */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <Hash size={16} />
                  Number of Classes *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.classes}
                  onChange={(e) => handleInputChange('classes', parseInt(e.target.value) || 1)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.classes ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many classes this teacher will teach (1-10)
                </p>
                {errors.classes && (
                  <p className="mt-1 text-sm text-red-600">{errors.classes}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.experience ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  placeholder="e.g., 5"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Teaching experience in years (0-50)
                </p>
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Join Date *
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.joinDate ? 'border-red-300 bg-red-50' : 'border-orange-300'
                  }`}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
                {errors.joinDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>
                )}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Teaching Schedule
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => handleInputChange('schedule', e.target.value)}
                  className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="e.g., Mon-Wed-Fri 9:00-11:00"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Column 3: Additional Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-800 mb-2">Additional Information</h4>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Preview */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="font-medium ml-2">{formData.name || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium ml-2">{formData.subject || 'Not selected'}</span>
              </div>
              <div>
                <span className="text-gray-600">Classes:</span>
                <span className="font-medium ml-2">{formData.classes}</span>
              </div>
              <div>
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium ml-2">{formData.experience} years</span>
              </div>
              <div>
                <span className="text-gray-600">Join Date:</span>
                <span className="font-medium ml-2">
                  {formData.joinDate ? new Date(formData.joinDate).toLocaleDateString('en-US') : 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="font-medium ml-2">{formData.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-orange-200 bg-orange-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-orange-700">
              <p>All fields marked with * are required</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim()}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Add Teacher
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;