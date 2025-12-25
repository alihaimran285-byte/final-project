import React, { useState } from 'react';
import { User, Mail, Phone, Send, Calendar, BookOpen } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    gradeApplying: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentOccupation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');

  const grades = ['Nursery', 'KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate unique application number
  const generateApplicationNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `APP${timestamp}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const appNumber = generateApplicationNumber();
      
      // ✅ Firebase Firestore mein save karo
      const docRef = await addDoc(collection(db, 'admissionApplications'), {
        // Student Information
        studentInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          gradeApplying: formData.gradeApplying
        },
        
        // Contact Information
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        
        // Parent Information
        parentInfo: {
          name: formData.parentName,
          email: formData.parentEmail,
          phone: formData.parentPhone,
          occupation: formData.parentOccupation
        },
        
        // Application Metadata
        applicationNumber: appNumber,
        status: 'pending', // Default status
        submittedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        
        // System Fields
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent
      });

      console.log('Application saved to Firebase with ID: ', docRef.id);
      
      // Success message show karo
      setApplicationNumber(appNumber);
      setShowSuccess(true);
      
      // Form reset karo
      resetForm();
      
      // Auto-hide success message
      setTimeout(() => {
        setShowSuccess(false);
        setApplicationNumber('');
      }, 8000);

    } catch (error) {
      console.error('Error saving application to Firebase: ', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client IP get karna (optional)
  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'Unknown';
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      gradeApplying: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      parentOccupation: ''
    });
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.dateOfBirth &&
      formData.gender &&
      formData.gradeApplying &&
      formData.email &&
      formData.phone &&
      formData.parentName &&
      formData.parentPhone
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-20 px-4">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3 text-green-800">
            <Send size={24} className="text-green-600" />
            <div>
              <h3 className="font-bold text-lg">Application Submitted Successfully!</h3>
              <p className="text-green-700 mt-1">
                Your application has been saved to our database. We'll contact you within 24 hours.
              </p>
              {applicationNumber && (
                <div className="mt-3 p-3 bg-green-100 rounded-lg">
                  <strong className="text-green-800">Application Number:</strong>
                  <div className="text-2xl font-mono font-bold text-green-900 mt-1">
                    {applicationNumber}
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Please save this number for future reference.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-gradient-to-br from-orange-50 to-peach-50 rounded-xl border border-orange-200 shadow-lg">
        <div className="p-6 border-b border-orange-200 bg-orange-100 rounded-t-xl">
          <h2 className="text-2xl font-bold text-orange-800">Student Admission Form</h2>
          <p className="text-orange-600">Fill out the form below to apply for admission</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Student Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center space-x-2">
              <User size={20} className="text-orange-600" />
              <span>Student Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Grade Applying For *
                </label>
                <select
                  required
                  value={formData.gradeApplying}
                  onChange={(e) => handleInputChange('gradeApplying', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center space-x-2">
              <Mail size={20} className="text-orange-600" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="Enter city"
                />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center space-x-2">
              <User size={20} className="text-orange-600" />
              <span>Parent/Guardian Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="Enter parent/guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Parent Email
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="parent@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Parent Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Parent Occupation
                </label>
                <input
                  type="text"
                  value={formData.parentOccupation}
                  onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
                  placeholder="Enter occupation"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-orange-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-orange-400 text-orange-700 rounded-lg hover:bg-orange-50 hover:border-orange-500 transition-all duration-300 font-medium"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-peach-500 text-white rounded-lg hover:from-orange-600 hover:to-peach-600 disabled:from-orange-300 disabled:to-peach-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium flex items-center space-x-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting to Database...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;