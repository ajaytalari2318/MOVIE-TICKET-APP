// src/components/ProtectedRoute.jsx - Enhanced with Role Protection
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!token) {
      message.warning('Please login to access this page');
    } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      message.error('You do not have permission to access this page');
    }
  }, [token, user, allowedRoles]);

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on their role
    if (user.role === 'admin') {
      return <Navigate to="/profile" replace />;
    } else if (user.role === 'partner') {
      return <Navigate to="/partner-profile" replace />;
    } else {
      return <Navigate to="/user-profile" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;