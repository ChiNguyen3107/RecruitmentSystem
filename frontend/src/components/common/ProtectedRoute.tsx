import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, initAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'EMPLOYER') {
      return <Navigate to="/employer/dashboard" replace />;
    } else if (user.role === 'APPLICANT') {
      return <Navigate to="/applicant/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

