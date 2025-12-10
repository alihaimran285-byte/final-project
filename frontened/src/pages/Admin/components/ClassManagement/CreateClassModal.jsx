import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save, Loader2, Calendar, User, Users } from 'lucide-react'; // Users آئیکن شامل کیا

const CreateClassModal = ({ isOpen, onClose, onSave, loading, teachers }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    grade: '',
    subject: '',
    schedule: '',
    room: '',
    capacity: 30,
    students: 0 // نیا فیلڈ شامل کیا
  });

  const [errors, setErrors] = useState({});
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        code: '',
        teacher: '',
        grade: '',
        subject: '',
        schedule: '',
        room: '',
        capacity: 30,
        students: 0 // نیا فیلڈ شامل کیا
      });
      setErrors({});
      setIsGenerated(false);
    }
  }, [isOpen]);

  const generateClassCode = (subject, name) => {
    const prefixes = {
      'Mathematics': 'MATH',
      'Science': 'SCI',
      'English': 'ENG',
      'History': 'HIST',
      'Urdu': 'URDU',
      'Islamiat': 'ISL',
      'Biology': 'BIO',
      'Physics': 'PHY',
      'Chemistry': 'CHEM',
      'Social Studies': 'SOC',
      'Computer Science': 'CS'
    };
    
    const prefix = prefixes[subject] || 'GEN';
    const nameCode = name.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${prefix}${nameCode}${randomNum}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-generate code when name and subject are filled
    if ((name === 'name' || name === 'subject') && formData.name && formData.subject) {
      const newCode = generateClassCode(formData.subject, formData.name);
      setFormData(prev => ({
        ...prev,
        code: newCode
      }));
      setIsGenerated(true);
    }
  };

  const handleManualCodeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      code: value
    }));
    setIsGenerated(false);
  };

  const handleGenerateCode = () => {
    if (formData.name && formData.subject) {
      const newCode = generateClassCode(formData.subject, formData.name);
      setFormData(prev => ({
        ...prev,
        code: newCode
      }));
      setIsGenerated(true);
    } else {
      setErrors(prev => ({
        ...prev,
        name: !formData.name ? 'Name is required to generate code' : '',
        subject: !formData.subject ? 'Subject is required to generate code' : ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Class name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Class code is required';
    } else if (!/^[A-Z0-9]{6,10}$/.test(formData.code)) {
      newErrors.code = 'Code should be 6-10 uppercase letters/numbers';
    }

    if (!formData.teacher.trim()) {
      newErrors.teacher = 'Please select a teacher';
    }

    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade level is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select a subject';
    }

    if (formData.students < 0) {
      newErrors.students = 'Students cannot be negative';
    } else if (formData.students > formData.capacity) {
      newErrors.students = `Students cannot exceed capacity (${formData.capacity})`;
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-orange-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Create New Class</h2>
                <p className="text-gray-600 text-sm">Add a new class to the system</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Mathematics 101"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                  errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                disabled={loading}
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Islamiat">Islamiat</option>
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            {/* Class Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Code *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleManualCodeChange}
                  placeholder="e.g., MATH101"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                    errors.code ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 whitespace-nowrap text-sm"
                  disabled={loading}
                >
                  Generate
                </button>
              </div>
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
              {isGenerated && (
                <p className="mt-1 text-xs text-green-600">✓ Code auto-generated</p>
              )}
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher *
              </label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                  errors.teacher ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                disabled={loading}
              >
                <option value="">Select Teacher</option>
                {teachers && teachers.length > 0 ? (
                  teachers.map(teacher => (
                    <option key={teacher._id || teacher.id} value={teacher.name}>
                      {teacher.name} {teacher.subject ? `- ${teacher.subject}` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No teachers available</option>
                )}
              </select>
              {errors.teacher && (
                <p className="mt-1 text-sm text-red-600">{errors.teacher}</p>
              )}
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                  errors.grade ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                disabled={loading}
              >
                <option value="">Select Grade</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
              )}
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Schedule
                </span>
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="e.g., Mon, Wed, Fri • 9:00 AM"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Current Students */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center">
                  <Users size={14} className="mr-2" />
                  Current Students *
                </span>
              </label>
              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleChange}
                min="0"
                max={formData.capacity}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                  errors.students ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                disabled={loading}
              />
              {errors.students && (
                <p className="mt-1 text-sm text-red-600">{errors.students}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Current enrolled students (max: {formData.capacity})
              </p>
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="e.g., Room 101"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="100"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                  errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                disabled={loading}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Maximum number of students</p>
            </div>
          </div>

          {/* Capacity Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Class Capacity Info</p>
                <p className="text-xs text-blue-600 mt-1">
                  Current: <span className="font-bold">{formData.students}</span> students • 
                  Capacity: <span className="font-bold">{formData.capacity}</span> students • 
                  Available: <span className="font-bold">{formData.capacity - formData.students}</span> seats
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600">
                  {formData.students === 0 ? (
                    <span className="font-medium text-green-600">Class is empty</span>
                  ) : formData.students < formData.capacity ? (
                    <span className="font-medium text-green-600">Seats available</span>
                  ) : (
                    <span className="font-medium text-red-600">Class is full</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Create Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;