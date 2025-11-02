import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Component để bảo vệ các route công khai (login, register)
 * Nếu user đã đăng nhập, redirect đến dashboard theo role
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, user, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isAuthenticated && user) {
    // Redirect based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'EMPLOYER') {
      return <Navigate to="/employer/dashboard" replace />;
    } else if (user.role === 'APPLICANT') {
      // Ứng viên chuyển đến trang chủ
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

