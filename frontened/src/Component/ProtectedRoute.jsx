import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  // ✅ Safe localStorage access
  let currentUser = null;
  try {
    const userData = localStorage.getItem('currentUser');
    currentUser = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  console.log('🔐 Protected Route Check:', { currentUser, requiredRole: role });

  if (!currentUser) {
    console.log('❌ No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    console.log(`❌ Role mismatch: User is ${currentUser.role}, required ${role}`);
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Access granted for:', currentUser.role);
  return children;
};

export default ProtectedRoute;