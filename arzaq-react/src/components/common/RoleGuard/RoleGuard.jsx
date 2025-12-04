// src/components/common/RoleGuard/RoleGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

/**
 * RoleGuard component - Protects routes based on user roles
 * @param {Object} props
 * @param {Array<string>} props.allowedRoles - Array of allowed roles (e.g., ['admin', 'restaurant'])
 * @param {React.ReactNode} props.children - Component to render if user has access
 * @param {string} props.redirectTo - Path to redirect if access denied (default: '/')
 */
const RoleGuard = ({ allowedRoles = [], children, redirectTo = '/' }) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has one of the allowed roles
  const userRole = currentUser?.role;
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // Redirect if user doesn't have required role
  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  // User has access - render children
  return <>{children}</>;
};

export default RoleGuard;
